import { getGlyphMatrix } from "@engine/render-text";
import { glyphBounds } from "@engine/spacing";
import { describe, expect, it } from "vitest";

describe("glyphBounds", () => {
  it("returns the inclusive ink column range of a glyph", () => {
    const bounds = glyphBounds(getGlyphMatrix("I")!);

    expect(bounds).not.toBeNull();
    expect(bounds!.start).toBeGreaterThan(0);
    expect(bounds!.end).toBeLessThan(getGlyphMatrix("I")![0].length - 1);
    expect(bounds!.end).toBeGreaterThanOrEqual(bounds!.start);
  });

  it("returns null for an empty glyph", () => {
    expect(glyphBounds(getGlyphMatrix(" ")!)).toBeNull();
  });
});
