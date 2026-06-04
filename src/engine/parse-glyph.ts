import { CELL_MARKERS, METRICS } from "@engine/metrics";
import type { GlyphSource, PixelMatrix } from "@domain/index";

export function parseGlyph(source: GlyphSource): PixelMatrix {
  if (source.length !== METRICS.height) {
    throw new Error(
      `Glyph must have ${METRICS.height} rows, received ${source.length}.`,
    );
  }

  return source.map((row, rowIndex) => {
    if (row.length !== METRICS.width) {
      throw new Error(
        `Glyph row ${rowIndex} must have ${METRICS.width} columns, received ${row.length}.`,
      );
    }

    return Array.from(row, (marker, columnIndex) => {
      const cell = CELL_MARKERS[marker];
      if (!cell) {
        throw new Error(
          `Unknown glyph marker "${marker}" at row ${rowIndex}, column ${columnIndex}.`,
        );
      }
      return cell;
    });
  });
}

export function emptyMatrix(): PixelMatrix {
  return Array.from({ length: METRICS.height }, () =>
    Array.from({ length: METRICS.width }, () => "off" as const),
  );
}
