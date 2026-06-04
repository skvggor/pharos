import { isLit, METRICS } from "@engine/metrics";
import {
  getGlyphMatrix,
  hasGlyph,
  renderText,
} from "@engine/render-text";
import { describe, expect, it } from "vitest";

describe("getGlyphMatrix", () => {
  it("returns a matrix for a known character", () => {
    const matrix = getGlyphMatrix("A");

    expect(matrix).toBeDefined();
    expect(matrix).toHaveLength(METRICS.height);
  });

  it("caches and returns the same matrix reference", () => {
    expect(getGlyphMatrix("E")).toBe(getGlyphMatrix("E"));
  });

  it("returns undefined for an unknown character", () => {
    expect(getGlyphMatrix("¥")).toBeUndefined();
  });
});

describe("hasGlyph", () => {
  it("detects known and unknown characters", () => {
    expect(hasGlyph("O")).toBe(true);
    expect(hasGlyph("¥")).toBe(false);
  });
});

describe("renderText", () => {
  it("renders one glyph per character", () => {
    const result = renderText("HELLO");
    expect(result).toHaveLength(5);
    expect(result.map((glyph) => glyph.character).join("")).toBe("HELLO");
  });

  it("marks unknown characters as fallback", () => {
    const [glyph] = renderText("¥");

    expect(glyph.isFallback).toBe(true);
    expect(glyph.matrix.flat().every((cell) => cell === "off")).toBe(true);
  });

  it("does not flag known characters as fallback", () => {
    expect(renderText("A")[0].isFallback).toBe(false);
  });

  it("exposes subpixel triangles in glyphs that use them", () => {
    const [glyph] = renderText("A");
    const cells = glyph.matrix.flat();

    expect(cells.some((cell) => cell === "tl" || cell === "tr")).toBe(true);
    expect(cells.filter(isLit).length).toBeGreaterThan(0);
  });
});
