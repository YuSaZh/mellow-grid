import type { CSSProperties, ReactNode } from "react";
import type { PageConfig, PageTheme } from "@/lib/page-config/types";

type PageShellProps = {
  config: PageConfig;
  profile: ReactNode;
  grid: ReactNode;
};

const THEME_RADIUS_MAP: Record<PageTheme["radius"], string> = {
  soft: "22px",
  round: "32px",
  pill: "38px",
};

export function getPageThemeStyle(theme: PageTheme): CSSProperties {
  return {
    backgroundColor: theme.background,
    color: theme.foreground,
    "--mg-bg": theme.background,
    "--mg-fg": theme.foreground,
    "--mg-card": theme.card,
    "--mg-accent": theme.accent,
    "--mg-radius": THEME_RADIUS_MAP[theme.radius] ?? "32px",
  } as CSSProperties;
}

export function PageShell({ config, profile, grid }: PageShellProps) {
  return (
    <main
      className="mg-page-ambient grid min-h-screen place-items-center overflow-x-clip px-4 py-10 sm:px-6 sm:py-12 lg:px-8 xl:py-16"
      data-theme-shadow={config.theme.shadow}
      style={getPageThemeStyle(config.theme)}
    >
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-10 xl:flex-row xl:items-start xl:gap-16">
        <aside className="w-full max-w-[340px] shrink-0 text-center xl:sticky xl:top-16 xl:text-left">{profile}</aside>
        {grid}
      </div>
    </main>
  );
}
