import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { WidgetShell } from "@/components/widgets/widget-shell";
import { dividerWidget } from "./divider";
import { GithubActivityWidget, githubActivityWidget } from "./github-activity";
import { LinkWidget } from "./link";
import { MapWidget, mapWidget } from "./map";
import { MusicWidget } from "./music";
import { TextWidget } from "./text";
import { getWidgetDefinition, widgetRegistry } from "@/lib/widgets/registry";

describe("widget definitions", () => {
  it("renders text widgets through the current WidgetShell with hover enabled", () => {
    const element = TextWidget({ props: { title: "Title", body: "Body", background: { type: "solid", value: "#E9F7EF" } } });
    const html = renderToStaticMarkup(element);

    expect(element.type).toBe(WidgetShell);
    expect(element.props.interactive).toBe(true);
    expect(element.props.background).toEqual({ type: "solid", value: "#E9F7EF" });
    expect(html).toContain("color:#1a1a1a;background:#E9F7EF");
    expect(html).toContain("text-current");
    expect(html).not.toContain("#fbfbfb");
  });

  it("renders wide link cards with balanced editorial layout and host badge", () => {
    const html = renderToStaticMarkup(
      LinkWidget({
        context: { layout: { i: "coffee", x: 0, y: 0, w: 2, h: 1 }, variant: "wide" },
        props: {
          title: "Buy me a Coffee",
          description: "Support open-source tools",
          href: "https://github.com/YuSaZh/mellow-grid",
          logo: { type: "builtin", key: "coffee" },
        },
      }),
    );

    expect(html).toContain("Buy me a Coffee");
    expect(html).toContain("Support open-source tools");
    expect(html).toContain("github.com");
  });

  it("uses a half-height divider layout", () => {
    expect(dividerWidget.defaultLayout).toMatchObject({ h: 0.5, minH: 0.5, maxH: 0.5 });
  });

  it("registers rich personal homepage widgets", () => {
    expect(Object.keys(widgetRegistry)).toEqual(expect.arrayContaining(["github-activity", "music", "map", "media"]));
    for (const type of ["github-activity", "music", "map", "media"]) {
      expect(getWidgetDefinition(type)?.defaultLayout).toMatchObject({ minW: 1, minH: 1 });
      expect(getWidgetDefinition(type)?.defaultLayout).not.toHaveProperty("maxH");
    }
    expect(getWidgetDefinition("github-activity")?.defaultLayout).toMatchObject({ w: 4, h: 2 });
    expect(getWidgetDefinition("music")?.defaultLayout).toMatchObject({ w: 2, h: 2 });
    expect(getWidgetDefinition("map")?.defaultLayout).toMatchObject({ w: 2, h: 2 });
    expect(getWidgetDefinition("media")?.defaultLayout).toMatchObject({ w: 2, h: 2 });
  });

  it("renders GitHub with the DailyGreen activity wall by default", () => {
    const html = renderToStaticMarkup(
      GithubActivityWidget({
        props: {
          title: "GitHub",
          username: "username",
          profileUrl: "https://github.com/octocat",
          summary: "1,284 contributions this year",
          days: [0, 1, 2, 3, 4],
          stats: [
            { label: "Repos", value: "42" },
            { label: "Stars", value: "256" },
            { label: "Streak", value: "18d" },
            { label: "PRs", value: "73" },
          ],
        },
      }),
    );

    expect(githubActivityWidget.defaultProps).not.toHaveProperty("stats");
    expect(html).toContain(">GitHub<");
    expect(html).toContain("@octocat");
    expect(html).toContain("https://www.dailygreen.xyz/octocat");
    expect(html).toContain("GitHub contribution activity for octocat");
    expect(html).toContain("max-w-[707px]");
    expect(html).toContain("h-[92px]");
    expect(html).toContain("justify-end");
    expect(html).toContain("translate-x-[6px]");
    expect(html).toContain("mask-image");
    expect(html).not.toContain("Contribution intensity preview");
    expect(html).not.toContain("1,284 contributions this year");
    expect(html).not.toContain("max-w-[18rem]");
    expect(html).not.toContain("grid-cols-[repeat(14,minmax(0,1fr))]");
    expect(html).not.toContain("object-contain");
    expect(html).not.toContain("max-w-full");
    expect(html).not.toContain("grid-cols-7");
    expect(html).not.toContain("Repos");
    expect(html).not.toContain("Stars");
    expect(html).not.toContain("Streak");
    expect(html).not.toContain("PRs");
  });

  it("renders GitHub external activity images when explicitly configured", () => {
    const html = renderToStaticMarkup(
      GithubActivityWidget({
        props: {
          title: "GitHub",
          username: "octocat",
          profileUrl: "https://github.com/octocat",
          summary: "",
          activityImageUrl: "https://www.dailygreen.xyz/octocat",
        },
      }),
    );

    expect(html).toContain("https://www.dailygreen.xyz/octocat");
    expect(html).toContain("GitHub contribution activity for octocat");
    expect(html).not.toContain("Contribution intensity preview");
  });

  it("builds a marker-based map embed from coordinates", () => {
    expect(mapWidget.defaultProps).toMatchObject({
      latitude: 35.6595,
      longitude: 139.7005,
    });
  });

  it("renders music as a polished static player when no safe embed is available", () => {
    const html = renderToStaticMarkup(
      MusicWidget({
        props: {
          title: "Night Drive",
          artist: "MellowGrid FM",
          provider: "Spotify",
          embedUrl: "javascript:alert(1)",
          href: "https://open.spotify.com/",
        },
      }),
    );

    expect(html).toContain("music-artwork");
    expect(html).toContain("music-progress");
    expect(html).toContain("music-equalizer");
    expect(html).toContain("mgEqBar");
    expect(html).toContain("mgVinylSpin");
    expect(html).toContain("Now playing");
    expect(html).toContain("Play Night Drive");
    expect(html).toContain("<svg");
    expect(html).toContain('href="https://open.spotify.com/"');
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("javascript:alert");
  });

  it("omits unsafe widget href protocols", () => {
    const html = renderToStaticMarkup(
      <WidgetShell href="javascript:alert(1)" showLinkIndicator>
        <span>Unsafe widget link</span>
      </WidgetShell>,
    );

    expect(html).toContain("Unsafe widget link");
    expect(html).not.toContain("<a ");
    expect(html).not.toContain("javascript:");
  });

  it("keeps safe music embeds for large cards and falls back to the player in compact cards", () => {
    const safeEmbedUrl = "https://open.spotify.com/embed/playlist/example";
    const largeHtml = renderToStaticMarkup(
      MusicWidget({
        context: { layout: { i: "music", x: 0, y: 0, w: 2, h: 2 }, variant: "large" },
        props: {
          title: "Night Drive",
          artist: "MellowGrid FM",
          embedUrl: safeEmbedUrl,
        },
      }),
    );
    const compactHtml = renderToStaticMarkup(
      MusicWidget({
        context: { layout: { i: "music", x: 0, y: 0, w: 1, h: 1 }, variant: "compact" },
        props: {
          title: "Night Drive",
          artist: "MellowGrid FM",
          embedUrl: safeEmbedUrl,
        },
      }),
    );

    expect(largeHtml).toContain("<iframe");
    expect(largeHtml).toContain(safeEmbedUrl);
    expect(compactHtml).toContain("music-artwork");
    expect(compactHtml).not.toContain("<iframe");
  });

  it("resolves same-site relative music cover images against the app base URL", () => {
    const html = renderToStaticMarkup(
      MusicWidget({
        props: {
          title: "Night Drive",
          artist: "MellowGrid FM",
          coverUrl: "default-media.svg",
        },
      }),
    );

    expect(html).toContain('src="/default-media.svg"');
  });

  it("keeps map presentation clear with ArcGIS light gray tiles, radar pin, and clickable link", () => {
    const html = renderToStaticMarkup(
      MapWidget({
        props: {
          title: "Tokyo",
          location: "Shibuya, Tokyo",
          latitude: 35.6595,
          longitude: 139.7005,
          zoom: 15,
        },
      }),
    );

    expect(html).toContain("server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/");
    expect(html).toMatch(/MapServer\/tile\/15\/1290\d\/2909\d/);
    expect(html).toContain("<a ");
    expect(html).toContain("https://www.openstreetmap.org/?mlat=35.6595");
    expect(html).toContain("map-tile");
    expect(html.match(/map-tile/g)).toHaveLength(9);
    expect(html).toContain("grid-cols-3");
    expect(html).toContain("grid-rows-3");
    expect(html).toContain("inset-[-32%]");
    expect(html).toContain("map-marker");
    expect(html).toContain("mgMapPulse");
    expect(html).toContain('data-map-backdrop="true"');
    expect(html).not.toContain("basemaps.cartocdn.com");
    expect(html).not.toContain("grid-cols-2");
    expect(html).not.toContain("grid-rows-2");
    expect(html).not.toContain("inset-[-6%]");
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("tile.openstreetmap.org");
    expect(html).not.toContain("export/embed.html");
    expect(html).not.toContain("opacity-80");
    expect(html).not.toContain("rgba(255,255,255,0.78)");
  });

  it("keeps compact maps as a real tile map with scaled overlays and fallback backdrop", () => {
    const html = renderToStaticMarkup(
      MapWidget({
        context: { layout: { i: "map", x: 0, y: 0, w: 1, h: 1 }, variant: "compact" },
        props: {
          title: "Tokyo",
          location: "Shibuya, Tokyo",
          latitude: 35.6595,
          longitude: 139.7005,
          zoom: 15,
        },
      }),
    );

    expect(html.match(/map-marker/g)).toHaveLength(1);
    expect(html.match(/map-tile/g)).toHaveLength(9);
    expect(html).toContain("map-marker pointer-events-none absolute left-1/2 top-1/2 z-10 grid size-6");
    expect(html).toContain("p-3");
    expect(html).toContain('data-map-backdrop="true"');
  });
});
