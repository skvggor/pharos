import { emptyMatrix, parseGlyph } from "@engine/parse-glyph";
import { FALLBACK_CHARACTER, GLYPHS } from "@glyphs/registry";
import type { GlyphSource, PixelMatrix, RenderedGlyph } from "@domain/index";

const glyphCache = new Map<string, PixelMatrix>();

/**
 * Register (or override) a glyph at runtime. The source is validated against
 * the canvas metrics and the parsed matrix cache is invalidated.
 */
export function registerGlyph(character: string, source: GlyphSource): void {
  if (character.length !== 1) {
    throw new Error(`registerGlyph expects a single character, got "${character}".`);
  }
  parseGlyph(source);
  GLYPHS[character] = source;
  glyphCache.delete(character);
}

export function getCharacters(): string[] {
  return Object.keys(GLYPHS);
}

export function getGlyphMatrix(character: string): PixelMatrix | undefined {
  const source = GLYPHS[character];
  if (!source) {
    return undefined;
  }

  const cached = glyphCache.get(character);
  if (cached) {
    return cached;
  }

  const matrix = parseGlyph(source);
  glyphCache.set(character, matrix);
  return matrix;
}

export function hasGlyph(character: string): boolean {
  return character in GLYPHS;
}

export function renderText(text: string): RenderedGlyph[] {
  return Array.from(text, (character) => {
    const matrix = getGlyphMatrix(character);
    if (matrix) {
      return { character, matrix, isFallback: false };
    }

    const fallback = getGlyphMatrix(FALLBACK_CHARACTER) ?? emptyMatrix();
    return { character, matrix: fallback, isFallback: true };
  });
}
