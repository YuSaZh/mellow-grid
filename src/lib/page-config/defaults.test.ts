import { describe, expect, it } from "vitest";
import usernamePageConfig from "../../../data/pages/username.json";
import { BENTO_COLS, BENTO_ROW_UNITS_PER_ITEM, bentoLayoutItemsCollide } from "./bento-layout";
import { widgetRegistry } from "@/lib/widgets/registry";
import { defaultPageConfig } from "./defaults";
import { normalizePageConfig } from "./normalize";
import type { PageConfig } from "./types";

describe("defaultPageConfig", () => {
  it("uses data/pages/username.json as the build-time page source", () => {
    const sourceConfig = usernamePageConfig as PageConfig;

    expect(defaultPageConfig.title).toBe(sourceConfig.title);
    expect(defaultPageConfig.profile.name).toBe(sourceConfig.profile.name);
    expect(defaultPageConfig.widgets.map((widget) => widget.id)).toEqual(sourceConfig.widgets.map((widget) => widget.id));
  });

  it("keeps the default showcase page populated with every available widget type", () => {
    const expectedTypes = Object.keys(widgetRegistry).sort();
    const defaultTypes = [...new Set(defaultPageConfig.widgets.map((widget) => widget.type))].sort();
    const layoutIds = new Set(defaultPageConfig.layout.map((item) => item.i));

    expect(defaultTypes).toEqual(expectedTypes);
    expect(defaultPageConfig.widgets.every((widget) => layoutIds.has(widget.id))).toBe(true);
  });

  it("keeps the default showcase layout free of overlapping cards and empty holes", () => {
    const collisions = defaultPageConfig.layout.flatMap((item, index) =>
      defaultPageConfig.layout
        .slice(index + 1)
        .filter((nextItem) => bentoLayoutItemsCollide(item, nextItem))
        .map((nextItem) => `${item.i} overlaps ${nextItem.i}`),
    );

    expect(collisions).toEqual([]);

    const maxY = defaultPageConfig.layout.reduce((bottom, item) => Math.max(bottom, item.y + item.h), 0);
    const totalHalfCells = BENTO_COLS * Math.round(maxY * BENTO_ROW_UNITS_PER_ITEM);
    const coveredHalfCells = defaultPageConfig.layout.reduce(
      (sum, item) => sum + item.w * Math.round(item.h * BENTO_ROW_UNITS_PER_ITEM),
      0,
    );

    expect(maxY).toBe(8);
    expect(coveredHalfCells).toBe(totalHalfCells);
  });

  it("keeps the default showcase GitHub activity card and asset paths valid", () => {
    const activityWidget = defaultPageConfig.widgets.find((widget) => widget.id === "rich-github-activity");
    const activityLayout = defaultPageConfig.layout.find((item) => item.i === "rich-github-activity");
    const mediaWidget = defaultPageConfig.widgets.find((widget) => widget.id === "rich-media");

    expect(defaultPageConfig.profile.avatarUrl).not.toMatch(/^data:/);
    expect(activityLayout).toMatchObject({ x: 2, y: 0, w: 2, h: 1 });
    expect(activityWidget).toMatchObject({
      type: "github-activity",
      props: {
        username: "YuSaZh",
        profileUrl: "https://github.com/YuSaZh",
        href: "https://github.com/YuSaZh",
        activityImageUrl: "https://www.dailygreen.xyz/YuSaZh",
      },
    });
    expect(String(mediaWidget?.props.imageUrl ?? "")).not.toMatch(/^data:/);
  });

  it("links the default showcase to featured YuSaZh GitHub repositories", () => {
    const expectedRepos = [
      {
        id: "project-mellow-grid",
        title: "MellowGrid",
        href: "https://github.com/YuSaZh/mellow-grid",
        description: "Visual Bento editor",
        layout: { x: 2, y: 1, w: 1, h: 1 },
      },
      {
        id: "project-bdsubmerge",
        title: "BDSubMerge",
        href: "https://github.com/YuSaZh/BDSubMerge",
        description: "Blu-ray subtitle tool",
        layout: { x: 3, y: 1, w: 1, h: 1 },
      },
      {
        id: "link-mph6dsk9",
        title: "Bili CDN",
        href: "https://github.com/YuSaZh/bilibili-cdn-router",
        description: "mpv fallback router",
        layout: { x: 2, y: 2, w: 1, h: 1 },
      },
      {
        id: "project-chatgpt-toolkit",
        title: "ChatGPT Toolkit",
        href: "https://github.com/YuSaZh/ChatGPT-Toolkit",
        description: "Pro usage counter",
        layout: { x: 3, y: 2, w: 1, h: 1 },
      },
      {
        id: "project-imagine",
        title: "Imagine.",
        href: "https://github.com/YuSaZh/Imagine.",
        description: "Self-hosted AI media workspace",
        layout: { x: 0, y: 6, w: 2, h: 1 },
      },
    ];

    for (const repo of expectedRepos) {
      const widget = defaultPageConfig.widgets.find((item) => item.id === repo.id);
      const layout = defaultPageConfig.layout.find((item) => item.i === repo.id);

      expect(widget).toMatchObject({
        type: "link",
        props: {
          title: repo.title,
          href: repo.href,
          description: repo.description,
          logo: { type: "builtin", key: "github" },
        },
      });
      expect(layout).toMatchObject(repo.layout);
    }
  });

  it("refreshes rich widget minimum sizes from current widget definitions", () => {
    const config = normalizePageConfig({
      ...(usernamePageConfig as PageConfig),
      layout: [
        {
          i: "rich-map",
          x: 0,
          y: 0,
          w: 1,
          h: 1,
          minW: 2,
          minH: 2,
          maxW: 4,
        },
      ],
      widgets: [
        {
          id: "rich-map",
          type: "map",
          props: {
            title: "Tokyo",
            location: "Shibuya, Tokyo",
          },
        },
      ],
    });

    expect(config.layout[0]).toMatchObject({ w: 1, h: 1, minW: 1, minH: 1 });
  });

  it("adds current text widget defaults to older text widgets", () => {
    const config = normalizePageConfig({
      ...(usernamePageConfig as PageConfig),
      layout: [{ i: "legacy-text", x: 0, y: 0, w: 2, h: 1 }],
      widgets: [
        {
          id: "legacy-text",
          type: "text",
          props: {
            eyebrow: "Old",
            title: "Legacy text",
            body: "Created before text backgrounds existed.",
          },
        },
      ],
    });

    expect(config.widgets[0]?.props).toMatchObject({
      background: { type: "theme" },
      title: "Legacy text",
    });
  });
});
