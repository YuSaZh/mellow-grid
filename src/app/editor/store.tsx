"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createStore, useStore } from "zustand";
import { BENTO_COLS, BENTO_DEFAULT_ITEM_SIZE, BENTO_MIN_ITEM_SIZE, arrangeBentoLayout, clampBentoLayoutItem, updateBentoLayoutItem } from "@/lib/page-config/bento-layout";
import { getGridWidgets, normalizePageConfig } from "@/lib/page-config/normalize";
import type { GridLayoutItem, PageConfig, PageProfile, WidgetInstance } from "@/lib/page-config/types";
import { collectDocumentStyles, renderStaticPageHtml } from "@/lib/page-export/export-html";
import { getWidgetDefinition } from "@/lib/widgets/registry";

export type SelectedTarget = { type: "widget"; id: string } | null;

type AddWidgetPlacement = {
  x: number;
  y: number;
};

type EditorState = {
  config: PageConfig;
  selectedTarget: SelectedTarget;
  status: string;
  addWidget: (type: string, placement?: AddWidgetPlacement) => void;
  clearSelection: () => void;
  deleteWidget: (id: string) => void;
  exportConfig: () => void;
  exportStaticHtml: () => void;
  importConfig: (file: File) => Promise<void>;
  loadLocalDraft: () => void;
  saveDraft: () => Promise<void>;
  selectWidget: (id: string) => void;
  updateLayout: (layout: GridLayoutItem[]) => void;
  updateLayoutItem: (id: string, patch: Partial<Omit<GridLayoutItem, "i">>) => void;
  updateProfile: (props: Partial<PageProfile>) => void;
  updateWidgetProps: (id: string, props: Record<string, unknown>) => void;
};

type EditorStore = ReturnType<typeof createEditorStore>;

const EditorStoreContext = createContext<EditorStore | null>(null);

