import type { PropsWithChildren } from "react";

type BentoCardProps = PropsWithChildren<{
  className?: string;
}>;

export function BentoCard({ children, className = "" }: BentoCardProps) {
  return (
    <section
      className={`h-full overflow-hidden rounded-[2rem] border border-black/5 bg-white/90 p-6 shadow-[0_22px_70px_rgba(20,16,10,0.12)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(20,16,10,0.16)] ${className}`}
    >
      {children}
    </section>
  );
}
