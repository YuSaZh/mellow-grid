"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { BentoGrid, bentoGridStyles, getBentoGridItemStyle } from "@/components/page/bento-grid";
import { BENTO_COLS, BENTO_DEFAULT_ITEM_SIZE, BENTO_GAP, bentoLayoutItemsCollide, clampBentoLayoutItem, updateBentoLayoutItem } from "@/lib/page-config/bento-layout";
import type { GridLayoutItem, WidgetInstance, WidgetRenderVariant } from "@/lib/page-config/types";
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
  ghostHeight: number;
  ghostWidth: number;
  id: string;
  mode: InteractionMode;
  pointerOffsetX: number;
  pointerOffsetY: number;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  widget: WidgetInstance;
};

type DragGhostState = {
  height: number;
  item: GridLayoutItem;
  left: number;
  top: number;
  widget: WidgetInstance;
  width: number;
};

export function EditorCanvas() {
  const config = useEditorStore((state) => state.config);
  const selectedTarget = useEditorStore((state) => state.selectedTarget);
  const selectWidget = useEditorStore((state) => state.selectWidget);
  const updateLayout = useEditorStore((state) => state.updateLayout);
  const [activeInteractionId, setActiveInteractionId] = useState<string | null>(null);
  const [dragGhost, setDragGhost] = useState<DragGhostState | null>(null);
  const [previewLayout, setPreviewLayout] = useState<GridLayoutItem[] | null>(null);
  const interactionRef = useRef<InteractionState | null>(null);
  const layout = previewLayout ?? config.layout;
  const addModuleLayout = useMemo(() => findAddModuleLayout(layout), [layout]);

  function commitInteraction(event: PointerEvent<HTMLDivElement>) {
    const interaction = interactionRef.current;

    if (!interaction || interaction.pointerId !== event.pointerId) {
      return;
    }

    const nextLayout = previewLayout;
    const shouldOpenEditor = distance(event, interaction) < DRAG_THRESHOLD && interaction.mode === "move";
    interactionRef.current = null;
    setActiveInteractionId(null);
    setDragGhost(null);
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
    setDragGhost(null);
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

      setDragGhost({
        height: interaction.ghostHeight,
        item: interaction.baseItem,
        left: event.clientX - interaction.pointerOffsetX,
        top: event.clientY - interaction.pointerOffsetY,
        widget: interaction.widget,
        width: interaction.ghostWidth,
      });

      const nextX = Math.round((event.clientX - metrics.left - interaction.pointerOffsetX) / (metrics.columnWidth + metrics.gap));
      const nextY = Math.round((event.clientY - metrics.top - interaction.pointerOffsetY) / (metrics.rowHeight + metrics.gap));
      setPreviewLayout(updateBentoLayoutItem(interaction.baseLayout, interaction.id, { x: nextX, y: nextY }));
      return;
    }

    const nextW = interaction.baseItem.w + Math.round(deltaX / (metrics.columnWidth + metrics.gap));
    const nextH = interaction.baseItem.h + Math.round(deltaY / (metrics.rowHeight + metrics.gap));
    setPreviewLayout(updateBentoLayoutItem(interaction.baseLayout, interaction.id, { w: nextW, h: nextH }));
  }

  function startInteraction(event: PointerEvent<HTMLDivElement>, item: GridLayoutItem, widget: WidgetInstance, mode: InteractionMode) {
    if (event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest("a, button, input, textarea, select, [contenteditable='true']")) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    setActiveInteractionId(item.i);
    interactionRef.current = {
      baseItem: item,
      baseLayout: config.layout,
      ghostHeight: rect.height,
      ghostWidth: rect.width,
      id: item.i,
      mode,
      pointerOffsetX: event.clientX - rect.left,
      pointerOffsetY: event.clientY - rect.top,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      widget,
    };
  }

  return (
    <section className="relative min-w-0 flex-1">
      <style>{`
        @keyframes mgEditorItemIn {
          0% { opacity: 0; transform: translateY(14px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .mg-editor-grid-item {
          animation: mgEditorItemIn 0.45s cubic-bezier(0.165, 0.84, 0.44, 1) both;
        }

        .mg-editor-grid-item > *:first-child {
          will-change: transform;
        }

        .mg-editor-placeholder > *:first-child {
          opacity: 0.15 !important;
          transform: scale(0.96) !important;
          border: 2px dashed #3FA3EB !important;
          background: rgba(63, 163, 235, 0.05) !important;
          box-shadow: none !important;
        }
      `}</style>
      <div onPointerCancel={cancelInteraction} onPointerMove={updateInteraction} onPointerUp={commitInteraction}>
        <BentoGrid
          getItemClassName={(_item, widget) => `relative touch-none mg-editor-grid-item ${dragGhost?.widget.id === widget.id ? "mg-editor-placeholder" : ""}`}
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
          afterItems={<AddModuleSlot layout={addModuleLayout} />}
        />
      </div>
      {dragGhost ? <EditorDragGhost ghost={dragGhost} /> : null}
    </section>
  );
}

