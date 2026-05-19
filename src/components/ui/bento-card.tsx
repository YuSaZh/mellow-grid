import type { PropsWithChildren } from "react";
import { WidgetShell } from "@/components/widgets/widget-shell";

type BentoCardProps = PropsWithChildren<{
  className?: string;
}>;

export function BentoCard({ children, className = "" }: BentoCardProps) {
  return <WidgetShell className={className}>{children}</WidgetShell>;
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
