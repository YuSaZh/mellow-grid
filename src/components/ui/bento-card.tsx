import type { PropsWithChildren } from "react";

type BentoCardProps = PropsWithChildren<{
  className?: string;
}>;

export function BentoCard({ children, className = "" }: BentoCardProps) {
  return (
    <section className={`relative h-full overflow-hidden rounded-[2rem] border border-black/5 bg-white/90 p-5 backdrop-blur transition-colors duration-300 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[2rem] before:shadow-[0_22px_70px_rgba(20,16,10,0.12)] ${className}`}>
      {children}
    </section>
  );
}
