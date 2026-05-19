import type { PageConfig, PageProfile, PageTheme } from "./types";

export const defaultTheme: PageTheme = {
  background: "#ffffff",
  foreground: "#000000",
  card: "#121313",
  accent: "#ade0ff",
  radius: "round",
  shadow: "soft",
};

export const defaultProfile: PageProfile = {
  name: "Double Glitch 🇺🇦",
  bio: "Hey there! My name is Roman, I am a Ukrainian designer. I create unusual stuff with ordinary tools hoping to inspire people to unlock or boost their own creativity.",
  location: "",
  avatarUrl: "",
  contacts: [],
};

export const defaultPageConfig: PageConfig = {
  username: "username",
  title: "MellowGrid",
  description: "A 2.5D Bento playground inspired personal homepage.",
  profile: defaultProfile,
  theme: defaultTheme,
  updatedAt: new Date(0).toISOString(),
  layout: [
    { i: "social-twitter", x: 0, y: 0, w: 2, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
    { i: "social-figma", x: 2, y: 0, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
    { i: "social-dribbble", x: 3, y: 0, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
    { i: "links", x: 0, y: 1, w: 2, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
    { i: "about", x: 2, y: 1, w: 1, h: 2, minW: 1, minH: 1, maxW: 2, maxH: 2 },
    { i: "social-mail", x: 3, y: 1, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
    { i: "stats", x: 0, y: 2, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
    { i: "social-github", x: 1, y: 2, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
    { i: "social-linkedin", x: 3, y: 2, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
    { i: "social-blog", x: 0, y: 3, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
    { i: "intro", x: 1, y: 3, w: 2, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
    { i: "social-coffee", x: 3, y: 3, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
  ],
  widgets: [
    {
      id: "social-twitter",
      type: "link",
      props: {
        title: "Twitter",
        href: "https://twitter.com/",
        description: "@handle or address",
        logo: { type: "builtin", key: "x" },
        color: "#f5f5f5",
        background: { type: "theme" },
      },
    },
    {
      id: "social-figma",
      type: "link",
      props: {
        title: "Figma",
        href: "https://figma.com/",
        description: "@handle or address",
        logo: { type: "builtin", key: "figma" },
        color: "#A259FF",
        background: { type: "theme" },
      },
    },
    {
      id: "social-dribbble",
      type: "link",
      props: {
        title: "Dribbble",
        href: "https://dribbble.com/",
        description: "@handle or address",
        logo: { type: "builtin", key: "dribbble" },
        color: "#EA4C89",
        background: { type: "theme" },
      },
    },
    {
      id: "links",
      type: "links",
      props: {
        links: [
          { label: "Buy me a coffee", href: "https://example.com" },
          { label: "Portfolio", href: "https://example.com" },
        ],
      },
    },
    {
      id: "social-linkedin",
      type: "link",
      props: {
        title: "LinkedIn",
        href: "https://www.linkedin.com/",
        description: "@handle or address",
        logo: { type: "builtin", key: "linkedin" },
        color: "#0A66C2",
        background: { type: "theme" },
      },
    },
    {
      id: "social-github",
      type: "link",
      props: {
        title: "GitHub",
        href: "https://github.com/",
        description: "@handle or address",
        logo: { type: "builtin", key: "github" },
        color: "#f0f6fc",
        background: { type: "theme" },
      },
    },
    {
      id: "intro",
      type: "text",
      props: {
        eyebrow: "Playground",
        title: "2.5D widgets for ordinary tools.",
        body: "Rounded cards, subtle highlights, and a crisp bento layout.",
      },
    },
    {
      id: "stats",
      type: "stats",
      props: {
        value: "12",
        label: "Playground widgets",
      },
    },
    {
      id: "social-blog",
      type: "link",
      props: {
        title: "Blog",
        href: "https://example.com",
        description: "@handle or address",
        logo: { type: "builtin", key: "blog" },
        color: "#ade0ff",
        background: { type: "theme" },
      },
    },
    {
      id: "social-mail",
      type: "link",
      props: {
        title: "Email",
        href: "mailto:hello@example.com",
        description: "@handle or address",
        logo: { type: "builtin", key: "email" },
        color: "#ade0ff",
        background: { type: "theme" },
      },
    },
    {
      id: "about",
      type: "text",
      props: {
        eyebrow: "Notes",
        title: "Designed as a compact visual playground.",
        body: "Each tile follows the current link widget template with unified logo shadows.",
      },
    },
    {
      id: "social-coffee",
      type: "link",
      props: {
        title: "Coffee",
        href: "https://example.com",
        description: "@handle or address",
        logo: { type: "builtin", key: "coffee" },
        color: "#ffdd99",
        background: { type: "theme" },
      },
    },
  ],
};
