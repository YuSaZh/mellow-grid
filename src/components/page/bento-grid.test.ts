import { describe, expect, it } from "vitest";
import { getBentoGridItemStyle } from "./bento-grid";

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
