import { BentoCard } from "@/components/ui/bento-card";

export type StatsWidgetProps = {
  value: string;
  label: string;
};

export function StatsWidget({ props }: { props: StatsWidgetProps }) {
  return (
    <BentoCard className="grid place-items-center text-center">
      <div>
        <p className="text-5xl font-black tracking-tight text-zinc-950 sm:text-6xl">{props.value}</p>
        <p className="mt-2 text-xs font-medium text-zinc-500 sm:text-sm">{props.label}</p>
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
