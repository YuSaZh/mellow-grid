import { BentoCard } from "@/components/ui/bento-card";

export type StatsWidgetProps = {
  value: string;
  label: string;
};

export function StatsWidget({ props }: { props: StatsWidgetProps }) {
  return (
    <BentoCard className="grid place-items-center text-center">
      <div>
        <p className="text-6xl font-black tracking-tight text-zinc-950">{props.value}</p>
        <p className="mt-2 text-sm font-medium text-zinc-500">{props.label}</p>
      </div>
    </BentoCard>
  );
}

export const statsWidget = {
  type: "stats",
  name: "Stats",
  description: "A large number with a small label.",
  defaultLayout: { w: 2, h: 2, minW: 2, minH: 2 },
  defaultProps: {
    value: "24",
    label: "Years lived",
  } satisfies StatsWidgetProps,
  Component: StatsWidget,
};
