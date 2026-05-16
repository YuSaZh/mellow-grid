"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createStore, useStore } from "zustand";
import { BENTO_COLS, BENTO_DEFAULT_ITEM_SIZE, clampBentoLayoutItem } from "@/lib/page-config/bento-layout";
import type { DeploymentMode, GridLayoutItem, PageConfig, WidgetInstance } from "@/lib/page-config/types";
import { getWidgetDefinition } from "@/lib/widgets/registry";

export type SelectedTarget =
  | { type: "profile"; id: string }
  | { type: "widget"; id: string }
  | null;

type EditorState = {
  config: PageConfig;
  mode: DeploymentMode;
  selectedTarget: SelectedTarget;
  status: string;
  addWidget: (type: string) => void;
  clearSelection: () => void;
  deleteWidget: (id: string) => void;
  exportConfig: () => void;
  importConfig: (file: File) => Promise<void>;
  loadLocalDraft: () => void;
  saveDraft: () => Promise<void>;
  selectProfile: (id: string) => void;
  selectWidget: (id: string) => void;
  updateLayout: (layout: GridLayoutItem[]) => void;
  updateProfileProps: (id: string, props: Record<string, unknown>) => void;
  updateWidgetProps: (id: string, props: Record<string, unknown>) => void;
};

type EditorStore = ReturnType<typeof createEditorStore>;

const EditorStoreContext = createContext<EditorStore | null>(null);

export function EditorStoreProvider({ children, initialConfig, mode }: { children: ReactNode; initialConfig: PageConfig; mode: DeploymentMode }) {
  const [store] = useState(() => createEditorStore(initialConfig, mode));

  useEffect(() => {
    store.getState().loadLocalDraft();
  }, [store]);

  return <EditorStoreContext.Provider value={store}>{children}</EditorStoreContext.Provider>;
}

export function useEditorStore<T>(selector: (state: EditorState) => T) {
  const store = useContext(EditorStoreContext);

  if (!store) {
    throw new Error("useEditorStore must be used inside EditorStoreProvider");
  }

  return useStore(store, selector);
}

