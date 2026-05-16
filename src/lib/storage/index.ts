import type { DeploymentMode } from "@/lib/page-config/types";
import type { PageStorage } from "./types";
import { fileStorage } from "./file-storage";
import { staticStorage } from "./static-storage";

export function getDeploymentMode(): DeploymentMode {
  const mode = process.env.MELLOWGRID_MODE;

  if (mode === "file" || mode === "remote" || mode === "static") {
    return mode;
  }

  return "static";
}

export function getPageStorage(): PageStorage {
  const mode = getDeploymentMode();

  if (mode === "file") {
    return fileStorage;
  }

  return staticStorage;
}
