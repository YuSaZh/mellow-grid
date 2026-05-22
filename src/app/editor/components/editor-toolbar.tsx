"use client";

import type { ChangeEvent } from "react";
import { useEditorStore } from "../store";

export function EditorToolbar() {
  const exportConfig = useEditorStore((state) => state.exportConfig);
  const exportStaticHtml = useEditorStore((state) => state.exportStaticHtml);
  const importConfig = useEditorStore((state) => state.importConfig);
  const saveDraft = useEditorStore((state) => state.saveDraft);
  const status = useEditorStore((state) => state.status);

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await importConfig(file);
    event.target.value = "";
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 bottom-4 z-[1000] px-4 sm:bottom-8">
      <style>{`
        @keyframes mgPulseDot {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(10, 207, 131, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(10, 207, 131, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(10, 207, 131, 0); }
        }
      `}</style>
      <div className="pointer-events-auto mx-auto flex w-fit max-w-[calc(100vw-2rem)] flex-wrap items-center justify-center gap-4 rounded-[100px] border border-white/[0.12] bg-[#121214]/90 px-5 py-3 text-white shadow-[0_30px_60px_rgba(0,0,0,0.30),inset_1px_1px_0_rgba(255,255,255,0.15)] backdrop-blur-[20px] backdrop-saturate-[1.8] sm:px-8">
        <div className="hidden items-center gap-2 border-r border-white/[0.15] pr-6 text-[0.8rem] font-bold uppercase tracking-[0.08em] text-white/45 md:flex" title={status}>
          <span className="size-2 rounded-full bg-[#0acf83]" style={{ animation: "mgPulseDot 1.5s infinite" }} />
          <span>流式重排编辑器</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-[0.85rem] font-semibold">
          <a className="grid min-h-10 place-items-center rounded-full bg-white px-5 font-bold transition hover:-translate-y-0.5 hover:bg-[#f1f1f5] focus:outline-none focus:ring-4 focus:ring-white/20" href="/" style={{ backgroundColor: "#ffffff", color: "#121214" }}>
            预览效果
          </a>
          <label className="grid min-h-10 cursor-pointer place-items-center rounded-full bg-transparent px-5 text-white transition hover:-translate-y-0.5 hover:bg-white/[0.15] focus-within:ring-4 focus-within:ring-white/20">
            导入 JSON
            <input accept="application/json" className="sr-only" onChange={handleImport} type="file" />
          </label>
          <button className="min-h-10 rounded-full bg-transparent px-5 text-white transition hover:-translate-y-0.5 hover:bg-white/[0.15] focus:outline-none focus:ring-4 focus:ring-white/20" onClick={exportConfig} type="button">
            备份数据
          </button>
          <button className="min-h-10 rounded-full bg-transparent px-5 text-white transition hover:-translate-y-0.5 hover:bg-white/[0.15] focus:outline-none focus:ring-4 focus:ring-white/20" onClick={saveDraft} type="button">
            保存更改
          </button>
          <button className="min-h-10 rounded-full bg-[#0acf83] px-5 text-white transition hover:-translate-y-0.5 hover:bg-[#19df96] focus:outline-none focus:ring-4 focus:ring-[#0acf83]/30" onClick={exportStaticHtml} type="button">
            发布静态主页
          </button>
        </div>
      </div>
    </header>
  );
}
