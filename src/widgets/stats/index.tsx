import { BentoCard, BentoIcon } from "@/components/ui/bento-card";

export type StatsWidgetProps = {
  value: string;
  label: string;
};

export function StatsWidget({ props }: { props: StatsWidgetProps }) {
  return (
    <BentoCard>
      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <BentoIcon>{props.value.slice(0, 2)}</BentoIcon>
        <div>
          <p className="text-[32px] font-bold leading-none tracking-[-0.04em] text-[#fbfbfb]">{props.value}</p>
          <p className="mt-2 text-[12px] leading-4 text-[#fbfbfb]/80">{props.label}</p>
        </div>
      </div>
    </BentoCard>
  );
}

export const statsWidget = {
  type: "stats",
  name: "Stats",
  description: "A large number with a small label.",
  defaultLayout: { w: 2, h: 2, minW: 1, minH: 1 },
  defaultProps: {
    value: "24",
    label: "Years lived",
  } satisfies StatsWidgetProps,
  Component: StatsWidget,
};
