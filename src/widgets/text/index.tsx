import { BentoCard } from "@/components/ui/bento-card";

export type TextWidgetProps = {
  eyebrow?: string;
  title: string;
  body: string;
};

export function TextWidget({ props }: { props: TextWidgetProps }) {
  return (
    <BentoCard>
      {props.eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">{props.eyebrow}</p> : null}
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950">{props.title}</h2>
      <p className="mt-4 text-base leading-7 text-zinc-600">{props.body}</p>
    </BentoCard>
  );
}

export const textWidget = {
  type: "text",
  name: "Text",
  description: "Heading, body copy, or quote content.",
  defaultLayout: { w: 4, h: 2, minW: 3, minH: 2 },
  defaultProps: {
    eyebrow: "Snapshot",
    title: "Simple, rounded, customizable.",
    body: "A soft Bento module for notes, quotes, or introductions.",
  } satisfies TextWidgetProps,
  Component: TextWidget,
};
