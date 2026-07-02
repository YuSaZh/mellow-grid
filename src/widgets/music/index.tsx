import { WidgetShell } from "@/components/widgets/widget-shell";
import type { WidgetRenderContext } from "@/lib/page-config/types";

export type MusicWidgetProps = {
  artist: string;
  coverUrl?: string;
  embedUrl?: string;
  href?: string;
  label?: string;
  provider?: string;
  title: string;
};

export function MusicWidget({ context, props }: { context?: WidgetRenderContext; props: MusicWidgetProps }) {
  const title = props.title || "Playlist";
  const artist = props.artist || "Artist";
  const compact = context?.variant === "compact";
  const embedUrl = sanitizeEmbedUrl(props.embedUrl);
  const coverUrl = sanitizeCoverUrl(props.coverUrl);
  const provider = props.provider || props.label || "Music";
  const renderEmbed = Boolean(embedUrl && !compact);

  return (
    <WidgetShell
      ariaLabel={`${title} by ${artist}`}
      background={{ type: "gradient", from: "#17181A", to: "#27312E", angle: 145 }}
      className="text-left"
      href={!renderEmbed ? props.href : undefined}
      interactive={!renderEmbed}
      showLinkIndicator={!renderEmbed && Boolean(props.href)}
    >
      <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_14%,rgba(185,247,120,0.32),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(63,163,235,0.28),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
        <div className="pointer-events-none absolute bottom-[-18%] left-[-12%] h-[55%] w-[72%] rounded-full bg-[#FF6B4A]/20 blur-[26px]" />
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
        <p className="truncate text-[0.64rem] font-black uppercase text-white/48">{provider}</p>
        <h2 className={`mt-1 [word-break:break-word] font-black leading-tight text-white ${compact ? "text-[0.9rem]" : "text-[1.05rem]"}`}>{title}</h2>
        <p className="mt-1 truncate text-[0.72rem] font-bold text-white/55">{artist}</p>
      </div>
      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.12] text-sm font-black text-white shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2)]">♪</span>
    </div>
  );
}

function StaticMusicPlayer({ artist, compact, coverUrl, provider, title }: { artist: string; compact?: boolean; coverUrl: string; provider: string; title: string }) {
  return (
    <div className={`relative z-10 grid h-full min-h-0 ${compact ? "gap-2 p-3" : "gap-4 p-5"}`}>
      <div className="flex min-h-0 items-start gap-4">
        <MusicArtwork coverUrl={coverUrl} compact={compact} title={title} />
        <div className="grid min-w-0 flex-1 gap-2">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <p className="truncate text-[0.64rem] font-black uppercase text-white/48">Now playing</p>
            <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.1] px-2 py-1 text-[0.58rem] font-black uppercase text-[#B9F778]">{provider}</span>
          </div>
          <div className="min-w-0">
            <h2 className={`[word-break:break-word] font-black leading-tight text-white ${compact ? "text-[0.94rem]" : "text-[1.22rem]"}`}>{title}</h2>
            <p className="mt-1 truncate text-sm font-bold text-white/58">{artist}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto grid gap-3">
        <div className="music-progress h-2 overflow-hidden rounded-full bg-white/[0.13]" aria-hidden="true">
          <div className="h-full w-[62%] rounded-full bg-[linear-gradient(90deg,#B9F778,#3FA3EB,#FF6B4A)] shadow-[0_0_20px_rgba(185,247,120,0.42)]" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="music-equalizer flex h-9 flex-1 items-end gap-1.5" aria-hidden="true">
            {[14, 25, 18, 32, 24, 15, 29, 20, 34, 22].map((height, index) => (
              <span className="w-full rounded-full bg-white/85 shadow-[0_0_12px_rgba(255,255,255,0.18)]" key={`${height}-${index}`} style={{ height }} />
            ))}
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[0.72rem] font-black text-[#151515] shadow-[0_12px_28px_rgba(0,0,0,0.26)]" aria-label={`Play ${title}`}>
            ▶
          </span>
        </div>
      </div>
    </div>
  );
}

function MusicArtwork({ compact, coverUrl, title }: { compact?: boolean; coverUrl: string; title: string }) {
  const sizeClassName = compact ? "size-14" : "size-[5.9rem]";

  return (
    <div className={`music-artwork relative shrink-0 overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#101112] shadow-[0_18px_46px_rgba(0,0,0,0.28)] ${sizeClassName}`}>
      {coverUrl ? <img alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" src={coverUrl} /> : <GeneratedArtwork title={title} />}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.35),transparent_19%),linear-gradient(145deg,transparent,rgba(0,0,0,0.42))]" />
      <div className="absolute left-1/2 top-1/2 grid size-[38%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/18 bg-black/35 backdrop-blur-[5px]">
        <span className="size-[28%] rounded-full bg-white/86" />
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
        background: `linear-gradient(135deg, hsl(${hue} 72% 58%) 0%, hsl(${(hue + 74) % 360} 72% 48%) 48%, hsl(${(hue + 146) % 360} 78% 52%) 100%)`,
      }}
    >
      <div className="absolute inset-[14%] rounded-full border-[10px] border-black/18" />
      <div className="absolute inset-[-16%] rotate-[-22deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)]" />
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
