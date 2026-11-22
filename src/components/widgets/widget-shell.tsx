import type { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { sanitizeHref } from "@/lib/urls/safe-href";

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

export function WidgetShell({
  ariaLabel,
  background,
  children,
  className = "",
  href,
  interactive,
  showLinkIndicator,
  style,
  topRightSlot,
}: WidgetShellProps) {
  const safeHref = sanitizeHref(href);
  const backgroundStyle = getWidgetBackgroundStyle(background);
  const lightCard = isLightBackground(backgroundStyle.background);
  const isInteractive = Boolean(interactive || safeHref);

  const borderClassName = lightCard ? "border-black/[0.07]" : "border-white/[0.12]";
  const interactiveClassName = isInteractive
    ? [
        "outline-none hover:-translate-y-[5px] hover:scale-[1.012] active:scale-[0.99]",
        lightCard
          ? "hover:border-black/[0.12] focus-visible:ring-4 focus-visible:ring-slate-900/15"
          : "hover:border-white/[0.22] focus-visible:ring-4 focus-visible:ring-white/30",
      ].join(" ")
    : "";

  const shellClassName = [
    "mg-widget-card group relative block h-full overflow-hidden rounded-[var(--mg-radius,32px)] border [perspective:1000px]",
    borderClassName,
    interactiveClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const shellStyle: CSSProperties = {
    color: lightCard ? "#1a1a1a" : "#ffffff",
    ...backgroundStyle,
    ...style,
  };

  const indicatorClassName = lightCard
    ? "border-black/[0.06] bg-black/[0.05] text-black/70 group-hover:bg-black/[0.09] group-hover:text-black"
    : "border-white/[0.16] bg-white/[0.14] text-white group-hover:bg-white/[0.24]";

  const content = (
    <>
      <div
        aria-hidden="true"
        className={
          lightCard
            ? "pointer-events-none absolute inset-px border border-white/80 [mask-image:linear-gradient(180deg,#000_0%,transparent_68%)]"
            : "pointer-events-none absolute inset-px border border-white/[0.22] [mask-image:linear-gradient(180deg,#000_0%,transparent_72%)]"
        }
        style={{ borderRadius: "calc(var(--mg-radius, 32px) - 1px)" }}
      />
      <div
        aria-hidden="true"
        className={
          lightCard
            ? "pointer-events-none absolute inset-0 rounded-[var(--mg-radius,32px)] bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.5),transparent_38%)] opacity-60"
            : "pointer-events-none absolute inset-0 rounded-[var(--mg-radius,32px)] bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.20),transparent_38%)] opacity-75 mix-blend-screen"
        }
      />
      {isInteractive ? <div aria-hidden="true" className="mg-widget-sheen" /> : null}
      {(showLinkIndicator && safeHref) || topRightSlot ? (
        <div
          className={`pointer-events-none absolute right-[18px] top-[18px] z-20 grid size-8 place-items-center rounded-full border opacity-65 backdrop-blur-md transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-focus-visible:opacity-100 ${indicatorClassName}`}
        >
          {topRightSlot ?? (
            <svg
              aria-hidden="true"
              className="size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[1.5px] group-hover:-translate-y-[1.5px] group-focus-visible:translate-x-[1.5px] group-focus-visible:-translate-y-[1.5px]"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                d="M5.25 10.75 10.75 5.25M6 5.25h4.75V10"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
              />
            </svg>
          )}
        </div>
      ) : null}
      {children}
    </>
  );

  if (safeHref) {
    return (
      <a
        aria-label={ariaLabel}
        className={shellClassName}
        data-card-interactive={isInteractive ? "true" : "false"}
        data-card-surface={lightCard ? "light" : "dark"}
        href={safeHref}
        style={shellStyle}
      >
        {content}
      </a>
    );
  }

  return (
    <section
      aria-label={ariaLabel}
      className={shellClassName}
      data-card-interactive={isInteractive ? "true" : "false"}
      data-card-surface={lightCard ? "light" : "dark"}
      style={shellStyle}
    >
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

export const WIDGET_DEFAULT_BG = DEFAULT_CARD_BACKGROUND;

function isLightBackground(background: CSSProperties["background"]) {
  if (typeof background !== "string") {
    return false;
  }

  const hexStops = Array.from(background.matchAll(/#([0-9a-f]{6}|[0-9a-f]{3})\b/gi), (match) => match[1]);

  if (!hexStops.length) {
    return false;
  }

  if (hexStops.length === 1) {
    return getHexLuminance(hexStops[0]) > 0.62;
  }

  const firstLum = getHexLuminance(hexStops[0]);
  const lastLum = getHexLuminance(hexStops[hexStops.length - 1]);

  if (hexStops.length === 2) {
    return firstLum * 0.4 + lastLum * 0.6 > 0.62;
  }

  const middleStops = hexStops.slice(1, -1);
  const middleAvg = middleStops.reduce((sum, hex) => sum + getHexLuminance(hex), 0) / middleStops.length;

  return firstLum * 0.3 + middleAvg * 0.15 + lastLum * 0.55 > 0.62;
}

function getHexLuminance(hex: string) {
  const normalized = hex.length === 3 ? hex.split("").map((value) => value + value).join("") : hex;
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
}
