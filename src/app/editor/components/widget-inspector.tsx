"use client";

import { useEditorStore } from "../store";
import { LinksField, TextAreaField, TextField } from "./inspector-fields";
import { LinkWidgetInspector } from "./link-widget-inspector";
import { getWidgetDefinition } from "@/lib/widgets/registry";

export function WidgetInspector({ id }: { id: string }) {
  const deleteWidget = useEditorStore((state) => state.deleteWidget);
  const updateWidgetProps = useEditorStore((state) => state.updateWidgetProps);
  const widget = useEditorStore((state) => state.config.widgets.find((item) => item.id === id));
  const definition = widget ? getWidgetDefinition(widget.type) : undefined;

  if (!widget || !definition) {
    return <p className="rounded-3xl bg-zinc-50 p-4 text-sm font-medium text-zinc-500">Widget is missing.</p>;
  }

  return (
    <section className="grid gap-[1.1rem]">
      {widget.type === "link" ? (
        <LinkWidgetInspector onChange={(nextProps) => updateWidgetProps(widget.id, nextProps)} props={widget.props} />
      ) : (
        <div className="grid gap-4">
          {Object.entries(widget.props as Record<string, unknown>).map(([key, value]) => (
            <PropertyField key={key} label={key} onChange={(nextValue) => updateWidgetProps(widget.id, { [key]: nextValue })} value={value} />
          ))}
        </div>
      )}
      <button className="min-h-11 justify-self-start rounded-full bg-red-50 px-4 text-xs font-bold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-200" onClick={() => deleteWidget(widget.id)} type="button">
        删除模块
      </button>
    </section>
  );
}

function PropertyField({ label, onChange, value }: { label: string; onChange: (value: unknown) => void; value: unknown }) {
  if (Array.isArray(value)) {
    return <LinksField label={label} onChange={onChange} value={value} />;
  }

  if (typeof value === "string" && (label === "bio" || label === "body")) {
    return <TextAreaField label={label} onChange={onChange} value={value} />;
  }

  return <TextField label={label} onChange={onChange} value={typeof value === "string" ? value : String(value ?? "")} />;
}
