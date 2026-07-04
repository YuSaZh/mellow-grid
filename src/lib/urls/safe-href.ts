const SAFE_SCHEMES = new Set(["http", "https", "mailto", "tel"]);

export function sanitizeHref(href?: string) {
  if (!href) {
    return "";
  }

  const value = href.trim();

  if (!value || value.startsWith("//")) {
    return "";
  }

  const schemeSource = value.replace(/[\u0000-\u001f\u007f\s]+/g, "");
  const scheme = schemeSource.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();

  if (scheme) {
    return SAFE_SCHEMES.has(scheme) ? value : "";
  }

  return value;
}
