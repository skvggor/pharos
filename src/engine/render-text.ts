import { createGlyphRegistry } from "@engine/glyph-registry";
import { GLYPHS } from "@glyphs/registry";

/**
 * Default registry shared by the library. It operates on the exported `GLYPHS`
 * by reference, so `registerGlyph` keeps mutating the global glyph table and
 * `import { GLYPHS }` reflects runtime registrations.
 */
export const defaultRegistry = createGlyphRegistry(GLYPHS);

export const { registerGlyph, getCharacters, getGlyphMatrix, hasGlyph, renderText } =
  defaultRegistry;
