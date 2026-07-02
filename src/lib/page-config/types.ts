import type { ComponentType } from "react";

export type GridLayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
};

export type PageTheme = {
  background: string;
  foreground: string;
  card: string;
  accent: string;
  radius: "soft" | "round" | "pill";
  shadow: "none" | "soft" | "float";
};

export type PageContact = {
  label: string;
  href: string;
};

export type PageProfile = {
  name: string;
  bio: string;
  location: string;
  avatarUrl?: string;
  contacts?: PageContact[];
};

export type WidgetInstance<TProps = Record<string, unknown>> = {
  id: string;
  type: string;
  props: TProps;
};

export type WidgetRenderVariant = "compact" | "wide" | "large";

export type WidgetRenderContext = {
  layout: GridLayoutItem;
  variant: WidgetRenderVariant;
};

export type WidgetEditorInspector = "default" | "link" | "rich";

export type PageConfig = {
  username: string;
  title: string;
  description?: string;
  profile: PageProfile;
  theme: PageTheme;
  layout: GridLayoutItem[];
  widgets: WidgetInstance[];
  updatedAt: string;
};

export type WidgetDefinition<TProps = unknown> = {
  type: string;
  name: string;
  description: string;
  editor?: {
    inspector: WidgetEditorInspector;
  };
  defaultLayout: Omit<GridLayoutItem, "i" | "x" | "y">;
  defaultProps: TProps;
  Component: ComponentType<{ props: TProps; context?: WidgetRenderContext }>;
};

export type AnyWidgetDefinition = Omit<WidgetDefinition<unknown>, "Component"> & {
  Component: ComponentType<{ props: unknown; context?: WidgetRenderContext }>;
};
