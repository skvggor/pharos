import { computeFluidUnits } from "@engine/layout";
import type { GlyphBounds } from "@engine/spacing";
import { describe, expect, it } from "vitest";

const options = { spaceWidth: 4, gapRatio: 0.16, letterSpacingRatio: 0.5 };

describe("computeFluidUnits", () => {
  it("sums ink width, inter-pixel gaps and letter spacing", () => {
    const advances: (GlyphBounds | null)[] = [
      { start: 0, end: 2 },
      { start: 0, end: 1 },
    ];
    // (3 + 2 * 0.16) + 0.5 + (2 + 1 * 0.16) = 5.98
    expect(computeFluidUnits(advances, options)).toBeCloseTo(5.98);
  });

  it("uses spaceWidth for null bounds", () => {
    const advances: (GlyphBounds | null)[] = [null];
    expect(computeFluidUnits(advances, options)).toBe(4);
  });

  it("never returns less than one unit", () => {
    expect(computeFluidUnits([], options)).toBe(1);
  });
});
