"use client";

import { useEditorStore } from "../store";
import { fileToDataUrl, LinksField, stringProp, TextAreaField, TextField, uploadFile } from "./inspector-fields";

export function ProfileInspector({ id }: { id: string }) {
  const widget = useEditorStore((state) => state.config.widgets.find((item) => item.id === id));
  const updateProfileProps = useEditorStore((state) => state.updateProfileProps);

  if (!widget) {
    return <p className="rounded-3xl bg-zinc-50 p-4 text-sm font-medium text-zinc-500">Profile module is missing.</p>;
  }

  const props = widget.props as Record<string, unknown>;
  const avatarUrl = stringProp(props.avatarUrl, "");
  const bio = stringProp(props.bio, "");
  const contacts = Array.isArray(props.contacts) ? props.contacts : [];
  const location = stringProp(props.location, "Based in Your City");
  const name = stringProp(props.name, "Your Name");

  return (
    <section className="grid gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">Profile</p>
        <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-zinc-950">个人资料</h2>
      </div>

      <TextField label="Name" onChange={(value) => updateProfileProps(id, { name: value })} value={name} />
      <TextField label="Location" onChange={(value) => updateProfileProps(id, { location: value })} value={location} />
      <TextAreaField label="Bio" onChange={(value) => updateProfileProps(id, { bio: value })} value={bio} />

      <div className="grid gap-3 rounded-3xl border border-black/5 bg-zinc-50 p-3">
        <TextField label="Avatar URL" onChange={(value) => updateProfileProps(id, { avatarUrl: value })} value={avatarUrl} />
        <label className="grid min-h-11 cursor-pointer place-items-center rounded-full bg-zinc-950 px-4 text-sm font-bold text-white transition hover:bg-zinc-700 focus-within:ring-2 focus-within:ring-[#7c5cff]/40">
          上传头像
          <input
            accept="image/*"
            className="sr-only"
            onChange={async (event) => {
              const file = uploadFile(event);

              if (file) {
                updateProfileProps(id, { avatarUrl: await fileToDataUrl(file) });
              }
            }}
            type="file"
          />
        </label>
        {avatarUrl ? (
          <button className="min-h-11 rounded-full bg-white px-4 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#7c5cff]/30" onClick={() => updateProfileProps(id, { avatarUrl: "" })} type="button">
            移除头像
          </button>
        ) : null}
      </div>

      <LinksField label="Contacts" onChange={(value) => updateProfileProps(id, { contacts: value })} value={contacts} />
    </section>
  );
}
