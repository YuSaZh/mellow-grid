# MellowGrid

MellowGrid is a lightweight Bento-style personal homepage project. The current architecture is based on Astro: the public homepage is static, and the editor is a React island that only loads on `/editor`.

<p align="center">
  <a href="README.md">简体中文</a> | <a href="README.en.md">English</a>
</p>

## Routes

- `/`: static personal homepage rendered from `defaultPageConfig`.
- `/editor`: visual React editor loaded with `client:only="react"`.

## Current Architecture

- Astro static output for the public homepage.
- React + Zustand for editor interactions.
- Editor drafts are saved in browser `localStorage`.
- The editor supports JSON import/export and standalone static HTML export.
- The current single-user workflow no longer includes a runtime backend, page-save API, file storage adapter, or Docker deployment files.

## Features

- Bento-style public homepage.
- Visual editing for the profile and right-side modules.
- Add, delete, select, and edit modules.
- Drag-to-move and drag-to-resize grid cards.
- JSON config import/export.
- Static HTML export.

## Active Widgets

The current widget registry contains:

- `link`: social or external link cards.
- `text`: text/content cards.
- `divider`: borderless section divider text.

## Quick Start

```bash
npm ci
npm run dev
```

Open:

- Homepage: <http://localhost:4321/>
- Editor: <http://localhost:4321/editor>

## Scripts

```bash
npm run dev     # Start Astro dev server
npm run build   # Build static output
npm run start   # Preview the build output
npm run lint    # Run Astro checks
npm test        # Run Vitest
```

## Project Structure

```txt
src/pages/index.astro          Static homepage route
src/pages/editor.astro         React editor island route
src/app/editor/                Editor UI, state, and inspectors
src/components/page/           Shared homepage and preview renderers
src/lib/page-config/           Page config types, defaults, and normalization
src/lib/page-export/           Static HTML export helpers
src/lib/widgets/registry.ts    Active widget registry
src/widgets/                   Widget implementations
data/pages/username.json       Example import/export config
```

`dist/` and `.astro/` are generated directories. They are ignored by git and can be regenerated with `npm run build`.

## Editing Workflow

1. Open `/editor`.
2. Adjust the profile and modules visually.
3. Save a local browser draft.
4. Export JSON for backup or static HTML for publishing.

Sample data uses generic placeholders such as `Username`, `Location`, and example URLs.

## License

Licensed under the [MIT License](LICENSE).
