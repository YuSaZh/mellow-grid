const ABSOLUTE_OR_SPECIAL_URL_PATTERN = /^(?:https?:|data:|blob:|mailto:|tel:|#|\/\/)/i;

export function normalizeBaseUrl(baseUrl?: string): string {
  const raw = baseUrl ?? (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/";
  const trimmed = raw.trim();

  if (trimmed === "") {
    return "";
  }

  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

export function resolveAssetUrl(url?: string, baseUrl?: string): string {
  const trimmed = url?.trim() ?? "";

  if (!trimmed) {
    return "";
  }

  if (ABSOLUTE_OR_SPECIAL_URL_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const base = normalizeBaseUrl(baseUrl);

  if (!base) {
    return trimmed;
  }

  if (base !== "/" && trimmed.startsWith(base)) {
    return trimmed;
  }

  const cleaned = trimmed.replace(/^(?:\.\/|\/)+/, "");

  return `${base}${cleaned}`;
}
