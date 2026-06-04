import type { Cell, CanvasMetrics } from "@domain/index";

/**
 * Glyph source markers. `#` full pixel, `.` empty. Numpad-mnemonic corner
 * triangles smooth diagonals and curves: 7=top-left, 9=top-right,
 * 1=bottom-left, 3=bottom-right (the corner each triangle fills).
 */
export const CELL_MARKERS: Record<string, Cell> = {
  "#": "on",
  ".": "off",
  "7": "tl",
  "9": "tr",
  "1": "bl",
  "3": "br",
};

export const METRICS: CanvasMetrics = {
  width: 12,
  height: 18,
  accentTop: 0,
  capTop: 3,
  xHeight: 6,
  baseline: 13,
  descenderBottom: 17,
};

export function isLit(cell: Cell): boolean {
  return cell !== "off";
}
