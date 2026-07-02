import { describe, expect, it } from "vitest";
import usernamePageConfig from "../../../data/pages/username.json";
import { bentoLayoutItemsCollide } from "./bento-layout";
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

  it("keeps the default showcase layout free of overlapping cards", () => {
    const collisions = defaultPageConfig.layout.flatMap((item, index) =>
      defaultPageConfig.layout
        .slice(index + 1)
        .filter((nextItem) => bentoLayoutItemsCollide(item, nextItem))
        .map((nextItem) => `${item.i} overlaps ${nextItem.i}`),
    );

    expect(collisions).toEqual([]);
  });

  it("keeps default showcase media assets outside the page JSON payload", () => {
    const activityWidget = defaultPageConfig.widgets.find((widget) => widget.id === "rich-github-activity");
    const mediaWidget = defaultPageConfig.widgets.find((widget) => widget.id === "rich-media");

    expect(defaultPageConfig.profile.avatarUrl).not.toMatch(/^data:/);
    expect(String(activityWidget?.props.activityImageUrl ?? "")).toBe("");
    expect(String(mediaWidget?.props.imageUrl ?? "")).not.toMatch(/^data:/);
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
