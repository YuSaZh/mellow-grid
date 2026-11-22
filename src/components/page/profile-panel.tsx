import type { PageProfile } from "@/lib/page-config/types";
import { resolveAssetUrl } from "@/lib/urls/asset-url";
import { sanitizeHref } from "@/lib/urls/safe-href";

export function ProfilePanel({ props }: { props: PageProfile }) {
  const avatarSrc = resolveAvatarUrl(props.avatarUrl);

  return (
    <section className="mg-fade-up max-w-[340px] text-inherit">
      <div className="group/avatar relative mx-auto size-[140px] rounded-full bg-white p-[3px] shadow-[0_1px_2px_rgba(15,23,42,0.06),0_18px_40px_-14px_rgba(15,23,42,0.22)] ring-1 ring-black/[0.07] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.035] hover:shadow-[0_4px_10px_rgba(15,23,42,0.08),0_24px_48px_-14px_rgba(63,163,235,0.28)] xl:mx-0">
        <div className="relative size-full overflow-hidden rounded-full bg-[#15171c]">
          {avatarSrc ? (
            <img
              alt={`${props.name} avatar`}
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
        </div>
      </div>

      <h1 className="mt-8 text-[clamp(2.15rem,3vw,2.65rem)] font-extrabold leading-[1.06] tracking-[-0.045em] text-current">{props.name}</h1>

      {props.location ? (
        <div className="mt-4 flex justify-center xl:justify-start">
          <p className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/85 px-3.5 py-1.5 text-[0.76rem] font-bold tracking-[0.06em] text-[#5a5e6a] shadow-[0_2px_10px_-4px_rgba(15,23,42,0.08)] backdrop-blur-md">
            <span aria-hidden="true" className="mg-status-dot shrink-0" />
            <span>{props.location}</span>
          </p>
        </div>
      ) : null}

      {props.bio ? <p className="mx-auto mt-4 max-w-[30ch] text-[1.02rem] font-normal leading-[1.65] text-current opacity-75 xl:mx-0">{props.bio}</p> : null}

      {props.contacts?.length ? (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 xl:justify-start">
          {props.contacts.map((contact, index) => {
            const href = resolveContactHref(contact.href);
            const className =
              index === 0
                ? "inline-flex items-center gap-1.5 rounded-full bg-[#141518] px-5 py-2.5 text-[0.84rem] font-bold tracking-[-0.01em] text-white shadow-[0_1px_2px_rgba(15,23,42,0.12),0_10px_24px_-10px_rgba(15,23,42,0.45)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#23252b] hover:shadow-[0_14px_28px_-10px_rgba(15,23,42,0.52)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3FA3EB]/30"
                : "inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/90 px-5 py-2.5 text-[0.84rem] font-bold tracking-[-0.01em] text-[#141518] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_20px_-10px_rgba(15,23,42,0.14)] backdrop-blur-md transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-black/[0.14] hover:bg-white hover:shadow-[0_12px_26px_-10px_rgba(15,23,42,0.18)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3FA3EB]/25";

            return href ? (
              <a className={className} href={href} key={`${contact.label}-${contact.href}-${index}`}>
                {contact.label}
              </a>
            ) : (
              <span className={className} key={`${contact.label}-${contact.href}-${index}`}>
                {contact.label}
              </span>
            );
          })}
        </div>
      ) : null}
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

function resolveContactHref(rawHref?: string) {
  const safe = sanitizeHref(rawHref);

  if (!safe) {
    return "";
  }

  if (safe.startsWith("?")) {
    return safe;
  }

  return resolveAssetUrl(safe);
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
