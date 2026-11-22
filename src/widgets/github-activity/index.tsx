import { WidgetShell } from "@/components/widgets/widget-shell";
import type { WidgetRenderContext } from "@/lib/page-config/types";
import { getBuiltinLogoDefinition } from "@/lib/widgets/logo-registry";
import { buildGithubActivityImageUrl, parseGithubUsername } from "./github-profile";

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
      <div className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-3 p-4 sm:p-[1.125rem]">
        <div className="flex items-center justify-between gap-2.5 pr-10">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-[0.8rem] bg-[#141518] p-[7px] text-white shadow-[0_8px_18px_rgba(15,23,42,0.16)]">
              {GithubLogo ? <GithubLogo color="#ffffff" /> : null}
            </span>
            <div className="min-w-0 leading-none">
              <h2 className="[word-break:break-word] text-[0.86rem] font-extrabold leading-tight tracking-[-0.02em] text-[#141518]">{title}</h2>
              <p className="mt-0.5 truncate text-[0.68rem] font-semibold leading-none text-black/45">@{username}</p>
            </div>
          </div>

          {!compact ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#22C55E]/20 bg-[#ECFDF3] px-2.5 py-1 text-[0.62rem] font-bold leading-none text-[#15803D]">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#22C55E]" />
              Contributions
            </span>
          ) : null}
        </div>

        {activityImageUrl ? (
          <div className="flex min-h-0 flex-1 items-center overflow-hidden rounded-2xl border border-black/[0.04] bg-[#F7F9FB]/80 px-2 py-1">
            <div className="flex h-full w-full max-w-[707px] items-center justify-end overflow-hidden [mask-image:linear-gradient(90deg,transparent_0%,black_5%,black_97%,transparent_100%)]">
              <img
                alt={`GitHub contribution activity for ${username}`}
                className="block h-[92px] w-auto max-w-none shrink-0 translate-x-[6px]"
                loading="lazy"
                referrerPolicy="no-referrer"
                src={activityImageUrl}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-2 rounded-2xl border border-black/[0.04] bg-[#F7F9FB]/80 p-2.5">
            <div className="grid max-w-[18rem] grid-cols-[repeat(14,minmax(0,1fr))] gap-[0.18rem]" aria-label="Contribution intensity preview">
              {days.map((level, index) => (
                <span className="aspect-square rounded-[0.18rem] ring-1 ring-black/[0.03]" key={`${level}-${index}`} style={{ background: LEVEL_COLORS[level] ?? LEVEL_COLORS[0] }} />
              ))}
            </div>
            {!compact && props.summary ? <p className="[word-break:break-word] text-[0.68rem] font-bold leading-4 text-black/48">{props.summary}</p> : null}
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
  editor: { inspector: "rich" },
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
  if (props.activityImageUrl) {
    return props.activityImageUrl;
  }

  return buildGithubActivityImageUrl(props.profileUrl || props.href || props.username);
}

function normalizeDays(days: GithubActivityWidgetProps["days"]) {
  const values = Array.isArray(days) && days.length ? days : DEFAULT_DAYS;

  return values.slice(0, 70).map((value) => Math.min(Math.max(Math.round(Number(value) || 0), 0), 4));
}
