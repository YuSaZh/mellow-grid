import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MediaWidget } from ".";

describe("MediaWidget", () => {
  it("renders same-site relative image assets", () => {
    const html = renderToStaticMarkup(
      <MediaWidget
        props={{
          title: "Studio reel",
          mediaType: "image",
          imageUrl: "default-media.svg",
        }}
      />,
    );

    expect(html).toContain('src="default-media.svg"');
  });
});
