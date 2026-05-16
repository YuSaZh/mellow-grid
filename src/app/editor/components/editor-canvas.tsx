"use client";

import { useMemo, type KeyboardEvent, type MouseEvent } from "react";
import { ReactGridLayout, useContainerWidth, type Layout, type ResizeHandleAxis } from "react-grid-layout";
import { BENTO_COLS, BENTO_GAP, BENTO_ROW_HEIGHT, clampBentoLayoutItem } from "@/lib/page-config/bento-layout";
import type { GridLayoutItem, WidgetInstance } from "@/lib/page-config/types";
import { getWidgetDefinition } from "@/lib/widgets/registry";
import { useEditorStore } from "../store";

const GRID_MARGIN = [BENTO_GAP, BENTO_GAP] as const;
const GRID_PADDING = [0, 0] as const;
const RESIZE_HANDLES: ResizeHandleAxis[] = ["se"];

export function EditorCanvas() {
  const config = useEditorStore((state) => state.config);
  const selectedTarget = useEditorStore((state) => state.selectedTarget);
  const selectWidget = useEditorStore((state) => state.selectWidget);
  const updateLayout = useEditorStore((state) => state.updateLayout);
  const { containerRef, mounted, width } = useContainerWidth({ initialWidth: 960, measureBeforeMount: true });

  const widgetsById = useMemo(() => new Map(config.widgets.map((widget) => [widget.id, widget])), [config.widgets]);
  const gridItems = useMemo(
    () =>
      config.layout
        .map((layout) => ({ layout, widget: widgetsById.get(layout.i) }))
        .filter((item): item is { layout: GridLayoutItem; widget: WidgetInstance } => Boolean(item.widget && item.widget.type !== "profile")),
    [config.layout, widgetsById],
  );
  const layout = useMemo(() => gridItems.map((item) => toGridLayoutItem(item.layout)), [gridItems]);

  function commitLayout(nextLayout: Layout) {
    updateLayout(nextLayout.map(fromGridLayoutItem));
  }

  return (
    <section className="min-w-0">
      <div ref={containerRef} className="min-h-[32rem]">
        {mounted && width > 0 ? (
          <ReactGridLayout
            autoSize
            className="mg-editor-grid min-h-[32rem]"
            dragConfig={{ cancel: "input,textarea,select,a,label,.mg-no-drag", enabled: true, handle: ".mg-drag-handle", threshold: 8 }}
            gridConfig={{ cols: BENTO_COLS, containerPadding: GRID_PADDING, margin: GRID_MARGIN, rowHeight: BENTO_ROW_HEIGHT }}
            layout={layout}
            onDragStop={commitLayout}
            onResizeStop={commitLayout}
            resizeConfig={{ enabled: true, handles: RESIZE_HANDLES }}
            width={width}
          >
            {gridItems.map(({ widget }) => (
              <EditableGridItem key={widget.id} selectWidget={selectWidget} selected={selectedTarget?.type === "widget" && selectedTarget.id === widget.id} widget={widget} />
            ))}
          </ReactGridLayout>
        ) : (
          <div className="grid min-h-[32rem] place-items-center rounded-[2rem] border border-dashed border-black/10 bg-white/60 text-sm font-bold text-zinc-400">Preparing canvas…</div>
        )}
      </div>
    </section>
  );
}

function EditableGridItem({ selectWidget, selected, widget }: { selectWidget: (id: string) => void; selected: boolean; widget: WidgetInstance }) {
  const definition = getWidgetDefinition(widget.type);

  if (!definition) {
    return null;
  }

  const Widget = definition.Component;

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a")) {
      event.preventDefault();
    }

    selectWidget(widget.id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectWidget(widget.id);
    }
  }

  return (
    <div
      aria-label={`选择 ${definition.name} 模块`}
      className={`group relative h-full rounded-[2rem] transition ${selected ? "ring-4 ring-[#7c5cff]/60 ring-offset-4 ring-offset-[#f7f4ef]" : "ring-1 ring-transparent hover:ring-black/10"}`}
      onClickCapture={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between gap-2 rounded-full bg-white/90 p-1 text-xs font-black text-zinc-600 opacity-100 shadow-[0_10px_28px_rgba(20,16,10,0.10)] backdrop-blur transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        <button aria-label={`拖动 ${definition.name} 模块`} className="mg-drag-handle min-h-9 cursor-grab rounded-full bg-zinc-950 px-4 text-white active:cursor-grabbing" type="button">
          拖动
        </button>
        <span className="truncate px-3">{definition.name}</span>
      </div>
      <div className={`pointer-events-none absolute bottom-2 right-2 z-20 grid size-10 place-items-center rounded-full bg-zinc-950 text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"}`}>
        <span className="text-lg leading-none">⌟</span>
      </div>
      <div className="h-full overflow-hidden rounded-[2rem]">
        <Widget props={widget.props} />
      </div>
    </div>
  );
}

function fromGridLayoutItem(item: Layout[number]): GridLayoutItem {
  return clampBentoLayoutItem({
    i: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
    minW: item.minW,
    minH: item.minH,
    maxW: item.maxW,
    maxH: item.maxH,
  });
}

function toGridLayoutItem(item: GridLayoutItem): Layout[number] {
  const nextItem = clampBentoLayoutItem(item);

  return {
    i: nextItem.i,
    x: nextItem.x,
    y: nextItem.y,
    w: nextItem.w,
    h: nextItem.h,
    minW: nextItem.minW,
    minH: nextItem.minH,
    maxW: nextItem.maxW,
    maxH: nextItem.maxH,
  };
}
