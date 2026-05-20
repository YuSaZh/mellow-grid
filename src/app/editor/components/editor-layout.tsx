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
      <div className="mx-auto grid w-full max-w-[1196px] grid-cols-1 gap-8 px-5 py-8 sm:px-8 lg:px-10 xl:grid-cols-[20rem_820px] xl:items-start xl:gap-14">
        <aside className="pt-2 xl:sticky xl:top-8 xl:min-h-[calc(100vh-7rem)]">
          <EditableProfile profile={config.profile} />
        </aside>

        <EditorCanvas />
      </div>
      <WidgetEditorModal />
    </main>
  );
}
