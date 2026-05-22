"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useEditorStore } from "../store";
import { WidgetInspector } from "./widget-inspector";
import { getWidgetDefinition } from "@/lib/widgets/registry";

type FloatingPosition = {
  left: number;
  top: number;
};

export function WidgetEditorModal() {
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const selectedTarget = useEditorStore((state) => state.selectedTarget);
  const widget = useEditorStore((state) => state.config.widgets.find((item) => selectedTarget?.type === "widget" && item.id === selectedTarget.id));
  const definition = widget ? getWidgetDefinition(widget.type) : undefined;
  const modalRef = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState<FloatingPosition>({ left: 24, top: 24 });

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        clearSelection();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearSelection]);

  useLayoutEffect(() => {
    if (!widget) {
      return;
    }

    const widgetId = widget.id;
    let frameId: number | null = null;

    function updatePosition() {
      const selector = `[data-editor-widget-id="${escapeCssIdentifier(widgetId)}"]`;
      const target = document.querySelector<HTMLElement>(selector);
      const modalRect = modalRef.current?.getBoundingClientRect();
      const panelWidth = Math.min(modalRect?.width ?? 500, window.innerWidth - 32);
      const panelHeight = Math.min(modalRect?.height ?? 540, window.innerHeight - 32);

      if (!target) {
        setPosition({ left: Math.max(16, window.innerWidth - panelWidth - 16), top: Math.max(16, window.innerHeight - panelHeight - 16) });
        return;
      }

      const rect = target.getBoundingClientRect();
      const gap = 18;
      const fitsRight = rect.right + gap + panelWidth <= window.innerWidth - 16;
      const fitsLeft = rect.left - gap - panelWidth >= 16;
      const left = fitsRight ? rect.right + gap : fitsLeft ? rect.left - gap - panelWidth : Math.max(16, window.innerWidth - panelWidth - 16);
      const top = Math.min(Math.max(16, rect.top), Math.max(16, window.innerHeight - panelHeight - 16));

      setPosition({ left, top });
    }

    function schedulePositionUpdate() {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(updatePosition);
    }

    schedulePositionUpdate();
    const resizeObserver = typeof ResizeObserver !== "undefined" && modalRef.current ? new ResizeObserver(schedulePositionUpdate) : null;

    if (modalRef.current) {
      resizeObserver?.observe(modalRef.current);
    }

    window.addEventListener("resize", schedulePositionUpdate);
    window.addEventListener("scroll", schedulePositionUpdate, true);
    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      resizeObserver?.disconnect();
      window.removeEventListener("resize", schedulePositionUpdate);
      window.removeEventListener("scroll", schedulePositionUpdate, true);
    };
  }, [widget]);

  useEffect(() => {
    if (!selectedTarget || !widget || !definition) {
      return;
    }

    function handleOutsidePointerDown(event: globalThis.PointerEvent) {
      const target = event.target;

      if (target instanceof Node && modalRef.current?.contains(target)) {
        return;
      }

      clearSelection();
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown, true);
    return () => document.removeEventListener("pointerdown", handleOutsidePointerDown, true);
  }, [clearSelection, definition, selectedTarget, widget]);

  if (!selectedTarget || !widget || !definition) {
    return null;
  }

  return (
    <>
      <section
        aria-label={`${definition.name} 编辑选项`}
        aria-modal="true"
        className="pointer-events-auto fixed flex w-[min(500px,calc(100vw-2rem))] flex-col gap-4 overflow-visible rounded-[30px] border border-black/[0.08] bg-white/[0.96] p-5 shadow-[0_30px_70px_rgba(0,0,0,0.16),0_0_1px_rgba(0,0,0,0.1),inset_1px_1px_0_rgba(255,255,255,0.8)] backdrop-blur-[20px]"
        ref={modalRef}
        role="dialog"
        style={{ animation: "mgFloatingPop 0.28s cubic-bezier(0.175,0.885,0.32,1.2)", left: position.left, top: position.top, transformOrigin: "top left" }}
      >
        <style>{`
          @keyframes mgFloatingPop {
            0% { opacity: 0; transform: scale(0.92) translateY(12px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
        <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] pb-3">
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#a0a0ab]">Edit widget</p>
            <h2 className="mt-1 text-base font-extrabold text-[#121214]">{definition.name}·快速参数配置</h2>
          </div>
          <button className="grid size-9 shrink-0 place-items-center rounded-full border-0 bg-black/[0.04] text-2xl leading-none text-[#8a8a94] transition hover:bg-black/[0.08] hover:text-[#121214] focus:outline-none focus:ring-4 focus:ring-[#3FA3EB]/[0.15]" onClick={clearSelection} type="button">
            ×
          </button>
        </div>

        <WidgetInspector id={widget.id} />
      </section>
    </>
  );
}

function escapeCssIdentifier(value: string) {
  if (typeof CSS !== "undefined" && "escape" in CSS) {
    return CSS.escape(value);
  }

  return value.replace(/"/g, '\\"');
}
