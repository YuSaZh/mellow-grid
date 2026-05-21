import { BENTO_CELL_SIZE, BENTO_COLS, BENTO_GAP, BENTO_GRID_WIDTH, BENTO_ROW_HEIGHT, clampBentoLayoutItem } from "../page-config/bento-layout";
import { normalizePageConfig } from "../page-config/normalize";
import type { GridLayoutItem, PageConfig, WidgetInstance } from "../page-config/types";

type LinkWidgetProps = {
  background?: { type: "theme" } | { type: "solid"; value: string } | { type: "gradient"; from: string; to: string; angle?: number };
  color?: string;
  description?: string;
  href?: string;
  logo?: { type: "builtin"; key: string } | { type: "uploaded"; url: string; alt?: string };
  title?: string;
};

const DEFAULT_CARD_BACKGROUND = "linear-gradient(180deg,#313030 0%,#121313 100%)";

export function renderStaticPageHtml(config: PageConfig) {
  const normalized = normalizePageConfig(config);
  const widgetsById = new Map(normalized.widgets.map((widget) => [widget.id, widget]));
  const cards = normalized.layout
    .map(clampBentoLayoutItem)
    .map((item) => renderCard(item, widgetsById.get(item.i)))
    .filter(Boolean)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(normalized.description ?? "")}">
  <title>${escapeHtml(normalized.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>${getStaticCss(normalized.theme.background, normalized.theme.foreground)}</style>
</head>
<body>
  <main class="page-shell">
    <div class="page-container">
      <aside class="sidebar">
        <div class="avatar-wrapper">${normalized.profile.avatarUrl ? `<span class="avatar-image" style="background-image:url('${escapeAttribute(normalized.profile.avatarUrl)}')" role="img" aria-label="${escapeAttribute(normalized.profile.name)} avatar"></span>` : getGlitchAvatar()}</div>
        <h1 class="profile-title">${escapeHtml(normalized.profile.name)}</h1>
        ${normalized.profile.location ? `<p class="profile-location">${escapeHtml(normalized.profile.location)}</p>` : ""}
        ${normalized.profile.bio ? `<p class="profile-bio">${escapeHtml(normalized.profile.bio)}</p>` : ""}
      </aside>
      <section class="bento-grid" style="--bento-cols:${BENTO_COLS};--bento-cell-size:${BENTO_CELL_SIZE}px;--bento-gap:${BENTO_GAP}px;--bento-grid-width:${BENTO_GRID_WIDTH}px;--bento-row-height:${BENTO_ROW_HEIGHT}px;">
${cards}
      </section>
    </div>
  </main>
</body>
</html>`;
}

function renderCard(item: GridLayoutItem, widget?: WidgetInstance) {
  if (!widget) {
    return "";
  }

  if (widget.type !== "link") {
    return renderGenericCard(item, widget);
  }

  const props = asLinkProps(widget.props);
  const title = props.title || "Link";
  const description = props.description ?? props.href ?? "";
  const href = props.href || "#";
  const background = getBackground(props.background);
  const light = isLightBackground(background);
  const icon = getIconMarkup(props.logo, props.color || (light ? "#1a1a1a" : "#ffffff"), title);

  return `        <a class="bento-card ${light ? "light-card" : ""}" href="${escapeAttribute(href)}" style="grid-column:${item.x + 1} / span ${item.w};grid-row:${item.y + 1} / span ${item.h};background:${escapeAttribute(background)};color:${light ? "#1a1a1a" : "#ffffff"}">
          <div class="card-top">${icon}</div>
          <div class="card-bottom"><div class="card-title">${escapeHtml(title)}</div>${description ? `<div class="card-handle">${escapeHtml(description)}</div>` : ""}</div>
        </a>`;
}

function renderGenericCard(item: GridLayoutItem, widget: WidgetInstance) {
  const props = widget.props as Record<string, unknown>;
  const title = typeof props.title === "string" ? props.title : widget.type;
  const body = typeof props.body === "string" ? props.body : typeof props.label === "string" ? props.label : "";

  return `        <section class="bento-card" style="grid-column:${item.x + 1} / span ${item.w};grid-row:${item.y + 1} / span ${item.h};background:${DEFAULT_CARD_BACKGROUND};color:#ffffff">
          <div class="card-top"><span class="text-icon">${escapeHtml(widget.type.slice(0, 2).toUpperCase())}</span></div>
          <div class="card-bottom"><div class="card-title">${escapeHtml(title)}</div>${body ? `<div class="card-handle">${escapeHtml(body)}</div>` : ""}</div>
        </section>`;
}

function asLinkProps(value: unknown): LinkWidgetProps {
  return value && typeof value === "object" ? (value as LinkWidgetProps) : {};
}

function getBackground(background: LinkWidgetProps["background"]) {
  if (!background || background.type === "theme") {
    return DEFAULT_CARD_BACKGROUND;
  }

  if (background.type === "solid") {
    return background.value || DEFAULT_CARD_BACKGROUND;
  }

  return `linear-gradient(${background.angle ?? 135}deg, ${background.from || "#313030"} 0%, ${background.to || "#121313"} 100%)`;
}

function getIconMarkup(logo: LinkWidgetProps["logo"], color: string, title: string) {
  if (logo?.type === "uploaded" && logo.url) {
    return `<span class="icon-3d uploaded-icon" style="background-image:url('${escapeAttribute(logo.url)}')" role="img" aria-label="${escapeAttribute(logo.alt || title)}"></span>`;
  }

  const icon = logo?.type === "builtin" ? ICONS[logo.key] : undefined;
  return `<span class="icon-3d" style="color:${escapeAttribute(color)}">${icon ?? escapeHtml(title.slice(0, 2).toUpperCase())}</span>`;
}

const ICONS: Record<string, string> = {
  x: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>`,
  figma: `<svg viewBox="0 0 24 36"><path fill="#F24E1E" d="M6 12a6 6 0 1 1 0-12h6v12H6z"/><path fill="#FF7262" d="M12 0h6a6 6 0 1 1-6 6V0z"/><path fill="#A259FF" d="M6 24a6 6 0 1 1 0-12h6v12H6z"/><path fill="#1ABCFE" d="M12 12a6 6 0 1 1 6 6h-6v-6z"/><path fill="#0ACF83" d="M6 36a6 6 0 1 1 6-6v6H6z"/></svg>`,
  medium: `<span class="text-icon">M</span>`,
  pinterest: `<svg viewBox="0 0 48 48"><path fill="currentColor" d="M24 5C13.5 5 8 12.1 8 19.8c0 5.1 2.8 9.1 7.2 10.7.8.3 1.2 0 1.4-.8l.5-2.1c.2-.7.1-1-.4-1.6-1.4-1.6-2.3-3.5-2.3-6.4 0-7.4 5.5-12.6 14-12.6 7.6 0 12.4 4.6 12.4 11.5 0 8.4-4.2 14.3-9.8 14.3-3 0-5.2-2.5-4.5-5.5.9-3.6 2.5-7.4 2.5-10 0-2.3-1.2-4.2-3.8-4.2-3 0-5.4 3.1-5.4 7.3 0 2.7.9 4.5.9 4.5l-3.7 15.7c-.6 2.5-.4 5.9-.1 8.2.1.7 1 .9 1.4.3 1.2-1.7 3.1-4.9 3.8-7.4l1.8-7c1 1.9 3.8 3.5 6.8 3.5 9 0 15.5-8.3 15.5-18.6C46 11.8 39.1 5 24 5Z"/></svg>`,
  discord: `<svg viewBox="0 0 48 48"><path fill="currentColor" d="M36.8 12.1A31 31 0 0 0 29 9.7l-.8 1.7a28.9 28.9 0 0 0-8.6 0l-.8-1.7a31 31 0 0 0-7.8 2.4C6.1 19.3 4.8 26.4 5.4 33.4a31.5 31.5 0 0 0 9.6 4.9l2.1-3.4a20 20 0 0 1-3.3-1.6l.8-.6a22.2 22.2 0 0 0 18.8 0l.8.6c-1 .6-2.1 1.1-3.3 1.6l2.1 3.4a31.5 31.5 0 0 0 9.6-4.9c.8-8.2-1.4-15.2-5.8-21.3ZM18.3 29.1c-1.9 0-3.4-1.7-3.4-3.8s1.5-3.8 3.4-3.8 3.5 1.7 3.4 3.8c0 2.1-1.5 3.8-3.4 3.8Zm11.4 0c-1.9 0-3.4-1.7-3.4-3.8s1.5-3.8 3.4-3.8 3.5 1.7 3.4 3.8c0 2.1-1.5 3.8-3.4 3.8Z"/></svg>`,
  dribbble: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12Zm10.118-12.432c-.227-.059-4.584-1.16-6.224-.438 1.042 2.65 1.51 5.174 1.622 5.855 2.879-1.341 4.462-3.87 4.602-5.417Zm-6.284 6.782c-.134-.799-.652-3.41-1.745-6.141-.122.04-.251.083-.385.127-3.951 1.298-5.347 5.161-5.518 5.679 1.688 1.077 3.693 1.705 5.845 1.705 1.053 0 2.062-.143 3.016-.39-.104-.15-.157-.506-.213-.98Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5Zm-11 19h-3v-11h3v11Zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75Zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759Z"/></svg>`,
  gumroad: `<span class="text-icon">G</span>`,
  stack: `<svg viewBox="0 0 48 48"><path fill="currentColor" d="M14 36h20v4H14v-4Zm1-8 19 4 .8-3.9-19-4-.8 3.9Zm2.5-9.2 17.6 8.3 1.7-3.6-17.6-8.3-1.7 3.6Zm5-8.7L38 22.2l2.5-3.1L25 7l-2.5 3.1ZM14 30h20v4H14v-4Z"/></svg>`,
  instagram: `<svg viewBox="0 0 48 48"><rect x="9" y="9" width="30" height="30" rx="9" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="24" cy="24" r="7" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="33" cy="15" r="2" fill="currentColor"/></svg>`,
  reddit: `<svg viewBox="0 0 48 48"><path fill="currentColor" d="M37.8 19.9c-1.4 0-2.6.6-3.4 1.5-2.5-1.7-5.9-2.8-9.6-2.9l1.7-7.7 5.3 1.1a3.7 3.7 0 1 0 .4-2l-6.3-1.3c-.5-.1-1 .2-1.1.7l-2 9.2c-3.8.1-7.2 1.2-9.8 2.9a4.6 4.6 0 1 0-5.1 7.4 8.2 8.2 0 0 0-.1 1.2c0 6.4 7.3 11.6 16.2 11.6S40.2 36.4 40.2 30c0-.4 0-.8-.1-1.2a4.6 4.6 0 0 0-2.3-8.9ZM17 28.1a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Zm13.2 7.1c-1.8 1.8-4.9 2-6.2 2s-4.4-.2-6.2-2a1 1 0 0 1 1.4-1.4c1.1 1.1 3.3 1.4 4.8 1.4s3.7-.3 4.8-1.4a1 1 0 1 1 1.4 1.4Zm.8-7.1a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z"/></svg>`,
  coffee: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.2 6h-1.5V5c0-1.1-.9-2-2-2h-10c-1.1 0-2 .9-2 2v8c0 2.2 1.8 4 4 4h5.5c2 0 3.7-1.5 3.9-3.5l.8-5c.2-.9-.5-1.5-1.2-1.5h-.5v-.5c0-.8-.7-1.5-1.5-1.5Zm-11.2 9c-1.1 0-2-.9-2-2V5h9v8c0 1.1-.9 2-2 2H9Z"/></svg>`,
  website: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm7.9 9h-3.2a15.7 15.7 0 0 0-1.1-5 8.05 8.05 0 0 1 4.3 5ZM12 4.04c.8 1.16 1.48 2.88 1.72 4.96h-3.44C10.52 6.92 11.2 5.2 12 4.04Z"/></svg>`,
};

function getStaticCss(background: string, foreground: string) {
  return `*{box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}body{margin:0;min-height:100vh;font-family:'Plus Jakarta Sans',Inter,ui-sans-serif,system-ui,sans-serif;background:${background};color:${foreground}}.page-shell{min-height:100vh;display:grid;place-items:center;padding:4rem 2rem}.page-container{width:100%;max-width:1240px;display:flex;gap:4rem;align-items:flex-start}.sidebar{flex:0 0 340px;position:sticky;top:4rem}.avatar-wrapper{width:140px;height:140px;border-radius:50%;background:#111113;padding:4px;overflow:hidden;box-shadow:0 15px 35px rgba(0,0,0,.15),inset 1.5px 1.5px 0 rgba(255,255,255,.15),inset -2px -2px 5px rgba(0,0,0,.4);margin-bottom:2.2rem}.avatar-image{display:block;width:100%;height:100%;border-radius:50%;background-size:cover;background-position:center}.avatar-svg{display:block;width:100%;height:100%;border-radius:50%}.profile-title{font-size:2.5rem;font-weight:800;letter-spacing:-1px;line-height:1.08;margin:0 0 1rem;color:#111113}.profile-location{font-size:.78rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#9b9ba4;margin:0 0 .75rem}.profile-bio{font-size:1.05rem;line-height:1.6;color:#5d5d65;margin:0}.bento-grid{flex:1;display:grid;grid-template-columns:repeat(var(--bento-cols),var(--bento-cell-size));grid-auto-rows:var(--bento-row-height);gap:var(--bento-gap);width:var(--bento-grid-width)}.bento-card{border-radius:38px;padding:1.8rem 2rem;display:flex;flex-direction:column;justify-content:space-between;text-decoration:none;position:relative;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,.05),inset 1.5px 1.5px 1px rgba(255,255,255,.4),inset -2px -2px 3px rgba(0,0,0,.1);border:1px solid rgba(255,255,255,.08);transition:all .45s cubic-bezier(.165,.84,.44,1)}.bento-card:hover{transform:translateY(-8px) scale(1.015);box-shadow:0 22px 45px rgba(0,0,0,.09),inset 2px 2px 1.5px rgba(255,255,255,.45),inset -2px -2px 3px rgba(0,0,0,.08)}.light-card{box-shadow:0 12px 30px rgba(0,0,0,.03),inset 1.8px 1.8px 1px rgba(255,255,255,.9),inset -2px -2px 4px rgba(0,0,0,.05);border-color:rgba(255,255,255,.5)}.card-top{display:flex;align-items:flex-start}.card-bottom{margin-top:1.5rem}.card-title{font-size:1.15rem;font-weight:700;letter-spacing:-.3px;margin-bottom:.15rem}.card-handle{font-size:.85rem;font-weight:500;opacity:.7}.icon-3d{width:46px;height:46px;display:grid;place-items:center;filter:drop-shadow(1.5px 2px 1.5px rgba(0,0,0,.15)) drop-shadow(5px 9px 8px rgba(0,0,0,.22)) drop-shadow(10px 16px 18px rgba(0,0,0,.14));transition:all .45s cubic-bezier(.165,.84,.44,1)}.icon-3d svg{width:100%;height:100%;display:block}.bento-card:hover .icon-3d{transform:scale(1.12) translate(-3px,-5px)}.uploaded-icon{background-size:contain;background-position:center;background-repeat:no-repeat}.text-icon{display:grid;place-items:center;width:46px;height:46px;border-radius:14px;background:linear-gradient(180deg,#fff 0%,#ade0ff 100%);color:#171717;font-weight:900}@media(max-width:1024px){.page-shell{padding:3rem 1.5rem}.page-container{flex-direction:column;gap:2.5rem;align-items:center;max-width:760px}.sidebar{position:static;flex:auto;text-align:center}.bento-grid{width:100%;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:auto}.bento-card{grid-column:auto/span 1!important;grid-row:auto!important;aspect-ratio:1}}@media(max-width:480px){.page-shell{padding:2rem 1rem}.bento-grid{grid-template-columns:1fr;gap:16px}.profile-title{font-size:2.1rem}}`;
}

function getGlitchAvatar() {
  return `<svg class="avatar-svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#0c0c0e"/><line x1="0" y1="20" x2="100" y2="20" stroke="#1d1d23" stroke-width="0.5"/><line x1="0" y1="40" x2="100" y2="40" stroke="#1d1d23" stroke-width="0.5"/><line x1="0" y1="60" x2="100" y2="60" stroke="#1d1d23" stroke-width="0.5"/><line x1="0" y1="80" x2="100" y2="80" stroke="#1d1d23" stroke-width="0.5"/><path d="M50,15 C41,15 28,24 28,45 C28,58 35,68 38,72 L36,85 L62,85 L60,72 C63,68 70,58 70,45 C70,24 59,15 50,15 Z" fill="#00f0ff" opacity="0.6" transform="translate(-2, 1)"/><path d="M50,15 C41,15 28,24 28,45 C28,58 35,68 38,72 L36,85 L62,85 L60,72 C63,68 70,58 70,45 C70,24 59,15 50,15 Z" fill="#ff007f" opacity="0.6" transform="translate(2, -1)"/><path d="M50,15 C41,15 28,24 28,45 C28,58 35,68 38,72 L36,85 L62,85 L60,72 C63,68 70,58 70,45 C70,24 59,15 50,15 Z" fill="#1b1c21"/><rect x="15" y="30" width="18" height="4" fill="#00f0ff" opacity="0.8"/><rect x="68" y="32" width="15" height="3" fill="#ff007f" opacity="0.8"/><rect x="25" y="55" width="55" height="1.5" fill="#ffffff" opacity="0.9"/><rect x="40" y="65" width="30" height="2" fill="#00f0ff" opacity="0.7"/><rect x="20" y="74" width="12" height="3" fill="#ff007f" opacity="0.8"/></svg>`;
}

function isLightBackground(background: string) {
  return /#(?:fff|fcfcfc|f7f7f2|e6e6e6|ffea79|ffe181|f5c13d|fce3fe|eaa2f0|ffe8ee|dde2ff|dff0ff|fff1df|ffe0f1|ffd39a|ffe4d8)/i.test(background);
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
