import { describe, expect, it } from "vitest";
import type { GridLayoutItem } from "@/lib/page-config/types";
import { getBentoGridItemStyle, sortBentoLayout } from "./bento-grid";

describe("getBentoGridItemStyle", () => {
  it("preserves half-height grid rows for compact dividers", () => {
    const style = getBentoGridItemStyle({ i: "divider", x: 0, y: 1, w: 4, h: 0.5, minH: 0.5, maxH: 0.5 });

    expect(style["--bento-grid-row" as keyof typeof style]).toBe("3 / span 1");
  });

  it("maps normal-height cards to two half-height grid rows", () => {
    const style = getBentoGridItemStyle({ i: "card", x: 0, y: 0, w: 1, h: 1 });

    expect(style["--bento-grid-row" as keyof typeof style]).toBe("1 / span 2");
  });
});

describe("sortBentoLayout", () => {
  it("sorts items in visual reading order (y, then x) without mutating input", () => {
    const input: GridLayoutItem[] = [
      { i: "bottom-wide", x: 0, y: 3.5, w: 2, h: 1 },
      { i: "top-right", x: 2, y: 0, w: 2, h: 1 },
      { i: "divider", x: 0, y: 3, w: 4, h: 0.5, minH: 0.5, maxH: 0.5 },
      { i: "top-left", x: 0, y: 0, w: 2, h: 2 },
      { i: "mid-right", x: 3, y: 1, w: 1, h: 1 },
      { i: "mid-left", x: 2, y: 1, w: 1, h: 1 },
    ];
    const snapshot = input.map((item) => item.i);

    const sorted = sortBentoLayout(input);

    expect(sorted.map((item) => item.i)).toEqual([
      "top-left",
      "top-right",
      "mid-left",
      "mid-right",
      "divider",
      "bottom-wide",
    ]);
    expect(input.map((item) => item.i)).toEqual(snapshot);
  });
});
