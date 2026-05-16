import type { PageConfig } from "@/lib/page-config/types";

export type PageStorage = {
  getPage(username: string): Promise<PageConfig>;
  savePage(username: string, config: PageConfig): Promise<PageConfig>;
};
