import { WidgetShell } from "@/components/widgets/widget-shell";
import type { WidgetRenderContext } from "@/lib/page-config/types";

export type MusicWidgetProps = {
  artist: string;
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
  const renderEmbed = Boolean(embedUrl && !compact);

  return (
    <WidgetShell
      ariaLabel={`${title} by ${artist}`}
      background={{ type: "gradient", from: "#FFF1DF", to: "#E9F7EF", angle: 135 }}
      className="text-left"
      href={!renderEmbed ? props.href : undefined}
      interactive={!renderEmbed}
      showLinkIndicator={!renderEmbed && Boolean(props.href)}
    >
      <div className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.66rem] font-black uppercase text-black/45">{props.provider || props.label || "Music"}</p>
            <h2 className="mt-1 [word-break:break-word] text-[1.2rem] font-black leading-tight text-[#151515]">{title}</h2>
            <p className="mt-1 [word-break:break-word] text-sm font-semibold text-black/55">{artist}</p>
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#151515] text-[1.05rem] font-black text-white">♪</span>
        </div>

        {renderEmbed ? (
          <iframe
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="min-h-0 w-full flex-1 rounded-[1.15rem] border-0 bg-black/5"
            loading="lazy"
            src={embedUrl}
            title={`${title} music embed`}
          />
        ) : (
          <div className="flex items-end gap-1.5" aria-hidden="true">
            {[26, 42, 32, 58, 44, 34, 52, 28, 46].map((height, index) => (
              <span className="w-full rounded-full bg-[#151515]" key={`${height}-${index}`} style={{ height }} />
            ))}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}

export const musicWidget = {
  type: "music",
  name: "音乐",
  description: "Playlist, track, or album card with optional music embed.",
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

function sanitizeEmbedUrl(url?: string) {
  if (!url) {
    return "";
  }

  return /^https:\/\/(open\.spotify\.com|embed\.music\.apple\.com|w\.soundcloud\.com)\//i.test(url) ? url : "";
}
