import { describe, expect, it } from "vitest";
import { WidgetShell } from "@/components/widgets/widget-shell";
import { dividerWidget } from "./divider";
import { TextWidget } from "./text";

describe("widget definitions", () => {
  it("renders text widgets through the current WidgetShell with hover enabled", () => {
    const element = TextWidget({ props: { title: "Title", body: "Body" } });

    expect(element.type).toBe(WidgetShell);
    expect(element.props.interactive).toBe(true);
  });

  it("uses a half-height divider layout", () => {
    expect(dividerWidget.defaultLayout).toMatchObject({ h: 0.5, minH: 0.5, maxH: 0.5 });
  });
});