function AddModuleSlot({ layout }: { layout: GridLayoutItem }) {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleOutsidePointerDown(event: globalThis.PointerEvent) {
      const target = event.target;

      if (target instanceof Node && slotRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown, true);
    return () => document.removeEventListener("pointerdown", handleOutsidePointerDown, true);
  }, [open]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  function closePanel() {
    setOpen(false);
  }

  function togglePanel(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setOpen((value) => !value);
  }

  return (
    <div className={`${bentoGridStyles.item} relative overflow-visible mg-editor-grid-item`} ref={slotRef} style={getBentoGridItemStyle(layout)}>
      <button
        aria-expanded={open}
        className="mg-no-drag grid h-full min-h-44 w-full place-items-center rounded-[38px] border-2 border-dashed border-[#3FA3EB]/40 bg-white/[0.48] p-5 text-center transition hover:-translate-y-1 hover:border-[#3FA3EB]/80 hover:bg-white/[0.82] focus:outline-none focus:ring-4 focus:ring-[#3FA3EB]/[0.16]"
        onClick={togglePanel}
        onKeyDown={handleKeyDown}
        type="button"
      >
        <span className="grid gap-3">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#121214] text-3xl font-black leading-none text-white shadow-[0_18px_48px_rgba(15,17,25,0.20)]">+</span>
          <span className="text-sm font-black uppercase tracking-[0.18em] text-[#121214]">添加模块</span>
          <span className="text-xs font-medium leading-5 text-zinc-400">点击添加到网格</span>
        </span>
      </button>
      {open ? (
        <div className="mg-no-drag absolute bottom-[calc(100%+0.75rem)] left-1/2 z-[2200] w-[min(20rem,calc(100vw-2.5rem))] -translate-x-1/2 xl:left-auto xl:right-0 xl:translate-x-0">
          <AddWidgetPanel onAdd={closePanel} placement={{ x: layout.x, y: layout.y }} />
        </div>
      ) : null}
    </div>
  );
}

