"use client";

import type { ChangeEvent } from "react";
import type { WidgetBackground } from "@/components/widgets/widget-shell";

export type EditableLink = {
  label: string;
  href: string;
};

type TextFieldProps = {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
};

export function TextField({ label, onChange, placeholder, type = "text", value }: TextFieldProps) {
  return (
    <label className="grid gap-1.5 text-sm font-bold capitalize text-zinc-700">
      {label}
      <input
        className="min-h-11 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-zinc-950 outline-none transition focus:border-[#7c5cff] focus:ring-2 focus:ring-[#7c5cff]/20"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

export function TextAreaField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-bold capitalize text-zinc-700">
      {label}
      <textarea
        className="min-h-32 resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium leading-6 text-zinc-950 outline-none transition focus:border-[#7c5cff] focus:ring-2 focus:ring-[#7c5cff]/20"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

export function SelectField({ label, onChange, options, value }: SelectFieldProps) {
  return (
    <label className="grid gap-1.5 text-sm font-bold capitalize text-zinc-700">
      {label}
      <select
        className="min-h-11 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-zinc-950 outline-none transition focus:border-[#7c5cff] focus:ring-2 focus:ring-[#7c5cff]/20"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ColorField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-bold capitalize text-zinc-700">
      {label}
      <span className="grid grid-cols-[3rem_1fr] overflow-hidden rounded-2xl border border-black/10 bg-white focus-within:border-[#7c5cff] focus-within:ring-2 focus-within:ring-[#7c5cff]/20">
        <input className="h-full min-h-11 w-full cursor-pointer border-0 bg-transparent p-1" onChange={(event) => onChange(event.target.value)} type="color" value={normalizeColor(value)} />
        <input className="min-h-11 border-0 px-4 py-3 text-sm font-medium text-zinc-950 outline-none" onChange={(event) => onChange(event.target.value)} value={value} />
      </span>
    </label>
  );
}

export function BackgroundField({ label, onChange, value }: { label: string; onChange: (value: WidgetBackground) => void; value: WidgetBackground }) {
  const background = normalizeBackground(value);

  return (
    <div className="grid gap-3 rounded-3xl border border-black/5 bg-zinc-50 p-3">
      <SelectField
        label={label}
        onChange={(type) => {
          if (type === "solid") {
            onChange({ type: "solid", value: "#313030" });
            return;
          }

          if (type === "gradient") {
            onChange({ type: "gradient", from: "#313030", to: "#121313", angle: 180 });
            return;
          }

          onChange({ type: "theme" });
        }}
        options={[
          { label: "Use theme", value: "theme" },
          { label: "Solid", value: "solid" },
          { label: "Gradient", value: "gradient" },
        ]}
        value={background.type}
      />
      {background.type === "solid" ? <ColorField label="background color" onChange={(nextValue) => onChange({ ...background, value: nextValue })} value={background.value} /> : null}
      {background.type === "gradient" ? (
        <div className="grid gap-3">
          <ColorField label="gradient from" onChange={(nextFrom) => onChange({ ...background, from: nextFrom })} value={background.from} />
          <ColorField label="gradient to" onChange={(nextTo) => onChange({ ...background, to: nextTo })} value={background.to} />
          <TextField label="gradient angle" onChange={(nextAngle) => onChange({ ...background, angle: Number.parseInt(nextAngle, 10) || 180 })} type="number" value={String(background.angle ?? 180)} />
        </div>
      ) : null}
    </div>
  );
}

export function LinksField({ label, onChange, value }: { label: string; onChange: (value: EditableLink[]) => void; value: unknown[] }) {
  const links = value.filter(isEditableLink);

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold capitalize text-zinc-700">{label}</span>
        <button
          className="min-h-11 rounded-full bg-zinc-950 px-4 text-xs font-bold text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#7c5cff]/40"
          onClick={() => onChange([...links, { label: "New link", href: "https://example.com" }])}
          type="button"
        >
          添加
        </button>
      </div>
      <div className="grid gap-3">
        {links.map((link, index) => (
          <div className="grid gap-3 rounded-3xl border border-black/5 bg-zinc-50 p-3" key={`${link.label}-${index}`}>
            <TextField label="Label" onChange={(nextLabel) => onChange(links.map((item, itemIndex) => (itemIndex === index ? { ...item, label: nextLabel } : item)))} value={link.label} />
            <TextField label="Href" onChange={(nextHref) => onChange(links.map((item, itemIndex) => (itemIndex === index ? { ...item, href: nextHref } : item)))} value={link.href} />
            <button
              className="min-h-11 justify-self-start rounded-full bg-red-50 px-4 text-xs font-bold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
              onClick={() => onChange(links.filter((_, itemIndex) => itemIndex !== index))}
              type="button"
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result ?? "")));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

export function isEditableLink(value: unknown): value is EditableLink {
  return typeof value === "object" && value !== null && "label" in value && "href" in value && typeof value.label === "string" && typeof value.href === "string";
}

export function stringProp(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export function uploadFile(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0] ?? null;
  event.target.value = "";

  return file;
}

function normalizeBackground(value: WidgetBackground): WidgetBackground {
  if (value.type === "solid") {
    return { type: "solid", value: value.value || "#313030" };
  }

  if (value.type === "gradient") {
    return { type: "gradient", from: value.from || "#313030", to: value.to || "#121313", angle: value.angle ?? 180 };
  }

  return { type: "theme" };
}

function normalizeColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : "#313030";
}
