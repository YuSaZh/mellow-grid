import type { PageProfile } from "@/lib/page-config/types";
import { sanitizeHref } from "@/lib/urls/safe-href";

export function ProfilePanel({ props }: { props: PageProfile }) {
  return (
    <section className="max-w-[340px] text-inherit">
      <div className="relative mx-auto size-[140px] overflow-hidden rounded-full border border-[#d8d8de] bg-white p-[2px] shadow-[0_14px_34px_rgba(20,16,10,0.10),inset_1px_1px_0_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(20,16,10,0.06)] transition hover:scale-[1.03] xl:mx-0">
        {props.avatarUrl ? (
          <span aria-label={`${props.name} avatar`} className="block size-full rounded-full bg-cover bg-center" role="img" style={{ backgroundImage: `url(${props.avatarUrl})` }} />
        ) : (
          <GlitchAvatar />
        )}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.72),inset_0_4px_12px_rgba(20,16,10,0.10)]" />
      </div>

      <h1 className="mt-9 text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#111113]">{props.name}</h1>
      {props.location ? <p className="mt-4 text-[0.83rem] font-extrabold uppercase tracking-[0.16em] text-[#9b9ba4]">{props.location}</p> : null}
      {props.bio ? <p className="mt-3 text-[1.05rem] font-normal leading-[1.6] text-[#5d5d65]">{props.bio}</p> : null}

      {props.contacts?.length ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {props.contacts.map((contact) => {
            const href = sanitizeHref(contact.href);
            const className = "rounded-full bg-zinc-100 px-5 py-3 text-sm font-bold uppercase tracking-[-0.02em] text-zinc-700 shadow-[0_10px_28px_rgba(20,16,10,0.08)] transition hover:-translate-y-0.5 hover:bg-zinc-200";

            return href ? (
              <a className={className} href={href} key={`${contact.label}-${contact.href}`}>
                {contact.label}
              </a>
            ) : (
              <span className={className} key={`${contact.label}-${contact.href}`}>
                {contact.label}
              </span>
            );
          })}
        </div>
      ) : null}
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
