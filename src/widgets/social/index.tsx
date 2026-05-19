import { BentoCard, BentoIcon } from "@/components/ui/bento-card";

export type SocialWidgetProps = {
  label: string;
  href: string;
  handle?: string;
  initials?: string;
};

export function SocialWidget({ props }: { props: SocialWidgetProps }) {
  const iconLabel = props.initials || props.label.slice(0, 2).toUpperCase();

  return (
    <BentoCard className="group">
      <a className="absolute inset-0 z-10 block rounded-[24px] text-left outline-none transition focus-visible:ring-4 focus-visible:ring-white/25" href={props.href} aria-label={props.label}>
        <BentoIcon className="absolute left-6 top-6">{iconLabel}</BentoIcon>
        <span className="absolute inset-x-6 bottom-5 grid gap-[3px]">
          <span className="[word-break:break-word] text-[16px] font-semibold leading-none text-[#fbfbfb]">{props.label}</span>
          <span className="[word-break:break-word] text-[12px] leading-4 text-[#fbfbfb]">{props.handle || "@handle or address"}</span>
        </span>
        <span className="absolute right-[13px] top-[13px] size-5 rounded-full border-2 border-white/20 bg-black/20 opacity-0 backdrop-blur-[7px]" />
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
    handle: "@handle or address",
    initials: "in",
  } satisfies SocialWidgetProps,
  Component: SocialWidget,
};
