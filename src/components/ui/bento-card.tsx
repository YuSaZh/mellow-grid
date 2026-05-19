import type { PropsWithChildren } from "react";

type BentoCardProps = PropsWithChildren<{
  className?: string;
}>;

export function BentoCard({ children, className = "" }: BentoCardProps) {
  return (
    <section className={`relative h-full overflow-hidden rounded-[24px] border border-black/[0.08] bg-[linear-gradient(180deg,#313030_0%,#121313_100%)] shadow-[0_2px_3px_rgba(0,0,0,0.03)] ${className}`}>
      <div className="pointer-events-none absolute inset-px rounded-[23px] border border-white/[0.22] [mask-image:linear-gradient(180deg,#000_0%,transparent_100%)]" />
      {children}
    </section>
  );
}

export function BentoIcon({ children, className = "" }: BentoCardProps) {
  return (
    <span
      className={`grid size-12 place-items-center overflow-hidden rounded-[14px] bg-[linear-gradient(180deg,#ffffff_0%,#ade0ff_100%)] text-base font-black uppercase leading-none text-[#171717] shadow-[inset_1px_1px_1px_#ffffff,inset_-0.5px_-1px_1px_#7ebee5] ${className}`}
    >
      {children}
    </span>
  );
}
