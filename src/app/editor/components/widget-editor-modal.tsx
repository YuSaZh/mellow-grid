"use client";

import { useEffect } from "react";
import { useEditorStore } from "../store";
import { WidgetInspector } from "./widget-inspector";
import { getWidgetDefinition } from "@/lib/widgets/registry";

export function WidgetEditorModal() {
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const selectedTarget = useEditorStore((state) => state.selectedTarget);
  const widget = useEditorStore((state) => state.config.widgets.find((item) => selectedTarget?.type === "widget" && item.id === selectedTarget.id));
  const definition = widget ? getWidgetDefinition(widget.type) : undefined;

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        clearSelection();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearSelection]);

  if (!selectedTarget || !widget || !definition) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none px-4 py-4 sm:px-6" onClick={clearSelection}>
      <section
        aria-label={`${definition.name} 编辑选项`}
        aria-modal="true"
        className="pointer-events-auto fixed bottom-28 right-4 max-h-[min(42rem,calc(100dvh-9rem))] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto rounded-[1.75rem] border border-white/70 bg-white/88 p-5 shadow-[0_30px_70px_rgba(22,24,31,0.24)] backdrop-blur-2xl sm:right-6 sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">编辑模块</p>
            <h2 className="mt-1 text-3xl font-black tracking-[-0.05em] text-zinc-950">{definition.name}</h2>
          </div>
          <button className="min-h-11 rounded-full bg-zinc-100 px-4 text-sm font-black text-zinc-600 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#7c5cff]/30" onClick={clearSelection} type="button">
            关闭
          </button>
        </div>

        <WidgetInspector id={widget.id} />
      </section>
    </div>
  );
}
