# MellowGrid Editor Layout-First Design

## Goal

The first usable editor should prioritize reliable layout editing over inline content editing. `/editor` should load the same page config used by the public page, show the profile area separately from the Bento grid, let the owner select modules, edit content in a stable inspector panel, add and delete modules, drag modules, resize modules, and save or export changes according to the active deployment mode.

The public page must stay lightweight and must not import editor-only dependencies such as React Grid Layout or editor state management.

## Confirmed direction

The editor will use a layout-first interaction model:

- The canvas is responsible for selection, dragging, and resizing.
- The inspector panel is responsible for editing content.
- Widget previews show the real public widgets but do not contain inline editing controls.
- The profile section remains outside the grid and is edited through its own inspector form.

This avoids the event conflicts from combining links, inline inputs, click-to-edit controls, drag handles, and resize handles inside the same card.

## Page structure

`/editor` will be a client-side editor shell with three visible areas:

1. Top toolbar
   - Shows deployment mode and save status.
   - Provides save, preview, import, and export actions.
2. Main editing area
   - Left: profile preview, visually close to the public homepage profile block.
   - Center: Bento grid canvas powered by React Grid Layout.
   - Right: fixed inspector panel for the selected profile or widget.
3. Add module entry
   - Available from the toolbar or inspector side area.
   - Lists all registered widgets except the profile widget.

The layout should still feel like the target homepage, but the right inspector is allowed because this version prioritizes stable layout editing.

## Component boundaries

Editor-specific code should live under `src/app/editor` and should not be imported by the public renderer.

Planned component split:

```txt
src/app/editor/editor-client.tsx
src/app/editor/components/editor-layout.tsx
src/app/editor/components/editor-toolbar.tsx
src/app/editor/components/editor-canvas.tsx
src/app/editor/components/editor-sidebar.tsx
src/app/editor/components/profile-inspector.tsx
src/app/editor/components/widget-inspector.tsx
src/app/editor/components/add-widget-panel.tsx
src/app/editor/store.ts
```

Responsibilities:

- `editor-client.tsx`: receives `initialConfig` and `mode`, initializes the editor store, and renders the editor shell.
- `editor-layout.tsx`: owns the editor page layout and places toolbar, profile preview, canvas, and sidebar.
- `editor-toolbar.tsx`: owns save, preview, import, export, and status UI.
- `editor-canvas.tsx`: renders non-profile widgets inside React Grid Layout and updates layout after drag or resize.
- `editor-sidebar.tsx`: chooses which inspector to show based on current selection.
- `profile-inspector.tsx`: edits profile props, avatar, and contacts.
- `widget-inspector.tsx`: edits generic widget props.
- `add-widget-panel.tsx`: creates new widget instances from the registry.
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
type SelectedTarget =
  | { type: "profile"; id: string }
  | { type: "widget"; id: string }
  | null;
```

The store owns:

- `config`
- `selectedTarget`
- `status`
- `selectProfile`
- `selectWidget`
- `clearSelection`
- `updateProfileProps`
- `updateWidgetProps`
- `updateLayout`
- `addWidget`
- `deleteWidget`
- `saveDraft`
- `importConfig`
- `exportConfig`

Every mutation that changes the page config also updates `updatedAt`.

## Profile editing

The profile widget remains a widget in `config.widgets`, but it is displayed outside the grid. Clicking the profile preview selects the profile target. The right inspector then shows fields for:

- name
- location
- bio
- avatar upload
- avatar URL
- contacts list

Contacts support add, edit, and remove. Each contact has `label` and `href`.

Profile cannot be deleted in the first editor version.

## Widget editing

Non-profile widgets are rendered in the grid canvas. Clicking a grid item selects that widget and opens the widget inspector.

The generic inspector maps prop values to simple controls:

- string values use a text input.
- `bio` and `body` strings use a textarea.
- arrays of `{ label, href }` use a link-list editor.
- unsupported values are shown as string fields in the first version.

Deleting is only available for non-profile widgets. Deleting a widget removes both its widget instance and its layout item.

## Layout editing

React Grid Layout is used only inside the editor canvas. The profile section is not part of React Grid Layout.

Layout rules:

- Only non-profile widgets are passed to React Grid Layout.
- Dragging updates `x` and `y`.
- Resizing updates `w` and `h`.
- Min and max layout constraints from widget definitions are preserved.
- The selected widget should show a visible outline or active state.
- Links inside widget previews should not navigate while inside the editor canvas.

Layout updates should be committed on drag stop and resize stop, not on every mouse movement unless React Grid Layout requires intermediate layout state for smooth rendering.

## Adding widgets

The add panel lists widget definitions from the registry except `profile`.

Adding a widget:

1. Creates a unique widget id.
2. Clones the widget definition's default props.
3. Places the layout item at the bottom of the current grid.
4. Selects the new widget.
5. Opens the widget inspector.

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
2. Select the profile and edit name, location, bio, avatar, and contacts from the inspector.
3. Select each existing widget and edit its props from the inspector.
4. Add a new widget and confirm it appears at the bottom of the grid and becomes selected.
5. Delete a non-profile widget and confirm both the card and layout item disappear.
6. Drag a widget and confirm the new position persists in editor state.
7. Resize a widget and confirm the new size persists in editor state.
8. Save in static mode and confirm refreshing `/editor` restores the local draft.
9. Export JSON and confirm the downloaded file contains the edited config.
10. Open `/:username` to confirm the public renderer still works and does not require editor-only UI.

## Non-goals for this pass

- Inline editing inside cards.
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
2. Select the profile.
3. Edit profile content from the inspector.
4. Add a widget.
5. Select and edit that widget from the inspector.
6. Drag the widget.
7. Resize the widget.
8. Save locally or through file mode.
9. Preview the public page without editor dependencies leaking into the public renderer.
