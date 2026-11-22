"use client";

import type { PageContact, PageProfile } from "@/lib/page-config/types";
import { resolveAssetUrl } from "@/lib/urls/asset-url";
import { useEditorStore } from "../store";
import { fileToDataUrl, uploadFile } from "./inspector-fields";

export function EditableProfile({ profile }: { profile: PageProfile }) {
  const updateProfile = useEditorStore((state) => state.updateProfile);
  const contacts = profile.contacts ?? [];
  const avatarSrc = resolveAvatarUrl(profile.avatarUrl);

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
    <section className="group/profile mg-fade-up relative max-w-[340px] text-inherit">
      <label className="group/avatar relative mx-auto block size-[140px] cursor-pointer rounded-full bg-white p-[3px] shadow-[0_1px_2px_rgba(15,23,42,0.06),0_18px_40px_-14px_rgba(15,23,42,0.22)] ring-1 ring-black/[0.07] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.035] hover:shadow-[0_4px_10px_rgba(15,23,42,0.08),0_24px_48px_-14px_rgba(63,163,235,0.28)] focus-within:ring-4 focus-within:ring-[#3FA3EB]/25 xl:mx-0">
        <div className="relative size-full overflow-hidden rounded-full bg-[#15171c]">
          {avatarSrc ? (
            <img
              alt="个人头像预览"
              className="block size-full rounded-full object-cover transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/avatar:scale-[1.04]"
              src={avatarSrc}
            />
          ) : (
            <GlitchAvatar />
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55),inset_0_4px_12px_rgba(15,23,42,0.08)]"
          />
          <span className="absolute inset-x-4 bottom-3 rounded-full bg-white/95 px-3 py-1.5 text-center text-[0.65rem] font-black uppercase tracking-[0.14em] text-[#141518] opacity-0 shadow-[0_12px_32px_rgba(20,16,10,0.18)] transition group-hover/profile:opacity-100 group-focus-within/profile:opacity-100">
            上传头像
          </span>
        </div>
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
        className="mt-8 text-[clamp(2.15rem,3vw,2.65rem)] font-extrabold leading-[1.06] tracking-[-0.045em] text-current outline-none transition focus:rounded focus:bg-[#3FA3EB]/[0.05] focus:ring-2 focus:ring-[#3FA3EB]/25"
        contentEditable
        onInput={(event) => updateProfile({ name: event.currentTarget.textContent ?? "" })}
        suppressContentEditableWarning
      >
        {profile.name}
      </h1>

      <div className="mt-4 flex justify-center xl:justify-start">
        <p className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/85 px-3.5 py-1.5 text-[0.76rem] font-bold tracking-[0.06em] text-[#5a5e6a] shadow-[0_2px_10px_-4px_rgba(15,23,42,0.08)] backdrop-blur-md">
          <span aria-hidden="true" className="mg-status-dot shrink-0" />
          <span
            className="min-w-[2ch] outline-none transition focus:rounded focus:bg-[#3FA3EB]/[0.08] focus:ring-2 focus:ring-[#3FA3EB]/25"
            contentEditable
            onInput={(event) => updateProfile({ location: event.currentTarget.textContent ?? "" })}
            suppressContentEditableWarning
          >
            {profile.location}
          </span>
        </p>
      </div>

      <p
        className="mx-auto mt-4 max-w-[30ch] text-[1.02rem] font-normal leading-[1.65] text-current opacity-75 outline-none transition focus:rounded focus:bg-[#3FA3EB]/[0.05] focus:ring-2 focus:ring-[#3FA3EB]/25 xl:mx-0"
        contentEditable
        onInput={(event) => updateProfile({ bio: event.currentTarget.textContent ?? "" })}
        suppressContentEditableWarning
      >
        {profile.bio}
      </p>

      {contacts.length ? (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 xl:justify-start">
          {contacts.map((contact, index) => (
            <span className="group/contact relative inline-flex" key={`contact-${index}`}>
              <span
                aria-label={`按钮 ${index + 1} 文案`}
                className={
                  index === 0
                    ? "inline-flex cursor-text items-center gap-1.5 rounded-full bg-[#141518] px-5 py-2.5 text-[0.84rem] font-bold tracking-[-0.01em] text-white shadow-[0_1px_2px_rgba(15,23,42,0.12),0_10px_24px_-10px_rgba(15,23,42,0.45)] outline-none transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#23252b] focus:ring-4 focus:ring-[#3FA3EB]/30"
                    : "inline-flex cursor-text items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/90 px-5 py-2.5 text-[0.84rem] font-bold tracking-[-0.01em] text-[#141518] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_20px_-10px_rgba(15,23,42,0.14)] backdrop-blur-md outline-none transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-black/[0.14] hover:bg-white focus:ring-4 focus:ring-[#3FA3EB]/25"
                }
                contentEditable
                onInput={(event) => updateContact(index, { label: event.currentTarget.textContent ?? "" })}
                suppressContentEditableWarning
              >
                {contact.label}
              </span>
              <button
                aria-label={`删除 ${contact.label}`}
                className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-[#141518] text-sm font-black leading-none text-white opacity-0 ring-2 ring-white shadow-[0_8px_18px_rgba(20,16,10,0.18)] transition group-hover/contact:opacity-100 group-focus-within/contact:opacity-100"
                onClick={() => removeContact(index)}
                type="button"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <details className="pointer-events-none absolute left-0 top-full z-30 mt-4 w-full rounded-[24px] border border-black/[0.07] bg-white/[0.88] p-3 text-left opacity-0 shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-md transition group-hover/profile:pointer-events-auto group-hover/profile:opacity-100 group-focus-within/profile:pointer-events-auto group-focus-within/profile:opacity-100">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <span className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#868c9b]">Profile buttons</span>
          <button
            className="rounded-full bg-[#141518] px-3 py-2 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-zinc-700"
            onClick={addContact}
            type="button"
          >
            添加按钮
          </button>
        </summary>

        {contacts.length ? (
          <div className="mt-3 grid gap-2">
            {contacts.map((contact, index) => (
              <div className="grid gap-2 rounded-[18px] bg-black/[0.025] p-2" key={`editor-contact-${index}`}>
                <input
                  aria-label={`按钮 ${index + 1} 链接`}
                  className="min-h-10 rounded-[13px] border border-black/10 bg-white/80 px-3 text-xs font-semibold text-[#141518] outline-none transition focus:border-[#3FA3EB] focus:ring-2 focus:ring-[#3FA3EB]/20"
                  onChange={(event) => updateContact(index, { href: event.target.value })}
                  placeholder="https://example.com"
                  value={contact.href}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-[18px] bg-black/[0.025] px-3 py-2 text-xs font-semibold text-[#868c9b]">还没有底部按钮，点击添加按钮创建。</p>
        )}
      </details>
    </section>
  );
}

function resolveAvatarUrl(avatarUrl?: string) {
  if (!avatarUrl) {
    return "";
  }

  const trimmed = avatarUrl.trim();

  if (!trimmed || trimmed.startsWith("//")) {
    return "";
  }

  if (/^(?:https?:\/\/|data:image\/|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(trimmed)) {
    return "";
  }

  return resolveAssetUrl(trimmed);
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
