import { isLit } from "@engine/metrics";
import type { PixelMatrix } from "@domain/index";

export interface GlyphBounds {
  start: number;
  end: number;
}

/**
 * Horizontal ink bounds of a glyph (inclusive column range that contains any
 * lit pixel). Returns null for empty glyphs such as the space character.
 */
export function glyphBounds(matrix: PixelMatrix): GlyphBounds | null {
  let start = Number.POSITIVE_INFINITY;
  let end = Number.NEGATIVE_INFINITY;

  for (const row of matrix) {
    for (let column = 0; column < row.length; column++) {
      if (isLit(row[column])) {
        if (column < start) start = column;
        if (column > end) end = column;
      }
    }
  }

  return end === Number.NEGATIVE_INFINITY ? null : { start, end };
}
