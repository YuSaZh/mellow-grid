import type { CSSProperties, ReactNode } from "react";
import { BENTO_CELL_SIZE, BENTO_COLS, BENTO_GAP, BENTO_GRID_WIDTH, BENTO_ROW_HEIGHT, clampBentoLayoutItem } from "@/lib/page-config/bento-layout";
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
  const gridLayout = layout.filter((item) => widgetsById.has(item.i));

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
          "--bento-row-height": `${BENTO_ROW_HEIGHT}px`,
        } as CSSProperties
      }
    >
      {gridLayout.map((layoutItem) => {
        const item = clampBentoLayoutItem(layoutItem);
        const widget = widgetsById.get(item.i);
        const definition = widget ? getWidgetDefinition(widget.type) : undefined;

        if (!widget || !definition) {
          return null;
        }

        const Widget = definition.Component;
        const className = getItemClassName?.(item, widget);
        const variant = getWidgetRenderVariant(item);

        return (
          <div
            key={item.i}
            className={className ? `${styles.item} ${className}` : styles.item}
            style={
              {
                "--bento-grid-column": `${item.x + 1} / span ${item.w}`,
                "--bento-grid-row": `${item.y + 1} / span ${item.h}`,
                "--bento-item-aspect-ratio": getBentoGridItemAspectRatio(item),
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

function getWidgetRenderVariant(item: GridLayoutItem): WidgetRenderVariant {
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
    "--bento-grid-row": `${nextItem.y + 1} / span ${nextItem.h}`,
    "--bento-item-aspect-ratio": getBentoGridItemAspectRatio(nextItem),
  } as CSSProperties;
}

function getBentoGridItemAspectRatio(item: GridLayoutItem) {
  const width = item.w * BENTO_CELL_SIZE + Math.max(0, item.w - 1) * BENTO_GAP;
  const height = item.h * BENTO_CELL_SIZE + Math.max(0, item.h - 1) * BENTO_GAP;

  return `${width} / ${height}`;
}

export { styles as bentoGridStyles };
