import type { CSSProperties } from "react";
import { BENTO_COLS, BENTO_GAP, BENTO_ROW_HEIGHT, clampBentoLayoutItem } from "@/lib/page-config/bento-layout";
import type { PageConfig } from "@/lib/page-config/types";
import { getWidgetDefinition } from "@/lib/widgets/registry";
import styles from "./bento-grid.module.css";
import { PageShell } from "./page-shell";

export function PageRenderer({ config }: { config: PageConfig }) {
  const widgetsById = new Map(config.widgets.map((widget) => [widget.id, widget]));
  const profileWidget = config.widgets.find((widget) => widget.type === "profile");
  const profileDefinition = profileWidget ? getWidgetDefinition(profileWidget.type) : undefined;
  const Profile = profileDefinition?.Component;
  const gridLayout = config.layout.filter((item) => widgetsById.get(item.i)?.type !== "profile");

  return (
    <PageShell
      config={config}
      profile={profileWidget && Profile ? <Profile props={profileWidget.props} /> : null}
      grid={
        <section
          className={styles.grid}
          style={
            {
              "--bento-cols": BENTO_COLS,
              "--bento-gap": `${BENTO_GAP}px`,
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

            return (
              <div
                key={item.i}
                className={styles.item}
                style={
                  {
                    "--bento-grid-column": `${item.x + 1} / span ${item.w}`,
                    "--bento-grid-row": `${item.y + 1} / span ${item.h}`,
                  } as CSSProperties
                }
              >
                <Widget props={widget.props} />
              </div>
            );
          })}
        </section>
      }
    />
  );
}
