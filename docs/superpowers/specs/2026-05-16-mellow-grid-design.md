# MellowGrid Design

## Goal

MellowGrid is a personal, open-source Bento-style homepage with a visual editor. It should stay lightweight for self-hosting and static deployment, while keeping the architecture open for richer storage and modules later.

## Product scope

The first version targets a single owner who wants to maintain a public homepage. The editor lets the owner add modules, rearrange them, resize them, change content, preview changes, and save according to the active deployment mode.

Public pages use `/:username`. The editor starts at `/editor` and edits the default user configured by environment or local config.

## Deployment modes

MellowGrid separates editor behavior from persistence through a storage adapter.

### Static mode

Static mode supports GitHub Pages and other static hosts. The public page reads bundled JSON config. The editor can preview changes, save drafts to `localStorage`, and export JSON. To update the public page for visitors, the owner commits the exported config and redeploys.

### File mode

File mode supports local Node.js, VPS, and Docker deployments. The editor saves via a Next.js Route Handler, which writes page config to `data/pages/[username].json`. Public pages read that file on refresh and render the latest saved state. This mode does not require a database.

### Remote mode

Remote mode is reserved for later adapters such as Upstash, Vercel KV, Cloudflare KV, Supabase, or a custom REST backend. The editor and renderer should call the same adapter interface, so adding remote storage does not change UI code.

## Docker readiness

The file storage path must be configurable. Docker deployments should mount persistent data into the app, for example `/app/data`, so saved page configs survive container restarts.

Planned environment variables:

- `MELLOWGRID_MODE`: `static`, `file`, or `remote`
- `MELLOWGRID_DEFAULT_USER`: default profile slug
- `MELLOWGRID_DATA_DIR`: directory for file-mode page configs
- `MELLOWGRID_EDITOR_PASSWORD`: optional lightweight editor protection for file mode

## Module system

Widgets are registered through a central registry. Each widget owns its display component, editable props type, default props, default grid size, and optional editor component.

A page config contains:

- `username`
- `title`
- `theme`
- `layout`
- `widgets`

Each widget instance contains:

- `id`
- `type`
- `props`

Each layout item contains:

- `i`: widget instance id
- `x`, `y`, `w`, `h`
- optional min and max sizes

Adding a module should require creating a widget folder and registering it, not modifying the page renderer.

## Initial widgets

The first implementation should include small, maintainable widgets before advanced external integrations:

- Profile: avatar, name, bio, location
- Text: heading/body or quote
- Links: social/action links
- Stats: simple number labels

Planned follow-up widgets:

- Image
- Music via Spotify embed or HTML audio
- Map via MapLibre/react-map-gl
- GitHub contribution card
- QR code

## Public renderer

The public page resolves a page config for the requested username and renders widgets through the registry. It should not import editor-only code. Styling should emphasize large radius, soft shadows, white space, responsive layout, and light hover motion.

## Editor

The editor will be a client-side workspace with:

- widget library
- draggable/resizable canvas
- selected widget state
- property panel
- preview
- save, import, and export actions

The editor calls a storage service instead of directly knowing whether it is in static, file, or remote mode.

## Styling

Tailwind CSS and CSS variables define theme tokens for background, foreground, card color, radius, shadow, and accent color. Framer Motion can be added for hover lift and entry animation once the static renderer is stable.

## Testing and validation

Early validation should include TypeScript checks, linting, production build, and manual browser checks for `/`, `/:username`, and `/editor` once the editor UI exists.

## Explicit non-goals for the first version

- Multi-user SaaS
- Full account system
- Database requirement
- Plugin marketplace
- Real-time collaborative editing
- Secret-bearing GitHub API writes from a static frontend
