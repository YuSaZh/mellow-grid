import type { PropsWithChildren } from "react";

type IconEffectProps = PropsWithChildren<{
  className?: string;
  depth?: "soft" | "figma";
  framed?: boolean;
}>;

const FIGMA_SHADOW_LAYERS = [
  { offset: 52, blur: 48, opacity: 0.05 },
  { offset: 48, blur: 44, opacity: 0.1 },
  { offset: 44, blur: 40, opacity: 0.15 },
  { offset: 40, blur: 40, opacity: 0.2 },
  { offset: 32, blur: 32, opacity: 0.25 },
  { offset: 24, blur: 28, opacity: 0.3 },
  { offset: 16, blur: 24, opacity: 0.35 },
  { offset: 15, blur: 24, opacity: 0.4 },
  { offset: 11, blur: 16, opacity: 0.45 },
  { offset: 7, blur: 10, opacity: 0.5 },
  { offset: 5, blur: 6, opacity: 0.55 },
  { offset: 3, blur: 4, opacity: 0.6 },
  { offset: 2, blur: 3, opacity: 0.6 },
  { offset: 1, blur: 2, opacity: 0.6 },
  { offset: 0.5, blur: 1, opacity: 0.6 },
];

const SOFT_SHADOW_LAYERS = [
  { offset: 5, blur: 6, opacity: 0.18 },
  { offset: 2, blur: 3, opacity: 0.22 },
  { offset: 0.5, blur: 1, opacity: 0.28 },
];

export function IconEffect({ children, className = "", depth = "figma", framed = false }: IconEffectProps) {
  const layers = depth === "figma" ? FIGMA_SHADOW_LAYERS : SOFT_SHADOW_LAYERS;
  const contentClassName = framed
    ? "relative z-10 grid size-12 place-items-center overflow-hidden rounded-[14px]"
    : "relative z-10 grid size-12 place-items-center overflow-visible";
  const contentStyle = framed
    ? { boxShadow: "inset -0.5px -1px 1px rgba(0, 0, 0, 0.4), inset 1px 1px 1px rgba(255, 255, 255, 0.9)" }
    : undefined;

  return (
    <span className={`relative isolate grid size-12 place-items-center overflow-visible ${className}`}>
      {layers.map((layer) => (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid size-12 place-items-center text-black"
          key={`${layer.offset}-${layer.blur}-${layer.opacity}`}
          style={{
            filter: `brightness(0) blur(${layer.blur}px)`,
            opacity: layer.opacity,
            transform: `translate(${layer.offset}px, ${layer.offset}px)`,
          }}
        >
          {children}
        </span>
      ))}
      <span className={contentClassName} style={contentStyle}>
        {children}
      </span>
    </span>
  );
}
