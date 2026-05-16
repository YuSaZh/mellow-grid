"use client";

import { useEditorStore } from "../store";
import { widgetRegistry } from "@/lib/widgets/registry";

export function AddWidgetPanel() {
  const addWidget = useEditorStore((state) => state.addWidget);

  return (
    <details className="group rounded-[2rem] border border-black/10 bg-white/95 shadow-[0_18px_60px_rgba(20,16,10,0.12)] backdrop-blur-xl" open>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 text-sm font-black uppercase tracking-[0.18em] text-zinc-500 [&::-webkit-details-marker]:hidden">
        添加模块
        <span className="grid size-9 place-items-center rounded-full bg-zinc-950 text-base leading-none text-white transition group-open:rotate-45">+</span>
      </summary>
      <div className="grid gap-2 px-4 pb-4">
        {Object.values(widgetRegistry)
          .filter((definition) => definition.type !== "profile")
          .map((definition) => (
            <button
              className="min-h-14 rounded-3xl border border-black/5 bg-zinc-50 px-4 py-3 text-left transition hover:border-[#7c5cff]/30 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#7c5cff]/30"
              key={definition.type}
              onClick={() => addWidget(definition.type)}
              type="button"
            >
              <span className="block text-sm font-black text-zinc-900">{definition.name}</span>
              <span className="mt-1 block text-xs font-medium leading-5 text-zinc-500">{definition.description}</span>
            </button>
          ))}
      </div>
    </details>
  );
}
