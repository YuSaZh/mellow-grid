import type { ReactNode } from "react";
import type { PageConfig } from "@/lib/page-config/types";

type PageShellProps = {
  config: PageConfig;
  profile: ReactNode;
  grid: ReactNode;
};

export function PageShell({ config, profile, grid }: PageShellProps) {
  return (
    <main className="min-h-screen px-5 py-8 text-zinc-950 sm:px-8 lg:px-10" style={{ background: config.theme.background, color: config.theme.foreground }}>
      <div className="mx-auto grid w-full max-w-[86rem] grid-cols-1 gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start xl:grid-cols-[20rem_minmax(0,1fr)] xl:gap-14">
        <aside className="pt-2 lg:sticky lg:top-8 lg:min-h-[calc(100vh-4rem)]">{profile}</aside>
        {grid}
      </div>
    </main>
  );
}
