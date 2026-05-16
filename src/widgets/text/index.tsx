import { BentoCard } from "@/components/ui/bento-card";

export type TextWidgetProps = {
  eyebrow?: string;
  title: string;
  body: string;
};

export function TextWidget({ props }: { props: TextWidgetProps }) {
  return (
    <BentoCard>
      {props.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">{props.eyebrow}</p> : null}
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">{props.title}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">{props.body}</p>
    </BentoCard>
  );
}

export const textWidget = {
  type: "text",
  name: "Text",
  description: "Heading, body copy, or quote content.",
  defaultLayout: { w: 2, h: 2, minW: 1, minH: 1 },
  defaultProps: {
    eyebrow: "Snapshot",
    title: "Simple, rounded, customizable.",
    body: "A soft Bento module for notes, quotes, or introductions.",
  } satisfies TextWidgetProps,
  Component: TextWidget,
};
