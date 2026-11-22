import { WidgetShell } from "@/components/widgets/widget-shell";
import type { WidgetRenderContext } from "@/lib/page-config/types";
import { resolveAssetUrl } from "@/lib/urls/asset-url";

export type MusicWidgetProps = {
  artist: string;
  coverUrl?: string;
  embedUrl?: string;
  href?: string;
  label?: string;
  provider?: string;
  title: string;
};

const EQUALIZER_BARS = [
  { height: 14, duration: "1.25s", delay: "-0.2s" },
  { height: 26, duration: "1.45s", delay: "-0.7s" },
  { height: 18, duration: "1.15s", delay: "-0.45s" },
  { height: 34, duration: "1.55s", delay: "-1.1s" },
  { height: 24, duration: "1.3s", delay: "-0.3s" },
  { height: 16, duration: "1.1s", delay: "-0.85s" },
  { height: 30, duration: "1.6s", delay: "-0.55s" },
  { height: 38, duration: "1.35s", delay: "-0.1s" },
  { height: 22, duration: "1.2s", delay: "-0.95s" },
  { height: 34, duration: "1.65s", delay: "-0.15s" },
  { height: 18, duration: "1.18s", delay: "-0.75s" },
  { height: 28, duration: "1.42s", delay: "-0.4s" },
  { height: 36, duration: "1.52s", delay: "-1.0s" },
  { height: 20, duration: "1.28s", delay: "-0.6s" },
  { height: 30, duration: "1.48s", delay: "-0.25s" },
  { height: 16, duration: "1.22s", delay: "-0.8s" },
];

export function MusicWidget({ context, props }: { context?: WidgetRenderContext; props: MusicWidgetProps }) {
  const title = props.title || "Playlist";
  const artist = props.artist || "Artist";
  const compact = context?.variant === "compact";
  const embedUrl = sanitizeEmbedUrl(props.embedUrl);
  const coverUrl = resolveAssetUrl(sanitizeCoverUrl(props.coverUrl));
  const provider = props.provider || props.label || "Music";
  const renderEmbed = Boolean(embedUrl && !compact);

  return (
    <WidgetShell
      ariaLabel={`${title} by ${artist}`}
      background={{ type: "gradient", from: "#141619", to: "#1E252A", angle: 148 }}
      className="text-left"
      href={!renderEmbed ? props.href : undefined}
      interactive={!renderEmbed}
      showLinkIndicator={!renderEmbed && Boolean(props.href)}
    >
      <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(167,243,128,0.2),transparent_34%),radial-gradient(circle_at_88%_16%,rgba(63,163,235,0.22),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0))]" />
        <div className="pointer-events-none absolute bottom-[-22%] left-[-12%] h-[52%] w-[68%] rounded-full bg-[#3FA3EB]/14 blur-[28px]" />
        {renderEmbed ? (
          <div className="relative z-10 flex h-full min-h-0 flex-col gap-3 p-4">
            <MusicHeader artist={artist} compact={compact} provider={provider} title={title} />
            <iframe
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="min-h-0 w-full flex-1 rounded-[1.25rem] border-0 bg-black/30 shadow-[0_20px_48px_rgba(0,0,0,0.22)]"
              loading="lazy"
              src={embedUrl}
              title={`${title} music embed`}
            />
          </div>
        ) : (
          <StaticMusicPlayer artist={artist} compact={compact} coverUrl={coverUrl} provider={provider} title={title} />
        )}
      </div>
    </WidgetShell>
  );
}

export const musicWidget = {
  type: "music",
  name: "音乐",
  description: "Playlist, track, or album card with optional music embed.",
  editor: { inspector: "rich" },
  defaultLayout: { w: 2, h: 2, minW: 1, minH: 1, maxW: 4 },
  defaultProps: {
    title: "Night Drive",
    artist: "MellowGrid FM",
    provider: "Spotify",
    embedUrl: "https://open.spotify.com/embed/playlist/example",
    href: "https://open.spotify.com/",
  } satisfies MusicWidgetProps,
  Component: MusicWidget,
};

function MusicHeader({ artist, compact, provider, title }: { artist: string; compact?: boolean; provider: string; title: string }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-white/50">{provider}</p>
        <h2 className={`mt-1 [word-break:break-word] font-extrabold leading-tight tracking-[-0.02em] text-white ${compact ? "text-[0.9rem]" : "text-[1.06rem]"}`}>{title}</h2>
        <p className="mt-1 truncate text-[0.74rem] font-semibold text-white/58">{artist}</p>
      </div>
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full border border-white/12 bg-white/[0.1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
      >
        <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M15.5 3.1a.9.9 0 0 0-1.08-.88l-7 1.55a.9.9 0 0 0-.72.88v8.02a2.65 2.65 0 1 0 1.6 2.43V8.27l5.6-1.24v4.34a2.65 2.65 0 1 0 1.6 2.43V3.1Z" />
        </svg>
      </span>
    </div>
  );
}

