import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PageRenderer } from "@/components/page/page-renderer";
import { getPageDocumentTitle } from "../page-config/metadata";
import { normalizePageConfig } from "../page-config/normalize";
import type { PageConfig } from "../page-config/types";

export type StaticPageHtmlOptions = {
  styles?: string;
};

export function renderStaticPageHtml(config: PageConfig, options: StaticPageHtmlOptions = {}) {
  const normalized = normalizePageConfig(config);
  const title = getPageDocumentTitle(normalized);
  const pageMarkup = renderToStaticMarkup(createElement(PageRenderer, { config: normalized }));
  const baseCss = getStandaloneBaseCss(normalized);
  const styles = [baseCss, options.styles].filter(Boolean).join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(normalized.description ?? "")}">
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>${sanitizeStyleContent(styles)}</style>
</head>
<body>
  ${pageMarkup}
</body>
</html>`;
}

export function collectDocumentStyles() {
  if (typeof document === "undefined") {
    return "";
  }

  const styleChunks: string[] = [];

  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (isEditorOnlyNode(sheet.ownerNode)) {
        continue;
      }

      if (sheet.href && new URL(sheet.href).origin !== window.location.origin) {
        continue;
      }

      const cssText = Array.from(sheet.cssRules)
        .map((rule) => rule.cssText)
        .join("\n");

      if (cssText) {
        styleChunks.push(cssText);
      }
    } catch {
      // Cross-origin stylesheets, such as Google Fonts, cannot be read from the browser.
    }
  }

  if (!styleChunks.length) {
    for (const style of Array.from(document.querySelectorAll("style"))) {
      if (isEditorOnlyNode(style)) {
        continue;
      }

      if (style.textContent) {
        styleChunks.push(style.textContent);
      }
    }
  }

  return Array.from(new Set(styleChunks)).join("\n");
}

function isEditorOnlyNode(node: unknown) {
  return Boolean(
    node &&
      typeof node === "object" &&
      "getAttribute" in node &&
      typeof (node as { getAttribute?: unknown }).getAttribute === "function" &&
      (node as { getAttribute: (name: string) => string | null }).getAttribute("data-editor-only") === "true",
  );
}

function getStandaloneBaseCss(config: PageConfig) {
  const radius = config.theme.radius === "soft" ? "22px" : config.theme.radius === "pill" ? "38px" : "32px";

  return `:root{--mg-bg:${config.theme.background};--mg-fg:${config.theme.foreground};--mg-card:${config.theme.card};--mg-accent:${config.theme.accent};--mg-radius:${radius}}*{box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}body{margin:0;min-height:100vh;font-family:'Plus Jakarta Sans',Inter,ui-sans-serif,system-ui,sans-serif;background:var(--mg-bg,${config.theme.background});color:var(--mg-fg,${config.theme.foreground})}@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important;scroll-behavior:auto!important}}`;
}

export { getStandaloneBaseCss };

function sanitizeStyleContent(styles: string) {
  return styles.replace(/<\/style/gi, "<\\/style");
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

  return value.replace(/[&<>"]/g, (char) => entities[char] ?? char);
}
