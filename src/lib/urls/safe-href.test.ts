import { describe, expect, it } from "vitest";
import { sanitizeHref } from "./safe-href";

describe("sanitizeHref", () => {
  it.each([
    "https://example.com/path",
    "http://example.com/path",
    "mailto:email@example.com",
    "tel:+1234567890",
    "/profile",
    "./profile",
    "../profile",
    "#contact",
    "?tab=links",
  ])("allows safe href %s", (href) => {
    expect(sanitizeHref(href)).toBe(href);
  });

  it.each([
    "javascript:alert(1)",
    "java\nscript:alert(1)",
    "ftp://example.com/file",
    "//evil.test",
    "/\n/evil.test",
    "\u0000//evil.test",
    "\\\\evil.test",
    "/\\evil.test",
  ])("rejects unsafe href %s", (href) => {
    expect(sanitizeHref(href)).toBe("");
  });
});
