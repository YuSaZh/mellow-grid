"use client";

import type { ChangeEvent } from "react";
import { useEditorStore } from "../store";

export function EditorToolbar() {
  const exportConfig = useEditorStore((state) => state.exportConfig);
  const exportStaticHtml = useEditorStore((state) => state.exportStaticHtml);
  const importConfig = useEditorStore((state) => state.importConfig);
  const mode = useEditorStore((state) => state.mode);
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
    <header className="pointer-events-none fixed inset-x-0 bottom-4 z-50 px-4 sm:bottom-6 sm:px-6 lg:px-8">
      <div className="pointer-events-auto mx-auto flex max-w-[72rem] flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-white/10 bg-[#17181d]/88 px-4 py-3 text-white shadow-[0_24px_80px_rgba(15,17,25,0.28)] backdrop-blur-2xl sm:px-5">
        <div className="min-w-0">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-zinc-400">MellowGrid Editor</p>
          <p className="mt-1 flex items-center gap-2 truncate text-sm font-bold text-zinc-100"><span className="size-2 rounded-full bg-[#72f2a5] shadow-[0_0_18px_rgba(114,242,165,0.85)]" />{mode} · {status}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
          <button className="min-h-11 rounded-full bg-white px-5 text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/40" onClick={saveDraft} type="button">
            保存
          </button>
          <button className="min-h-11 rounded-full bg-[#72f2a5] px-5 text-zinc-950 shadow-[0_10px_28px_rgba(114,242,165,0.25)] transition hover:bg-[#9ff6c0] focus:outline-none focus:ring-2 focus:ring-[#72f2a5]/50" onClick={exportStaticHtml} type="button">
            发布静态主页
          </button>
          <a className="grid min-h-11 place-items-center rounded-full bg-white/10 px-5 text-white shadow-[0_10px_28px_rgba(0,0,0,0.12)] transition hover:bg-white/16 focus:outline-none focus:ring-2 focus:ring-white/30" href="/">
            预览
          </a>
          <button className="min-h-11 rounded-full bg-white/10 px-5 text-white shadow-[0_10px_28px_rgba(0,0,0,0.12)] transition hover:bg-white/16 focus:outline-none focus:ring-2 focus:ring-white/30" onClick={exportConfig} type="button">
            导出 JSON
          </button>
          <label className="grid min-h-11 cursor-pointer place-items-center rounded-full bg-white/10 px-5 text-white shadow-[0_10px_28px_rgba(0,0,0,0.12)] transition hover:bg-white/16 focus-within:ring-2 focus-within:ring-white/30">
            导入
            <input accept="application/json" className="sr-only" onChange={handleImport} type="file" />
          </label>
        </div>
      </div>
    </header>
  );
}
