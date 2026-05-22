"use client";

import { EditorLayout } from "./components/editor-layout";
import { EditorStoreProvider } from "./store";
import type { PageConfig } from "@/lib/page-config/types";

type EditorClientProps = {
  initialConfig: PageConfig;
};

export function EditorClient({ initialConfig }: EditorClientProps) {
  return (
    <EditorStoreProvider initialConfig={initialConfig}>
      <EditorLayout />
    </EditorStoreProvider>
  );
}
