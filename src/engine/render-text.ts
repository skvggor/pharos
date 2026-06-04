import { emptyMatrix, parseGlyph } from "@engine/parse-glyph";
import { FALLBACK_CHARACTER, GLYPHS } from "@glyphs/registry";
import type { PixelMatrix, RenderedGlyph } from "@domain/index";

const glyphCache = new Map<string, PixelMatrix>();

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
