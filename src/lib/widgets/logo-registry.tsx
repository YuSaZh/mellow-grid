import type { ReactNode } from "react";

export type BuiltinLogoKey =
  | "figma"
  | "github"
  | "x"
  | "linkedin"
  | "dribbble"
  | "email"
  | "blog"
  | "coffee"
  | "website"
  | "medium"
  | "pinterest"
  | "discord"
  | "gumroad"
  | "stack"
  | "instagram"
  | "reddit";

export type LinkLogo = { type: "builtin"; key: BuiltinLogoKey } | { type: "uploaded"; url: string; alt?: string };

type BuiltinLogoDefinition = {
  color: string;
  label: string;
  render: (props: { color?: string }) => ReactNode;
};

export const builtinLogoRegistry: Record<BuiltinLogoKey, BuiltinLogoDefinition> = {
  figma: {
    color: "#A259FF",
    label: "Figma",
    render: () => (
      <svg aria-hidden="true" className="size-full" viewBox="0 0 48 48">
        <path d="M19 4h7a7 7 0 1 1 0 14h-7V4Z" fill="#FF7262" />
        <path d="M19 18h7a7 7 0 1 1 0 14h-7V18Z" fill="#A259FF" />
        <path d="M5 39a7 7 0 0 1 7-7h7v7a7 7 0 1 1-14 0Z" fill="#0ACF83" />
        <path d="M5 25a7 7 0 0 1 7-7h7v14h-7a7 7 0 0 1-7-7Z" fill="#1ABCFE" />
        <path d="M5 11a7 7 0 0 1 7-7h7v14h-7a7 7 0 0 1-7-7Z" fill="#F24E1E" />
      </svg>
    ),
  },
  github: {
    color: "#F0F6FC",
    label: "GitHub",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 48 48">
        <path
          d="M24 5.5c-10.5 0-19 8.5-19 19 0 8.4 5.4 15.5 13 18 .9.2 1.2-.4 1.2-.9v-3.4c-5.3 1.2-6.4-2.2-6.4-2.2-.8-2.1-2.1-2.7-2.1-2.7-1.7-1.2.1-1.1.1-1.1 1.9.1 2.9 2 2.9 2 1.7 2.9 4.4 2 5.5 1.5.2-1.2.7-2 1.2-2.5-4.2-.5-8.7-2.1-8.7-9.4 0-2.1.7-3.8 2-5.1-.2-.5-.9-2.5.2-5.1 0 0 1.6-.5 5.2 2a18 18 0 0 1 9.6 0c3.6-2.5 5.2-2 5.2-2 1.1 2.6.4 4.6.2 5.1 1.2 1.3 2 3 2 5.1 0 7.3-4.5 8.9-8.7 9.4.7.6 1.3 1.7 1.3 3.5v5c0 .5.3 1.1 1.3.9a19 19 0 0 0 13-18c0-10.5-8.5-19-19-19Z"
          fill={color || "currentColor"}
        />
      </svg>
    ),
  },
  x: {
    color: "#F5F5F5",
    label: "X",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" viewBox="0 0 48 48">
        <path d="M31.6 10h5.5L27 21.6 39 38h-9.4l-7.4-9.7L13.8 38H8.3l10.8-12.4L7.6 10h9.6l6.7 8.9L31.6 10Zm-1.9 25.1h3L15.5 12.7h-3.2l17.4 22.4Z" fill={color || "currentColor"} />
      </svg>
    ),
  },
  medium: {
    color: "#1C1C1C",
    label: "Medium",
    render: ({ color }) => <TextLogo color={color} text="M" />,
  },
  pinterest: {
    color: "#E60023",
    label: "Pinterest",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" viewBox="0 0 48 48">
        <path d="M24 5C13.5 5 8 12.1 8 19.8c0 5.1 2.8 9.1 7.2 10.7.8.3 1.2 0 1.4-.8l.5-2.1c.2-.7.1-1-.4-1.6-1.4-1.6-2.3-3.5-2.3-6.4 0-7.4 5.5-12.6 14-12.6 7.6 0 12.4 4.6 12.4 11.5 0 8.4-4.2 14.3-9.8 14.3-3 0-5.2-2.5-4.5-5.5.9-3.6 2.5-7.4 2.5-10 0-2.3-1.2-4.2-3.8-4.2-3 0-5.4 3.1-5.4 7.3 0 2.7.9 4.5.9 4.5l-3.7 15.7c-.6 2.5-.4 5.9-.1 8.2.1.7 1 .9 1.4.3 1.2-1.7 3.1-4.9 3.8-7.4l1.8-7c1 1.9 3.8 3.5 6.8 3.5 9 0 15.5-8.3 15.5-18.6C46 11.8 39.1 5 24 5Z" fill={color || "currentColor"} />
      </svg>
    ),
  },
  linkedin: {
    color: "#0A66C2",
    label: "LinkedIn",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" viewBox="0 0 48 48">
        <path d="M10.5 8h27A2.5 2.5 0 0 1 40 10.5v27a2.5 2.5 0 0 1-2.5 2.5h-27A2.5 2.5 0 0 1 8 37.5v-27A2.5 2.5 0 0 1 10.5 8Z" fill={color || "currentColor"} />
        <path d="M17.4 20.4H13V35h4.4V20.4Zm.3-4.5c0-1.4-1.1-2.5-2.5-2.5s-2.6 1.1-2.6 2.5 1.1 2.5 2.5 2.5h.1c1.4 0 2.5-1.1 2.5-2.5ZM35 26.6c0-4.4-2.3-6.5-5.4-6.5-2.5 0-3.6 1.4-4.2 2.3v-2h-4.4c.1 1.3 0 14.6 0 14.6h4.4v-8.2c0-.4 0-.9.2-1.2.3-.9 1.1-1.8 2.4-1.8 1.7 0 2.4 1.3 2.4 3.2v8H35v-8.4Z" fill="#fff" />
      </svg>
    ),
  },
  discord: {
    color: "#5865F2",
    label: "Discord",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" viewBox="0 0 48 48">
        <path d="M36.8 12.1A31 31 0 0 0 29 9.7l-.8 1.7a28.9 28.9 0 0 0-8.6 0l-.8-1.7a31 31 0 0 0-7.8 2.4C6.1 19.3 4.8 26.4 5.4 33.4a31.5 31.5 0 0 0 9.6 4.9l2.1-3.4a20 20 0 0 1-3.3-1.6l.8-.6a22.2 22.2 0 0 0 18.8 0l.8.6c-1 .6-2.1 1.1-3.3 1.6l2.1 3.4a31.5 31.5 0 0 0 9.6-4.9c.8-8.2-1.4-15.2-5.8-21.3ZM18.3 29.1c-1.9 0-3.4-1.7-3.4-3.8s1.5-3.8 3.4-3.8 3.5 1.7 3.4 3.8c0 2.1-1.5 3.8-3.4 3.8Zm11.4 0c-1.9 0-3.4-1.7-3.4-3.8s1.5-3.8 3.4-3.8 3.5 1.7 3.4 3.8c0 2.1-1.5 3.8-3.4 3.8Z" fill={color || "currentColor"} />
      </svg>
    ),
  },
  dribbble: {
    color: "#EA4C89",
    label: "Dribbble",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="17" fill={color || "currentColor"} />
        <path d="M10.5 22.8c7.3.2 14-1.1 20.3-4.1M18.3 8.7c5.1 6.2 8.9 15.9 10.5 30.2M14.6 35.7c4.5-7.4 11.4-11.5 22-12.5M35.7 14.5c-3.6 4.4-9.6 7.9-18.9 9.7" stroke="#fff" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
    ),
  },
  gumroad: {
    color: "#FF90E8",
    label: "Gumroad",
    render: ({ color }) => <TextLogo color={color} text="G" />,
  },
  stack: {
    color: "#F48024",
    label: "Stack Overflow",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" viewBox="0 0 48 48">
        <path d="M14 36h20v4H14v-4Zm1-8 19 4 .8-3.9-19-4-.8 3.9Zm2.5-9.2 17.6 8.3 1.7-3.6-17.6-8.3-1.7 3.6Zm5-8.7L38 22.2l2.5-3.1L25 7l-2.5 3.1ZM14 30h20v4H14v-4Z" fill={color || "currentColor"} />
      </svg>
    ),
  },
  instagram: {
    color: "#E1306C",
    label: "Instagram",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 48 48">
        <rect height="30" rx="9" stroke={color || "currentColor"} strokeWidth="4" width="30" x="9" y="9" />
        <circle cx="24" cy="24" r="7" stroke={color || "currentColor"} strokeWidth="4" />
        <circle cx="33" cy="15" fill={color || "currentColor"} r="2" />
      </svg>
    ),
  },
  reddit: {
    color: "#FF4500",
    label: "Reddit",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" viewBox="0 0 48 48">
        <path d="M37.8 19.9c-1.4 0-2.6.6-3.4 1.5-2.5-1.7-5.9-2.8-9.6-2.9l1.7-7.7 5.3 1.1a3.7 3.7 0 1 0 .4-2l-6.3-1.3c-.5-.1-1 .2-1.1.7l-2 9.2c-3.8.1-7.2 1.2-9.8 2.9a4.6 4.6 0 1 0-5.1 7.4 8.2 8.2 0 0 0-.1 1.2c0 6.4 7.3 11.6 16.2 11.6S40.2 36.4 40.2 30c0-.4 0-.8-.1-1.2a4.6 4.6 0 0 0-2.3-8.9ZM17 28.1a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Zm13.2 7.1c-1.8 1.8-4.9 2-6.2 2s-4.4-.2-6.2-2a1 1 0 0 1 1.4-1.4c1.1 1.1 3.3 1.4 4.8 1.4s3.7-.3 4.8-1.4a1 1 0 1 1 1.4 1.4Zm.8-7.1a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z" fill={color || "currentColor"} />
      </svg>
    ),
  },
  email: {
    color: "#ADE0FF",
    label: "Email",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 48 48">
        <rect height="28" rx="6" stroke={color || "currentColor"} strokeWidth="4" width="34" x="7" y="10" />
        <path d="m10 15 14 11 14-11" stroke={color || "currentColor"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      </svg>
    ),
  },
  blog: {
    color: "#ADE0FF",
    label: "Blog",
    render: ({ color }) => <TextLogo color={color} text="BL" />,
  },
  coffee: {
    color: "#FFDD99",
    label: "Coffee",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 48 48">
        <path d="M12 17h20v10a10 10 0 0 1-20 0V17Z" fill={color || "currentColor"} />
        <path d="M32 20h2a5 5 0 0 1 0 10h-2" stroke={color || "currentColor"} strokeWidth="4" />
        <path d="M13 38h22" stroke={color || "currentColor"} strokeLinecap="round" strokeWidth="4" />
      </svg>
    ),
  },
  website: {
    color: "#ADE0FF",
    label: "Website",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="17" stroke={color || "currentColor"} strokeWidth="4" />
        <path d="M8 24h32M24 7c4 4.6 6 10.2 6 17s-2 12.4-6 17c-4-4.6-6-10.2-6-17s2-12.4 6-17Z" stroke={color || "currentColor"} strokeLinecap="round" strokeWidth="3" />
      </svg>
    ),
  },
};

