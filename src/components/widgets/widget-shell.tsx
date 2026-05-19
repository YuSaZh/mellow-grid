import type { CSSProperties, PropsWithChildren, ReactNode } from "react";

export type WidgetBackground =
  | { type: "theme" }
  | { type: "solid"; value: string }
  | { type: "gradient"; from: string; to: string; angle?: number };

type WidgetShellProps = PropsWithChildren<{
  accentColor?: string;
  ariaLabel?: string;
  background?: WidgetBackground;
  className?: string;
  href?: string;
  interactive?: boolean;
  showLinkIndicator?: boolean;
  style?: CSSProperties;
  topRightSlot?: ReactNode;
}>;

const DEFAULT_CARD_BACKGROUND = "linear-gradient(180deg,#313030 0%,#121313 100%)";

export function WidgetShell({ ariaLabel, background, children, className = "", href, interactive, showLinkIndicator, style, topRightSlot }: WidgetShellProps) {
  const shellClassName = [
    "group relative block h-full overflow-hidden rounded-[24px] border border-black/[0.08] shadow-[0_2px_3px_rgba(0,0,0,0.03)]",
    interactive || href ? "outline-none transition focus-visible:ring-4 focus-visible:ring-white/25" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const shellStyle = { ...getWidgetBackgroundStyle(background), ...style };
  const content = (
    <>
      <div className="pointer-events-none absolute inset-px rounded-[23px] border border-white/[0.22] [mask-image:linear-gradient(180deg,#000_0%,transparent_100%)]" />
      {showLinkIndicator || topRightSlot ? (
        <div className="pointer-events-none absolute right-[13px] top-[13px] z-20 grid size-5 place-items-center rounded-full border-2 border-white/20 bg-black/20 opacity-0 backdrop-blur-[7px] transition group-hover:opacity-100 group-focus-visible:opacity-100">
          {topRightSlot}
        </div>
      ) : null}
      {children}
    </>
  );

  if (href) {
    return (
      <a aria-label={ariaLabel} className={shellClassName} href={href} style={shellStyle}>
        {content}
      </a>
    );
  }

  return (
    <section aria-label={ariaLabel} className={shellClassName} style={shellStyle}>
      {content}
    </section>
  );
}

export function getWidgetBackgroundStyle(background?: WidgetBackground): CSSProperties {
  if (!background || background.type === "theme") {
    return { background: DEFAULT_CARD_BACKGROUND };
  }

  if (background.type === "solid") {
    return { background: background.value || DEFAULT_CARD_BACKGROUND };
  }

  const angle = Number.isFinite(background.angle) ? background.angle : 180;
  const from = background.from || "#313030";
  const to = background.to || "#121313";

  return { background: `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)` };
}
