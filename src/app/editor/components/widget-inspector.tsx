"use client";

import { useState } from "react";
import { useEditorStore } from "../store";
import { BackgroundField, LinksField, SelectField, TextAreaField, TextField, fileToDataUrl, uploadFile } from "./inspector-fields";
import { LinkWidgetInspector } from "./link-widget-inspector";
import type { WidgetBackground } from "@/components/widgets/widget-shell";
import { getWidgetDefinition } from "@/lib/widgets/registry";
import { buildGithubActivityImageUrl, parseGithubUsername } from "@/widgets/github-activity/github-profile";

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
      {definition.editor?.inspector === "link" ? (
        <LinkWidgetInspector onChange={(nextProps) => updateWidgetProps(widget.id, nextProps)} props={mergeDefaultProps(definition.defaultProps, widget.props)} />
      ) : definition.editor?.inspector === "rich" ? (
        <RichWidgetInspector onChange={(nextProps) => updateWidgetProps(widget.id, nextProps)} props={mergeDefaultProps(definition.defaultProps, widget.props)} type={widget.type} />
      ) : (
        <div className="grid gap-4">
          {Object.entries(mergeDefaultProps(definition.defaultProps, widget.props)).map(([key, value]) => (
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

function RichWidgetInspector({ onChange, props, type }: { onChange: (props: Record<string, unknown>) => void; props: unknown; type: string }) {
  const value = asRecord(props);
  const [githubStatus, setGithubStatus] = useState("");
  const [mapSearchStatus, setMapSearchStatus] = useState("");

  function updateGithubProfile(profileUrl: string) {
    const username = parseGithubUsername(profileUrl);

    if (!username) {
      onChange({ profileUrl });
      setGithubStatus(profileUrl.trim() ? "请输入有效的 GitHub 个人主页，例如 https://github.com/octocat。" : "");
      return;
    }

    const href = `https://github.com/${username}`;

    onChange({
      activityImageUrl: buildGithubActivityImageUrl(username),
      href,
      profileUrl: href,
      summary: "",
      username,
    });
    setGithubStatus("已生成真实 GitHub 贡献活跃度卡片。");
  }

  async function searchMapLocation() {
    const query = stringValue(value.location, stringValue(value.title));

    if (!query.trim()) {
      setMapSearchStatus("请输入地址后再搜索。");
      return;
    }

    setMapSearchStatus("搜索中...");

    try {
      const result = await searchAddress(query);

      if (!result) {
        setMapSearchStatus("没有找到地址，请换一个更具体的地点。");
        return;
      }

      const latitude = Number.parseFloat(result.lat);
      const longitude = Number.parseFloat(result.lon);
      const zoom = 15;
      const nextLocation = result.display_name || query;

      onChange({
        location: nextLocation,
        latitude,
        longitude,
        zoom,
        href: getOpenStreetMapHref(latitude, longitude, zoom),
        embedUrl: "",
      });
      setMapSearchStatus("已定位并更新地图亮点。");
    } catch {
      setMapSearchStatus("搜索失败，请稍后重试或手动填写坐标。");
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField label="标题 (Title)" onChange={(title) => onChange({ title })} value={stringValue(value.title)} />
      {type === "github-activity" ? (
        <div className="grid gap-2">
          <TextField label="GitHub 主页链接" onChange={updateGithubProfile} placeholder="https://github.com/octocat" type="url" value={stringValue(value.profileUrl, stringValue(value.href))} />
          <button className="min-h-11 rounded-[14px] bg-[#121214] px-4 text-sm font-bold text-white transition hover:bg-[#333338] focus:outline-none focus:ring-4 focus:ring-[#3FA3EB]/[0.16]" onClick={() => updateGithubProfile(stringValue(value.profileUrl, stringValue(value.href, stringValue(value.username))))} type="button">
            更新活跃度卡片
          </button>
          {githubStatus ? <p className="text-xs font-semibold leading-5 text-zinc-500">{githubStatus}</p> : null}
        </div>
      ) : null}
      {type === "music" ? <TextField label="艺术家 / 来源" onChange={(artist) => onChange({ artist })} value={stringValue(value.artist)} /> : null}
      {type === "map" ? (
        <div className="grid gap-2">
          <TextField label="地点" onChange={(location) => onChange({ location })} value={stringValue(value.location)} />
          <button className="min-h-11 rounded-[14px] bg-[#121214] px-4 text-sm font-bold text-white transition hover:bg-[#333338] focus:outline-none focus:ring-4 focus:ring-[#3FA3EB]/[0.16]" onClick={searchMapLocation} type="button">
            搜索并定位
          </button>
          {mapSearchStatus ? <p className="text-xs font-semibold leading-5 text-zinc-500">{mapSearchStatus}</p> : null}
        </div>
      ) : null}
      {type === "media" ? (
        <SelectField
          label="媒体类型"
          onChange={(mediaType) => onChange({ mediaType })}
          options={[
            { label: "图片", value: "image" },
            { label: "视频", value: "video" },
          ]}
          value={stringValue(value.mediaType, "image")}
        />
      ) : null}

      {type === "github-activity" ? <TextField label="GitHub 用户名" onChange={(username) => updateGithubProfile(username)} placeholder="octocat" value={stringValue(value.username)} /> : null}
      {type === "music" ? <TextField label="平台" onChange={(provider) => onChange({ provider })} value={stringValue(value.provider)} /> : null}
      {type === "media" ? <MediaImageFields onChange={onChange} value={stringValue(value.imageUrl)} /> : null}

      {type !== "github-activity" ? (
        <div className="sm:col-span-2">
          <TextField label={type === "map" ? "备用嵌入地址 (高级)" : "嵌入地址 (Embed URL)"} onChange={(embedUrl) => onChange({ embedUrl })} type="url" value={stringValue(value.embedUrl)} />
        </div>
      ) : null}
      {type === "map" ? (
        <div className="grid gap-3 sm:col-span-2 sm:grid-cols-3">
          <TextField label="纬度" onChange={(latitude) => onChange({ latitude: numberOrUndefined(latitude) })} type="number" value={stringValue(value.latitude, String(value.latitude ?? ""))} />
          <TextField label="经度" onChange={(longitude) => onChange({ longitude: numberOrUndefined(longitude) })} type="number" value={stringValue(value.longitude, String(value.longitude ?? ""))} />
          <TextField label="缩放" onChange={(zoom) => onChange({ zoom: numberOrUndefined(zoom) })} type="number" value={stringValue(value.zoom, String(value.zoom ?? ""))} />
        </div>
      ) : null}
      <div className="sm:col-span-2">
        <TextField label="跳转链接 (URL)" onChange={(href) => onChange({ href })} type="url" value={stringValue(value.href)} />
      </div>
      {type === "media" ? (
        <div className="sm:col-span-2">
          <TextAreaField label="说明" onChange={(caption) => onChange({ caption })} value={stringValue(value.caption)} />
        </div>
      ) : null}
    </div>
  );
}

function MediaImageFields({ onChange, value }: { onChange: (props: Record<string, unknown>) => void; value: string }) {
  return (
    <div className="grid gap-2">
      <TextField label="图片地址" onChange={(imageUrl) => onChange({ imageUrl, mediaType: "image", embedUrl: "" })} type="url" value={value} />
      <label className="grid min-w-0 gap-1.5">
        <span className="text-[0.75rem] font-bold uppercase tracking-[0.04em] text-[#72727a]">上传图片</span>
        <input
          accept="image/svg+xml,image/png,image/jpeg,image/webp"
          className="min-h-11 rounded-[14px] border-[1.5px] border-black/10 bg-black/[0.02] px-4 py-3 text-sm font-medium text-[#121214] outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[#121214] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white focus:border-[#3FA3EB] focus:bg-white focus:ring-4 focus:ring-[#3FA3EB]/[0.12]"
          onChange={async (event) => {
            const file = uploadFile(event);

            if (!file) {
              return;
            }

            onChange({ imageUrl: await fileToDataUrl(file), mediaType: "image", embedUrl: "" });
          }}
          type="file"
        />
      </label>
      {value ? <p className="text-xs font-semibold leading-5 text-zinc-500">图片会作为 data URL 保存在 widget JSON 中。</p> : null}
    </div>
  );
}

function PropertyField({ label, onChange, value }: { label: string; onChange: (value: unknown) => void; value: unknown }) {
  if (Array.isArray(value)) {
    return <LinksField label={label} onChange={onChange} value={value} />;
  }

  if (label === "background" && isWidgetBackground(value)) {
    return <BackgroundField label="背景" onChange={onChange} value={value} />;
  }

  if (typeof value === "string" && (label === "bio" || label === "body")) {
    return <TextAreaField label={label} onChange={onChange} value={value} />;
  }

  return <TextField label={label} onChange={onChange} value={typeof value === "string" ? value : String(value ?? "")} />;
}

function mergeDefaultProps(defaultProps: unknown, props: unknown) {
  return { ...asRecord(defaultProps), ...asRecord(props) };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

type NominatimSearchResult = {
  display_name?: string;
  lat: string;
  lon: string;
};

async function searchAddress(query: string): Promise<NominatimSearchResult | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", query);

  const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });

  if (!response.ok) {
    throw new Error("Address search failed");
  }

  const results = (await response.json()) as NominatimSearchResult[];

  return results[0] ?? null;
}

function getOpenStreetMapHref(latitude: number, longitude: number, zoom: number) {
  const lat = latitude.toFixed(4);
  const lon = longitude.toFixed(4);

  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;
}

function numberOrUndefined(value: string) {
  const number = Number.parseFloat(value);

  return Number.isFinite(number) ? number : undefined;
}

function isWidgetBackground(value: unknown): value is WidgetBackground {
  const background = asRecord(value);

  return background.type === "theme" || background.type === "solid" || background.type === "gradient";
}
