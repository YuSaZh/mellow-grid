import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { defaultPageConfig } from "@/lib/page-config/defaults";
import { normalizePageConfig } from "@/lib/page-config/normalize";
import type { PageConfig } from "@/lib/page-config/types";
import type { PageStorage } from "./types";

const dataDir = process.env.MELLOWGRID_DATA_DIR ?? path.join(process.cwd(), "data");
const pagesDir = path.join(dataDir, "pages");

function pagePath(username: string) {
  return path.join(pagesDir, `${username}.json`);
}

export const fileStorage: PageStorage = {
  async getPage(username) {
    try {
      const raw = await readFile(pagePath(username), "utf8");
      return normalizePageConfig(JSON.parse(raw) as PageConfig);
    } catch {
      return normalizePageConfig({ ...defaultPageConfig, username });
    }
  },

  async savePage(username, config) {
    const nextConfig = normalizePageConfig({
      ...config,
      username,
      updatedAt: new Date().toISOString(),
    });

    await mkdir(pagesDir, { recursive: true });
    await writeFile(pagePath(username), `${JSON.stringify(nextConfig, null, 2)}\n`, "utf8");

    return nextConfig;
  },
};
