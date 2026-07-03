import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WidgetInspector } from "./widget-inspector";

const mockEditorState = vi.hoisted(() => ({
  state: {
    config: {
      widgets: [] as Array<{ id: string; props: Record<string, unknown>; type: string }>,
    },
    deleteWidget: vi.fn(),
    updateWidgetProps: vi.fn(),
  },
}));

const mockWidgetDefinitions = vi.hoisted(() => ({
  definitions: {
    text: {
      type: "text",
      name: "Text",
      description: "Text widget",
      defaultLayout: { w: 2, h: 2 },
      defaultProps: {
        background: { type: "theme" },
        body: "",
        eyebrow: "",
        title: "",
      },
    },
  } as Record<string, { defaultLayout: Record<string, unknown>; defaultProps: Record<string, unknown>; description: string; editor?: { inspector: "link" | "rich" }; name: string; type: string }>,
}));

vi.mock("../store", () => ({
  useEditorStore: (selector: (state: typeof mockEditorState.state) => unknown) => selector(mockEditorState.state),
}));

vi.mock("@/lib/widgets/registry", () => ({
  getWidgetDefinition: (type: string) => mockWidgetDefinitions.definitions[type],
}));

describe("WidgetInspector", () => {
  beforeEach(() => {
    mockEditorState.state.config.widgets = [];
    mockEditorState.state.deleteWidget.mockClear();
    mockEditorState.state.updateWidgetProps.mockClear();
    mockWidgetDefinitions.definitions = {
      text: {
        type: "text",
        name: "Text",
        description: "Text widget",
        defaultLayout: { w: 2, h: 2 },
        defaultProps: {
          background: { type: "theme" },
          body: "",
          eyebrow: "",
          title: "",
        },
      },
    };
  });

  it("shows newly added default fields for existing text widgets", () => {
    mockEditorState.state.config.widgets = [
      {
        id: "legacy-text",
        type: "text",
        props: {
          eyebrow: "Old",
          title: "Legacy text",
          body: "Created before text backgrounds existed.",
        },
      },
    ];

    const html = renderToStaticMarkup(<WidgetInspector id="legacy-text" />);

    expect(html).toContain("背景");
    expect(html).toContain("Legacy text");
  });

  it("uses widget definition metadata to choose the rich inspector", () => {
    mockWidgetDefinitions.definitions["custom-rich"] = {
      type: "custom-rich",
      name: "Custom rich",
      description: "A rich widget provided by the registry.",
      editor: { inspector: "rich" },
      defaultLayout: { w: 2, h: 2 },
      defaultProps: {
        embedUrl: "",
        href: "https://example.com/",
        title: "Default rich title",
      },
    };
    mockEditorState.state.config.widgets = [
      {
        id: "registry-rich",
        type: "custom-rich",
        props: {
          title: "Registry rich widget",
        },
      },
    ];

    const html = renderToStaticMarkup(<WidgetInspector id="registry-rich" />);

    expect(html).toContain("标题 (Title)");
    expect(html).toContain("跳转链接 (URL)");
    expect(html).toContain("Registry rich widget");
    expect(html).toContain("https://example.com/");
  });

  it("uses widget definition metadata to choose the link inspector", () => {
    mockWidgetDefinitions.definitions["custom-link"] = {
      type: "custom-link",
      name: "Custom link",
      description: "A link widget provided by the registry.",
      editor: { inspector: "link" },
      defaultLayout: { w: 1, h: 1 },
      defaultProps: {
        background: { type: "theme" },
        color: "#A259FF",
        description: "Default handle",
        href: "https://example.com/",
        logo: { type: "builtin", key: "website" },
        title: "Default link title",
      },
    };
    mockEditorState.state.config.widgets = [
      {
        id: "registry-link",
        type: "custom-link",
        props: {
          title: "Registry link widget",
        },
      },
    ];

    const html = renderToStaticMarkup(<WidgetInspector id="registry-link" />);

    expect(html).toContain("主标题 (Title)");
    expect(html).toContain("副标题 (Handle)");
    expect(html).toContain("Registry link widget");
    expect(html).toContain("Default handle");
    expect(html).toContain("https://example.com/");
  });
});
