import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MediaWidget } from ".";

describe("MediaWidget", () => {
  it("resolves same-site relative image assets against the app base URL", () => {
    const html = renderToStaticMarkup(
      <MediaWidget
        props={{
          title: "Studio reel",
          mediaType: "image",
          imageUrl: "default-media.svg",
        }}
      />,
    );

    expect(html).toContain('src="/default-media.svg"');
    expect(html).toContain("group-hover:scale-[1.05]");
  });

  it("keeps external image URLs intact and drops unsafe protocols", () => {
    const externalHtml = renderToStaticMarkup(
      <MediaWidget
        props={{
          title: "External cover",
          mediaType: "image",
          imageUrl: "https://example.com/reel.png",
        }}
      />,
    );
    const unsafeHtml = renderToStaticMarkup(
      <MediaWidget
        props={{
          title: "Unsafe cover",
          mediaType: "image",
          imageUrl: "javascript:alert(1)",
        }}
      />,
    );

    expect(externalHtml).toContain('src="https://example.com/reel.png"');
    expect(unsafeHtml).not.toContain("javascript:");
    expect(unsafeHtml).not.toContain("<img");
  });

  it("marks the video embed overlay pointer-events-none so player controls stay interactive", () => {
    const html = renderToStaticMarkup(
      <MediaWidget
        context={{ layout: { i: "media", x: 0, y: 0, w: 2, h: 2 }, variant: "large" }}
        props={{
          title: "Studio reel",
          caption: "Motion demo",
          mediaType: "video",
          embedUrl: "https://www.youtube.com/embed/example",
        }}
      />,
    );

    expect(html).toContain("<iframe");
    expect(html).toContain("https://www.youtube.com/embed/example");
    expect(html).toContain("pointer-events-none relative z-10");
  });
});
