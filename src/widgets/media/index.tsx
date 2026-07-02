import { WidgetShell } from "@/components/widgets/widget-shell";
import type { WidgetRenderContext } from "@/lib/page-config/types";

export type MediaWidgetProps = {
  caption?: string;
  embedUrl?: string;
  href?: string;
  imageUrl?: string;
  mediaType?: "image" | "video";
  title: string;
};

export function MediaWidget({ context, props }: { context?: WidgetRenderContext; props: MediaWidgetProps }) {
  const title = props.title || "Media";
  const compact = context?.variant === "compact";
  const embedUrl = props.mediaType === "video" ? sanitizeVideoEmbedUrl(props.embedUrl) : "";
  const imageUrl = sanitizeImageUrl(props.imageUrl);
  const renderEmbed = Boolean(embedUrl && !compact);

  return (
    <WidgetShell
      ariaLabel={title}
      background={{ type: "gradient", from: "#17181A", to: "#32383F", angle: 140 }}
      className="text-left"
      href={!renderEmbed ? props.href : undefined}
      interactive={!renderEmbed}
      showLinkIndicator={!renderEmbed && Boolean(props.href)}
    >
      <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden">
        {renderEmbed ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            src={embedUrl}
            title={`${title} video`}
          />
        ) : imageUrl ? (
          <img alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" src={imageUrl} />
        ) : (
          <MediaPlaceholder />
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />
        <div className="relative z-10 mt-auto grid gap-2 p-6">
          <p className="text-[0.66rem] font-black uppercase text-white/50">{props.mediaType === "video" ? "Video" : "Media"}</p>
          <h2 className="[word-break:break-word] text-[1.45rem] font-black leading-none text-white">{title}</h2>
          {props.caption ? <p className="[word-break:break-word] text-sm font-semibold leading-5 text-white/70">{props.caption}</p> : null}
        </div>
      </div>
    </WidgetShell>
  );
}

export const mediaWidget = {
  type: "media",
  name: "图片/视频",
  description: "Image, reel, or video embed tile for visual homepage moments.",
  defaultLayout: { w: 2, h: 2, minW: 1, minH: 1, maxW: 4 },
  defaultProps: {
    title: "Studio reel",
    caption: "Recent visual notes",
    mediaType: "video",
    embedUrl: "https://www.youtube.com/embed/example",
    href: "https://youtube.com/",
  } satisfies MediaWidgetProps,
  Component: MediaWidget,
};

function MediaPlaceholder() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#2B2C2E,#17181A)]" />
      <div className="absolute left-[12%] top-[14%] h-[48%] w-[62%] rounded-[2rem] border border-white/12 bg-white/[0.08]" />
      <div className="absolute bottom-[16%] right-[13%] grid size-20 place-items-center rounded-full border border-white/12 bg-white/[0.14] text-2xl font-black text-white">▶</div>
    </div>
  );
}

function sanitizeImageUrl(url?: string) {
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

function sanitizeVideoEmbedUrl(url?: string) {
  if (!url) {
    return "";
  }

  return /^https:\/\/(www\.youtube\.com\/embed\/|player\.vimeo\.com\/video\/)/i.test(url) ? url : "";
}