export function EditorStoreProvider({ children, initialConfig }: { children: ReactNode; initialConfig: PageConfig }) {
  const [store] = useState(() => createEditorStore(initialConfig));

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

export function createEditorStore(initialConfig: PageConfig) {
  return createStore<EditorState>((set, get) => ({
    config: normalizePageConfig(initialConfig),
    selectedTarget: null,
    status: "Ready",

    addWidget(type, placement) {
      const definition = getWidgetDefinition(type);

      if (!definition) {
        return;
      }

      set((state) => {
        const id = createWidgetId(type, state.config.widgets);
        const gridIds = new Set(getGridWidgets(state.config).map((widget) => widget.id));
        const gridLayout = state.config.layout.filter((item) => gridIds.has(item.i));
        const maxY = gridLayout.reduce((bottom, item) => Math.max(bottom, item.y + item.h), 0);
        const widget: WidgetInstance = {
          id,
          type,
          props: cloneValue(definition.defaultProps) as Record<string, unknown>,
        };
        const layout = clampBentoLayoutItem({
          i: id,
          x: placement?.x ?? findNextColumn(gridLayout),
          y: placement?.y ?? maxY,
          w: definition.defaultLayout.w ?? BENTO_DEFAULT_ITEM_SIZE,
          h: definition.defaultLayout.h ?? BENTO_DEFAULT_ITEM_SIZE,
          minW: definition.defaultLayout.minW,
          minH: definition.defaultLayout.minH,
          maxW: definition.defaultLayout.maxW,
          maxH: definition.defaultLayout.maxH,
        });

        return {
          config: touchConfig(
            normalizePageConfig({
              ...state.config,
              widgets: [...state.config.widgets, widget],
              layout: arrangeBentoLayout([...state.config.layout, layout], id),
            }),
          ),
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

        if (!widget) {
          return state;
        }

        return {
          config: touchConfig(
            normalizePageConfig({
              ...state.config,
              widgets: state.config.widgets.filter((item) => item.id !== id),
              layout: state.config.layout.filter((item) => item.i !== id),
            }),
          ),
          selectedTarget: null,
          status: "Deleted",
        };
      });
    },

    exportConfig() {
      const { config } = get();
      downloadBlob(new Blob([JSON.stringify(normalizePageConfig(config), null, 2)], { type: "application/json" }), "username.json");
      set({ status: "Exported" });
    },

    exportStaticHtml() {
      const { config } = get();
      const normalizedConfig = normalizePageConfig(config);
      downloadBlob(new Blob([renderStaticPageHtml(normalizedConfig, { styles: collectDocumentStyles() })], { type: "text/html;charset=utf-8" }), "index.html");
      set({ config: normalizedConfig, status: "Static HTML exported" });
    },

    async importConfig(file) {
      try {
        const nextConfig = JSON.parse(await file.text()) as PageConfig;
        set({ config: normalizePageConfig(nextConfig), selectedTarget: null, status: "Imported" });
      } catch {
        set({ status: "Import failed" });
      }
    },

    loadLocalDraft() {
      const { config } = get();

      if (typeof window === "undefined") {
        return;
      }

      const draftStorage = getSessionDraftStorage();

      if (!draftStorage) {
        return;
      }

      const draft = draftStorage.getItem(getDraftKey(config.username));

      if (!draft) {
        return;
      }

      try {
        set({ config: normalizePageConfig(JSON.parse(draft) as PageConfig), selectedTarget: null, status: "Session draft loaded" });
      } catch {
        set({ status: "Ready" });
      }
    },

    async saveDraft() {
      const { config } = get();
      const normalizedConfig = normalizePageConfig(config);

      const draftStorage = getSessionDraftStorage();

      if (!draftStorage) {
        set({ config: normalizedConfig, status: "Session storage unavailable" });
        return;
      }

      try {
        draftStorage.setItem(getDraftKey(config.username), JSON.stringify(normalizedConfig, null, 2));
      } catch {
        set({ config: normalizedConfig, status: "Session storage unavailable" });
        return;
      }

      set({ config: normalizedConfig, status: "Saved for this session" });
    },

    selectWidget(id) {
      set({ selectedTarget: { type: "widget", id } });
    },

    updateLayout(layout) {
      set((state) => {
        const gridIds = new Set(getGridWidgets(state.config).map((widget) => widget.id));
        const nextLayout = arrangeBentoLayout(layout.filter((item) => gridIds.has(item.i)).map(clampBentoLayoutItem));

        return {
          config: touchConfig(
            normalizePageConfig({
              ...state.config,
              layout: nextLayout,
            }),
          ),
          status: "Layout changed",
        };
      });
    },

    updateLayoutItem(id, patch) {
      set((state) => {
        const widgetIds = new Set(getGridWidgets(state.config).map((widget) => widget.id));

        if (!widgetIds.has(id)) {
          return state;
        }

        const layoutItem = state.config.layout.find((item) => item.i === id);

        if (!layoutItem) {
          return state;
        }

        return {
          config: touchConfig(
            normalizePageConfig({
              ...state.config,
              layout: updateBentoLayoutItem(state.config.layout, id, normalizeLayoutPatch(layoutItem, patch)),
            }),
          ),
          status: "Layout changed",
        };
      });
    },

    updateProfile(props) {
      set((state) => ({
        config: touchConfig(
          normalizePageConfig({
            ...state.config,
            profile: { ...state.config.profile, ...props },
          }),
        ),
        status: "Changed",
      }));
    },

    updateWidgetProps(id, props) {
      set((state) => ({
        config: touchConfig(
          normalizePageConfig({
            ...state.config,
            widgets: state.config.widgets.map((widget) =>
              widget.id === id ? { ...widget, props: { ...(widget.props as Record<string, unknown>), ...props } } : widget,
            ),
          }),
        ),
        status: "Changed",
      }));
    },
  }));
}

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

function downloadBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
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

function getSessionDraftStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function normalizeLayoutPatch(item: GridLayoutItem, patch: Partial<Omit<GridLayoutItem, "i">>): GridLayoutItem {
  const nextW = patch.w ?? item.w;
  const nextH = patch.h ?? item.h;
  const minW = patch.minW ?? item.minW;
  const minH = patch.minH ?? item.minH;
  const maxW = patch.maxW ?? item.maxW;
  const maxH = patch.maxH ?? item.maxH;
  const w = clamp(Math.round(nextW), Math.max(BENTO_MIN_ITEM_SIZE, minW ?? BENTO_MIN_ITEM_SIZE), Math.min(BENTO_COLS, maxW ?? BENTO_COLS));

  return clampBentoLayoutItem({
    ...item,
    ...patch,
    x: patch.x ?? item.x,
    y: patch.y ?? item.y,
    w,
    h: nextH,
    minW,
    minH,
    maxW,
    maxH,
  });
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function findNextColumn(layout: GridLayoutItem[]) {
  const lastItem = layout.reduce<GridLayoutItem | null>((latest, item) =>
    !latest || item.y + item.h >= latest.y + latest.h ? item : latest,
    null,
  );

  if (!lastItem) {
    return 0;
  }

  const nextX = lastItem.x + lastItem.w;

  return nextX + BENTO_DEFAULT_ITEM_SIZE <= BENTO_COLS ? nextX : 0;
}

function touchConfig(config: PageConfig): PageConfig {
  return { ...config, updatedAt: new Date().toISOString() };
}
