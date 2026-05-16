"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { BentoGrid, bentoGridStyles, getBentoGridItemStyle } from "@/components/page/bento-grid";
import { BENTO_COLS, BENTO_DEFAULT_ITEM_SIZE, BENTO_GAP, BENTO_ROW_HEIGHT, bentoLayoutItemsCollide, clampBentoLayoutItem, updateBentoLayoutItem } from "@/lib/page-config/bento-layout";
import type { GridLayoutItem, WidgetInstance } from "@/lib/page-config/types";
import { getWidgetDefinition } from "@/lib/widgets/registry";
import { useEditorStore } from "../store";
import { AddWidgetPanel } from "./add-widget-panel";

const ADD_MODULE_ID = "__add-module__";
const DRAG_THRESHOLD = 4;

type InteractionMode = "move" | "resize";

type GridMetrics = {
  columnWidth: number;
  gap: number;
  left: number;
  rowHeight: number;
  top: number;
};

type InteractionState = {
  baseItem: GridLayoutItem;
  baseLayout: GridLayoutItem[];
  id: string;
  mode: InteractionMode;
  pointerId: number;
  startClientX: number;
  startClientY: number;
};

export function EditorCanvas() {
  const config = useEditorStore((state) => state.config);
  const selectedTarget = useEditorStore((state) => state.selectedTarget);
  const selectWidget = useEditorStore((state) => state.selectWidget);
  const updateLayout = useEditorStore((state) => state.updateLayout);
  const [activeInteractionId, setActiveInteractionId] = useState<string | null>(null);
  const [previewLayout, setPreviewLayout] = useState<GridLayoutItem[] | null>(null);
  const interactionRef = useRef<InteractionState | null>(null);
  const addLayout = useMemo(() => findAddModuleLayout(previewLayout ?? config.layout), [config.layout, previewLayout]);
  const layout = previewLayout ?? config.layout;

  function commitInteraction(event: PointerEvent<HTMLDivElement>) {
    const interaction = interactionRef.current;

    if (!interaction || interaction.pointerId !== event.pointerId) {
      return;
    }

    const nextLayout = previewLayout;
    const shouldOpenEditor = distance(event, interaction) < DRAG_THRESHOLD && interaction.mode === "move";
    interactionRef.current = null;
    setActiveInteractionId(null);
    setPreviewLayout(null);

    if (nextLayout) {
      updateLayout(nextLayout);
      return;
    }

    if (shouldOpenEditor) {
      selectWidget(interaction.id);
    }
  }

  function cancelInteraction(event: PointerEvent<HTMLDivElement>) {
    if (interactionRef.current?.pointerId !== event.pointerId) {
      return;
    }

    interactionRef.current = null;
    setActiveInteractionId(null);
    setPreviewLayout(null);
  }

  function updateInteraction(event: PointerEvent<HTMLDivElement>) {
    const interaction = interactionRef.current;

    if (!interaction || interaction.pointerId !== event.pointerId) {
      return;
    }

    const metrics = getGridMetrics(event.currentTarget);

    if (!metrics) {
      return;
    }

    const deltaX = event.clientX - interaction.startClientX;
    const deltaY = event.clientY - interaction.startClientY;

    if (interaction.mode === "move") {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < DRAG_THRESHOLD) {
        return;
      }

      const nextX = Math.round((event.clientX - metrics.left) / (metrics.columnWidth + metrics.gap) - interaction.baseItem.w / 2);
      const nextY = Math.round((event.clientY - metrics.top) / (metrics.rowHeight + metrics.gap) - interaction.baseItem.h / 2);
      setPreviewLayout(updateBentoLayoutItem(interaction.baseLayout, interaction.id, { x: nextX, y: nextY }));
      return;
    }

    const nextW = interaction.baseItem.w + Math.round(deltaX / (metrics.columnWidth + metrics.gap));
    const nextH = interaction.baseItem.h + Math.round(deltaY / (metrics.rowHeight + metrics.gap));
    setPreviewLayout(updateBentoLayoutItem(interaction.baseLayout, interaction.id, { w: nextW, h: nextH }));
  }

  function startInteraction(event: PointerEvent<HTMLDivElement>, item: GridLayoutItem, mode: InteractionMode) {
    if (event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest("a, button, input, textarea, select, [contenteditable='true']")) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setActiveInteractionId(item.i);
    interactionRef.current = {
      baseItem: item,
      baseLayout: config.layout,
      id: item.i,
      mode,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
    };
  }

  return (
    <section className="min-w-0">
      <div onPointerCancel={cancelInteraction} onPointerMove={updateInteraction} onPointerUp={commitInteraction}>
        <BentoGrid
          afterItems={<AddModuleSlot layout={addLayout} />}
          getItemClassName={() => "relative touch-none"}
          getItemOverlay={(item, widget) => (
            <EditorGridOverlay
              item={item}
              selected={(selectedTarget?.type === "widget" && selectedTarget.id === widget.id) || activeInteractionId === widget.id}
              startInteraction={startInteraction}
              widget={widget}
            />
          )}
          layout={layout}
          widgets={config.widgets}
        />
      </div>
    </section>
  );
}

