import { IconEffect } from "./icon-effect";
import { getBuiltinLogoDefinition, type LinkLogo as LinkLogoValue } from "@/lib/widgets/logo-registry";

type LinkLogoProps = {
  className?: string;
  color?: string;
  logo?: LinkLogoValue;
  title: string;
};

export function LinkLogo({ className = "", color, logo, title }: LinkLogoProps) {
  const framed = !isRenderableLogo(logo);

  return (
    <IconEffect className={className} depth="figma" framed={framed}>
      <LogoContent color={color} logo={logo} title={title} />
    </IconEffect>
  );
}

function isRenderableLogo(logo?: LinkLogoValue) {
  if (logo?.type === "uploaded") {
    return Boolean(logo.url);
  }

  if (logo?.type === "builtin") {
    return Boolean(getBuiltinLogoDefinition(logo.key));
  }

  return false;
}

function LogoContent({ color, logo, title }: Omit<LinkLogoProps, "className">) {
  if (logo?.type === "uploaded" && logo.url) {
    return <span aria-label={logo.alt || title} className="size-full bg-contain bg-center bg-no-repeat" role="img" style={{ backgroundImage: `url(${logo.url})` }} />;
  }

  if (logo?.type === "builtin") {
    const definition = getBuiltinLogoDefinition(logo.key);

    if (definition) {
      return <span className="grid size-full place-items-center" style={{ color: color || definition.color }}>{definition.render({ color: color || definition.color })}</span>;
    }
  }

  return (
    <span className="grid size-full place-items-center rounded-[14px] bg-[linear-gradient(180deg,#ffffff_0%,#ade0ff_100%)] text-base font-black uppercase leading-none text-[#171717]">
      {title.slice(0, 2)}
    </span>
  );
}
