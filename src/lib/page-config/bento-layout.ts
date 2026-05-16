import type { GridLayoutItem } from "./types";

export const BENTO_COLS = 8;
export const BENTO_ROW_HEIGHT = 76;
export const BENTO_GAP = 18;
export const BENTO_MIN_ITEM_SIZE = 1;
export const BENTO_DEFAULT_ITEM_SIZE = 2;

export function clampBentoLayoutItem(item: GridLayoutItem): GridLayoutItem {
  const w = clamp(Math.round(item.w), BENTO_MIN_ITEM_SIZE, BENTO_COLS);
  const h = Math.max(BENTO_MIN_ITEM_SIZE, Math.round(item.h));
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
