# MellowGrid Editor Layout-First Design

## Goal

The first usable editor should prioritize reliable layout editing while keeping `/editor` visually aligned with the public page. `/editor` should load the same page config used by the public page, show `PageConfig.profile` as a standalone editable profile area outside the Bento grid, let the owner edit right-side modules from local card controls, add modules through an in-grid 2x2 placeholder, adjust module position and size with explicit layout controls, and save or export changes according to the active deployment mode.

The public page must stay lightweight and must not import editor state management or editor-only UI.

## Confirmed direction

The editor will use a layout-first interaction model:

- The right grid is rendered by the same CSS Grid component used by the public page.
- Widget previews show the real public widgets and expose local card-level editing controls when selected.
- Layout controls in the selected-card popover update `x`, `y`, `w`, and `h` directly.
- The profile section remains outside the grid, is not a widget, and supports direct field editing plus avatar upload.

This avoids treating the profile as a grid module while keeping editor interactions layered onto the same layout that `/:username` renders.

## Page structure

`/editor` will be a client-side editor shell with three visible areas:

1. Top toolbar
   - Shows deployment mode and save status.
   - Provides save, preview, import, and export actions.
2. Main editing area
   - Left: directly editable profile area, visually close to the public homepage profile block.
   - Right: the same 8-column Bento CSS Grid used by the public page, with editor overlays.
3. Add module entry
   - Rendered as an in-grid 2x2 placeholder card.
   - Clicking the placeholder opens a floating module picker.

The layout should feel like the target homepage, with editing controls layered onto the same page structure instead of adding a right sidebar.

## Component boundaries

Editor-specific code should live under `src/app/editor` and should not be imported by the public renderer.

Planned component split:

```txt
src/app/editor/editor-client.tsx
src/app/editor/components/editor-layout.tsx
src/app/editor/components/editor-toolbar.tsx
src/app/editor/components/editor-canvas.tsx
src/app/editor/components/editable-profile.tsx
src/app/editor/components/widget-inspector.tsx
src/app/editor/components/add-widget-panel.tsx
src/app/editor/store.ts
```

Responsibilities:

- `editor-client.tsx`: receives `initialConfig` and `mode`, initializes the editor store, and renders the editor shell.
- `editor-layout.tsx`: owns the editor page layout and places toolbar, editable profile, and grid editor.
- `editor-toolbar.tsx`: owns save, preview, import, export, and status UI.
- `editor-canvas.tsx`: renders right-side widgets through the shared Bento grid, overlays selected-card controls, and renders the virtual add placeholder.
- `editable-profile.tsx`: edits `PageConfig.profile` inline, including avatar and contacts.
- `widget-inspector.tsx`: edits generic widget props from a selected-card popover.
- `add-widget-panel.tsx`: renders the floating module picker opened from the 2x2 add placeholder.
- `store.ts`: owns editor state transitions and keeps UI components thin.

Existing public components remain responsible for rendering:

```txt
src/components/page/page-renderer.tsx
src/components/page/page-shell.tsx
src/components/page/profile-panel.tsx
src/widgets/*/index.tsx
```

## State model

The editor state should be explicit about what is selected:

```ts
type SelectedTarget = { type: "widget"; id: string } | null;
```

The store owns:

- `config`
- `selectedTarget`
- `status`
- `selectWidget`
- `clearSelection`
- `updateProfile`
- `updateWidgetProps`
- `updateLayout`
- `addWidget`
- `deleteWidget`
- `saveDraft`
- `importConfig`
- `exportConfig`

Every mutation that changes the page config also updates `updatedAt`.

## Profile editing

Profile data lives in `config.profile`, not in `config.widgets`. The profile area is displayed outside the grid and edited inline:

- clicking the avatar uploads an image
- name is edited directly in a heading-styled input
- location is edited directly
- bio is edited directly
- contacts can be edited from a local profile control

Contacts support add, edit, and remove. Each contact has `label` and `href`.

Profile cannot be deleted because it is a required page section, not a widget.

## Widget editing

Widgets are rendered in the right shared Bento grid. Clicking a grid item selects that widget and opens a local card-level inspector popover.

The generic inspector maps prop values to simple controls:

- string values use a text input.
- `bio` and `body` strings use a textarea.
- arrays of `{ label, href }` use a link-list editor.
- unsupported values are shown as string fields in the first version.

Deleting is only available for non-profile widgets. Deleting a widget removes both its widget instance and its layout item.

## Layout editing

The editor uses the same CSS Grid placement logic as the public page. The profile section is not part of the Bento grid.

Layout rules:

- All widgets are right-side Bento modules; profile is not a widget and is never passed through the widget registry.
- The selected-card popover exposes controls to update `x`, `y`, `w`, and `h`.
- Min and max layout constraints from widget definitions are preserved.
- The selected widget should show a visible outline or active state.
- Links inside widget previews should not navigate while inside the editor grid.

Layout updates are explicit button actions so `/editor` and `/:username` share one placement model without a second canvas implementation.

## Adding widgets

The add placeholder appears as a virtual 2x2 grid item and opens a floating picker listing all widget definitions.

Adding a widget:

1. Creates a unique widget id.
2. Clones the widget definition's default props.
3. Places the layout item at the placeholder position when possible.
4. Selects the new widget.
5. Opens the local widget inspector popover.

The virtual add placeholder is never persisted to `config.layout`.

## Persistence

The editor receives the current deployment mode from the server page.

Static mode:

- Save stores the current config in `localStorage` using the username-specific draft key.
- Import replaces editor state from a JSON file.
- Export downloads the current config as JSON.
- Public pages do not change for other visitors until exported JSON is committed and redeployed.

File mode:

- Save sends `POST /api/pages/:username` with the full page config.
- On success, the response config replaces editor state.
- Public pages read the saved file on refresh.

Remote mode remains out of scope for this implementation.

## Error handling

The first version uses visible status text in the toolbar for editor actions:

- ready
- changed
- saved locally
- saved
- save failed
- imported
- exported

Invalid JSON imports should fail safely and leave the current editor config unchanged. Failed saves should not clear local editor state.

## Validation plan

Automated checks:

- Run `npm run lint`.
- Run `npm run build`.

Manual browser validation on port 3001:

1. Open `/editor` and confirm the profile and all existing widgets render.
2. Edit name, location, bio, avatar, and contacts directly in the profile area.
3. Select each existing widget and edit its props from the card-level inspector popover.
4. Add a new widget from the 2x2 in-grid placeholder and confirm it appears near that placeholder and becomes selected.
5. Delete a non-profile widget and confirm both the card and layout item disappear.
6. Use layout controls to move a widget and confirm the new position persists in editor state.
7. Use layout controls to resize a widget and confirm the new size persists in editor state.
8. Save in static mode and confirm refreshing `/editor` restores the local draft.
9. Export JSON and confirm the downloaded file contains the edited config.
10. Open `/:username` to confirm the public renderer still works and does not require editor-only UI.

## Non-goals for this pass

- Full inline editing inside every widget card.
- Multi-select layout editing.
- Undo and redo.
- Theme editing.
- Custom widget schemas.
- Remote storage.
- Authentication.
- Animation polish.

## Success criteria

The editor is successful when it can complete this flow without broken clicks or event conflicts:

1. Load the current page config.
2. Edit profile content directly in the left profile area.
3. Add a widget from the in-grid 2x2 placeholder.
4. Select and edit that widget from a card-level popover.
5. Move the widget with layout controls.
6. Resize the widget with layout controls.
7. Save locally or through file mode.
8. Preview the public page without editor dependencies leaking into the public renderer.
