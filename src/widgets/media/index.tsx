import { WidgetShell } from "@/components/widgets/widget-shell";
import type { WidgetRenderContext } from "@/lib/page-config/types";
import { resolveAssetUrl } from "@/lib/urls/asset-url";

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
  const imageUrl = resolveAssetUrl(sanitizeImageUrl(props.imageUrl));
  const renderEmbed = Boolean(embedUrl && !compact);

  return (
    <WidgetShell
      ariaLabel={title}
      background={{ type: "gradient", from: "#16181D", to: "#2B323C", angle: 145 }}
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
          <img
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            loading="lazy"
            src={imageUrl}
          />
        ) : (
          <MediaPlaceholder />
        )}

        {renderEmbed ? (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.22)_58%,transparent_100%)]" />
            <div className="pointer-events-none relative z-10 grid gap-1.5 p-5 sm:p-6">
              <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[0.62rem] font-extrabold uppercase leading-none tracking-[0.16em] text-white/90 backdrop-blur-md">
                Video
              </span>
              <h2 className="[word-break:break-word] text-[1.2rem] font-extrabold leading-[1.15] tracking-[-0.03em] text-white sm:text-[1.35rem]">{title}</h2>
              {props.caption ? <p className="[word-break:break-word] text-[0.84rem] font-medium leading-[1.45] text-white/75">{props.caption}</p> : null}
            </div>
          </>
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.15)_52%,rgba(0,0,0,0.78)_100%)]" />
            <div className={`relative z-10 mt-auto grid gap-2 ${compact ? "p-4" : "p-5 sm:p-6"}`}>
              <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[0.62rem] font-extrabold uppercase leading-none tracking-[0.16em] text-white/90 backdrop-blur-md">
                {props.mediaType === "video" ? "Video" : "Media"}
              </span>
              <h2 className={`[word-break:break-word] font-extrabold leading-[1.1] tracking-[-0.03em] text-white ${compact ? "text-[1.08rem]" : "text-[1.38rem] sm:text-[1.48rem]"}`}>
                {title}
              </h2>
              {props.caption ? (
                <p className={`[word-break:break-word] font-medium leading-[1.45] text-white/75 ${compact ? "line-clamp-2 text-[0.78rem]" : "text-[0.86rem] sm:text-[0.9rem]"}`}>
                  {props.caption}
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </WidgetShell>
  );
}

export const mediaWidget = {
  type: "media",
  name: "图片/视频",
  description: "Image, reel, or video embed tile for visual homepage moments.",
  editor: { inspector: "rich" },
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
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#252830,#14161B)]" />
      <div className="absolute left-[12%] top-[14%] h-[48%] w-[62%] rounded-[2rem] border border-white/12 bg-white/[0.07]" />
      <div className="absolute bottom-[16%] right-[13%] grid size-16 place-items-center rounded-full border border-white/16 bg-white/[0.14] text-white backdrop-blur-sm">
        <svg className="size-6 translate-x-[1.5px]" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4.2 2.65a1 1 0 0 1 1.5-.86l8.2 4.85a1 1 0 0 1 0 1.72l-8.2 4.85a1 1 0 0 1-1.5-.86V2.65Z" />
        </svg>
      </div>
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
