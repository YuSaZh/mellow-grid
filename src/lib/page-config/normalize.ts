import { clampBentoLayoutItem } from "./bento-layout";
import { defaultProfile, defaultTheme } from "./fallbacks";
import type { PageConfig, PageContact, PageProfile, WidgetInstance } from "./types";
import { builtinLogoRegistry, getBuiltinLogoKeyFromLabel, isBuiltinLogoKey, type LinkLogo } from "@/lib/widgets/logo-registry";
import { getWidgetDefinition } from "@/lib/widgets/registry";

export function normalizePageConfig(config: PageConfig): PageConfig {
  const widgets = Array.isArray(config.widgets) ? config.widgets : [];
  const legacyProfileWidget = widgets.find((widget) => widget.type === "profile");
  const normalizedWidgets = widgets.map(normalizeWidget);
  const profile = normalizeProfile(config.profile ?? legacyProfileWidget?.props);
  const supportedWidgets = normalizedWidgets.filter((widget) => widget.type !== "profile" && getWidgetDefinition(widget.type));
  const gridWidgetTypes = new Map(supportedWidgets.map((widget) => [widget.id, widget.type]));

  return {
    ...config,
    profile,
    theme: { ...defaultTheme, ...config.theme },
    widgets: supportedWidgets,
    layout: (Array.isArray(config.layout) ? config.layout : [])
      .filter((item) => gridWidgetTypes.has(item.i))
      .map((item) => refreshLayoutConstraints(item, gridWidgetTypes.get(item.i)))
      .map(clampBentoLayoutItem),
  };
}

function refreshLayoutConstraints(item: PageConfig["layout"][number], widgetType?: string) {
  const defaultLayout = widgetType ? getWidgetDefinition(widgetType)?.defaultLayout : undefined;

  if (!defaultLayout) {
    return item;
  }

  return {
    ...item,
    minW: defaultLayout.minW,
    minH: defaultLayout.minH,
    maxW: defaultLayout.maxW,
    maxH: defaultLayout.maxH,
  };
}

function normalizeWidget(widget: WidgetInstance): WidgetInstance {
  if (widget.type === "link") {
    return { ...widget, props: normalizeLinkProps(widget.props) };
  }

  const definition = getWidgetDefinition(widget.type);

  if (!definition) {
    return widget;
  }

  return { ...widget, props: { ...asRecord(definition.defaultProps), ...asRecord(widget.props) } };
}

function normalizeLinkProps(value: unknown): Record<string, unknown> {
  const props = asRecord(value);
  const title = stringValue(props.title, stringValue(props.label, "Link"));
  const logo = normalizeLinkLogo(props.logo, title);

  return {
    title,
    href: stringValue(props.href, "#"),
    description: typeof props.description === "string" ? props.description : stringValue(props.handle, "@handle or address"),
    logo,
    color: stringValue(props.color, logo.type === "builtin" ? builtinLogoRegistry[logo.key].color : defaultTheme.accent),
    background: normalizeWidgetBackground(props.background),
  };
}

function normalizeLinkLogo(value: unknown, title: string): LinkLogo {
  const logo = asRecord(value);

  if (logo.type === "uploaded" && typeof logo.url === "string" && logo.url) {
    return { type: "uploaded", url: logo.url, alt: typeof logo.alt === "string" ? logo.alt : title };
  }

  if (logo.type === "builtin" && isBuiltinLogoKey(logo.key)) {
    return { type: "builtin", key: logo.key };
  }

  return { type: "builtin", key: getBuiltinLogoKeyFromLabel(title) };
}

function normalizeWidgetBackground(value: unknown) {
  const background = asRecord(value);

  if (background.type === "solid" && typeof background.value === "string") {
    return { type: "solid", value: background.value };
  }

  if (background.type === "gradient" && typeof background.from === "string" && typeof background.to === "string") {
    return {
      type: "gradient",
      from: background.from,
      to: background.to,
      angle: typeof background.angle === "number" ? background.angle : undefined,
    };
  }

  return { type: "theme" };
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

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value ? value : fallback;
}

export function getGridWidgets(config: PageConfig): WidgetInstance[] {
  return config.widgets.filter((widget) => widget.type !== "profile" && getWidgetDefinition(widget.type));
}
