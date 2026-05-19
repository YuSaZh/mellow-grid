import { BentoCard, BentoIcon } from "@/components/ui/bento-card";

export type LinksWidgetProps = {
  links: Array<{
    label: string;
    href: string;
  }>;
};

export function LinksWidget({ props }: { props: LinksWidgetProps }) {
  return (
    <BentoCard>
      <BentoIcon className="absolute left-6 top-6 z-10">LN</BentoIcon>
      <div className="absolute inset-x-6 bottom-5 z-10 grid gap-[3px]">
        <p className="text-[16px] font-semibold leading-none text-[#fbfbfb]">Links</p>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {props.links.map((link) => (
            <a className="text-[12px] leading-4 text-[#fbfbfb] transition hover:text-white/75" href={link.href} key={`${link.label}-${link.href}`}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}

export const linksWidget = {
  type: "links",
  name: "Links",
  description: "A compact list of social and action links.",
  defaultLayout: { w: 2, h: 2, minW: 1, minH: 1 },
  defaultProps: {
    links: [
      { label: "GitHub", href: "https://github.com/" },
      { label: "Blog", href: "https://example.com" },
    ],
  } satisfies LinksWidgetProps,
  Component: LinksWidget,
};
