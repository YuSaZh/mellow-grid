"use client";

import { useEditorStore } from "../store";
import { AddWidgetPanel } from "./add-widget-panel";
import { ProfileInspector } from "./profile-inspector";
import { WidgetInspector } from "./widget-inspector";

export function EditorSidebar() {
  const selectedTarget = useEditorStore((state) => state.selectedTarget);

  return (
    <aside className="pointer-events-none fixed bottom-5 right-5 z-40 grid max-h-[calc(100vh-7rem)] w-[min(24rem,calc(100vw-2.5rem))] content-end gap-3 overflow-y-auto sm:bottom-6 sm:right-6">
      <section className="pointer-events-auto rounded-[2rem] border border-black/10 bg-white/95 p-5 shadow-[0_22px_70px_rgba(20,16,10,0.16)] backdrop-blur-xl">
        {selectedTarget?.type === "profile" ? <ProfileInspector id={selectedTarget.id} /> : null}
        {selectedTarget?.type === "widget" ? <WidgetInspector id={selectedTarget.id} /> : null}
        {!selectedTarget ? (
          <div className="rounded-3xl bg-zinc-50 p-5 text-sm leading-6 text-zinc-500">
            <p className="font-bold text-zinc-800">选择一个区域开始编辑</p>
            <p className="mt-2">点击个人资料或任意卡片，这里会显示对应的编辑表单。</p>
          </div>
        ) : null}
      </section>

      <div className="pointer-events-auto">
        <AddWidgetPanel />
      </div>
    </aside>
  );
}
