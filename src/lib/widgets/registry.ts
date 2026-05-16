import type { AnyWidgetDefinition } from "@/lib/page-config/types";
import { linksWidget } from "@/widgets/links";
import { profileWidget } from "@/widgets/profile";
import { socialWidget } from "@/widgets/social";
import { statsWidget } from "@/widgets/stats";
import { textWidget } from "@/widgets/text";

export const widgetRegistry = {
  profile: profileWidget,
  links: linksWidget,
  social: socialWidget,
  text: textWidget,
  stats: statsWidget,
} as unknown as Record<string, AnyWidgetDefinition>;

export type WidgetType = keyof typeof widgetRegistry;

export function getWidgetDefinition(type: string): AnyWidgetDefinition | undefined {
  return widgetRegistry[type as WidgetType];
}
