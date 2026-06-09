import { isLit } from "@engine/metrics";
import type { PixelMatrix } from "@domain/index";

const litCountCache = new WeakMap<PixelMatrix, number>();

/**
 * Number of lit cells in a glyph matrix. Memoized per matrix reference: because
 * parsed matrices are cached and shared, repeated characters reuse the count
 * instead of scanning the grid again.
 */
export function countLit(matrix: PixelMatrix): number {
  const cached = litCountCache.get(matrix);
  if (cached !== undefined) {
    return cached;
  }

  const total = matrix.reduce(
    (sum, row) => sum + row.filter(isLit).length,
    0,
  );
  litCountCache.set(matrix, total);
  return total;
}
