import type { WidgetRenderContext } from "@/lib/page-config/types";

export type DividerWidgetProps = {
  eyebrow?: string;
  title: string;
};

export function DividerWidget({ context, props }: { context?: WidgetRenderContext; props: DividerWidgetProps }) {
  const compact = context?.variant === "compact";

  return (
    <section className="relative z-10 flex h-full min-h-0 items-end text-left text-[#111113]">
      <div className="w-full pb-2">
        {props.eyebrow ? <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9b9ba4]">{props.eyebrow}</p> : null}
        <h2 className={`${compact ? "text-[1.25rem]" : "text-[1.7rem]"} font-extrabold leading-none tracking-[-0.05em]`}>{props.title}</h2>
      </div>
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
