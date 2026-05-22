import type { PageProfile, PageTheme } from "./types";

export const defaultTheme: PageTheme = {
  background: "#ffffff",
  foreground: "#000000",
  card: "#121313",
  accent: "#ade0ff",
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
