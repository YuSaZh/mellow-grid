"use client";

import { useEditorStore } from "../store";
import { EditableProfile } from "./editable-profile";
import { EditorCanvas } from "./editor-canvas";
import { EditorToolbar } from "./editor-toolbar";
import { WidgetEditorModal } from "./widget-editor-modal";

export function EditorLayout() {
  const config = useEditorStore((state) => state.config);

  return (
    <main className="min-h-dvh bg-[#f6f6f9] pb-32 text-zinc-950">
      <EditorToolbar />
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-14 xl:flex-row xl:items-start xl:gap-16">
        <aside className="w-full max-w-[340px] shrink-0 pt-2 xl:sticky xl:top-12 xl:min-h-[calc(100vh-8rem)]">
          <EditableProfile profile={config.profile} />
        </aside>

        <EditorCanvas />
      </div>
      <WidgetEditorModal />
    </main>
  );
}
