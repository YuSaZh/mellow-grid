"use client";

import { getPageThemeStyle } from "@/components/page/page-shell";
import { useEditorStore } from "../store";
import { EditableProfile } from "./editable-profile";
import { EditorCanvas } from "./editor-canvas";
import { EditorToolbar } from "./editor-toolbar";
import { WidgetEditorModal } from "./widget-editor-modal";

export function EditorLayout() {
  const config = useEditorStore((state) => state.config);

  return (
    <main
      className="mg-page-ambient grid min-h-screen place-items-center overflow-x-clip px-4 pt-10 pb-28 sm:px-6 sm:pt-12 sm:pb-32 lg:px-8 xl:pt-16 xl:pb-32"
      data-theme-shadow={config.theme.shadow}
      style={getPageThemeStyle(config.theme)}
    >
      <EditorToolbar />
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-10 xl:flex-row xl:items-start xl:gap-16">
        <aside className="w-full max-w-[340px] shrink-0 text-center xl:sticky xl:top-16 xl:text-left">
          <EditableProfile profile={config.profile} />
        </aside>

        <EditorCanvas />
      </div>
      <WidgetEditorModal />
    </main>
  );
}
