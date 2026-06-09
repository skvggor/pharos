import type { GlyphBounds } from "@engine/spacing";

export interface FluidUnitsOptions {
  spaceWidth: number;
  gapRatio: number;
  letterSpacingRatio: number;
}

/**
 * Total horizontal units of a line in fluid mode, expressed as multiples of one
 * pixel cell. Lit glyphs contribute their ink width plus inter-pixel gaps;
 * `null` bounds (spaces) contribute `spaceWidth`; letters are separated by
 * `letterSpacingRatio`. Always at least 1 to avoid a zero-width container.
 */
export function computeFluidUnits(
  advances: ReadonlyArray<GlyphBounds | null>,
  { spaceWidth, gapRatio, letterSpacingRatio }: FluidUnitsOptions,
): number {
  let units = 0;

  advances.forEach((bounds, index) => {
    if (bounds === null) {
      units += spaceWidth;
    } else {
      const width = bounds.end - bounds.start + 1;
      units += width + (width - 1) * gapRatio;
    }
    if (index < advances.length - 1) {
      units += letterSpacingRatio;
    }
  });

  return units > 0 ? units : 1;
}
