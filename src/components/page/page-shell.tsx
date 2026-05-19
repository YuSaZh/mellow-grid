import type { ReactNode } from "react";
import type { PageConfig } from "@/lib/page-config/types";

type PageShellProps = {
  config: PageConfig;
  profile: ReactNode;
  grid: ReactNode;
};

export function PageShell({ config, profile, grid }: PageShellProps) {
  return (
    <main className="min-h-screen px-5 py-8 text-zinc-950 sm:px-8 lg:px-16 lg:py-16" style={{ background: config.theme.background, color: config.theme.foreground }}>
      <div className="mx-auto grid w-full max-w-[1312px] grid-cols-1 gap-12 xl:grid-cols-[412px_820px] xl:items-start xl:gap-[80px]">
        <aside className="xl:sticky xl:top-16 xl:min-h-[calc(100vh-8rem)]">{profile}</aside>
        {grid}
      </div>
    </main>
  );
}
