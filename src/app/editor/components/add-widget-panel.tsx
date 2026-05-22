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
    <div className="w-[min(20rem,calc(100vw-2.5rem))] rounded-[2rem] border border-black/10 bg-white/95 p-3 shadow-[0_24px_80px_rgba(20,16,10,0.16)] backdrop-blur-xl">
      <div className="px-2 pb-1">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">添加模块</p>
        <p className="mt-1 text-sm font-medium text-zinc-500">选择后会放到当前占位。</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {Object.values(widgetRegistry).map((definition) => (
          <button
            className="min-h-12 rounded-2xl border border-black/5 bg-zinc-50 px-3 py-2 text-center text-sm font-black text-zinc-900 transition hover:-translate-y-0.5 hover:border-[#3FA3EB]/35 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#3FA3EB]/30"
            key={definition.type}
            onClick={() => {
              addWidget(definition.type, placement);
              onAdd?.();
            }}
            title={definition.description}
            type="button"
          >
            {definition.name}
          </button>
        ))}
      </div>
    </div>
  );
}
