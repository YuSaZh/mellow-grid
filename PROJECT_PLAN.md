# MellowGrid Project Plan

## Current Direction

MellowGrid has been migrated to an Astro-first static architecture:

```txt
/         static personal homepage
/editor   React editor island, loaded only while editing
```

The project is optimized for a single-person homepage workflow. The public page should stay lightweight, and editor-only JavaScript should not be loaded on the homepage.

## Current Stack

- Astro static output
- React editor island
- TypeScript
- Tailwind CSS utilities and project CSS
- Zustand editor state
- Custom Bento grid/layout helpers

## Active Routes

- `src/pages/index.astro` renders the public homepage from `defaultPageConfig`.
- `src/pages/editor.astro` loads the React editor with `client:only="react"`.

## Active Widgets

The current widget registry supports the core homepage widgets and the richer personal-page widgets now used by the default showcase:

- `link`
- `text`
- `divider`
- `github-activity`
- `music`
- `map`
- `media`

Removed widgets such as the old `links` and `stats` modules should not be reintroduced unless the design is revisited.

## Storage and Export Model

- The editor saves drafts to browser `sessionStorage` and handles blocked or unavailable session storage without crashing.
- JSON import/export remains available for backups and manual config movement.
- Static HTML export remains available for standalone publishing.
- There is no active file-mode backend, page-save API, storage adapter layer, or Docker deployment path.

## Generated Artifacts

The following are generated artifacts and should stay out of git:

- `dist/`
- `.astro/`

They can be regenerated with `npm run build`.

## Near-Term Priorities

1. Keep homepage and editor rendering visually aligned.
2. Keep the public homepage static and minimal.
3. Continue improving editor WYSIWYG behavior.
4. Refine existing rich widgets and add only widgets that fit the current Bento design.
5. Keep the default showcase populated with every registered widget type and covered by non-overlap layout tests.
6. Keep sample data anonymized with generic placeholders.

## Maintenance Notes

- Do not add a backend unless there is a clear new requirement.
- Do not load editor-only React code on the public homepage.
- Keep new modules registered through `src/lib/widgets/registry.ts`.
- Keep generated folders ignored and disposable.
