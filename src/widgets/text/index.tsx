import { BentoCard, BentoIcon } from "@/components/ui/bento-card";

export type TextWidgetProps = {
  eyebrow?: string;
  title: string;
  body: string;
};

export function TextWidget({ props }: { props: TextWidgetProps }) {
  return (
    <BentoCard>
      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <BentoIcon>TX</BentoIcon>
        <div>
          {props.eyebrow ? <p className="text-[12px] font-normal leading-4 text-[#fbfbfb]">{props.eyebrow}</p> : null}
          <h2 className="mt-1 text-[16px] font-semibold leading-tight text-[#fbfbfb]">{props.title}</h2>
          <p className="mt-2 text-[12px] leading-4 text-[#fbfbfb]/80">{props.body}</p>
        </div>
      </div>
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
