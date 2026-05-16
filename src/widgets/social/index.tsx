import { BentoCard } from "@/components/ui/bento-card";

export type SocialWidgetProps = {
  label: string;
  href: string;
  initials?: string;
};

export function SocialWidget({ props }: { props: SocialWidgetProps }) {
  return (
    <BentoCard className="grid place-items-center p-0 text-center">
      <a className="grid h-full w-full place-items-center rounded-[2rem] text-3xl font-black text-zinc-950" href={props.href} aria-label={props.label}>
        {props.initials || props.label.slice(0, 2).toUpperCase()}
      </a>
    </BentoCard>
  );
}

export const socialWidget = {
  type: "social",
  name: "Social",
  description: "A compact 1x1 social link tile.",
  defaultLayout: { w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
  defaultProps: {
    label: "Social",
    href: "#",
    initials: "in",
  } satisfies SocialWidgetProps,
  Component: SocialWidget,
};
