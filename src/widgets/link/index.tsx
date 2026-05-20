import { LinkLogo } from "@/components/widgets/link-logo";
import { WidgetShell, type WidgetBackground } from "@/components/widgets/widget-shell";
import type { WidgetRenderContext } from "@/lib/page-config/types";
import type { LinkLogo as LinkLogoValue } from "@/lib/widgets/logo-registry";

export type LinkWidgetProps = {
  background?: WidgetBackground;
  color?: string;
  description?: string;
  href: string;
  logo?: LinkLogoValue;
  title: string;
};

export function LinkWidget({ context, props }: { context?: WidgetRenderContext; props: LinkWidgetProps }) {
  const title = props.title || "Link";
  const description = props.description ?? props.href;
  const variant = context?.variant ?? "compact";

  return (
    <WidgetShell ariaLabel={title} background={props.background} className="text-left" href={props.href || "#"} showLinkIndicator>
      {variant === "large" ? <LargeLinkContent color={props.color} description={description} logo={props.logo} title={title} /> : <CompactLinkContent color={props.color} description={description} logo={props.logo} title={title} wide={variant === "wide"} />}
    </WidgetShell>
  );
}

function CompactLinkContent({ color, description, logo, title, wide = false }: Pick<LinkWidgetProps, "color" | "description" | "logo" | "title"> & { wide?: boolean }) {
  return (
    <span className="relative z-10 flex h-full flex-col justify-between px-6 pb-5 pt-6">
      <LinkLogo className="shrink-0" color={color} logo={logo} title={title} />
      <span className={`grid gap-[3px] ${wide ? "absolute bottom-5 left-[6.5rem] right-6" : ""}`}>
        <span className="[word-break:break-word] text-[16px] font-semibold leading-none text-[#fbfbfb]">{title}</span>
        {description ? <span className="[word-break:break-word] text-[12px] leading-4 text-[#fbfbfb]">{description}</span> : null}
      </span>
    </span>
  );
}

function LargeLinkContent({ color, description, logo, title }: Pick<LinkWidgetProps, "color" | "description" | "logo" | "title">) {
  return (
    <span className="relative z-10 flex h-full flex-col justify-between px-6 pb-5 pt-6">
      <LinkLogo color={color} logo={logo} title={title} />
      <span className="grid gap-2">
        <span className="[word-break:break-word] text-[20px] font-semibold leading-tight text-[#fbfbfb]">{title}</span>
        {description ? <span className="[word-break:break-word] text-[12px] leading-4 text-[#fbfbfb]/80">{description}</span> : null}
      </span>
    </span>
  );
}

export const linkWidget = {
  type: "link",
  name: "Link",
  description: "A single social, contact, or action link tile.",
  defaultLayout: { w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
  defaultProps: {
    title: "Figma",
    description: "@handle or address",
    href: "https://figma.com/",
    logo: { type: "builtin", key: "figma" },
    color: "#A259FF",
    background: { type: "theme" },
  } satisfies LinkWidgetProps,
  Component: LinkWidget,
};
