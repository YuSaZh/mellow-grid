import { describe, expect, it } from "vitest";
import usernamePageConfig from "../../../data/pages/username.json";
import { defaultPageConfig } from "./defaults";
import type { PageConfig } from "./types";

describe("defaultPageConfig", () => {
  it("uses data/pages/username.json as the build-time page source", () => {
    const sourceConfig = usernamePageConfig as PageConfig;

    expect(defaultPageConfig.title).toBe(sourceConfig.title);
    expect(defaultPageConfig.profile.name).toBe(sourceConfig.profile.name);
    expect(defaultPageConfig.widgets.map((widget) => widget.id)).toEqual(sourceConfig.widgets.map((widget) => widget.id));
  });
});
