<h1 align="center">MellowGrid</h1>

<p align="center">
  <img alt="Status: in development" src="https://img.shields.io/badge/status-in%20development-orange">
  <img alt="Usability: not yet" src="https://img.shields.io/badge/usable-not%20yet-red">
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript 5" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Docker supported" src="https://img.shields.io/badge/Docker-supported-2496ED?logo=docker&logoColor=white">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-green"></a>
</p>

<p align="center">
  <a href="README.md">简体中文</a> | <a href="README.en.md">English</a>
</p>

> [!WARNING]
> MellowGrid is still in early development. The current version is not ready for use and is not recommended for production personal homepages or deployments.

MellowGrid is a personal, self-hostable, Bento-style homepage project. It combines a public profile page, a visual editor, modular cards, and flexible deployment modes in one lightweight codebase.

> Current scope: a personal homepage editor, not a multi-tenant SaaS product. The project focuses on easy personal maintenance, clear deployment options, and simple module extension.

## Highlights

- **Bento-style public homepage**: visit `/:username` to render a profile panel with a modular Bento grid.
- **Visual editor**: use `/editor` to add widgets, move cards, resize cards, edit content, and import/export JSON.
- **Modular widget system**: built-in widgets include `links`, `text`, `stats`, and `social`.
- **Shared Bento Grid**: the public page and editor share the same 8-column layout interpretation.
- **Flexible deployment modes**: static mode, local/server file mode, and a reserved remote storage adapter path.
- **Self-hosting with Docker**: includes `Dockerfile` and `docker-compose.yml` for VPS, NAS, or personal server deployments.

## Current Status

Implemented:

- Public homepage at `/:username`.
- Visual editor at `/editor`.
- Widget add, delete, select, and property editing.
- Drag-to-move and drag-to-resize Bento cards.
- JSON import/export.
- Browser local draft saving in `static` mode.
- JSON file persistence in `file` mode through `data/pages/<username>.json`.
- Docker standalone build and Docker Compose configuration.

Planned or in progress:

- Remote storage adapters such as KV, Supabase, or custom APIs.
- Editor password protection and save API authentication.
- More widgets: image, music, map, GitHub, QR code, and more.
- A fuller theme system and page config validation.
- Static export and GitHub Pages documentation.

## Quick Start

### 1. Install dependencies

```bash
npm ci
```

### 2. Start the development server

```bash
npm run dev
```

Open:

- Public page: <http://localhost:3000/username>
- Editor: <http://localhost:3000/editor>

The root path `/` redirects to the user configured by `MELLOWGRID_DEFAULT_USER`; when unset, it defaults to `username`.

## Scripts

```bash
npm run dev      # Start the development server
npm run build    # Build for production
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `MELLOWGRID_MODE` | `file` in development, `static` in production | Deployment mode: `static`, `file`, or reserved `remote`. |
| `MELLOWGRID_DEFAULT_USER` | `username` | Username used by the root redirect and editor default page. |
| `MELLOWGRID_DATA_DIR` | `./data` | Data directory for page JSON files in `file` mode. |
| `MELLOWGRID_EDITOR_PASSWORD` | empty | Reserved; editor authentication is not implemented yet. |

## Deployment Modes

### File mode: recommended for local, VPS, and Docker deployments

`file` mode reads page config from `MELLOWGRID_DATA_DIR/pages` and writes JSON files when the editor saves.

```bash
MELLOWGRID_MODE=file
MELLOWGRID_DEFAULT_USER=username
MELLOWGRID_DATA_DIR=./data
```

Best for:

- Local long-running usage
- VPS / NAS / personal servers
- Docker Compose self-hosting

### Static mode: static hosting

`static` mode does not persist editor changes to the public page. Editor saves are stored in browser localStorage, which makes this mode useful for local drafts, JSON export, and redeploy workflows.

Best for:

- Static hosting
- GitHub Pages-like environments
- Scenarios where the server cannot write files

### Remote mode: reserved extension point

`remote` is reserved for future storage adapters such as KV, Supabase, Cloudflare, Upstash, or custom APIs. Remote persistence is not implemented yet.

## Docker Compose

```bash
docker compose up --build
```

The service listens on:

```txt
http://localhost:3000
```

`docker-compose.yml` uses `file` mode by default and mounts host `./data` to `/app/data` inside the container:

```yaml
volumes:
  - ./data:/app/data
```

Saved page config files remain under `data/pages` in the repository.

## Project Structure

```txt
mellow-grid/
├─ data/pages/                 # Sample page data for file mode
├─ docs/superpowers/specs/     # Design docs and specs
├─ src/
│  ├─ app/
│  │  ├─ [username]/           # Public homepage route
│  │  ├─ editor/               # Visual editor
│  │  └─ api/pages/[username]/ # Page config API
│  ├─ components/page/         # Page renderer and Bento Grid
│  ├─ components/ui/           # Shared UI primitives
│  ├─ lib/
│  │  ├─ page-config/          # Page config types, defaults, layout utilities
│  │  ├─ storage/              # Storage adapters
│  │  └─ widgets/              # Widget registry
│  └─ widgets/                 # Bento widgets
├─ Dockerfile
├─ docker-compose.yml
├─ next.config.ts
└─ package.json
```

## Extending Widgets

To add a new right-side Bento widget:

1. Create `src/widgets/<widget-name>/index.tsx`.
2. Provide `type`, `name`, `description`, `defaultLayout`, `defaultProps`, and `Component`.
3. Register it in `src/lib/widgets/registry.ts`.
4. If it needs custom editing fields, extend the editor inspector instead of hard-coding logic into the page renderer.

The profile panel is a separate page area and does not use the right-side widget registry.

## Data Model

Page configuration is described by `PageConfig`:

- `username`: page owner username.
- `title` / `description`: page title and description.
- `profile`: left-side profile panel.
- `theme`: background, foreground, card, accent, radius, and shadow settings.
- `layout`: right-side Bento item positions and sizes.
- `widgets`: right-side widget instances and props.
- `updatedAt`: last update time.

Related files:

- `src/lib/page-config/types.ts`
- `src/lib/page-config/defaults.ts`
- `src/lib/page-config/normalize.ts`

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Zustand
- Custom Bento CSS Grid
- Storage adapters: static / file / reserved remote
- Docker standalone build

## Roadmap

- [ ] Add editor authentication and save API authentication.
- [ ] Add page config validation.
- [ ] Add Image, Music, Map, GitHub, QR, and more widgets.
- [ ] Build a fuller theme token system.
- [ ] Improve static mode and GitHub Pages documentation.
- [ ] Add baseline tests and security checks.

## Maintenance Principles

- Keep editor-only dependencies out of the public page when possible.
- Keep storage logic out of UI components.
- Do not modify the whole renderer for a single widget.
- Prefer the widget registry for new right-side modules.
- Prefer storage adapters for new deployment modes.
- Keep sample data generic and avoid real personal information.

## License

Licensed under the [MIT License](LICENSE).
