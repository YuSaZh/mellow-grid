import { defaultPageConfig } from "@/lib/page-config/defaults";
import type { PageStorage } from "./types";

export const staticStorage: PageStorage = {
  async getPage(username) {
    return { ...defaultPageConfig, username };
  },

  async savePage(_username, config) {
    return config;
  },
};
