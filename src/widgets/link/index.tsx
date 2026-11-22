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
      {variant === "large" ? (
        <LargeLinkContent color={props.color} description={description} logo={props.logo} title={title} />
      ) : variant === "wide" ? (
        <WideLinkContent color={props.color} description={description} href={props.href} logo={props.logo} title={title} />
      ) : (
        <CompactLinkContent color={props.color} description={description} logo={props.logo} title={title} />
      )}
    </WidgetShell>
  );
}

function CompactLinkContent({ color, description, logo, title }: Pick<LinkWidgetProps, "color" | "description" | "logo" | "title">) {
  return (
    <span className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-3 p-5 sm:p-6">
      <LinkLogo className="shrink-0" color={color} logo={logo} title={title} />
      <span className="grid min-w-0 gap-1">
        <span className="[word-break:break-word] line-clamp-2 text-[1.06rem] font-bold leading-[1.15] tracking-[-0.025em] text-current sm:text-[1.12rem]">{title}</span>
        {description ? <span className="[word-break:break-word] line-clamp-2 text-[0.78rem] font-medium leading-[1.35] text-current opacity-68 sm:text-[0.82rem]">{description}</span> : null}
      </span>
    </span>
  );
}

function WideLinkContent({ color, description, href, logo, title }: Pick<LinkWidgetProps, "color" | "description" | "href" | "logo" | "title">) {
  const host = getDisplayHost(href);

  return (
    <span className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-4 px-6 py-5 sm:px-7 sm:py-6">
      <span className="flex items-center justify-between gap-3 pr-10">
        <LinkLogo className="shrink-0" color={color} logo={logo} title={title} />
        {host ? (
          <span className="hidden max-w-[11rem] truncate rounded-full border border-current/15 bg-current/[0.06] px-2.5 py-1 text-[0.68rem] font-semibold leading-none tracking-[0.01em] text-current opacity-75 sm:inline-block">
            {host}
          </span>
        ) : null}
      </span>
      <span className="grid min-w-0 gap-1">
        <span className="[word-break:break-word] text-[1.16rem] font-bold leading-[1.15] tracking-[-0.03em] text-current sm:text-[1.22rem]">{title}</span>
        {description ? <span className="[word-break:break-word] text-[0.84rem] font-medium leading-[1.42] text-current opacity-72 sm:text-[0.88rem]">{description}</span> : null}
      </span>
    </span>
  );
}

function LargeLinkContent({ color, description, logo, title }: Pick<LinkWidgetProps, "color" | "description" | "logo" | "title">) {
  return (
    <span className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-5 p-6 sm:p-7">
      <LinkLogo className="shrink-0" color={color} logo={logo} title={title} />
      <span className="grid min-w-0 gap-2">
        <span className="[word-break:break-word] text-[1.32rem] font-bold leading-[1.15] tracking-[-0.03em] text-current sm:text-[1.4rem]">{title}</span>
        {description ? <span className="[word-break:break-word] text-[0.9rem] font-medium leading-[1.5] text-current opacity-75">{description}</span> : null}
      </span>
    </span>
  );
}

function getDisplayHost(href?: string) {
  if (!href || !/^https?:\/\//i.test(href.trim())) {
    return "";
  }

  try {
    return new URL(href.trim()).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

export const linkWidget = {
  type: "link",
  name: "Link",
  description: "A single social, contact, or action link tile.",
  editor: { inspector: "link" },
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
