import { describe, expect, it } from "vitest";
import { defaultPageConfig } from "../page-config/defaults";
import { renderStaticPageHtml } from "./export-html";

describe("renderStaticPageHtml", () => {
  it("renders a standalone HTML document with profile, bento cards, and no editor chrome", () => {
    const html = renderStaticPageHtml(defaultPageConfig);

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain(defaultPageConfig.profile.name);
    expect(html).toContain("bento-grid");
    expect(html).toContain("card-title");
    expect(html).toContain("Twitter");
    expect(html).not.toContain("MellowGrid Editor");
  });

  it("exports the JSON-driven bento set without requiring application JavaScript", () => {
    const html = renderStaticPageHtml(defaultPageConfig);

    for (const label of ["Figma", "Dribbble", "GitHub", "Blog", "Email", "Coffee"]) {
      expect(html).toContain(label);
    }

    expect(html).toContain("grid-column:3 / span 2");
    expect(html).not.toContain("type=\"module\"");
    expect(html).not.toContain("/_astro/");
  });
});
