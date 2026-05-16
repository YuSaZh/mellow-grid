import type { PageProfile } from "@/lib/page-config/types";

export function ProfilePanel({ props }: { props: PageProfile }) {
  return (
    <section className="text-left">
      <div
        className="grid size-44 place-items-center overflow-hidden rounded-full bg-cover bg-center bg-zinc-950 text-5xl font-black text-white shadow-[0_18px_45px_rgba(20,16,10,0.12)]"
        style={props.avatarUrl ? { backgroundImage: `url(${props.avatarUrl})` } : undefined}
      >
        {props.avatarUrl ? null : props.name.slice(0, 1)}
      </div>

      <h1 className="mt-10 text-5xl font-black tracking-[-0.06em] text-zinc-950">{props.name}</h1>
      <p className="mt-5 max-w-[19rem] text-xl leading-7 tracking-[-0.04em] text-zinc-500">
        <span>{props.location}</span>
        {props.bio ? <span> · {props.bio}</span> : null}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-zinc-100 text-lg shadow-[0_10px_28px_rgba(20,16,10,0.08)]">⌂</span>
        {(props.contacts?.length ? props.contacts : [{ label: "Recommendations", href: "#" }]).map((contact) => (
          <a
            className="rounded-2xl bg-zinc-100 px-5 py-3 text-sm font-bold uppercase tracking-[-0.02em] text-zinc-700 shadow-[0_10px_28px_rgba(20,16,10,0.08)] transition hover:bg-zinc-200"
            href={contact.href}
            key={`${contact.label}-${contact.href}`}
          >
            {contact.label}
          </a>
        ))}
      </div>
    </section>
  );
}
