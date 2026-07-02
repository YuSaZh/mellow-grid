import { WidgetShell } from "@/components/widgets/widget-shell";
import { getBuiltinLogoDefinition } from "@/lib/widgets/logo-registry";
import type { WidgetRenderContext } from "@/lib/page-config/types";
import { parseGithubUsername } from "./github-profile";

export type GithubActivityWidgetProps = {
  activityImageUrl?: string;
  days?: number[];
  href?: string;
  profileUrl?: string;
  stats?: unknown;
  summary: string;
  title: string;
  username: string;
};

const DEFAULT_DAYS = [
  0, 1, 2, 3, 4, 2, 1, 0, 2, 3, 4, 2, 1, 0,
  1, 3, 4, 1, 0, 2, 3, 2, 4, 0, 2, 3, 1, 4,
  0, 1, 2, 3, 4, 2, 0, 1, 2, 0, 3, 4, 1, 2,
  0, 3, 4, 2, 1, 0, 2, 1, 4, 3, 0, 2, 3, 1,
  2, 4, 0, 1, 3, 4, 2, 0, 1, 2, 4, 3, 1, 0,
];
const LEVEL_COLORS = ["#EBEDF0", "#9BE9A8", "#40C463", "#30A14E", "#216E39"];

export function GithubActivityWidget({ context, props }: { context?: WidgetRenderContext; props: GithubActivityWidgetProps }) {
  const title = props.title || "GitHub";
  const username = getGithubUsername(props);
  const href = props.href || `https://github.com/${username}`;
  const activityImageUrl = getActivityImageUrl(props);
  const days = normalizeDays(props.days);
  const compact = context?.variant === "compact";
  const GithubLogo = getBuiltinLogoDefinition("github")?.render;

  return (
    <WidgetShell
      ariaLabel={`${title} for ${username}`}
      background={{ type: "solid", value: "#ffffff" }}
      className="text-left"
      href={href}
      showLinkIndicator
    >
      <div className="relative z-10 flex h-full flex-col justify-between gap-3 p-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-[0.7rem] bg-[#151515] p-1.5 text-white shadow-[0_9px_20px_rgba(0,0,0,0.1)]">{GithubLogo ? <GithubLogo color="#ffffff" /> : null}</span>
          <div className="min-w-0 leading-none">
            <h2 className="[word-break:break-word] text-[0.8rem] font-black leading-tight text-[#181818]">{title}</h2>
            <p className="mt-1 truncate text-[0.62rem] font-extrabold leading-none text-black/42">@{username}</p>
          </div>
        </div>

        {activityImageUrl ? (
          <div className="flex min-h-0 flex-1 items-center overflow-hidden">
            <div className="flex w-full max-w-[707px] justify-end overflow-hidden">
              <img alt={`GitHub contribution activity for ${username}`} className="block h-auto w-[735px] max-w-none shrink-0 translate-x-[10px]" loading="lazy" referrerPolicy="no-referrer" src={activityImageUrl} />
            </div>
          </div>
        ) : (
          <div className="grid gap-2">
            <div className="grid max-w-[18rem] grid-cols-[repeat(14,minmax(0,1fr))] gap-[0.18rem]" aria-label="Contribution intensity preview">
              {days.map((level, index) => (
                <span className="aspect-square rounded-[0.11rem] ring-1 ring-black/[0.03]" key={`${level}-${index}`} style={{ background: LEVEL_COLORS[level] ?? LEVEL_COLORS[0] }} />
              ))}
            </div>
            {!compact && props.summary ? <p className="[word-break:break-word] text-[0.68rem] font-extrabold leading-4 text-black/48">{props.summary}</p> : null}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}

export const githubActivityWidget = {
  type: "github-activity",
  name: "GitHub 活跃度",
  description: "Live GitHub contribution activity strip.",
  defaultLayout: { w: 4, h: 2, minW: 1, minH: 1, maxW: 4 },
  defaultProps: {
    title: "GitHub",
    username: "octocat",
    profileUrl: "https://github.com/octocat",
    summary: "",
    href: "https://github.com/octocat",
    days: DEFAULT_DAYS,
  } satisfies GithubActivityWidgetProps,
  Component: GithubActivityWidget,
};

function getGithubUsername(props: GithubActivityWidgetProps) {
  return parseGithubUsername(props.profileUrl || props.href || props.username) || parseGithubUsername(props.username) || "username";
}

function getActivityImageUrl(props: GithubActivityWidgetProps) {
  return props.activityImageUrl ?? "";
}

function normalizeDays(days: GithubActivityWidgetProps["days"]) {
  const values = Array.isArray(days) && days.length ? days : DEFAULT_DAYS;

  return values.slice(0, 70).map((value) => Math.min(Math.max(Math.round(Number(value) || 0), 0), 4));
}
