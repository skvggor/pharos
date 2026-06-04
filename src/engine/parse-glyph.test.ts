import { emptyMatrix, parseGlyph } from "@engine/parse-glyph";
import { METRICS } from "@engine/metrics";
import type { GlyphSource } from "@domain/index";
import { describe, expect, it } from "vitest";

function buildSource(rows: Partial<Record<number, string>> = {}): string[] {
  return Array.from({ length: METRICS.height }, (_, index) =>
    rows[index] ?? ".".repeat(METRICS.width),
  );
}

describe("parseGlyph", () => {
  it("maps the markers to their cell types", () => {
    const source = buildSource({ 0: "#7913......." });
    const [row] = parseGlyph(source);

    expect(row[0]).toBe("on");
    expect(row[1]).toBe("tl");
    expect(row[2]).toBe("tr");
    expect(row[3]).toBe("bl");
    expect(row[4]).toBe("br");
    expect(row[5]).toBe("off");
  });

  it("produces a matrix matching the canvas metrics", () => {
    const matrix = parseGlyph(buildSource());

    expect(matrix).toHaveLength(METRICS.height);
    expect(matrix[0]).toHaveLength(METRICS.width);
  });

  it("throws when the row count is wrong", () => {
    const source: GlyphSource = [".".repeat(METRICS.width)];
    expect(() => parseGlyph(source)).toThrow(/rows/);
  });

  it("throws when a row has the wrong width", () => {
    const source = buildSource({ 3: "###" });
    expect(() => parseGlyph(source)).toThrow(/columns/);
  });

  it("throws on an unknown marker", () => {
    const source = buildSource({ 2: "x..........." });
    expect(() => parseGlyph(source)).toThrow(/Unknown glyph marker/);
  });
});

describe("emptyMatrix", () => {
  it("creates a fully empty matrix sized to the metrics", () => {
    const matrix = emptyMatrix();

    expect(matrix).toHaveLength(METRICS.height);
    expect(matrix.every((row) => row.length === METRICS.width)).toBe(true);
    expect(matrix.flat().every((cell) => cell === "off")).toBe(true);
  });
});
