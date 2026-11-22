import { describe, expect, it } from "vitest";
import { normalizeBaseUrl, resolveAssetUrl } from "./asset-url";

describe("normalizeBaseUrl", () => {
  it("normalizes subpath bases with leading and trailing slashes", () => {
    expect(normalizeBaseUrl("/mellow-grid")).toBe("/mellow-grid/");
    expect(normalizeBaseUrl("/mellow-grid/")).toBe("/mellow-grid/");
    expect(normalizeBaseUrl("mellow-grid")).toBe("/mellow-grid/");
    expect(normalizeBaseUrl("mellow-grid/")).toBe("/mellow-grid/");
  });

  it("handles root and empty base URLs", () => {
    expect(normalizeBaseUrl("/")).toBe("/");
    expect(normalizeBaseUrl("")).toBe("");
    expect(normalizeBaseUrl("   ")).toBe("");
  });

  it("defaults to import.meta.env.BASE_URL or root slash", () => {
    expect(normalizeBaseUrl()).toBe("/");
  });
});

describe("resolveAssetUrl", () => {
  it("resolves relative and root-relative asset paths under a subpath base", () => {
    expect(resolveAssetUrl("default-avatar.svg", "/mellow-grid")).toBe("/mellow-grid/default-avatar.svg");
    expect(resolveAssetUrl("default-avatar.svg", "/mellow-grid/")).toBe("/mellow-grid/default-avatar.svg");
    expect(resolveAssetUrl("./default-media.svg", "/mellow-grid")).toBe("/mellow-grid/default-media.svg");
    expect(resolveAssetUrl("/default-media.svg", "/mellow-grid")).toBe("/mellow-grid/default-media.svg");
    expect(resolveAssetUrl("editor/", "/mellow-grid")).toBe("/mellow-grid/editor/");
  });

  it("avoids double-prefixing paths that already include the base URL", () => {
    expect(resolveAssetUrl("/mellow-grid/default-avatar.svg", "/mellow-grid")).toBe("/mellow-grid/default-avatar.svg");
    expect(resolveAssetUrl("/mellow-grid/editor/", "/mellow-grid/")).toBe("/mellow-grid/editor/");
  });

  it("resolves relative paths cleanly with root or empty base URLs", () => {
    expect(resolveAssetUrl("default-avatar.svg", "/")).toBe("/default-avatar.svg");
    expect(resolveAssetUrl("./default-avatar.svg", "/")).toBe("/default-avatar.svg");
    expect(resolveAssetUrl("/default-avatar.svg", "/")).toBe("/default-avatar.svg");
    expect(resolveAssetUrl("default-avatar.svg", "")).toBe("default-avatar.svg");
    expect(resolveAssetUrl("./default-media.svg", "")).toBe("./default-media.svg");
  });

  it("preserves absolute, data, blob, mailto, tel, hash, and protocol-relative URLs", () => {
    expect(resolveAssetUrl("https://example.com/avatar.png", "/mellow-grid")).toBe("https://example.com/avatar.png");
    expect(resolveAssetUrl("http://example.com/avatar.png", "/mellow-grid")).toBe("http://example.com/avatar.png");
    expect(resolveAssetUrl("data:image/svg+xml;base64,PHN2Zz4=", "/mellow-grid")).toBe("data:image/svg+xml;base64,PHN2Zz4=");
    expect(resolveAssetUrl("blob:https://example.com/1234", "/mellow-grid")).toBe("blob:https://example.com/1234");
    expect(resolveAssetUrl("mailto:hello@example.com", "/mellow-grid")).toBe("mailto:hello@example.com");
    expect(resolveAssetUrl("tel:+81300000000", "/mellow-grid")).toBe("tel:+81300000000");
    expect(resolveAssetUrl("#contact", "/mellow-grid")).toBe("#contact");
    expect(resolveAssetUrl("//cdn.example.com/media.png", "/mellow-grid")).toBe("//cdn.example.com/media.png");
  });

  it("returns empty string for missing or whitespace-only URLs", () => {
    expect(resolveAssetUrl(undefined, "/mellow-grid")).toBe("");
    expect(resolveAssetUrl("", "/mellow-grid")).toBe("");
    expect(resolveAssetUrl("   ", "/mellow-grid")).toBe("");
  });
});
