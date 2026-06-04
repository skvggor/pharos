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
  fluid?: boolean;
  gapRatio?: number;
  letterSpacingRatio?: number;
  "aria-label"?: string;
}

type PixelStyle = CSSProperties & Record<`--df-${string}`, string | number>;

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
    rootStyle["--df-units"] = units > 0 ? units : 1;
    rootStyle["--df-gap-ratio"] = gapRatio;
    rootStyle["--df-letter-ratio"] = letterSpacingRatio;
  } else {
    if (pixelSize !== undefined)
      rootStyle["--df-pixel-size"] = toCssLength(pixelSize);
    if (gap !== undefined) rootStyle["--df-gap"] = toCssLength(gap);
    if (letterSpacing !== undefined)
      rootStyle["--df-letter-spacing"] = toCssLength(letterSpacing);
  }
  if (color !== undefined) rootStyle["--df-on-color"] = color;
  if (offColor !== undefined) rootStyle["--df-off-color"] = offColor;

  // Smart corners emit per-corner border-radius, which only affects square-ish
  // shapes; for dot/diamond/ring the shape already owns border-radius/clip-path.
  const roundCorners =
    smartCorners && (pixelShape === "square" || pixelShape === "squircle");
  const cornerRadius = `calc(var(--df-pixel-size) * ${smoothness / 2})`;
  const rootClassName = [
    "digital-font",
    `df-shape-${pixelShape}`,
    fluid && "digital-font--fluid",
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
              className="digital-font__space"
              style={
                {
                  width: `calc(var(--df-pixel-size) * ${spaceWidth})`,
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
            className="digital-font__char"
            style={{ "--df-cols": end - start + 1 } as PixelStyle}
          >
            {glyph.matrix.flatMap((row, rowIndex) =>
              row.slice(start, end + 1).map((cell, sliceIndex) => {
                const columnIndex = start + sliceIndex;
                const lit = isLit(cell);
                const classes = ["digital-font__pixel"];
                const pixelStyle: PixelStyle = {
                  "--df-row": rowIndex,
                  "--df-col": columnIndex,
                };

                if (lit) {
                  classes.push("digital-font__pixel--on");
                  pixelStyle["--df-i"] = litIndex++;
                  pixelStyle["--df-n"] = litTotal;
                }

                if (cell !== "on" && cell !== "off") {
                  classes.push(`df-tri-${cell}`);
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
