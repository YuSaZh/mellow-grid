import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PageRenderer } from "@/components/page/page-renderer";
import { normalizePageConfig } from "../page-config/normalize";
import type { PageConfig } from "../page-config/types";

export type StaticPageHtmlOptions = {
  styles?: string;
};

export function renderStaticPageHtml(config: PageConfig, options: StaticPageHtmlOptions = {}) {
  const normalized = normalizePageConfig(config);
  const pageMarkup = renderToStaticMarkup(createElement(PageRenderer, { config: normalized }));
  const styles = getStandaloneStyleContent(normalized, options.styles);

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
      if (sheet.href && typeof window !== "undefined" && new URL(sheet.href).origin !== window.location.origin) {
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
      if (style.textContent) {
        styleChunks.push(style.textContent);
      }
    }
  }

  return Array.from(new Set(styleChunks)).join("\n");
}

function getStandaloneStyleContent(config: PageConfig, collectedStyles?: string) {
  return [getStandaloneBaseCss(config), collectedStyles].filter(Boolean).join("\n");
}

function getStandaloneBaseCss(config: PageConfig) {
  return `*{box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}body{margin:0;min-height:100vh;font-family:'Plus Jakarta Sans',Inter,ui-sans-serif,system-ui,sans-serif;background:${config.theme.background};color:${config.theme.foreground}}`;
}

function sanitizeStyleContent(styles: string) {
  return styles.replace(/<\/style/gi, "<\\/style");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char] ?? char);
}
