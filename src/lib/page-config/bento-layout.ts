import type { GridLayoutItem } from "./types";

export const BENTO_COLS = 4;
export const BENTO_CELL_SIZE = 188;
export const BENTO_ROW_HEIGHT = BENTO_CELL_SIZE;
export const BENTO_GAP = 24;
export const BENTO_GRID_WIDTH = BENTO_COLS * BENTO_CELL_SIZE + (BENTO_COLS - 1) * BENTO_GAP;
export const BENTO_MIN_ITEM_SIZE = 1;
export const BENTO_MIN_ITEM_HEIGHT = 0.5;
export const BENTO_DEFAULT_ITEM_SIZE = 1;
export const BENTO_ROW_UNITS_PER_ITEM = 2;
export const BENTO_ROW_UNIT_HEIGHT = (BENTO_ROW_HEIGHT - BENTO_GAP) / BENTO_ROW_UNITS_PER_ITEM;

export type BentoLayoutPatch = Partial<Pick<GridLayoutItem, "x" | "y" | "w" | "h">>;

export function clampBentoLayoutItem(item: GridLayoutItem): GridLayoutItem {
  const minW = Math.max(BENTO_MIN_ITEM_SIZE, item.minW ?? BENTO_MIN_ITEM_SIZE);
  const minH = Math.max(BENTO_MIN_ITEM_HEIGHT, item.minH ?? BENTO_DEFAULT_ITEM_SIZE);
  const maxW = Math.max(minW, Math.min(BENTO_COLS, item.maxW ?? BENTO_COLS));
  const maxH = Math.max(minH, item.maxH ?? Number.MAX_SAFE_INTEGER);
  const w = clamp(Math.round(item.w), minW, maxW);
  const h = clamp(snapBentoHeight(item.h), minH, maxH);
  const x = clamp(Math.round(item.x), 0, BENTO_COLS - w);
  const y = Math.max(0, snapBentoHeight(item.y));

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

export function getBentoGridRow(item: GridLayoutItem) {
  const nextItem = clampBentoLayoutItem(item);

  return `${getBentoGridRowStart(nextItem.y)} / span ${getBentoGridRowSpan(nextItem.h)}`;
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
  const maxIterations = 100;
  let next = placeWithoutCollisions(item, placed);

  for (let i = 0; i < maxIterations; i++) {
    if (next.y <= 0) break;
    const candidate = { ...next, y: Math.max(0, next.y - BENTO_MIN_ITEM_HEIGHT) };

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

function getBentoGridRowStart(y: number) {
  return Math.round(y * BENTO_ROW_UNITS_PER_ITEM) + 1;
}

function getBentoGridRowSpan(h: number) {
  return Math.max(1, Math.round(h * BENTO_ROW_UNITS_PER_ITEM));
}

function snapBentoHeight(value: number) {
  return Math.round(value / BENTO_MIN_ITEM_HEIGHT) * BENTO_MIN_ITEM_HEIGHT;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
