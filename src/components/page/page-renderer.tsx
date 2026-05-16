import type { PageConfig } from "@/lib/page-config/types";
import { getWidgetDefinition } from "@/lib/widgets/registry";

export function PageRenderer({ config }: { config: PageConfig }) {
  const widgetsById = new Map(config.widgets.map((widget) => [widget.id, widget]));

  return (
    <main
      className="min-h-screen px-6 py-10 text-zinc-950 sm:px-10 lg:px-16"
      style={{ background: config.theme.background, color: config.theme.foreground }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-6 lg:grid-cols-12">
        {config.layout.map((item) => {
          const widget = widgetsById.get(item.i);
          const definition = widget ? getWidgetDefinition(widget.type) : undefined;

          if (!widget || !definition) {
            return null;
          }

          const Widget = definition.Component;

          return (
            <div
              key={item.i}
              className="min-h-48"
              style={{
                gridColumn: `span ${Math.min(item.w, 12)} / span ${Math.min(item.w, 12)}`,
                minHeight: `${item.h * 8}rem`,
              }}
            >
              <Widget props={widget.props} />
            </div>
          );
        })}
      </div>
    </main>
  );
}
