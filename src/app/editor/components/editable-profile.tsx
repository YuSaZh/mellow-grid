"use client";

import { useState } from "react";
import type { PageContact, PageProfile } from "@/lib/page-config/types";
import { useEditorStore } from "../store";
import { fileToDataUrl, LinksField, uploadFile } from "./inspector-fields";

export function EditableProfile({ profile }: { profile: PageProfile }) {
  const updateProfile = useEditorStore((state) => state.updateProfile);
  const [editingContacts, setEditingContacts] = useState(false);
  const contacts = profile.contacts ?? [];
  const initial = profile.name.trim().charAt(0).toUpperCase() || "Y";

  return (
    <section className="group/profile grid justify-items-start gap-8 rounded-[2.5rem] p-3 transition hover:bg-white/50 focus-within:bg-white/70">
      <label className="relative mx-auto grid size-44 cursor-pointer place-items-center overflow-hidden rounded-full bg-zinc-950 text-6xl font-black text-white shadow-[0_28px_80px_rgba(20,16,10,0.18)] transition hover:scale-[1.02] focus-within:ring-4 focus-within:ring-[#7c5cff]/30 lg:mx-0 xl:size-52">
        {profile.avatarUrl ? <img alt="个人头像预览" className="size-full object-cover" src={profile.avatarUrl} /> : initial}
        <span className="absolute inset-x-5 bottom-5 rounded-full bg-white/95 px-4 py-2 text-center text-xs font-black uppercase tracking-[0.16em] text-zinc-950 opacity-0 shadow-[0_12px_32px_rgba(20,16,10,0.18)] transition group-hover/profile:opacity-100 group-focus-within/profile:opacity-100">
          上传头像
        </span>
        <input
          accept="image/*"
          aria-label="上传头像"
          className="sr-only"
          onChange={async (event) => {
            const file = uploadFile(event);

            if (file) {
              updateProfile({ avatarUrl: await fileToDataUrl(file) });
            }
          }}
          type="file"
        />
      </label>

      <div className="grid w-full gap-4">
        <label className="grid gap-2">
          <span className="sr-only">姓名</span>
          <input
            className="w-full rounded-3xl border border-transparent bg-transparent px-0 py-1 text-5xl font-black tracking-[-0.08em] text-zinc-950 outline-none transition placeholder:text-zinc-300 focus:border-[#7c5cff]/30 focus:bg-white/70 focus:px-4 focus:ring-4 focus:ring-[#7c5cff]/15"
            onChange={(event) => updateProfile({ name: event.target.value })}
            placeholder="Your Name"
            value={profile.name}
          />
        </label>

        <label className="grid gap-2">
          <span className="sr-only">位置</span>
          <input
            className="w-full rounded-2xl border border-transparent bg-transparent px-0 py-1 text-lg font-medium leading-7 text-zinc-500 outline-none transition placeholder:text-zinc-300 focus:border-[#7c5cff]/30 focus:bg-white/70 focus:px-4 focus:ring-4 focus:ring-[#7c5cff]/15"
            onChange={(event) => updateProfile({ location: event.target.value })}
            placeholder="Based in Your City"
            value={profile.location}
          />
        </label>

        <label className="grid gap-2">
          <span className="sr-only">简介</span>
          <textarea
            className="min-h-24 w-full resize-y rounded-2xl border border-transparent bg-transparent px-0 py-1 text-lg font-medium leading-7 text-zinc-500 outline-none transition placeholder:text-zinc-300 focus:border-[#7c5cff]/30 focus:bg-white/70 focus:px-4 focus:ring-4 focus:ring-[#7c5cff]/15"
            onChange={(event) => updateProfile({ bio: event.target.value })}
            placeholder="A short introduction for your personal homepage."
            value={profile.bio}
          />
        </label>
      </div>

      <div className="grid w-full gap-3">
        <div className="flex flex-wrap gap-3">
          <button
            className="mg-no-drag min-h-11 rounded-full bg-zinc-950 px-5 text-sm font-bold uppercase tracking-[-0.02em] text-white shadow-[0_16px_40px_rgba(20,16,10,0.12)] transition hover:bg-zinc-700 focus:outline-none focus:ring-4 focus:ring-[#7c5cff]/20"
            onClick={() => setEditingContacts((value) => !value)}
            type="button"
          >
            {editingContacts ? "收起联系方式" : "编辑联系方式"}
          </button>
          {profile.avatarUrl ? (
            <button
              className="mg-no-drag min-h-11 rounded-full bg-white px-5 text-sm font-bold text-zinc-700 shadow-[0_16px_40px_rgba(20,16,10,0.08)] transition hover:bg-zinc-100 focus:outline-none focus:ring-4 focus:ring-[#7c5cff]/20"
              onClick={() => updateProfile({ avatarUrl: "" })}
              type="button"
            >
              移除头像
            </button>
          ) : null}
        </div>

        {editingContacts ? (
          <div className="mg-no-drag rounded-[2rem] border border-black/10 bg-white/90 p-4 shadow-[0_18px_60px_rgba(20,16,10,0.10)] backdrop-blur">
            <LinksField label="Contacts" onChange={(value) => updateProfile({ contacts: value as PageContact[] })} value={contacts} />
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {contacts.map((contact, index) => (
              <a
                className="rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[-0.03em] text-zinc-700 shadow-[0_18px_45px_rgba(20,16,10,0.08)] transition hover:-translate-y-0.5 hover:text-zinc-950 focus:outline-none focus:ring-4 focus:ring-[#7c5cff]/20"
                href={contact.href}
                key={`${contact.label}-${index}`}
                onClick={(event) => event.preventDefault()}
              >
                {contact.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
