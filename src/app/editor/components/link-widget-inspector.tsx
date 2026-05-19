"use client";

import { BackgroundField, ColorField, SelectField, TextField, fileToDataUrl, uploadFile } from "./inspector-fields";
import type { WidgetBackground } from "@/components/widgets/widget-shell";
import { builtinLogoOptions, getBuiltinLogoDefinition, isBuiltinLogoKey, type BuiltinLogoKey, type LinkLogo } from "@/lib/widgets/logo-registry";
import type { LinkWidgetProps } from "@/widgets/link";

type LinkWidgetInspectorProps = {
  onChange: (props: Record<string, unknown>) => void;
  props: unknown;
};

export function LinkWidgetInspector({ onChange, props }: LinkWidgetInspectorProps) {
  const value = normalizeLinkWidgetProps(props);
  const logoType = value.logo?.type ?? "builtin";

  return (
    <div className="grid gap-4">
      <TextField label="title" onChange={(title) => onChange({ title })} value={value.title} />
      <TextField label="description" onChange={(description) => onChange({ description })} value={value.description ?? ""} />
      <TextField label="href" onChange={(href) => onChange({ href })} type="url" value={value.href} />
      <ColorField label="brand color" onChange={(color) => onChange({ color })} value={value.color ?? "#ade0ff"} />

      <div className="grid gap-3 rounded-3xl border border-black/5 bg-zinc-50 p-3">
        <SelectField
          label="logo source"
          onChange={(type) => {
            if (type === "uploaded") {
              onChange({ logo: { type: "uploaded", url: "", alt: value.title } });
              return;
            }

            onChange({ logo: { type: "builtin", key: getBuiltinKey(value.logo) } });
          }}
          options={[
            { label: "Built-in", value: "builtin" },
            { label: "Uploaded", value: "uploaded" },
          ]}
          value={logoType}
        />

        {logoType === "builtin" ? (
          <SelectField
            label="built-in logo"
            onChange={(key) => {
              const nextKey = isBuiltinLogoKey(key) ? key : "website";
              const definition = getBuiltinLogoDefinition(nextKey);

              onChange({ logo: { type: "builtin", key: nextKey }, color: definition?.color ?? value.color });
            }}
            options={builtinLogoOptions}
            value={getBuiltinKey(value.logo)}
          />
        ) : (
          <UploadedLogoFields logo={value.logo} onChange={onChange} title={value.title} />
        )}
      </div>

      <BackgroundField label="background" onChange={(background) => onChange({ background })} value={value.background ?? { type: "theme" }} />
    </div>
  );
}

function UploadedLogoFields({ logo, onChange, title }: { logo?: LinkLogo; onChange: (props: Record<string, unknown>) => void; title: string }) {
  const uploadedLogo = logo?.type === "uploaded" ? logo : { type: "uploaded", url: "", alt: title };

  return (
    <div className="grid gap-3">
      <label className="grid gap-1.5 text-sm font-bold capitalize text-zinc-700">
        upload logo
        <input
          accept="image/svg+xml,image/png,image/jpeg,image/webp"
          className="min-h-11 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-zinc-950 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-zinc-950 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white focus:border-[#7c5cff] focus:ring-2 focus:ring-[#7c5cff]/20"
          onChange={async (event) => {
            const file = uploadFile(event);

            if (!file) {
              return;
            }

            onChange({ logo: { ...uploadedLogo, url: await fileToDataUrl(file), alt: uploadedLogo.alt || title } });
          }}
          type="file"
        />
      </label>
      <TextField label="logo alt" onChange={(alt) => onChange({ logo: { ...uploadedLogo, alt } })} value={uploadedLogo.alt ?? title} />
      {uploadedLogo.url ? <p className="text-xs font-medium leading-5 text-zinc-500">Uploaded logo is saved in the widget JSON as a data URL.</p> : null}
    </div>
  );
}

function normalizeLinkWidgetProps(value: unknown): LinkWidgetProps {
  const props = asRecord(value);
  const title = stringValue(props.title, "Link");
  const logo = normalizeLogo(props.logo, title);

  return {
    title,
    description: stringValue(props.description, "@handle or address"),
    href: stringValue(props.href, "#"),
    logo,
    color: stringValue(props.color, logo.type === "builtin" ? getBuiltinLogoDefinition(logo.key)?.color ?? "#ade0ff" : "#ade0ff"),
    background: normalizeBackground(props.background),
  };
}

function normalizeLogo(value: unknown, title: string): LinkLogo {
  const logo = asRecord(value);

  if (logo.type === "uploaded") {
    return { type: "uploaded", url: typeof logo.url === "string" ? logo.url : "", alt: typeof logo.alt === "string" ? logo.alt : title };
  }

  if (logo.type === "builtin" && isBuiltinLogoKey(logo.key)) {
    return { type: "builtin", key: logo.key };
  }

  return { type: "builtin", key: "website" };
}

function normalizeBackground(value: unknown): WidgetBackground {
  const background = asRecord(value);

  if (background.type === "solid" && typeof background.value === "string") {
    return { type: "solid", value: background.value };
  }

  if (background.type === "gradient" && typeof background.from === "string" && typeof background.to === "string") {
    return { type: "gradient", from: background.from, to: background.to, angle: typeof background.angle === "number" ? background.angle : 180 };
  }

  return { type: "theme" };
}

function getBuiltinKey(logo?: LinkLogo): BuiltinLogoKey {
  return logo?.type === "builtin" ? logo.key : "website";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}
