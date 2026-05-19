import type { GridLayoutItem } from "./types";

export const BENTO_COLS = 4;
export const BENTO_ROW_HEIGHT = 175;
export const BENTO_GAP = 40;
export const BENTO_MIN_ITEM_SIZE = 1;
export const BENTO_DEFAULT_ITEM_SIZE = 1;

export type BentoLayoutPatch = Partial<Pick<GridLayoutItem, "x" | "y" | "w" | "h">>;

export function clampBentoLayoutItem(item: GridLayoutItem): GridLayoutItem {
  const minW = Math.max(BENTO_MIN_ITEM_SIZE, item.minW ?? BENTO_MIN_ITEM_SIZE);
  const minH = Math.max(BENTO_MIN_ITEM_SIZE, item.minH ?? BENTO_MIN_ITEM_SIZE);
  const maxW = Math.max(minW, Math.min(BENTO_COLS, item.maxW ?? BENTO_COLS));
  const maxH = Math.max(minH, item.maxH ?? Number.MAX_SAFE_INTEGER);
  const w = clamp(Math.round(item.w), minW, maxW);
  const h = clamp(Math.round(item.h), minH, maxH);
  const x = clamp(Math.round(item.x), 0, BENTO_COLS - w);
  const y = Math.max(0, Math.round(item.y));

  return {
    ...item,
    x,
    y,
    w,
    h,
    minW: item.minW,
    minH: item.minH,
    maxW: item.maxW,
    maxH: item.maxH,
  };
}

export function arrangeBentoLayout(layout: GridLayoutItem[], pinnedId?: string): GridLayoutItem[] {
  const originalOrder = new Map(layout.map((item, index) => [item.i, index]));
  const clamped = layout.map(clampBentoLayoutItem);
  const pinned = pinnedId ? clamped.find((item) => item.i === pinnedId) : undefined;
  const candidates = clamped
    .filter((item) => item.i !== pinned?.i)
    .sort((a, b) => sortByGridPosition(a, b, originalOrder));
  const placed: GridLayoutItem[] = [];

  if (pinned) {
    placed.push(pinned);
  }

  for (const item of candidates) {
    placed.push(placeWithoutCollisions(item, placed));
  }

  return restoreOriginalOrder(compactBentoLayout(placed, pinned?.i, originalOrder), originalOrder);
}

export function updateBentoLayoutItem(layout: GridLayoutItem[], id: string, patch: BentoLayoutPatch): GridLayoutItem[] {
  return arrangeBentoLayout(
    layout.map((item) => (item.i === id ? clampBentoLayoutItem({ ...item, ...patch }) : item)),
    id,
  );
}

export function moveBentoLayoutItem(layout: GridLayoutItem[], id: string, patch: Pick<BentoLayoutPatch, "x" | "y">): GridLayoutItem[] {
  return updateBentoLayoutItem(layout, id, patch);
}

export function resizeBentoLayoutItem(layout: GridLayoutItem[], id: string, patch: Pick<BentoLayoutPatch, "w" | "h">): GridLayoutItem[] {
  return updateBentoLayoutItem(layout, id, patch);
}

export function bentoLayoutItemsCollide(a: GridLayoutItem, b: GridLayoutItem) {
  return a.i !== b.i && a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function compactBentoLayout(layout: GridLayoutItem[], pinnedId: string | undefined, originalOrder: Map<string, number>): GridLayoutItem[] {
  const pinned = pinnedId ? layout.find((item) => item.i === pinnedId) : undefined;
  const candidates = layout
    .filter((item) => item.i !== pinned?.i)
    .sort((a, b) => sortByGridPosition(a, b, originalOrder));
  const placed: GridLayoutItem[] = [];

  if (pinned) {
    placed.push(pinned);
  }

  for (const item of candidates) {
    placed.push(compactItem(item, placed));
  }

  return placed;
}

function compactItem(item: GridLayoutItem, placed: GridLayoutItem[]): GridLayoutItem {
  let next = placeWithoutCollisions(item, placed);

  while (next.y > 0) {
    const candidate = { ...next, y: next.y - 1 };

    if (placed.some((placedItem) => bentoLayoutItemsCollide(candidate, placedItem))) {
      break;
    }

    next = candidate;
  }

  return next;
}

function placeWithoutCollisions(item: GridLayoutItem, placed: GridLayoutItem[]): GridLayoutItem {
  let next = clampBentoLayoutItem(item);
  let collision = placed.find((placedItem) => bentoLayoutItemsCollide(next, placedItem));

  while (collision) {
    next = { ...next, y: collision.y + collision.h };
    collision = placed.find((placedItem) => bentoLayoutItemsCollide(next, placedItem));
  }

  return next;
}

function sortByGridPosition(a: GridLayoutItem, b: GridLayoutItem, originalOrder: Map<string, number>) {
  return a.y - b.y || a.x - b.x || (originalOrder.get(a.i) ?? 0) - (originalOrder.get(b.i) ?? 0);
}

function restoreOriginalOrder(layout: GridLayoutItem[], originalOrder: Map<string, number>) {
  return [...layout].sort((a, b) => (originalOrder.get(a.i) ?? 0) - (originalOrder.get(b.i) ?? 0));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
