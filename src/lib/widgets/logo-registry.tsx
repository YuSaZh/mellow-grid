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
        <path d="M17.5 4.5H24v13h-6.5a6.5 6.5 0 1 1 0-13Z" fill="#F24E1E" />
        <path d="M24 4.5h6.5a6.5 6.5 0 1 1 0 13H24v-13Z" fill="#FF7262" />
        <path d="M17.5 17.5H24v13h-6.5a6.5 6.5 0 1 1 0-13Z" fill="#A259FF" />
        <circle cx="30.5" cy="24" fill="#1ABCFE" r="6.5" />
        <path d="M17.5 30.5H24V37a6.5 6.5 0 1 1-6.5-6.5Z" fill="#0ACF83" />
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
        <path
          d="M32.3 10h5.5L27.7 21.6 39.7 38h-9.4l-7.4-9.7L14.5 38H9l10.8-12.4L8.3 10h9.6l6.7 8.9L32.3 10Zm-1.9 25.1h3L16.2 12.7H13l17.4 22.4Z"
          fill={color || "currentColor"}
        />
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
        <path
          d="M24 5C13.5 5 6 12.3 6 20.5c0 4.9 2.6 8.8 6.8 10.4.7.3 1.1 0 1.3-.8l.5-2c.2-.7.1-1-.4-1.6-1.3-1.5-2.1-3.4-2.1-6.1 0-7.2 5.4-12.2 13.4-12.2 7.2 0 11.8 4.4 11.8 11 0 8-4 13.7-9.4 13.7-2.9 0-5-2.4-4.3-5.3.8-3.4 2.4-7.1 2.4-9.6 0-2.2-1.2-4-3.7-4-2.9 0-5.2 3-5.2 7 0 2.6.9 4.3.9 4.3l-3.5 15c-.6 2.4-.4 5.5-.1 7.6.1.6.9.8 1.3.2 1.2-1.6 3-4.6 3.7-7l1.7-6.6c1 1.8 3.6 3.3 6.5 3.3 8.6 0 14.8-7.9 14.8-17.8C43.4 11.6 36.8 5 24 5Z"
          fill={color || "currentColor"}
        />
      </svg>
    ),
  },
  linkedin: {
    color: "#0A66C2",
    label: "LinkedIn",
    render: ({ color }) => {
      const fill = color || "currentColor";
      const glyphFill = getHexLuminance(color) > 0.78 ? "#141518" : "#FFFFFF";

      return (
        <svg aria-hidden="true" className="size-full" viewBox="0 0 48 48">
          <rect fill={fill} height="34" rx="7" width="34" x="7" y="7" />
          <path
            d="M17.2 20.4H12.8V35h4.4V20.4Zm.2-4.6c0-1.4-1.1-2.5-2.5-2.5s-2.5 1.1-2.5 2.5 1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5ZM35.2 26.6c0-4.4-2.3-6.5-5.5-6.5-2.5 0-3.6 1.4-4.2 2.3v-2h-4.4V35h4.4v-8.2c0-.4 0-.9.2-1.2.3-.9 1.1-1.8 2.4-1.8 1.7 0 2.5 1.3 2.5 3.2V35h4.6v-8.4Z"
            fill={glyphFill}
          />
        </svg>
      );
    },
  },
  discord: {
    color: "#5865F2",
    label: "Discord",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" viewBox="0 0 48 48">
        <path
          d="M36.8 12.1A31 31 0 0 0 29 9.7l-.8 1.7a28.9 28.9 0 0 0-8.6 0l-.8-1.7a31 31 0 0 0-7.8 2.4C6.1 19.3 4.8 26.4 5.4 33.4a31.5 31.5 0 0 0 9.6 4.9l2.1-3.4a20 20 0 0 1-3.3-1.6l.8-.6a22.2 22.2 0 0 0 18.8 0l.8.6c-1 .6-2.1 1.1-3.3 1.6l2.1 3.4a31.5 31.5 0 0 0 9.6-4.9c.8-8.2-1.4-15.2-5.8-21.3ZM18.3 29.1c-1.9 0-3.4-1.7-3.4-3.8s1.5-3.8 3.4-3.8 3.5 1.7 3.4 3.8c0 2.1-1.5 3.8-3.4 3.8Zm11.4 0c-1.9 0-3.4-1.7-3.4-3.8s1.5-3.8 3.4-3.8 3.5 1.7 3.4 3.8c0 2.1-1.5 3.8-3.4 3.8Z"
          fill={color || "currentColor"}
        />
      </svg>
    ),
  },
  dribbble: {
    color: "#EA4C89",
    label: "Dribbble",
    render: ({ color }) => {
      const stroke = color || "currentColor";

      return (
        <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="16.5" stroke={stroke} strokeWidth="3.4" />
          <path
            d="M17.3 8.9c5.2 6.8 9.2 16.4 11.8 30.8M7.5 23.4c9.2.2 19.6-1.4 30.2-8.6M12.8 36.1c5.2-8.4 13.4-12.1 27.5-9.8"
            stroke={stroke}
            strokeLinecap="round"
            strokeWidth="3.1"
          />
        </svg>
      );
    },
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
        <path
          d="M14 36h20v4H14v-4Zm1-8 19 4 .8-3.9-19-4-.8 3.9Zm2.5-9.2 17.6 8.3 1.7-3.6-17.6-8.3-1.7 3.6Zm5-8.7L38 22.2l2.5-3.1L25 7l-2.5 3.1ZM14 30h20v4H14v-4Z"
          fill={color || "currentColor"}
        />
      </svg>
    ),
  },
  instagram: {
    color: "#E1306C",
    label: "Instagram",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 48 48">
        <rect height="32" rx="9.5" stroke={color || "currentColor"} strokeWidth="3.6" width="32" x="8" y="8" />
        <circle cx="24" cy="24" r="7.4" stroke={color || "currentColor"} strokeWidth="3.6" />
        <circle cx="33.5" cy="14.5" fill={color || "currentColor"} r="2.1" />
      </svg>
    ),
  },
  reddit: {
    color: "#FF4500",
    label: "Reddit",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" viewBox="0 0 48 48">
        <path
          d="M37.8 19.9c-1.4 0-2.6.6-3.4 1.5-2.5-1.7-5.9-2.8-9.6-2.9l1.7-7.7 5.3 1.1a3.7 3.7 0 1 0 .4-2l-6.3-1.3c-.5-.1-1 .2-1.1.7l-2 9.2c-3.8.1-7.2 1.2-9.8 2.9a4.6 4.6 0 1 0-5.1 7.4 8.2 8.2 0 0 0-.1 1.2c0 6.4 7.3 11.6 16.2 11.6S40.2 36.4 40.2 30c0-.4 0-.8-.1-1.2a4.6 4.6 0 0 0-2.3-8.9ZM17 28.1a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Zm13.2 7.1c-1.8 1.8-4.9 2-6.2 2s-4.4-.2-6.2-2a1 1 0 0 1 1.4-1.4c1.1 1.1 3.3 1.4 4.8 1.4s3.7-.3 4.8-1.4a1 1 0 1 1 1.4 1.4Zm.8-7.1a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z"
          fill={color || "currentColor"}
        />
      </svg>
    ),
  },
  email: {
    color: "#ADE0FF",
    label: "Email",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 48 48">
        <rect height="28" rx="6.5" stroke={color || "currentColor"} strokeWidth="3.6" width="34" x="7" y="10" />
        <path d="m10.5 15 13.5 10.5L37.5 15" stroke={color || "currentColor"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.6" />
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
    render: ({ color }) => {
      const tone = color || "currentColor";

      return (
        <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 48 48">
          <path d="M18.5 13.5c0-1.9 1.6-2.5 1.6-4.5M25.5 13.5c0-1.9 1.6-2.5 1.6-4.5" stroke={tone} strokeLinecap="round" strokeWidth="2.8" />
          <path d="M11 18h21a1 1 0 0 1 1 1v7a11 11 0 0 1-22 0v-7a1 1 0 0 1 1-1Z" fill={tone} />
          <path d="M33 21h2.4a4.4 4.4 0 0 1 0 8.8H33" stroke={tone} strokeLinecap="round" strokeWidth="3.5" />
          <path d="M12.5 40h20" stroke={tone} strokeLinecap="round" strokeWidth="3.5" />
        </svg>
      );
    },
  },
  website: {
    color: "#ADE0FF",
    label: "Website",
    render: ({ color }) => (
      <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="16.5" stroke={color || "currentColor"} strokeWidth="3.4" />
        <path d="M8 24h32M24 7.5c4.2 4.5 6.2 10 6.2 16.5S28.2 36 24 40.5c-4.2-4.5-6.2-10-6.2-16.5S19.8 12 24 7.5Z" stroke={color || "currentColor"} strokeLinecap="round" strokeWidth="2.8" />
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
  const tone = color || "#1C1C1C";
  const lightGlyph = getHexLuminance(tone) > 0.45;
  const textSizeClassName = text.length > 1 ? "text-[0.82rem]" : "text-[1.1rem]";

  return (
    <span
      className={`grid size-full place-items-center rounded-[14px] font-black uppercase leading-none tracking-[-0.04em] ${textSizeClassName}`}
      style={
        lightGlyph
          ? {
              background: "linear-gradient(155deg, rgba(38, 41, 48, 0.92) 0%, rgba(16, 18, 22, 0.96) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 6px 16px rgba(0, 0, 0, 0.24)",
              color: tone,
            }
          : {
              background: "linear-gradient(180deg, #FFFFFF 0%, #EFF2F7 100%)",
              border: "1px solid rgba(15, 23, 42, 0.1)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 6px 14px rgba(15, 23, 42, 0.08)",
              color: tone,
            }
      }
    >
      {text}
    </span>
  );
}

function getHexLuminance(value?: string) {
  if (!value) {
    return 0;
  }

  const match = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

  if (!match) {
    return 0;
  }

  const hex = match[1].length === 3 ? match[1].split("").map((char) => char + char).join("") : match[1];
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
}
