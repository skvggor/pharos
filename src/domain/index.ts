export type Cell = "off" | "on" | "tl" | "tr" | "bl" | "br";

export type PixelRow = Cell[];

export type PixelMatrix = PixelRow[];

export type GlyphSource = readonly string[];

export type PixelShape = "square" | "squircle" | "dot" | "diamond" | "ring";

export interface RenderedGlyph {
  character: string;
  matrix: PixelMatrix;
  isFallback: boolean;
}

export interface CanvasMetrics {
  width: number;
  height: number;
  accentTop: number;
  capTop: number;
  xHeight: number;
  baseline: number;
  descenderBottom: number;
}