function EditorGridOverlay({ item, selected, startInteraction, widget }: { item: GridLayoutItem; selected: boolean; startInteraction: (event: PointerEvent<HTMLDivElement>, item: GridLayoutItem, mode: InteractionMode) => void; widget: WidgetInstance }) {
  const definition = getWidgetDefinition(widget.type);

  if (!definition) {
    return null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  return (
    <div
      aria-label={`选择 ${definition.name} 模块`}
      className={`group absolute inset-0 z-20 rounded-[2rem] touch-none transition ${selected ? "ring-4 ring-[#7c5cff]/60 ring-offset-4 ring-offset-[#f7f4ef]" : "ring-1 ring-transparent hover:ring-black/10"}`}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => startInteraction(event, item, "move")}
      role="button"
      tabIndex={0}
    >
      <div className={`pointer-events-none absolute left-3 top-3 rounded-full bg-zinc-950 px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white shadow-[0_10px_28px_rgba(20,16,10,0.16)] transition ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus:opacity-100"}`}>
        拖动或点击编辑
      </div>
      <div
        aria-label="拖拽调整模块大小"
        className={`absolute bottom-3 right-3 z-30 grid size-9 cursor-nwse-resize place-items-center rounded-2xl border border-black/10 bg-white/95 shadow-[0_12px_36px_rgba(20,16,10,0.18)] transition ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus:opacity-100"}`}
        onPointerDown={(event) => {
          event.stopPropagation();
          startInteraction(event, item, "resize");
        }}
        role="presentation"
      >
        <span className="block size-3 rounded-br-lg border-b-2 border-r-2 border-zinc-900" />
      </div>
    </div>
  );
}

function AddModuleSlot({ layout }: { layout: GridLayoutItem }) {
  const [open, setOpen] = useState(false);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={`${bentoGridStyles.item} relative`} style={getBentoGridItemStyle(layout)}>
      <button
        aria-expanded={open}
        className="mg-no-drag grid h-full min-h-44 w-full place-items-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white/45 p-5 text-center text-zinc-500 transition hover:border-[#7c5cff]/40 hover:bg-white/75 focus:outline-none focus:ring-4 focus:ring-[#7c5cff]/20"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleKeyDown}
        type="button"
      >
        <span className="grid gap-3">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-zinc-950 text-3xl font-black leading-none text-white shadow-[0_18px_48px_rgba(20,16,10,0.18)]">+</span>
          <span className="text-sm font-black uppercase tracking-[0.18em] text-zinc-500">添加模块</span>
          <span className="text-xs font-medium leading-5 text-zinc-400">2x2 占位</span>
        </span>
      </button>
      {open ? (
        <div className="mg-no-drag absolute left-0 top-[calc(100%+0.75rem)] z-50 w-[min(22rem,calc(100vw-2.5rem))]" onClick={(event) => event.stopPropagation()}>
          <AddWidgetPanel onAdd={() => setOpen(false)} placement={{ x: layout.x, y: layout.y }} />
        </div>
      ) : null}
    </div>
  );
}

function findAddModuleLayout(layout: GridLayoutItem[]): GridLayoutItem {
  const occupied = layout.map(clampBentoLayoutItem);
  const maxY = occupied.reduce((bottom, item) => Math.max(bottom, item.y + item.h), 0);

  for (let y = 0; y <= maxY + BENTO_DEFAULT_ITEM_SIZE; y += 1) {
    for (let x = 0; x <= BENTO_COLS - BENTO_DEFAULT_ITEM_SIZE; x += 1) {
      const candidate = { i: ADD_MODULE_ID, x, y, w: BENTO_DEFAULT_ITEM_SIZE, h: BENTO_DEFAULT_ITEM_SIZE };

      if (!occupied.some((item) => bentoLayoutItemsCollide(candidate, item))) {
        return candidate;
      }
    }
  }

  return { i: ADD_MODULE_ID, x: 0, y: maxY, w: BENTO_DEFAULT_ITEM_SIZE, h: BENTO_DEFAULT_ITEM_SIZE };
}

function getGridMetrics(element: HTMLElement): GridMetrics | null {
  const grid = element.querySelector<HTMLElement>("[data-bento-grid='true']");

  if (!grid) {
    return null;
  }

  const rect = grid.getBoundingClientRect();
  const styles = window.getComputedStyle(grid);
  const gap = Number.parseFloat(styles.columnGap) || BENTO_GAP;
  const columnWidth = (rect.width - gap * (BENTO_COLS - 1)) / BENTO_COLS;

  return {
    columnWidth,
    gap,
    left: rect.left,
    rowHeight: BENTO_ROW_HEIGHT,
    top: rect.top,
  };
}

function distance(event: PointerEvent<HTMLDivElement>, interaction: InteractionState) {
  return Math.max(Math.abs(event.clientX - interaction.startClientX), Math.abs(event.clientY - interaction.startClientY));
}
