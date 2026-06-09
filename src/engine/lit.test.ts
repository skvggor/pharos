import { countLit } from "@engine/lit";
import type { PixelMatrix } from "@domain/index";
import { describe, expect, it } from "vitest";

describe("countLit", () => {
  it("counts every non-off cell", () => {
    const matrix: PixelMatrix = [
      ["on", "off", "tl"],
      ["off", "br", "off"],
    ];
    expect(countLit(matrix)).toBe(3);
  });

  it("returns zero for an empty matrix", () => {
    const matrix: PixelMatrix = [
      ["off", "off"],
      ["off", "off"],
    ];
    expect(countLit(matrix)).toBe(0);
  });

  it("memoizes the count per matrix reference", () => {
    const matrix: PixelMatrix = [["on", "off"]];
    const first = countLit(matrix);
    matrix[0][1] = "on";
    expect(countLit(matrix)).toBe(first);
  });
});
