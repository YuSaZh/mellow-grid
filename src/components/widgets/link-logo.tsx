import { IconEffect } from "./icon-effect";
import { resolveAssetUrl } from "@/lib/urls/asset-url";
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
    <IconEffect className={className} depth="clay" framed={framed}>
      <LogoContent color={color} logo={logo} title={title} />
    </IconEffect>
  );
}

function isRenderableLogo(logo?: LinkLogoValue) {
  if (logo?.type === "uploaded") {
    return Boolean(getSafeUploadedLogoUrl(logo.url));
  }

  if (logo?.type === "builtin") {
    return Boolean(getBuiltinLogoDefinition(logo.key));
  }

  return false;
}

function LogoContent({ color, logo, title }: Omit<LinkLogoProps, "className">) {
  if (logo?.type === "uploaded") {
    const resolvedUrl = getSafeUploadedLogoUrl(logo.url);

    if (resolvedUrl) {
      return <img alt={logo.alt || title} className="block size-full rounded-[12px] object-contain" loading="lazy" src={resolvedUrl} />;
    }
  }

  if (logo?.type === "builtin") {
    const definition = getBuiltinLogoDefinition(logo.key);

    if (definition) {
      return (
        <span className="grid size-full place-items-center" style={{ color: color || definition.color }}>
          {definition.render({ color: color || definition.color })}
        </span>
      );
    }
  }

  return (
    <span className="grid size-full place-items-center rounded-[14px] border border-current/15 bg-current/10 text-[0.95rem] font-extrabold uppercase leading-none tracking-[-0.02em] text-current shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
      {title.slice(0, 2)}
    </span>
  );
}

function getSafeUploadedLogoUrl(url?: string): string {
  if (!url) {
    return "";
  }

  const trimmed = url.trim();

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
