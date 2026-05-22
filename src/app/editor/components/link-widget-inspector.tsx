"use client";

import { BackgroundField, BackgroundPresetDots, SelectField, TextField, fileToDataUrl, uploadFile } from "./inspector-fields";
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
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField label="主标题 (Title)" onChange={(title) => onChange({ title })} value={value.title} />
      <TextField label="副标题 (Handle)" onChange={(description) => onChange({ description })} value={value.description ?? ""} />
      <div className="sm:col-span-2">
        <TextField label="跳转链接 (URL)" onChange={(href) => onChange({ href })} type="url" value={value.href} />
      </div>

      <SelectField
          label="Logo source"
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
            label="饰板图标 (Icon)"
            onChange={(key) => {
              const nextKey = isBuiltinLogoKey(key) ? key : "website";
              const definition = getBuiltinLogoDefinition(nextKey);

              onChange({ logo: { type: "builtin", key: nextKey }, color: definition?.color ?? value.color });
            }}
            options={builtinLogoOptions}
            value={getBuiltinKey(value.logo)}
          />
        ) : (
          <div className="sm:col-span-2">
            <UploadedLogoFields logo={value.logo} onChange={onChange} title={value.title} />
          </div>
        )}

      <div className="sm:col-span-2">
        <BackgroundPresetDots onChange={(background) => onChange({ background })} value={value.background ?? { type: "theme" }} />
      </div>
      <details className="sm:col-span-2 rounded-[18px] border border-black/[0.06] bg-black/[0.02] p-3">
        <summary className="cursor-pointer select-none text-[0.75rem] font-bold uppercase tracking-[0.04em] text-[#72727a]">高级背景模式</summary>
        <div className="mt-3">
          <BackgroundField label="背景模式" onChange={(background) => onChange({ background })} value={value.background ?? { type: "theme" }} />
        </div>
      </details>
    </div>
  );
}

function UploadedLogoFields({ logo, onChange, title }: { logo?: LinkLogo; onChange: (props: Record<string, unknown>) => void; title: string }) {
  const uploadedLogo = logo?.type === "uploaded" ? logo : { type: "uploaded", url: "", alt: title };

  return (
    <div className="grid gap-3">
      <label className="grid gap-1.5">
        <span className="text-[0.75rem] font-bold uppercase tracking-[0.04em] text-[#72727a]">Upload logo</span>
        <input
          accept="image/svg+xml,image/png,image/jpeg,image/webp"
          className="min-h-11 rounded-[14px] border-[1.5px] border-black/10 bg-black/[0.02] px-4 py-3 text-sm font-medium text-[#121214] outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[#121214] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white focus:border-[#3FA3EB] focus:bg-white focus:ring-4 focus:ring-[#3FA3EB]/[0.12]"
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
