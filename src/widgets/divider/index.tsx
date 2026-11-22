import type { WidgetRenderContext } from "@/lib/page-config/types";

export type DividerWidgetProps = {
  eyebrow?: string;
  title: string;
};

export function DividerWidget({ context, props }: { context?: WidgetRenderContext; props: DividerWidgetProps }) {
  const compact = context?.variant === "compact";

  return (
    <section
      className="relative z-10 flex h-full min-h-0 items-end gap-4 pb-1.5 text-left"
      style={{ color: "var(--mg-fg, #141518)" }}
    >
      <div className="min-w-0 max-w-full shrink-0">
        {props.eyebrow ? (
          <p className="mb-1 text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-current opacity-45">
            {props.eyebrow}
          </p>
        ) : null}
        <h2 className={`${compact ? "text-[1.25rem]" : "text-[1.45rem]"} font-extrabold leading-none tracking-[-0.04em] text-current`}>
          {props.title}
        </h2>
      </div>
      {!compact ? <span aria-hidden="true" className="mb-[0.35rem] h-px flex-1 bg-gradient-to-r from-black/12 to-transparent" /> : null}
    </section>
  );
}

export const dividerWidget = {
  type: "divider",
  name: "分栏符",
  description: "无框纯文字标题，用来上下分割右侧网格区域。",
  defaultLayout: { w: 4, h: 0.5, minW: 1, minH: 0.5, maxW: 4, maxH: 0.5 },
  defaultProps: {
    eyebrow: "",
    title: "Section",
  } satisfies DividerWidgetProps,
  Component: DividerWidget,
};
