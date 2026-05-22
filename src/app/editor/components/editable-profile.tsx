"use client";

import type { PageContact, PageProfile } from "@/lib/page-config/types";
import { useEditorStore } from "../store";
import { fileToDataUrl, uploadFile } from "./inspector-fields";

export function EditableProfile({ profile }: { profile: PageProfile }) {
  const updateProfile = useEditorStore((state) => state.updateProfile);
  const contacts = profile.contacts ?? [];

  function updateContacts(nextContacts: PageContact[]) {
    updateProfile({ contacts: nextContacts });
  }

  function updateContact(index: number, patch: Partial<PageContact>) {
    updateContacts(contacts.map((contact, contactIndex) => (contactIndex === index ? { ...contact, ...patch } : contact)));
  }

  function addContact() {
    updateContacts([...contacts, { label: "Button", href: "https://example.com" }]);
  }

  function removeContact(index: number) {
    updateContacts(contacts.filter((_, contactIndex) => contactIndex !== index));
  }

  return (
    <section className="group/profile relative max-w-[340px] text-inherit">
      <label className="relative mx-auto grid size-[140px] cursor-pointer place-items-center overflow-hidden rounded-full bg-[#111113] p-1 shadow-[0_15px_35px_rgba(0,0,0,0.15),inset_1.5px_1.5px_0_rgba(255,255,255,0.15),inset_-2px_-2px_5px_rgba(0,0,0,0.4)] transition hover:scale-[1.03] focus-within:ring-4 focus-within:ring-[#3FA3EB]/20 xl:mx-0">
        {profile.avatarUrl ? <img alt="个人头像预览" className="size-full rounded-full object-cover" src={profile.avatarUrl} /> : <GlitchAvatar />}
        <span className="absolute inset-x-4 bottom-4 rounded-full bg-white/95 px-3 py-2 text-center text-[0.65rem] font-black uppercase tracking-[0.14em] text-[#121214] opacity-0 shadow-[0_12px_32px_rgba(20,16,10,0.18)] transition group-hover/profile:opacity-100 group-focus-within/profile:opacity-100">
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

      <h1
        className="mt-9 text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#111113] outline-none transition focus:rounded focus:bg-[#3FA3EB]/[0.04] focus:ring-2 focus:ring-[#3FA3EB]/20"
        contentEditable
        onInput={(event) => updateProfile({ name: event.currentTarget.textContent ?? "" })}
        suppressContentEditableWarning
      >
        {profile.name}
      </h1>

      <p
        className="mt-4 text-[0.83rem] font-extrabold uppercase tracking-[0.16em] text-[#9b9ba4] outline-none transition focus:rounded focus:bg-[#3FA3EB]/[0.04] focus:ring-2 focus:ring-[#3FA3EB]/20"
        contentEditable
        onInput={(event) => updateProfile({ location: event.currentTarget.textContent ?? "" })}
        suppressContentEditableWarning
      >
        {profile.location}
      </p>

      <p
        className="mt-3 text-[1.05rem] font-normal leading-[1.6] text-[#5d5d65] outline-none transition focus:rounded focus:bg-[#3FA3EB]/[0.04] focus:ring-2 focus:ring-[#3FA3EB]/20"
        contentEditable
        onInput={(event) => updateProfile({ bio: event.currentTarget.textContent ?? "" })}
        suppressContentEditableWarning
      >
        {profile.bio}
      </p>

      {contacts.length ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {contacts.map((contact, index) => (
            <span className="group/contact relative inline-flex" key={`${contact.label}-${contact.href}-${index}`}>
              <span
                aria-label={`按钮 ${index + 1} 文案`}
                className="cursor-text rounded-full bg-zinc-100 px-5 py-3 text-sm font-bold uppercase tracking-[-0.02em] text-zinc-700 shadow-[0_10px_28px_rgba(20,16,10,0.08)] outline-none transition hover:-translate-y-0.5 hover:bg-zinc-200 focus:ring-2 focus:ring-[#3FA3EB]/25"
                contentEditable
                onInput={(event) => updateContact(index, { label: event.currentTarget.textContent ?? "" })}
                suppressContentEditableWarning
              >
                {contact.label}
              </span>
              <button
                aria-label={`删除 ${contact.label}`}
                className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-[#121214] text-sm font-black leading-none text-white opacity-0 shadow-[0_8px_18px_rgba(20,16,10,0.18)] transition group-hover/contact:opacity-100 group-focus-within/contact:opacity-100"
                onClick={() => removeContact(index)}
                type="button"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <details className="pointer-events-none absolute left-0 top-full z-30 mt-4 w-full rounded-[24px] border border-black/[0.06] bg-white/[0.82] p-3 text-left opacity-0 shadow-[0_14px_34px_rgba(20,16,10,0.06)] backdrop-blur-sm transition group-hover/profile:pointer-events-auto group-hover/profile:opacity-100 group-focus-within/profile:pointer-events-auto group-focus-within/profile:opacity-100">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <span className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9b9ba4]">Profile buttons</span>
          <button className="rounded-full bg-[#121214] px-3 py-2 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-zinc-700" onClick={addContact} type="button">
            添加按钮
          </button>
        </summary>

        {contacts.length ? (
          <div className="mt-3 grid gap-2">
            {contacts.map((contact, index) => (
              <div className="grid gap-2 rounded-[18px] bg-black/[0.025] p-2" key={`editor-${contact.label}-${contact.href}-${index}`}>
                <input
                  aria-label={`按钮 ${index + 1} 链接`}
                  className="min-h-10 rounded-[13px] border border-black/10 bg-white/70 px-3 text-xs font-semibold text-[#121214] outline-none transition focus:border-[#3FA3EB] focus:ring-2 focus:ring-[#3FA3EB]/20"
                  onChange={(event) => updateContact(index, { href: event.target.value })}
                  placeholder="https://example.com"
                  value={contact.href}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-[18px] bg-black/[0.025] px-3 py-2 text-xs font-semibold text-[#9b9ba4]">还没有底部按钮，点击添加按钮创建。</p>
        )}
      </details>
    </section>
  );
}

function GlitchAvatar() {
  return (
    <svg aria-hidden="true" className="block size-full rounded-full" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#0c0c0e" />
      <line x1="0" y1="20" x2="100" y2="20" stroke="#1d1d23" strokeWidth="0.5" />
      <line x1="0" y1="40" x2="100" y2="40" stroke="#1d1d23" strokeWidth="0.5" />
      <line x1="0" y1="60" x2="100" y2="60" stroke="#1d1d23" strokeWidth="0.5" />
      <line x1="0" y1="80" x2="100" y2="80" stroke="#1d1d23" strokeWidth="0.5" />
      <path d="M50,15 C41,15 28,24 28,45 C28,58 35,68 38,72 L36,85 L62,85 L60,72 C63,68 70,58 70,45 C70,24 59,15 50,15 Z" fill="#00f0ff" opacity="0.6" transform="translate(-2, 1)" />
      <path d="M50,15 C41,15 28,24 28,45 C28,58 35,68 38,72 L36,85 L62,85 L60,72 C63,68 70,58 70,45 C70,24 59,15 50,15 Z" fill="#ff007f" opacity="0.6" transform="translate(2, -1)" />
      <path d="M50,15 C41,15 28,24 28,45 C28,58 35,68 38,72 L36,85 L62,85 L60,72 C63,68 70,58 70,45 C70,24 59,15 50,15 Z" fill="#1b1c21" />
      <rect x="15" y="30" width="18" height="4" fill="#00f0ff" opacity="0.8" />
      <rect x="68" y="32" width="15" height="3" fill="#ff007f" opacity="0.8" />
      <rect x="25" y="55" width="55" height="1.5" fill="#ffffff" opacity="0.9" />
      <rect x="40" y="65" width="30" height="2" fill="#00f0ff" opacity="0.7" />
      <rect x="20" y="74" width="12" height="3" fill="#ff007f" opacity="0.8" />
    </svg>
  );
}
