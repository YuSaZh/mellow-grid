import type { PageConfig, PageTheme } from "./types";

export const defaultTheme: PageTheme = {
  background: "#f7f4ef",
  foreground: "#191714",
  card: "#ffffff",
  accent: "#7c5cff",
  radius: "round",
  shadow: "soft",
};

export const defaultPageConfig: PageConfig = {
  username: "hanam",
  title: "MellowGrid",
  description: "A soft, modular personal homepage.",
  theme: defaultTheme,
  updatedAt: new Date(0).toISOString(),
  layout: [
    { i: "profile", x: 0, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
    { i: "links", x: 4, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: "intro", x: 7, y: 0, w: 5, h: 2, minW: 3, minH: 2 },
    { i: "stats", x: 4, y: 2, w: 3, h: 2, minW: 2, minH: 2 },
  ],
  widgets: [
    {
      id: "profile",
      type: "profile",
      props: {
        name: "Hanam",
        bio: "Developer building a mellow corner of the web.",
        location: "Based on Earth",
        avatarUrl: "",
      },
    },
    {
      id: "links",
      type: "links",
      props: {
        links: [
          { label: "GitHub", href: "https://github.com/" },
          { label: "Blog", href: "https://example.com" },
        ],
      },
    },
    {
      id: "intro",
      type: "text",
      props: {
        eyebrow: "Snapshot",
        title: "Simple, rounded, customizable.",
        body: "MellowGrid is a Bento-style homepage with visual editing and flexible deployment modes.",
      },
    },
    {
      id: "stats",
      type: "stats",
      props: {
        value: "24",
        label: "Modules ready",
      },
    },
  ],
};
