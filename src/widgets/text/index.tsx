import { WidgetShell, type WidgetBackground } from "@/components/widgets/widget-shell";
import type { WidgetRenderContext } from "@/lib/page-config/types";

export type TextWidgetProps = {
  background?: WidgetBackground;
  eyebrow?: string;
  title: string;
  body: string;
};

export function TextWidget({ context, props }: { context?: WidgetRenderContext; props: TextWidgetProps }) {
  const compact = context?.variant === "compact";

  return (
    <WidgetShell background={props.background} interactive>
      <div className={`relative z-10 flex h-full min-h-0 flex-col justify-between gap-3 text-left ${compact ? "p-5" : "p-6"}`}>
        {props.eyebrow ? (
          <p className="inline-flex w-fit max-w-full items-center truncate rounded-full border border-current/15 bg-current/[0.06] px-2.5 py-1 text-[0.68rem] font-bold uppercase leading-none tracking-[0.16em] text-current opacity-75">
            {props.eyebrow}
          </p>
        ) : (
          <span aria-hidden="true" className="h-1 w-8 rounded-full bg-current opacity-20" />
        )}

        <div className="grid min-w-0 gap-1.5">
          <h2
            className={`[word-break:break-word] font-extrabold leading-[1.2] tracking-[-0.03em] text-current ${
              compact ? "text-[1.06rem]" : "text-[1.2rem] sm:text-[1.28rem]"
            }`}
          >
            {props.title}
          </h2>
          {props.body ? (
            <p
              className={`[word-break:break-word] font-medium leading-[1.55] text-current opacity-75 ${
                compact ? "line-clamp-3 text-[0.8rem]" : "text-[0.86rem] sm:text-[0.88rem]"
              }`}
            >
              {props.body}
            </p>
          ) : null}
        </div>
      </div>
    </WidgetShell>
  );
}

export const textWidget = {
  type: "text",
  name: "Text",
  description: "Heading, body copy, or quote content.",
  defaultLayout: { w: 2, h: 2, minW: 1, minH: 1 },
  defaultProps: {
    background: { type: "theme" },
    eyebrow: "Snapshot",
    title: "Simple, rounded, customizable.",
    body: "A soft Bento module for notes, quotes, or introductions.",
  } satisfies TextWidgetProps,
  Component: TextWidget,
};
