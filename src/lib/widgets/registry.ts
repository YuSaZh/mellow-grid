import type { AnyWidgetDefinition } from "@/lib/page-config/types";
import { linkWidget } from "@/widgets/link";
import { linksWidget } from "@/widgets/links";
import { statsWidget } from "@/widgets/stats";
import { textWidget } from "@/widgets/text";

export const widgetRegistry = {
  link: linkWidget,
  links: linksWidget,
  text: textWidget,
  stats: statsWidget,
} as unknown as Record<string, AnyWidgetDefinition>;

export type WidgetType = keyof typeof widgetRegistry;

export function getWidgetDefinition(type: string): AnyWidgetDefinition | undefined {
  return widgetRegistry[type as WidgetType];
}
