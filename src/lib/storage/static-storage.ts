import { defaultPageConfig } from "@/lib/page-config/defaults";
import { normalizePageConfig } from "@/lib/page-config/normalize";
import type { PageStorage } from "./types";

export const staticStorage: PageStorage = {
  async getPage(username) {
    return normalizePageConfig({ ...defaultPageConfig, username });
  },

  async savePage(_username, config) {
    return normalizePageConfig(config);
  },
};
