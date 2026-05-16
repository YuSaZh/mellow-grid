import Link from "next/link";
import { PageRenderer } from "@/components/page/page-renderer";
import { getDeploymentMode, getPageStorage } from "@/lib/storage";

export default async function EditorPage() {
  const username = process.env.MELLOWGRID_DEFAULT_USER ?? "hanam";
  const config = await getPageStorage().getPage(username);
  const mode = getDeploymentMode();

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-8 text-zinc-950">
      <div className="mx-auto mb-6 flex max-w-6xl flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-white/90 p-5 shadow-[0_18px_60px_rgba(20,16,10,0.12)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Editor</p>
          <h1 className="mt-1 text-2xl font-bold">MellowGrid workspace</h1>
          <p className="mt-1 text-sm text-zinc-500">Current mode: {mode}. Drag-and-resize editing will be added on this foundation.</p>
        </div>
        <div className="flex gap-3">
          <Link className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white" href={`/${username}`}>
            View page
          </Link>
          <button className="rounded-full bg-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-500" disabled>
            Save coming next
          </button>
        </div>
      </div>
      <PageRenderer config={config} />
    </main>
  );
}
