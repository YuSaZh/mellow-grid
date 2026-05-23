import type { PageConfig } from "./types";

export function getPageDocumentTitle(config: PageConfig) {
  return config.profile.name.trim() || config.username.trim() || "MellowGrid";
}
