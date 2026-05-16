import { BentoGrid } from "./bento-grid";
import { PageShell } from "./page-shell";
import { ProfilePanel } from "./profile-panel";
import type { PageConfig } from "@/lib/page-config/types";

export function PageRenderer({ config }: { config: PageConfig }) {
  return <PageShell config={config} profile={<ProfilePanel props={config.profile} />} grid={<BentoGrid layout={config.layout} widgets={config.widgets} />} />;
}