export const builtinLogoOptions = Object.entries(builtinLogoRegistry).map(([key, definition]) => ({ label: definition.label, value: key as BuiltinLogoKey }));

export function getBuiltinLogoDefinition(key: string | undefined) {
  return key && isBuiltinLogoKey(key) ? builtinLogoRegistry[key] : undefined;
}

export function isBuiltinLogoKey(value: unknown): value is BuiltinLogoKey {
  return typeof value === "string" && value in builtinLogoRegistry;
}

export function getBuiltinLogoKeyFromLabel(label: string): BuiltinLogoKey {
  const normalized = label.toLowerCase();

  if (normalized.includes("figma")) return "figma";
  if (normalized.includes("github")) return "github";
  if (normalized.includes("medium")) return "medium";
  if (normalized.includes("pinterest")) return "pinterest";
  if (normalized.includes("twitter") || normalized === "x") return "x";
  if (normalized.includes("linkedin")) return "linkedin";
  if (normalized.includes("dribbble")) return "dribbble";
  if (normalized.includes("discord")) return "discord";
  if (normalized.includes("gumroad")) return "gumroad";
  if (normalized.includes("stack")) return "stack";
  if (normalized.includes("instagram")) return "instagram";
  if (normalized.includes("reddit")) return "reddit";
  if (normalized.includes("mail") || normalized.includes("email")) return "email";
  if (normalized.includes("blog")) return "blog";
  if (normalized.includes("coffee")) return "coffee";

  return "website";
}

function TextLogo({ color, text }: { color?: string; text: string }) {
  return (
    <span className="grid size-full place-items-center rounded-[14px] bg-[linear-gradient(180deg,#ffffff_0%,#ade0ff_100%)] text-base font-black uppercase leading-none text-[#171717]" style={{ color: color || undefined }}>
      {text}
    </span>
  );
}
