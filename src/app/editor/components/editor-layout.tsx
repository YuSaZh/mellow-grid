"use client";

import type { MouseEvent } from "react";
import { ProfilePanel } from "@/components/page/profile-panel";
import { type ProfileWidgetProps } from "@/widgets/profile";
import { useEditorStore } from "../store";
import { EditorCanvas } from "./editor-canvas";
import { EditorSidebar } from "./editor-sidebar";
import { EditorToolbar } from "./editor-toolbar";
import { isEditableLink, stringProp } from "./inspector-fields";

export function EditorLayout() {
  const config = useEditorStore((state) => state.config);
  const selectedTarget = useEditorStore((state) => state.selectedTarget);
  const selectProfile = useEditorStore((state) => state.selectProfile);
  const profileWidget = config.widgets.find((widget) => widget.type === "profile");
  const profileProps = getProfileProps(profileWidget?.props);
  const selected = selectedTarget?.type === "profile" && selectedTarget.id === profileWidget?.id;

  function handleProfileClick(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a")) {
      event.preventDefault();
    }

    if (profileWidget) {
      selectProfile(profileWidget.id);
    }
  }

  function selectProfileWidget() {
    if (profileWidget) {
      selectProfile(profileWidget.id);
    }
  }

  return (
    <main className="min-h-dvh pb-40 text-zinc-950" style={{ background: config.theme.background, color: config.theme.foreground }}>
      <EditorToolbar />
      <div className="mx-auto grid w-full max-w-[86rem] grid-cols-1 gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:px-10 xl:grid-cols-[20rem_minmax(0,1fr)] xl:gap-14">
        <aside
          className={`rounded-[2.5rem] p-3 transition ${selected ? "bg-white/70 outline outline-4 outline-[#7c5cff]/50 outline-offset-4" : "hover:bg-white/50"}`}
          onClickCapture={handleProfileClick}
        >
          <div className="mb-4 flex justify-end">
            <button
              aria-label="选择个人资料进行编辑"
              className="min-h-10 rounded-full bg-zinc-950 px-4 text-sm font-bold text-white shadow-[0_10px_28px_rgba(20,16,10,0.16)] transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#7c5cff]/40"
              onClick={(event) => {
                event.stopPropagation();
                selectProfileWidget();
              }}
              type="button"
            >
              编辑资料
            </button>
          </div>
          {profileWidget ? <ProfilePanel props={profileProps} /> : <p className="rounded-3xl bg-white/80 p-5 text-sm font-medium text-zinc-500">Profile module is missing.</p>}
        </aside>

        <EditorCanvas />
      </div>
      <EditorSidebar />
    </main>
  );
}

function getProfileProps(value: unknown): ProfileWidgetProps {
  const props = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  return {
    name: stringProp(props.name, "Your Name"),
    bio: stringProp(props.bio, ""),
    location: stringProp(props.location, "Based in Your City"),
    avatarUrl: stringProp(props.avatarUrl, ""),
    contacts: Array.isArray(props.contacts) ? props.contacts.filter(isEditableLink) : [],
  };
}
