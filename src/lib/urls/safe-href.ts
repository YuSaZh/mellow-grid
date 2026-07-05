const SAFE_SCHEMES = new Set(["http", "https", "mailto", "tel"]);
const CONTROL_OR_SPACE_PATTERN = /[\u0000-\u001f\u007f\s]+/g;

export function sanitizeHref(href?: string) {
  if (!href) {
    return "";
  }

  const value = href.trim();
  const normalized = value.replace(CONTROL_OR_SPACE_PATTERN, "").replace(/\\/g, "/");

  if (!value || normalized.startsWith("//")) {
    return "";
  }

  const scheme = normalized.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();

  if (scheme) {
    return SAFE_SCHEMES.has(scheme) ? value : "";
  }

  return value;
}
