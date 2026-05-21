import type { ReactNode } from "react";
import type { PageConfig } from "@/lib/page-config/types";

type PageShellProps = {
  config: PageConfig;
  profile: ReactNode;
  grid: ReactNode;
};

export function PageShell({ config, profile, grid }: PageShellProps) {
  return (
    <main className="grid min-h-screen place-items-center overflow-x-hidden px-4 py-8 text-[#121214] sm:px-6 lg:px-8 lg:py-16" style={{ background: config.theme.background, color: config.theme.foreground }}>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-10 lg:items-start xl:flex-row xl:gap-16">
        <aside className="w-full max-w-[340px] shrink-0 text-center xl:sticky xl:top-16 xl:text-left">{profile}</aside>
        {grid}
      </div>
    </main>
  );
}
