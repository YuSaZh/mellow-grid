import type { PageProfile } from "@/lib/page-config/types";

export function ProfilePanel({ props }: { props: PageProfile }) {
  const description = [props.location, props.bio].filter(Boolean).join(props.location && props.bio ? " · " : "");

  return (
    <section className="max-w-[412px] text-left">
      <div
        className="grid size-[184px] place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_32%_24%,#65615b_0%,#252321_48%,#0f0f0f_100%)] bg-cover bg-center text-5xl font-black text-white shadow-[0_18px_45px_rgba(20,16,10,0.10)]"
        style={props.avatarUrl ? { backgroundImage: `url(${props.avatarUrl})` } : undefined}
      >
        {props.avatarUrl ? null : props.name.slice(0, 1)}
      </div>

      <h1 className="mt-8 text-[44px] font-bold leading-[1.2] tracking-[-0.045em] text-black">{props.name}</h1>
      {description ? <p className="mt-3 text-[20px] leading-[28px] tracking-[-0.035em] text-[#565656]">{description}</p> : null}

      {props.contacts?.length ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {props.contacts.map((contact) => (
            <a
              className="rounded-2xl bg-zinc-100 px-5 py-3 text-sm font-bold uppercase tracking-[-0.02em] text-zinc-700 shadow-[0_10px_28px_rgba(20,16,10,0.08)] transition hover:bg-zinc-200"
              href={contact.href}
              key={`${contact.label}-${contact.href}`}
            >
              {contact.label}
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}
