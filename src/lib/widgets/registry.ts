import type { AnyWidgetDefinition } from "@/lib/page-config/types";
import { dividerWidget } from "@/widgets/divider";
import { githubActivityWidget } from "@/widgets/github-activity";
import { linkWidget } from "@/widgets/link";
import { mapWidget } from "@/widgets/map";
import { mediaWidget } from "@/widgets/media";
import { musicWidget } from "@/widgets/music";
import { textWidget } from "@/widgets/text";

export const widgetRegistry = {
  link: linkWidget,
  text: textWidget,
  divider: dividerWidget,
  "github-activity": githubActivityWidget,
  music: musicWidget,
  map: mapWidget,
  media: mediaWidget,
} as unknown as Record<string, AnyWidgetDefinition>;

export type WidgetType = keyof typeof widgetRegistry;

export function getWidgetDefinition(type: string): AnyWidgetDefinition | undefined {
  return widgetRegistry[type as WidgetType];
}
