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

const DEFAULT_CARD_BACKGROUND = "linear-gradient(135deg,#2B2C2E 0%,#17181A 100%)";

export function WidgetShell({ ariaLabel, background, children, className = "", href, interactive, showLinkIndicator, style, topRightSlot }: WidgetShellProps) {
  const backgroundStyle = getWidgetBackgroundStyle(background);
  const lightCard = isLightBackground(backgroundStyle.background);
  const hoverShadowClassName = lightCard
    ? "hover:shadow-[0_22px_45px_rgba(0,0,0,0.06),inset_2px_2px_1.5px_rgba(255,255,255,0.95),inset_-2.5px_-2.5px_4px_rgba(0,0,0,0.04)]"
    : "hover:shadow-[0_22px_45px_rgba(0,0,0,0.09),inset_2px_2px_1.5px_rgba(255,255,255,0.45),inset_-2px_-2px_3px_rgba(0,0,0,0.08)]";
  const shellClassName = [
    "group relative block h-full overflow-hidden rounded-[38px] border border-white/[0.08] shadow-[0_12px_30px_rgba(0,0,0,0.05),inset_1.5px_1.5px_1px_rgba(255,255,255,0.4),inset_-2px_-2px_3px_rgba(0,0,0,0.1)] transition duration-[450ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] [perspective:1000px] [transform-style:preserve-3d]",
    lightCard ? "border-white/50 shadow-[0_12px_30px_rgba(0,0,0,0.03),inset_1.8px_1.8px_1px_rgba(255,255,255,0.9),inset_-2px_-2px_4px_rgba(0,0,0,0.05)]" : "",
    interactive || href ? `outline-none hover:-translate-y-2 hover:scale-[1.015] ${hoverShadowClassName} focus-visible:ring-4 focus-visible:ring-white/25` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const shellStyle = { color: lightCard ? "#1a1a1a" : "#ffffff", ...backgroundStyle, ...style };
  const content = (
    <>
      <div className="pointer-events-none absolute inset-px rounded-[37px] border border-white/[0.24] [mask-image:linear-gradient(180deg,#000_0%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[38px] bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.22),transparent_32%)] opacity-70 mix-blend-screen" />
      {showLinkIndicator || topRightSlot ? (
        <div className="pointer-events-none absolute right-4 top-4 z-20 grid size-5 place-items-center rounded-full border-2 border-white/20 bg-black/20 opacity-0 backdrop-blur-[7px] transition group-hover:opacity-100 group-focus-visible:opacity-100">
          {topRightSlot ?? <span className="text-[10px] font-black text-white">↗</span>}
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

  const angle = Number.isFinite(background.angle) ? background.angle : 135;
  const from = background.from || "#2B2C2E";
  const to = background.to || "#17181A";

  return { background: `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)` };
}

function isLightBackground(background: CSSProperties["background"]) {
  return typeof background === "string" && /#(?:fff|fcfcfc|f7f7f2|e6e6e6|ffea79|ffe181|f5c13d|fce3fe|eaa2f0|ffe8ee|dde2ff|dff0ff|fff1df|ffe0f1|ffd39a|ffe4d8)/i.test(background);
}
