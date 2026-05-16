import { defaultProfile, defaultTheme } from "./defaults";
import { clampBentoLayoutItem } from "./bento-layout";
import type { PageConfig, PageContact, PageProfile, WidgetInstance } from "./types";

export function normalizePageConfig(config: PageConfig): PageConfig {
  const widgets = Array.isArray(config.widgets) ? config.widgets : [];
  const legacyProfileWidget = widgets.find((widget) => widget.type === "profile");
  const profile = normalizeProfile(config.profile ?? legacyProfileWidget?.props);
  const gridWidgetIds = new Set(widgets.filter((widget) => widget.type !== "profile").map((widget) => widget.id));

  return {
    ...config,
    profile,
    theme: { ...defaultTheme, ...config.theme },
    widgets: widgets.filter((widget) => widget.type !== "profile"),
    layout: (Array.isArray(config.layout) ? config.layout : []).filter((item) => gridWidgetIds.has(item.i)).map(clampBentoLayoutItem),
  };
}

export function normalizeProfile(value: unknown): PageProfile {
  const props = value && typeof value === "object" ? (value as Partial<PageProfile>) : {};

  return {
    name: typeof props.name === "string" ? props.name : defaultProfile.name,
    bio: typeof props.bio === "string" ? props.bio : defaultProfile.bio,
    location: typeof props.location === "string" ? props.location : defaultProfile.location,
    avatarUrl: typeof props.avatarUrl === "string" ? props.avatarUrl : defaultProfile.avatarUrl,
    contacts: Array.isArray(props.contacts) ? props.contacts.filter(isPageContact) : defaultProfile.contacts,
  };
}

function isPageContact(value: unknown): value is PageContact {
  return typeof value === "object" && value !== null && "label" in value && "href" in value && typeof value.label === "string" && typeof value.href === "string";
}

export function getGridWidgets(config: PageConfig): WidgetInstance[] {
  return config.widgets.filter((widget) => widget.type !== "profile");
}
