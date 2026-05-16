# 8 Column Bento Layout Design

## Goal

Rebuild the public page and editor around one shared 8-column Bento layout protocol. The profile stays outside the grid on the left. The right content area uses `layout: { x, y, w, h }` as the single source of truth for both `/username` and `/editor`.

## Layout rules

- Right-side Bento grid has 8 columns.
- `1x1` is for compact social/icon modules.
- `2x2` is the default module size.
- `2x4` is for vertical feature/image modules.
- `4x2` is for wide modules such as music, link lists, or quotes.
- `4x4` is for high-information modules such as maps or large media.
- Public rendering must honor `x`, `y`, `w`, and `h`.
- Editor rendering must use the same constants as public rendering.

## Shared sizing tokens

Use shared constants for:

- `BENTO_COLS = 8`
- `BENTO_ROW_HEIGHT`
- `BENTO_GAP`
- supported/default widget dimensions

Public page and editor should import these constants instead of duplicating values.

## Public page renderer

The public page must stay lightweight and must not import React Grid Layout. It should render the Bento items with CSS grid and exact placement:

- `gridTemplateColumns: repeat(8, minmax(0, 1fr))`
- `gridAutoRows: <shared row height>`
- each item uses `gridColumn: "x + 1 / span w"`
- each item uses `gridRow: "y + 1 / span h"`

The public page should filter profile out of the grid and render it in the left profile column.

## Editor renderer

The editor page should look like the public page plus editing affordances:

- keep the top toolbar
- keep the same left profile / right grid layout
- use React Grid Layout only for the right Bento grid
- configure RGL with 8 columns and shared row height/gap
- each RGL child key must match its layout item `i`
- click card selects it
- drag handle moves the card
- visible resize handle resizes the card
- inspector remains a floating/collapsible panel and does not become a third page column

## Resize and drag UX

- Dragging should start only from a visible handle.
- Resize handle should be visible on selected or hovered cards.
- Resize target should be larger than the default 20px handle.
- Selection outline must not change card size.
- Links inside preview cards should not navigate in the editor.

## Persistence

Local development uses file mode so save writes `data/pages/username.json`; refreshing `/username` should show the saved layout. Static production mode can still use localStorage/export behavior.

## Validation

- Run `npm run lint`.
- Run `npm run build`.
- Start dev server on 3001 with webpack.
- Check `/username` and `/editor` visually.
- In editor, drag and resize cards to 1x1, 2x2, 2x4, 4x2, and 4x4.
- Save and refresh `/username` to confirm layout persistence.
