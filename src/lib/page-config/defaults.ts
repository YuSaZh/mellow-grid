import usernamePageConfig from "../../../data/pages/username.json";
import { normalizePageConfig } from "./normalize";
import type { PageConfig } from "./types";

export { defaultProfile, defaultTheme } from "./fallbacks";

export const defaultPageConfig: PageConfig = normalizePageConfig(usernamePageConfig as PageConfig);
