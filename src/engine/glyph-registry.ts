import { emptyMatrix, parseGlyph } from "@engine/parse-glyph";
import { FALLBACK_CHARACTER, GLYPHS } from "@glyphs/registry";
import type { GlyphSource, PixelMatrix, RenderedGlyph } from "@domain/index";

export interface GlyphRegistry {
  registerGlyph(character: string, source: GlyphSource): void;
  getCharacters(): string[];
  getGlyphMatrix(character: string): PixelMatrix | undefined;
  hasGlyph(character: string): boolean;
  renderText(text: string): RenderedGlyph[];
}

/**
 * Create an isolated glyph registry with its own glyph table and parse cache.
 * Useful for SSR or for consumers that need to register glyphs without touching
 * shared global state. Defaults to a copy of the built-in glyphs.
 *
 * The library's default registry passes `GLYPHS` by reference, so the global
 * `registerGlyph` keeps mutating the exported `GLYPHS` as before.
 */
export function createGlyphRegistry(
  glyphs: Record<string, GlyphSource> = { ...GLYPHS },
): GlyphRegistry {
  const glyphCache = new Map<string, PixelMatrix>();

  function registerGlyph(character: string, source: GlyphSource): void {
    if (character.length !== 1) {
      throw new Error(
        `registerGlyph expects a single character, got "${character}".`,
      );
    }
    parseGlyph(source);
    glyphs[character] = source;
    glyphCache.delete(character);
  }

  function getCharacters(): string[] {
    return Object.keys(glyphs);
  }

  function getGlyphMatrix(character: string): PixelMatrix | undefined {
    const source = glyphs[character];
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

  function hasGlyph(character: string): boolean {
    return character in glyphs;
  }

  function renderText(text: string): RenderedGlyph[] {
    return Array.from(text, (character) => {
      const matrix = getGlyphMatrix(character);
      if (matrix) {
        return { character, matrix, isFallback: false };
      }

      const fallback = getGlyphMatrix(FALLBACK_CHARACTER) ?? emptyMatrix();
      return { character, matrix: fallback, isFallback: true };
    });
  }

  return {
    registerGlyph,
    getCharacters,
    getGlyphMatrix,
    hasGlyph,
    renderText,
  };
}
