"use client";

import { useEditorStore } from "../store";
import { widgetRegistry } from "@/lib/widgets/registry";

type AddWidgetPanelProps = {
  onAdd?: () => void;
  placement?: {
    x: number;
    y: number;
  };
};

export function AddWidgetPanel({ onAdd, placement }: AddWidgetPanelProps) {
  const addWidget = useEditorStore((state) => state.addWidget);

  return (
    <div className="grid gap-2 rounded-[2rem] border border-black/10 bg-white/95 p-3 shadow-[0_24px_80px_rgba(20,16,10,0.16)] backdrop-blur-xl">
      <div className="px-2 pb-1">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">添加模块</p>
        <p className="mt-1 text-sm font-medium text-zinc-500">选择后会放到这个 2x2 占位位置。</p>
      </div>
      {Object.values(widgetRegistry).map((definition) => (
        <button
          className="min-h-14 rounded-3xl border border-black/5 bg-zinc-50 px-4 py-3 text-left transition hover:border-[#7c5cff]/30 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#7c5cff]/30"
          key={definition.type}
          onClick={() => {
            addWidget(definition.type, placement);
            onAdd?.();
          }}
          type="button"
        >
          <span className="block text-sm font-black text-zinc-900">{definition.name}</span>
          <span className="mt-1 block text-xs font-medium leading-5 text-zinc-500">{definition.description}</span>
        </button>
      ))}
    </div>
  );
}
