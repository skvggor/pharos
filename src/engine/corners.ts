import type { PixelMatrix } from "@domain/index";

/**
 * Whether the cell at (row, column) is lit. Out-of-bounds cells count as empty,
 * so edge pixels are treated as outer corners.
 */
export function isFilled(
  matrix: PixelMatrix,
  row: number,
  column: number,
): boolean {
  const cell = matrix[row]?.[column];
  return cell !== undefined && cell !== "off";
}

/**
 * `border-radius` shorthand for smart corners: each corner is rounded only when
 * both of its orthogonal neighbours are empty, i.e. it is an outer corner of
 * the glyph silhouette.
 */
export function smartCornerRadius(
  matrix: PixelMatrix,
  row: number,
  column: number,
  radius: string,
): string {
  const topLeft =
    !isFilled(matrix, row - 1, column) && !isFilled(matrix, row, column - 1)
      ? radius
      : "0";
  const topRight =
    !isFilled(matrix, row - 1, column) && !isFilled(matrix, row, column + 1)
      ? radius
      : "0";
  const bottomRight =
    !isFilled(matrix, row + 1, column) && !isFilled(matrix, row, column + 1)
      ? radius
      : "0";
  const bottomLeft =
    !isFilled(matrix, row + 1, column) && !isFilled(matrix, row, column - 1)
      ? radius
      : "0";

  return `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
}
