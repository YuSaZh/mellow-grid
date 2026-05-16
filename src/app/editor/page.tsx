import { EditorClient } from "./editor-client";
import { getDeploymentMode, getPageStorage } from "@/lib/storage";

export default async function EditorPage() {
  const username = process.env.MELLOWGRID_DEFAULT_USER ?? "username";
  const config = await getPageStorage().getPage(username);
  const mode = getDeploymentMode();

  return <EditorClient initialConfig={config} mode={mode} />;
}