function StaticMusicPlayer({ artist, compact, coverUrl, provider, title }: { artist: string; compact?: boolean; coverUrl: string; provider: string; title: string }) {
  return (
    <div className={`relative z-10 flex h-full min-h-0 flex-col justify-between ${compact ? "gap-2.5 p-4" : "gap-4 p-5 sm:p-6"}`}>
      <div className={`flex min-h-0 items-start ${compact ? "gap-3" : "gap-4"}`}>
        <MusicArtwork coverUrl={coverUrl} compact={compact} title={title} />
        <div className={`grid min-w-0 flex-1 ${compact ? "gap-1" : "gap-2"}`}>
          <div className={`flex min-w-0 flex-wrap items-center gap-2 ${compact ? "pr-7" : "pr-10"}`}>
            <p className="truncate text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-white/50">Now playing</p>
            {!compact ? (
              <span className="shrink-0 rounded-full border border-[#B9F778]/25 bg-[#B9F778]/12 px-2 py-0.5 text-[0.58rem] font-extrabold uppercase leading-none tracking-[0.08em] text-[#C8FA94]">
                {provider}
              </span>
            ) : null}
          </div>
          <div className="min-w-0">
            <h2 className={`[word-break:break-word] font-extrabold leading-[1.15] tracking-[-0.025em] text-white ${compact ? "line-clamp-2 text-[0.9rem]" : "text-[1.18rem] sm:text-[1.26rem]"}`}>
              {title}
            </h2>
            <p className={`mt-1 truncate font-semibold text-white/58 ${compact ? "text-[0.72rem]" : "text-[0.86rem]"}`}>{artist}</p>
          </div>
        </div>
      </div>

      <div className={`mt-auto grid ${compact ? "gap-2" : "gap-3.5"}`}>
        <div className="music-progress h-1.5 overflow-hidden rounded-full bg-white/[0.12]" aria-hidden="true">
          <div className="h-full w-[62%] rounded-full bg-[linear-gradient(90deg,#B9F778_0%,#3FA3EB_65%,#7DD3FC_100%)] shadow-[0_0_16px_rgba(185,247,120,0.35)]" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className={`music-equalizer flex ${compact ? "h-7" : "h-10"} flex-1 items-end justify-between gap-1`} aria-hidden="true">
            {EQUALIZER_BARS.map((bar, index) => (
              <span
                className={`${compact ? "w-[3px]" : "w-[5px]"} origin-bottom rounded-full bg-gradient-to-t from-white/50 via-white/85 to-[#C8FA94] shadow-[0_0_10px_rgba(185,247,120,0.22)]`}
                key={`${bar.height}-${index}`}
                style={{
                  height: compact ? Math.round(bar.height * 0.68) : bar.height,
                  animation: `mgEqBar ${bar.duration} ease-in-out ${bar.delay} infinite alternate`,
                }}
              />
            ))}
          </div>
          <span
            aria-label={`Play ${title}`}
            className={`grid ${compact ? "size-8" : "size-10"} shrink-0 place-items-center rounded-full bg-white text-[#141619] shadow-[0_10px_26px_rgba(0,0,0,0.32)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105`}
          >
            <svg aria-hidden="true" className={`${compact ? "size-3" : "size-3.5"} translate-x-[1px]`} fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.2 2.65a1 1 0 0 1 1.5-.86l8.2 4.85a1 1 0 0 1 0 1.72l-8.2 4.85a1 1 0 0 1-1.5-.86V2.65Z" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

function MusicArtwork({ compact, coverUrl, title }: { compact?: boolean; coverUrl: string; title: string }) {
  const sizeClassName = compact ? "size-12" : "size-[5.25rem] sm:size-[5.75rem]";

  return (
    <div
      className={`music-artwork relative shrink-0 overflow-hidden rounded-[1.35rem] border border-white/14 bg-[#0F1114] shadow-[0_18px_42px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.2)] ${sizeClassName}`}
    >
      {coverUrl ? <img alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" src={coverUrl} /> : <GeneratedArtwork title={title} />}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-28%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.24)_42deg,transparent_88deg,transparent_180deg,rgba(255,255,255,0.16)_220deg,transparent_268deg)] opacity-75 transition-opacity duration-500 group-hover:opacity-100"
        style={{ animation: "mgVinylSpin 18s linear infinite" }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-[10%] rounded-full border border-white/[0.14]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-[22%] rounded-full border border-black/25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.28),transparent_24%),linear-gradient(145deg,transparent,rgba(0,0,0,0.4))]" />
      <div className="absolute left-1/2 top-1/2 grid size-[34%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-[#111317]/65 backdrop-blur-[4px]">
        <span className="size-[30%] rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.35)]" />
      </div>
    </div>
  );
}

function GeneratedArtwork({ title }: { title: string }) {
  const hue = getTitleHue(title);

  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 70% 56%) 0%, hsl(${(hue + 74) % 360} 68% 46%) 50%, hsl(${(hue + 146) % 360} 74% 48%) 100%)`,
      }}
    >
      <div className="absolute inset-[14%] rounded-full border-[9px] border-black/18" />
    </div>
  );
}

function sanitizeEmbedUrl(url?: string) {
  if (!url) {
    return "";
  }

  return /^https:\/\/(open\.spotify\.com|embed\.music\.apple\.com|w\.soundcloud\.com)\//i.test(url) ? url : "";
}

function sanitizeCoverUrl(url?: string) {
  if (!url) {
    return "";
  }

  const value = url.trim();

  if (/^(https?:\/\/|data:image\/)/i.test(value)) {
    return value;
  }

  if (value.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(value)) {
    return "";
  }

  return value;
}

function getTitleHue(title: string) {
  return Array.from(title).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;
}
