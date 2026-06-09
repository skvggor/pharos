import { createGlyphRegistry } from "@engine/glyph-registry";
import { METRICS } from "@engine/metrics";
import type { GlyphSource } from "@domain/index";
import { describe, expect, it } from "vitest";

function fullSource(): GlyphSource {
  return Array.from({ length: METRICS.height }, () => ".".repeat(METRICS.width));
}

describe("createGlyphRegistry", () => {
  it("starts from a copy of the built-in glyphs", () => {
    const registry = createGlyphRegistry();
    expect(registry.hasGlyph("A")).toBe(true);
    expect(registry.getGlyphMatrix("A")).toHaveLength(METRICS.height);
  });

  it("isolates registrations between instances", () => {
    const first = createGlyphRegistry();
    const second = createGlyphRegistry();

    first.registerGlyph("¢", fullSource());

    expect(first.hasGlyph("¢")).toBe(true);
    expect(second.hasGlyph("¢")).toBe(false);
  });

  it("caches and returns the same matrix reference", () => {
    const registry = createGlyphRegistry();
    expect(registry.getGlyphMatrix("E")).toBe(registry.getGlyphMatrix("E"));
  });

  it("falls back to the space glyph for unknown characters", () => {
    const registry = createGlyphRegistry();
    const [glyph] = registry.renderText("¥");
    expect(glyph.isFallback).toBe(true);
  });

  it("rejects multi-character keys", () => {
    const registry = createGlyphRegistry();
    expect(() => registry.registerGlyph("ab", fullSource())).toThrow(
      /single character/,
    );
  });
});