function createEditorStore(initialConfig: PageConfig, mode: DeploymentMode) {
  return createStore<EditorState>((set, get) => ({
    config: normalizeConfigLayout(initialConfig),
    mode,
    selectedTarget: null,
    status: "Ready",

    addWidget(type) {
      const definition = getWidgetDefinition(type);

      if (!definition || definition.type === "profile") {
        return;
      }

      set((state) => {
        const id = createWidgetId(type, state.config.widgets);
        const gridLayout = getGridLayout(state.config);
        const maxY = gridLayout.reduce((bottom, item) => Math.max(bottom, item.y + item.h), 0);
        const widget: WidgetInstance = {
          id,
          type,
          props: cloneValue(definition.defaultProps) as Record<string, unknown>,
        };
        const layout = clampBentoLayoutItem({
          i: id,
          x: findNextColumn(gridLayout),
          y: maxY,
          w: definition.defaultLayout.w ?? BENTO_DEFAULT_ITEM_SIZE,
          h: definition.defaultLayout.h ?? BENTO_DEFAULT_ITEM_SIZE,
          minW: definition.defaultLayout.minW,
          minH: definition.defaultLayout.minH,
          maxW: definition.defaultLayout.maxW,
          maxH: definition.defaultLayout.maxH,
        });

        return {
          config: touchConfig({
            ...state.config,
            widgets: [...state.config.widgets, widget],
            layout: [...state.config.layout, layout],
          }),
          selectedTarget: { type: "widget", id },
          status: `${definition.name} added`,
        };
      });
    },

    clearSelection() {
      set({ selectedTarget: null });
    },

    deleteWidget(id) {
      set((state) => {
        const widget = state.config.widgets.find((item) => item.id === id);

        if (!widget || widget.type === "profile") {
          return state;
        }

        return {
          config: touchConfig({
            ...state.config,
            widgets: state.config.widgets.filter((item) => item.id !== id),
            layout: state.config.layout.filter((item) => item.i !== id),
          }),
          selectedTarget: null,
          status: "Deleted",
        };
      });
    },

    exportConfig() {
      const { config } = get();
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = href;
      link.download = `${config.username}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(href);
      set({ status: "Exported" });
    },

    async importConfig(file) {
      try {
        const nextConfig = JSON.parse(await file.text()) as PageConfig;
        set({ config: normalizeConfigLayout(nextConfig), selectedTarget: null, status: "Imported" });
      } catch {
        set({ status: "Import failed" });
      }
    },

    loadLocalDraft() {
      const { config, mode } = get();

      if (mode !== "static" || typeof window === "undefined") {
        return;
      }

      const draft = localStorage.getItem(getDraftKey(config.username));

      if (!draft) {
        return;
      }

      try {
        set({ config: normalizeConfigLayout(JSON.parse(draft) as PageConfig), selectedTarget: null, status: "Draft loaded" });
      } catch {
        set({ status: "Ready" });
      }
    },

    async saveDraft() {
      const { config, mode } = get();

      if (mode === "static") {
        localStorage.setItem(getDraftKey(config.username), JSON.stringify(config, null, 2));
        set({ status: "Saved locally" });
        return;
      }

      try {
        const response = await fetch(`/api/pages/${encodeURIComponent(config.username)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizeConfigLayout(config)),
        });

        if (!response.ok) {
          set({ status: "Save failed" });
          return;
        }

        set({ config: (await response.json()) as PageConfig, status: "Saved" });
      } catch {
        set({ status: "Save failed" });
      }
    },

    selectProfile(id) {
      set({ selectedTarget: { type: "profile", id } });
    },

    selectWidget(id) {
      set({ selectedTarget: { type: "widget", id } });
    },

    updateLayout(layout) {
      set((state) => {
        const gridIds = new Set(getGridWidgets(state.config).map((widget) => widget.id));
        const preservedLayout = state.config.layout.filter((item) => !gridIds.has(item.i));

        return {
          config: touchConfig({
            ...state.config,
            layout: [...preservedLayout, ...layout.map(normalizeLayoutItem)],
          }),
          status: "Layout changed",
        };
      });
    },

    updateProfileProps(id, props) {
      get().updateWidgetProps(id, props);
    },

    updateWidgetProps(id, props) {
      set((state) => ({
        config: touchConfig({
          ...state.config,
          widgets: state.config.widgets.map((widget) =>
            widget.id === id ? { ...widget, props: { ...(widget.props as Record<string, unknown>), ...props } } : widget,
          ),
        }),
        status: "Changed",
      }));
    },
  }));
}

function cloneValue(value: unknown) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function createWidgetId(type: string, widgets: WidgetInstance[]) {
  const existingIds = new Set(widgets.map((widget) => widget.id));
  const baseId = `${type}-${Date.now().toString(36)}`;
  let id = baseId;
  let index = 1;

  while (existingIds.has(id)) {
    id = `${baseId}-${index}`;
    index += 1;
  }

  return id;
}

function getDraftKey(username: string) {
  return `mellow-grid:${username}:draft`;
}

function getGridLayout(config: PageConfig) {
  const gridIds = new Set(getGridWidgets(config).map((widget) => widget.id));

  return config.layout.filter((item) => gridIds.has(item.i));
}

function getGridWidgets(config: PageConfig) {
  return config.widgets.filter((widget) => widget.type !== "profile");
}

function normalizeConfigLayout(config: PageConfig): PageConfig {
  return {
    ...config,
    layout: config.layout.map(normalizeLayoutItem),
  };
}

function normalizeLayoutItem(item: GridLayoutItem): GridLayoutItem {
  return clampBentoLayoutItem(item);
}

function findNextColumn(layout: GridLayoutItem[]) {
  const lastItem = layout.reduce<GridLayoutItem | null>((latest, item) => {
    if (!latest) {
      return item;
    }

    return item.y + item.h >= latest.y + latest.h ? item : latest;
  }, null);

  if (!lastItem) {
    return 0;
  }

  const nextX = lastItem.x + lastItem.w;

  return nextX + BENTO_DEFAULT_ITEM_SIZE <= BENTO_COLS ? nextX : 0;
}

function touchConfig(config: PageConfig): PageConfig {
  return { ...config, updatedAt: new Date().toISOString() };
}
