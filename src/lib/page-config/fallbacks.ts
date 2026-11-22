import type { PageProfile, PageTheme } from "./types";

export const defaultTheme: PageTheme = {
  background: "#F5F6F8",
  foreground: "#141518",
  card: "#17181B",
  accent: "#3FA3EB",
  radius: "round",
  shadow: "soft",
};

export const defaultProfile: PageProfile = {
  name: "Username",
  bio: "Short bio for your personal homepage.",
  location: "Location",
  avatarUrl: "",
  contacts: [
    { label: "Email", href: "mailto:email@example.com" },
    { label: "Website", href: "https://example.com" },
  ],
};
