import { describe, expect, it } from "vitest";
import { defaultPageConfig } from "../page-config/defaults";
import type { PageConfig } from "../page-config/types";
import { renderStaticPageHtml } from "./export-html";

describe("renderStaticPageHtml", () => {
  it("renders a standalone HTML document with profile, bento cards, and no editor chrome", () => {
    const html = renderStaticPageHtml(defaultPageConfig);

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain(defaultPageConfig.profile.name);
    expect(html).toContain('data-bento-grid="true"');
    expect(html).toContain("Twitter");
    expect(html).not.toContain("MellowGrid Editor");
  });

  it("exports the JSON-driven bento set without requiring application JavaScript", () => {
    const html = renderStaticPageHtml(defaultPageConfig);

    for (const widget of defaultPageConfig.widgets) {
      if ("title" in widget.props && typeof widget.props.title === "string") {
        expect(html).toContain(widget.props.title);
      }
    }

    expect(html).toContain("grid-row:7 / span 1");
    expect(html).not.toContain("type=\"module\"");
    expect(html).not.toContain("/_astro/");
  });

  it("exports the real profile and widget content instead of generic fallback cards", () => {
    const html = renderStaticPageHtml(createExportFixture());

    expect(html).toContain('href="mailto:username@example.com"');
    expect(html).toContain("Section eyebrow");
    expect(html).toContain("Section title");
    expect(html).toContain("Text eyebrow");
    expect(html).toContain("Text body");
    expect(html).not.toContain(">DI<");
    expect(html).not.toContain(">TE<");
  });

  it("exports current logo and grid structure parity for standalone HTML", () => {
    const html = renderStaticPageHtml(createExportFixture(), { styles: ".export-probe{color:red}" });

    expect(html).toContain(".export-probe{color:red}");
    expect(html).toContain("Github");
    expect(html).not.toContain(">GI<");
    expect(html).toContain("--bento-grid-column:");
    expect(html).toContain("--bento-grid-row:");
    expect(html).not.toContain("style=\"grid-column:");
  });

  it("uses the profile name as the document title", () => {
    const html = renderStaticPageHtml({
      ...createExportFixture(),
      title: "Old static title",
      profile: {
        ...createExportFixture().profile,
        name: "Updated Profile Name",
      },
    });

    expect(html).toContain("<title>Updated Profile Name</title>");
    expect(html).not.toContain("<title>Old static title</title>");
  });

  it("exports rich widgets for activity, music, maps, and media", () => {
    const html = renderStaticPageHtml(createRichWidgetFixture());

    expect(html).toContain("GitHub");
    expect(html).toContain("Contribution intensity preview");
    expect(html).not.toContain("https://www.dailygreen.xyz/octocat");
    expect(html).not.toContain("GitHub contribution activity for octocat");
    expect(html).not.toContain("1,284 contributions");
    expect(html).not.toContain("Repos");
    expect(html).not.toContain("Stars");
    expect(html).not.toContain("Streak");
    expect(html).not.toContain("PRs");
    expect(html).toContain("Night Drive");
    expect(html).toContain("open.spotify.com/embed/playlist/example");
    expect(html).toContain("Tokyo");
    expect(html).toContain("basemaps.cartocdn.com/light_nolabels");
    expect(html).toContain("map-marker");
    expect(html).not.toContain("tile.openstreetmap.org");
    expect(html).not.toContain("export/embed.html");
    expect(html).toContain("Studio reel");
    expect(html).toContain("www.youtube.com/embed/example");
  });
});

function createExportFixture(): PageConfig {
  return {
    username: "username",
    title: "Export fixture",
    description: "Standalone export fixture",
    profile: {
      name: "Username",
      bio: "Short bio",
      location: "Location",
      contacts: [{ label: "Email", href: "mailto:username@example.com" }],
    },
    theme: {
      background: "#ffffff",
      foreground: "#000000",
      card: "#121313",
      accent: "#ade0ff",
      radius: "round",
      shadow: "soft",
    },
    layout: [
      { i: "github", x: 0, y: 0, w: 1, h: 1 },
      { i: "text", x: 1, y: 0, w: 2, h: 1 },
      { i: "divider", x: 0, y: 1, w: 4, h: 0.5, minH: 0.5, maxH: 0.5 },
    ],
    widgets: [
      {
        id: "github",
        type: "link",
        props: {
          title: "Github",
          description: "@username",
          href: "https://github.com/username",
          logo: { type: "builtin", key: "github" },
          background: { type: "theme" },
        },
      },
      {
        id: "text",
        type: "text",
        props: {
          eyebrow: "Text eyebrow",
          title: "Text title",
          body: "Text body",
        },
      },
      {
        id: "divider",
        type: "divider",
        props: {
          eyebrow: "Section eyebrow",
          title: "Section title",
        },
      },
    ],
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

function createRichWidgetFixture(): PageConfig {
  return {
    ...createExportFixture(),
    layout: [
      { i: "activity", x: 0, y: 0, w: 4, h: 1 },
      { i: "music", x: 0, y: 1, w: 2, h: 1 },
      { i: "map", x: 2, y: 1, w: 2, h: 2 },
      { i: "media", x: 0, y: 2, w: 2, h: 2 },
    ],
    widgets: [
      {
        id: "activity",
        type: "github-activity",
        props: {
          title: "GitHub",
          username: "octocat",
          profileUrl: "https://github.com/octocat",
          href: "https://github.com/octocat",
          summary: "",
          days: [0, 1, 2, 3, 4],
        },
      },
      {
        id: "music",
        type: "music",
        props: {
          title: "Night Drive",
          artist: "MellowGrid FM",
          embedUrl: "https://open.spotify.com/embed/playlist/example",
          href: "https://open.spotify.com/playlist/example",
        },
      },
      {
        id: "map",
        type: "map",
        props: {
          title: "Tokyo",
          location: "Shibuya, Tokyo",
          latitude: 35.6595,
          longitude: 139.7005,
          zoom: 15,
          href: "https://www.openstreetmap.org/?mlat=35.6595&mlon=139.7005#map=15/35.6595/139.7005",
        },
      },
      {
        id: "media",
        type: "media",
        props: {
          title: "Studio reel",
          caption: "Recent visual notes",
          mediaType: "video",
          embedUrl: "https://www.youtube.com/embed/example",
          href: "https://youtube.com/watch?v=example",
        },
      },
    ],
  };
}
