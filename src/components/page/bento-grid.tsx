import type { CSSProperties, ReactNode } from "react";
import { BENTO_CELL_SIZE, BENTO_COLS, BENTO_GAP, BENTO_GRID_WIDTH, BENTO_ROW_UNIT_HEIGHT, clampBentoLayoutItem, getBentoGridRow } from "@/lib/page-config/bento-layout";
import type { GridLayoutItem, WidgetInstance, WidgetRenderVariant } from "@/lib/page-config/types";
import { getWidgetDefinition } from "@/lib/widgets/registry";
import styles from "./bento-grid.module.css";

type BentoGridProps = {
  afterItems?: ReactNode;
  getItemClassName?: (item: GridLayoutItem, widget: WidgetInstance) => string | undefined;
  getItemOverlay?: (item: GridLayoutItem, widget: WidgetInstance) => ReactNode;
  layout: GridLayoutItem[];
  widgets: WidgetInstance[];
};

export function BentoGrid({ afterItems, getItemClassName, getItemOverlay, layout, widgets }: BentoGridProps) {
  const widgetsById = new Map(widgets.map((widget) => [widget.id, widget]));
  const renderedEntries = sortBentoLayout(layout)
    .map((item) => {
      const widget = widgetsById.get(item.i);
      const definition = widget ? getWidgetDefinition(widget.type) : undefined;

      return widget && definition ? { item, widget, definition } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return (
    <section
      className={styles.grid}
      data-bento-grid="true"
      style={
        {
          "--bento-cols": BENTO_COLS,
          "--bento-cell-size": `${BENTO_CELL_SIZE}px`,
          "--bento-gap": `${BENTO_GAP}px`,
          "--bento-grid-width": `${BENTO_GRID_WIDTH}px`,
          "--bento-row-height": `${BENTO_ROW_UNIT_HEIGHT}px`,
        } as CSSProperties
      }
    >
      {renderedEntries.map(({ item, widget, definition }, index) => {
        const Widget = definition.Component;
        const className = getItemClassName?.(item, widget);
        const variant = getWidgetRenderVariant(item);
        const isWide = item.w >= 2;
        const isLarge = item.w >= 2 && item.h >= 2;

        return (
          <div
            key={item.i}
            className={[styles.item, "mg-card-enter", className].filter(Boolean).join(" ")}
            data-bento-h={item.h}
            data-bento-w={item.w}
            data-large={isLarge ? "true" : undefined}
            data-wide={isWide ? "true" : undefined}
            data-widget-type={widget.type}
            style={
              {
                ...getBentoGridItemStyle(item),
                "--mg-stagger": index,
              } as CSSProperties
            }
          >
            <Widget props={widget.props} context={{ layout: item, variant }} />
            {getItemOverlay?.(item, widget)}
          </div>
        );
      })}
      {afterItems}
    </section>
  );
}

export function sortBentoLayout(layout: GridLayoutItem[]): GridLayoutItem[] {
  return layout
    .map((item, index) => ({ item: clampBentoLayoutItem(item), index }))
    .sort((a, b) => a.item.y - b.item.y || a.item.x - b.item.x || a.index - b.index)
    .map(({ item }) => item);
}

export function getWidgetRenderVariant(item: GridLayoutItem): WidgetRenderVariant {
  if (item.w >= 2 && item.h >= 2) {
    return "large";
  }

  if (item.w >= 2) {
    return "wide";
  }

  return "compact";
}

export function getBentoGridItemStyle(item: GridLayoutItem): CSSProperties {
  const nextItem = clampBentoLayoutItem(item);

  return {
    "--bento-grid-column": `${nextItem.x + 1} / span ${nextItem.w}`,
    "--bento-grid-row": getBentoGridRow(nextItem),
    "--bento-item-aspect-ratio": getBentoGridItemAspectRatio(nextItem),
  } as CSSProperties;
}

function getBentoGridItemAspectRatio(item: GridLayoutItem) {
  const width = item.w * BENTO_CELL_SIZE + Math.max(0, item.w - 1) * BENTO_GAP;
  const height = item.h * BENTO_CELL_SIZE + Math.max(0, item.h - 1) * BENTO_GAP;

  return `${width} / ${height}`;
}

export { styles as bentoGridStyles };
