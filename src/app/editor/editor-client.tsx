"use client";

import { EditorLayout } from "./components/editor-layout";
import { EditorStoreProvider } from "./store";
import type { DeploymentMode, PageConfig } from "@/lib/page-config/types";

type EditorClientProps = {
  initialConfig: PageConfig;
  mode: DeploymentMode;
};

export function EditorClient({ initialConfig, mode }: EditorClientProps) {
  return (
    <EditorStoreProvider initialConfig={initialConfig} mode={mode}>
      <EditorLayout />
    </EditorStoreProvider>
  );
}
