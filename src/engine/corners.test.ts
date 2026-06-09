import { isFilled, smartCornerRadius } from "@engine/corners";
import type { PixelMatrix } from "@domain/index";
import { describe, expect, it } from "vitest";

const matrix: PixelMatrix = [
  ["on", "on"],
  ["on", "off"],
];

describe("isFilled", () => {
  it("is true for lit cells and false for off cells", () => {
    expect(isFilled(matrix, 0, 0)).toBe(true);
    expect(isFilled(matrix, 1, 1)).toBe(false);
  });

  it("treats out-of-bounds cells as empty", () => {
    expect(isFilled(matrix, -1, 0)).toBe(false);
    expect(isFilled(matrix, 0, 5)).toBe(false);
  });
});

describe("smartCornerRadius", () => {
  it("rounds outer corners where both neighbours are empty", () => {
    expect(smartCornerRadius(matrix, 0, 0, "4px")).toBe("4px 0 0 0");
  });

  it("keeps every corner square when fully surrounded", () => {
    const solid: PixelMatrix = [
      ["on", "on", "on"],
      ["on", "on", "on"],
      ["on", "on", "on"],
    ];
    expect(smartCornerRadius(solid, 1, 1, "4px")).toBe("0 0 0 0");
  });
});
