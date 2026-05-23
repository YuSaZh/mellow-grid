import { describe, expect, it } from "vitest";
import { findAddModuleLayout } from "./editor-canvas";
import type { GridLayoutItem } from "@/lib/page-config/types";

describe("findAddModuleLayout", () => {
  it("places the add-module slot on the next available half-height row", () => {
    const layout: GridLayoutItem[] = [
      { i: "card-1", x: 0, y: 0, w: 1, h: 1 },
      { i: "card-2", x: 1, y: 0, w: 1, h: 1 },
      { i: "card-3", x: 2, y: 0, w: 1, h: 1 },
      { i: "card-4", x: 3, y: 0, w: 1, h: 1 },
      { i: "divider", x: 0, y: 1, w: 4, h: 0.5, minH: 0.5, maxH: 0.5 },
    ];

    expect(findAddModuleLayout(layout)).toMatchObject({ x: 0, y: 1.5, w: 1, h: 1 });
  });
});
