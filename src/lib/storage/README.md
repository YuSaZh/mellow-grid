# Storage adapters

MellowGrid uses a storage adapter so deployment modes can change without rewriting the editor or page renderer.

- `staticStorage`: static export and GitHub Pages mode. Public config is bundled; editor changes can be exported or saved to browser storage later.
- `fileStorage`: Node.js, VPS, and Docker mode. Config is persisted as JSON files under `MELLOWGRID_DATA_DIR/pages`.
- `remoteStorage`: planned for KV, Supabase, or custom APIs.
