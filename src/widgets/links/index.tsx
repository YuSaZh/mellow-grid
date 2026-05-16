import { BentoCard } from "@/components/ui/bento-card";

export type LinksWidgetProps = {
  links: Array<{
    label: string;
    href: string;
  }>;
};

export function LinksWidget({ props }: { props: LinksWidgetProps }) {
  return (
    <BentoCard>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Links</p>
      <div className="mt-5 grid gap-3">
        {props.links.map((link) => (
          <a
            key={`${link.label}-${link.href}`}
            href={link.href}
            className="rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            {link.label}
          </a>
        ))}
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
