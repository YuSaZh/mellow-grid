import type { ComponentType } from "react";

export type DeploymentMode = "static" | "file" | "remote";

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
  defaultLayout: Omit<GridLayoutItem, "i" | "x" | "y">;
  defaultProps: TProps;
  Component: ComponentType<{ props: TProps }>;
};

export type AnyWidgetDefinition = Omit<WidgetDefinition<unknown>, "Component"> & {
  Component: ComponentType<{ props: unknown }>;
};
