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

vi.mock("../store", () => ({
  useEditorStore: (selector: (state: typeof mockEditorState.state) => unknown) => selector(mockEditorState.state),
}));

describe("WidgetInspector", () => {
  beforeEach(() => {
    mockEditorState.state.config.widgets = [];
    mockEditorState.state.deleteWidget.mockClear();
    mockEditorState.state.updateWidgetProps.mockClear();
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
});
