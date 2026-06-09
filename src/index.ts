export { PixelText } from "@components/PixelText";
export type { PixelTextProps } from "@components/PixelText";
export { METRICS, isLit } from "@engine/metrics";
export { countLit } from "@engine/lit";
export { createGlyphRegistry } from "@engine/glyph-registry";
export type { GlyphRegistry } from "@engine/glyph-registry";
export {
  renderText,
  getGlyphMatrix,
  hasGlyph,
  registerGlyph,
  getCharacters,
} from "@engine/render-text";
export { glyphBounds } from "@engine/spacing";
export type { GlyphBounds } from "@engine/spacing";
export { GLYPHS } from "@glyphs/registry";
export type {
  CanvasMetrics,
  Cell,
  GlyphSource,
  PixelMatrix,
  PixelRow,
  PixelShape,
  RenderedGlyph,
} from "@domain/index";
