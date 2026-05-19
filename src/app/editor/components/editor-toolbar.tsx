"use client";

import Link from "next/link";
import type { ChangeEvent } from "react";
import { useEditorStore } from "../store";

export function EditorToolbar() {
  const config = useEditorStore((state) => state.config);
  const exportConfig = useEditorStore((state) => state.exportConfig);
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
      <div className="pointer-events-auto mx-auto flex max-w-[72rem] flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-black/10 bg-[#f7f4ef]/88 px-4 py-3 shadow-[0_24px_80px_rgba(20,16,10,0.18)] backdrop-blur-2xl sm:px-5">
        <div className="min-w-0">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-zinc-400">MellowGrid Editor</p>
          <p className="mt-1 truncate text-sm font-bold text-zinc-700">{mode} · {status}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
          <button className="min-h-11 rounded-full bg-zinc-950 px-5 text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#7c5cff]/40" onClick={saveDraft} type="button">
            保存
          </button>
          <Link className="grid min-h-11 place-items-center rounded-full bg-white px-5 text-zinc-800 shadow-[0_10px_28px_rgba(20,16,10,0.08)] transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#7c5cff]/40" href={`/${config.username}`} prefetch={false}>
            预览
          </Link>
          <button className="min-h-11 rounded-full bg-white px-5 text-zinc-800 shadow-[0_10px_28px_rgba(20,16,10,0.08)] transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#7c5cff]/40" onClick={exportConfig} type="button">
            导出
          </button>
          <label className="grid min-h-11 cursor-pointer place-items-center rounded-full bg-white px-5 text-zinc-800 shadow-[0_10px_28px_rgba(20,16,10,0.08)] transition hover:bg-zinc-100 focus-within:ring-2 focus-within:ring-[#7c5cff]/40">
            导入
            <input accept="application/json" className="sr-only" onChange={handleImport} type="file" />
          </label>
        </div>
      </div>
    </header>
  );
}
