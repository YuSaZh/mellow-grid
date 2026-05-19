"use client";

import { useEditorStore } from "../store";
import { EditableProfile } from "./editable-profile";
import { EditorCanvas } from "./editor-canvas";
import { EditorToolbar } from "./editor-toolbar";
import { WidgetEditorModal } from "./widget-editor-modal";

export function EditorLayout() {
  const config = useEditorStore((state) => state.config);

  return (
    <main className="min-h-dvh pb-32 text-zinc-950" style={{ background: config.theme.background, color: config.theme.foreground }}>
      <EditorToolbar />
      <div className="mx-auto grid w-full max-w-[86rem] grid-cols-1 gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:px-10 xl:grid-cols-[20rem_minmax(0,1fr)] xl:gap-14">
        <aside className="pt-2 lg:sticky lg:top-8 lg:min-h-[calc(100vh-7rem)]">
          <EditableProfile profile={config.profile} />
        </aside>

        <EditorCanvas />
      </div>
      <WidgetEditorModal />
    </main>
  );
}