function EditorGridOverlay({ item, selected, startInteraction, widget }: { item: GridLayoutItem; selected: boolean; startInteraction: (event: PointerEvent<HTMLDivElement>, item: GridLayoutItem, widget: WidgetInstance, mode: InteractionMode) => void; widget: WidgetInstance }) {
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
      className={`group absolute inset-0 z-20 rounded-[38px] touch-none transition ${selected ? "outline outline-[3.5px] outline-offset-[4px] outline-[#3FA3EB] shadow-[0_25px_50px_rgba(63,163,235,0.15)]" : "outline outline-0 outline-offset-[4px] outline-transparent hover:outline-[2px] hover:outline-[#3FA3EB]/35"}`}
      data-editor-widget-id={widget.id}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => startInteraction(event, item, widget, "move")}
      role="button"
      tabIndex={0}
    >
      <div
        aria-label="拖拽调整模块大小"
        className={`absolute bottom-3 right-3 z-[99] flex size-[18px] cursor-se-resize items-center justify-center transition duration-200 hover:scale-125 ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus:opacity-100"}`}
        onPointerDown={(event) => {
          event.stopPropagation();
          startInteraction(event, item, widget, "resize");
        }}
        role="presentation"
      >
        <svg aria-hidden="true" className="size-2.5 fill-white/70 [filter:drop-shadow(0_1.5px_2px_rgba(0,0,0,0.35))]" viewBox="0 0 8 8">
          <path d="M6 0 L8 0 L8 8 L0 8 L0 6 L5 6 L0 1 L1 0 L6 5 Z" />
        </svg>
      </div>
    </div>
  );
}

function EditorDragGhost({ ghost }: { ghost: DragGhostState }) {
  const definition = getWidgetDefinition(ghost.widget.type);

  if (!definition) {
    return null;
  }

  const Widget = definition.Component;

  return (
    <div
      className="pointer-events-none fixed z-[3000] opacity-[0.92] shadow-[0_30px_65px_rgba(0,0,0,0.28),0_10px_20px_rgba(0,0,0,0.15)]"
      style={{
        height: ghost.height,
        left: ghost.left,
        top: ghost.top,
        transform: "scale(1.05) rotate(1.8deg)",
        width: ghost.width,
      }}
    >
      <Widget context={{ layout: ghost.item, variant: getWidgetRenderVariant(ghost.item) }} props={ghost.widget.props} />
    </div>
  );
}

function getGridMetrics(element: HTMLElement): GridMetrics | null {
  const grid = element.querySelector<HTMLElement>("[data-bento-grid='true']");

  if (!grid) {
    return null;
  }

  const rect = grid.getBoundingClientRect();
  const styles = window.getComputedStyle(grid);
  const gap = Number.parseFloat(styles.columnGap) || BENTO_GAP;
  const rowHeight = Number.parseFloat(styles.gridAutoRows) || (rect.width - gap * (BENTO_COLS - 1)) / BENTO_COLS;
  const columnWidth = (rect.width - gap * (BENTO_COLS - 1)) / BENTO_COLS;

  return {
    columnWidth,
    gap,
    left: rect.left,
    rowHeight,
    top: rect.top,
  };
}

function distance(event: PointerEvent<HTMLDivElement>, interaction: InteractionState) {
  return Math.max(Math.abs(event.clientX - interaction.startClientX), Math.abs(event.clientY - interaction.startClientY));
}

function getWidgetRenderVariant(item: GridLayoutItem): WidgetRenderVariant {
  if (item.w >= 2 && item.h >= 2) {
    return "large";
  }

  if (item.w >= 2) {
    return "wide";
  }

  return "compact";
}

function findAddModuleLayout(layout: GridLayoutItem[]): GridLayoutItem {
  const occupied = layout.map(clampBentoLayoutItem);
  const maxY = occupied.reduce((bottom, item) => Math.max(bottom, item.y + item.h), 0);

  for (let y = 0; y <= maxY + BENTO_DEFAULT_ITEM_SIZE; y += 1) {
    for (let x = 0; x <= BENTO_COLS - BENTO_DEFAULT_ITEM_SIZE; x += 1) {
      const candidate: GridLayoutItem = { i: ADD_MODULE_ID, x, y, w: BENTO_DEFAULT_ITEM_SIZE, h: BENTO_DEFAULT_ITEM_SIZE };

      if (!occupied.some((item) => bentoLayoutItemsCollide(candidate, item))) {
        return candidate;
      }
    }
  }

  return { i: ADD_MODULE_ID, x: 0, y: maxY, w: BENTO_DEFAULT_ITEM_SIZE, h: BENTO_DEFAULT_ITEM_SIZE };
}
