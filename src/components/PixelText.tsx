import "@components/pixel-text.css";

import { isLit, METRICS } from "@engine/metrics";
import { renderText } from "@engine/render-text";
import { glyphBounds } from "@engine/spacing";
import type { PixelMatrix, PixelShape } from "@domain/index";
import type { CSSProperties, HTMLAttributes } from "react";

export interface PixelTextProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  text: string;
  pixelSize?: number | string;
  gap?: number | string;
  letterSpacing?: number | string;
  color?: string;
  offColor?: string;
  pixelShape?: PixelShape;
  smartCorners?: boolean;
  smoothness?: number;
  proportional?: boolean;
  spaceWidth?: number;
  renderOff?: boolean;
  fluid?: boolean;
  gapRatio?: number;
  letterSpacingRatio?: number;
  "aria-label"?: string;
}

type PixelStyle = CSSProperties & Record<`--ph-${string}`, string | number>;

function toCssLength(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

function isFilled(matrix: PixelMatrix, row: number, column: number): boolean {
  return Boolean(matrix[row]?.[column]) && matrix[row][column] !== "off";
}

function countLit(matrix: PixelMatrix): number {
  return matrix.reduce((total, row) => total + row.filter(isLit).length, 0);
}

export function PixelText({
  text,
  pixelSize,
  gap,
  letterSpacing,
  color,
  offColor,
  pixelShape = "dot",
  smartCorners = false,
  smoothness = 0.6,
  proportional = true,
  spaceWidth = 4,
  renderOff = true,
  fluid = false,
  gapRatio = 0.16,
  letterSpacingRatio = 0.5,
  className,
  style,
  ...rest
}: PixelTextProps) {
  const glyphs = renderText(text);
  const ariaLabel = rest["aria-label"] ?? text;
  const columns = METRICS.width;

  const advances = glyphs.map((glyph) => {
    const bounds = proportional
      ? glyphBounds(glyph.matrix)
      : { start: 0, end: columns - 1 };
    return bounds;
  });

  const rootStyle: PixelStyle = { ...style };
  if (fluid) {
    let units = 0;
    advances.forEach((bounds, index) => {
      if (bounds === null) {
        units += spaceWidth;
      } else {
        const width = bounds.end - bounds.start + 1;
        units += width + (width - 1) * gapRatio;
      }
      if (index < glyphs.length - 1) units += letterSpacingRatio;
    });
    rootStyle["--ph-units"] = units > 0 ? units : 1;
    rootStyle["--ph-gap-ratio"] = gapRatio;
    rootStyle["--ph-letter-ratio"] = letterSpacingRatio;
  } else {
    if (pixelSize !== undefined)
      rootStyle["--ph-pixel-size"] = toCssLength(pixelSize);
    if (gap !== undefined) rootStyle["--ph-gap"] = toCssLength(gap);
    if (letterSpacing !== undefined)
      rootStyle["--ph-letter-spacing"] = toCssLength(letterSpacing);
  }
  if (color !== undefined) rootStyle["--ph-on-color"] = color;
  if (offColor !== undefined) rootStyle["--ph-off-color"] = offColor;

  // Smart corners emit per-corner border-radius, which only affects square-ish
  // shapes; for dot/diamond/ring the shape already owns border-radius/clip-path.
  const roundCorners =
    smartCorners && (pixelShape === "square" || pixelShape === "squircle");
  const cornerRadius = `calc(var(--ph-pixel-size) * ${smoothness / 2})`;
  const rootClassName = [
    "pharos",
    `ph-shape-${pixelShape}`,
    fluid && "pharos--fluid",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const litTotal = glyphs.reduce(
    (total, glyph) => total + countLit(glyph.matrix),
    0,
  );
  let litIndex = 0;

  return (
    <span
      {...rest}
      role="img"
      aria-label={ariaLabel}
      className={rootClassName}
      style={rootStyle}
    >
      {glyphs.map((glyph, glyphIndex) => {
        const bounds = advances[glyphIndex];

        if (bounds === null) {
          return (
            <span
              key={`${glyph.character}-${glyphIndex}`}
              aria-hidden="true"
              className="pharos__space"
              style={
                {
                  width: `calc(var(--ph-pixel-size) * ${spaceWidth})`,
                } as PixelStyle
              }
            />
          );
        }

        const { start, end } = bounds;

        return (
          <span
            key={`${glyph.character}-${glyphIndex}`}
            aria-hidden="true"
            className="pharos__char"
            style={
              {
                "--ph-cols": end - start + 1,
                "--ph-rows": METRICS.height,
              } as PixelStyle
            }
          >
            {glyph.matrix.flatMap((row, rowIndex) =>
              row.slice(start, end + 1).map((cell, sliceIndex) => {
                const columnIndex = start + sliceIndex;
                const lit = isLit(cell);
                if (!renderOff && !lit) return null;
                const classes = ["pharos__pixel"];
                const pixelStyle: PixelStyle = {
                  "--ph-row": rowIndex,
                  "--ph-col": columnIndex,
                };
                if (!renderOff) {
                  pixelStyle.gridColumn = columnIndex - start + 1;
                  pixelStyle.gridRow = rowIndex + 1;
                }

                if (lit) {
                  classes.push("pharos__pixel--on");
                  pixelStyle["--ph-i"] = litIndex++;
                  pixelStyle["--ph-n"] = litTotal;
                }

                if (cell !== "on" && cell !== "off") {
                  classes.push(`ph-tri-${cell}`);
                } else if (roundCorners && cell === "on") {
                  const tl =
                    !isFilled(glyph.matrix, rowIndex - 1, columnIndex) &&
                    !isFilled(glyph.matrix, rowIndex, columnIndex - 1)
                      ? cornerRadius
                      : "0";
                  const tr =
                    !isFilled(glyph.matrix, rowIndex - 1, columnIndex) &&
                    !isFilled(glyph.matrix, rowIndex, columnIndex + 1)
                      ? cornerRadius
                      : "0";
                  const br =
                    !isFilled(glyph.matrix, rowIndex + 1, columnIndex) &&
                    !isFilled(glyph.matrix, rowIndex, columnIndex + 1)
                      ? cornerRadius
                      : "0";
                  const bl =
                    !isFilled(glyph.matrix, rowIndex + 1, columnIndex) &&
                    !isFilled(glyph.matrix, rowIndex, columnIndex - 1)
                      ? cornerRadius
                      : "0";
                  pixelStyle.borderRadius = `${tl} ${tr} ${br} ${bl}`;
                }

                return (
                  <span
                    key={`${rowIndex}-${columnIndex}`}
                    className={classes.join(" ")}
                    style={pixelStyle}
                  />
                );
              }),
            )}
          </span>
        );
      })}
    </span>
  );
}
