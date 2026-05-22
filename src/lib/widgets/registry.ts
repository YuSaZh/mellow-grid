import type { AnyWidgetDefinition } from "@/lib/page-config/types";
import { dividerWidget } from "@/widgets/divider";
import { linkWidget } from "@/widgets/link";
import { textWidget } from "@/widgets/text";

export const widgetRegistry = {
  link: linkWidget,
  text: textWidget,
  divider: dividerWidget,
} as unknown as Record<string, AnyWidgetDefinition>;

export type WidgetType = keyof typeof widgetRegistry;

export function getWidgetDefinition(type: string): AnyWidgetDefinition | undefined {
  return widgetRegistry[type as WidgetType];
}
