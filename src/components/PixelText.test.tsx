import { PixelText } from "@components/PixelText";
import { METRICS } from "@engine/metrics";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("PixelText", () => {
  it("exposes the text through an accessible label", () => {
    render(<PixelText text="HELLO" />);
    expect(screen.getByRole("img", { name: "HELLO" })).toBeInTheDocument();
  });

  it("prefers an explicit aria-label over the text", () => {
    render(<PixelText text="OLA" aria-label="Olá" />);
    expect(screen.getByRole("img", { name: "Olá" })).toBeInTheDocument();
  });

  it("renders one char grid per character", () => {
    const { container } = render(<PixelText text="HI" />);
    expect(container.querySelectorAll(".digital-font__char")).toHaveLength(2);
  });

  it("renders the full grid of cells per character", () => {
    const { container } = render(<PixelText text="A" />);
    const pixels = container.querySelectorAll(".digital-font__pixel");
    expect(pixels).toHaveLength(METRICS.width * METRICS.height);
  });

  it("marks lit pixels with the on modifier", () => {
    const { container } = render(<PixelText text="A" />);
    const lit = container.querySelectorAll(".digital-font__pixel--on");
    expect(lit.length).toBeGreaterThan(0);
  });

  it("applies the default dot shape on the root", () => {
    const { container } = render(<PixelText text="O" />);
    expect(container.querySelector(".digital-font.df-shape-dot")).toBeInTheDocument();
  });

  it("applies a custom pixel shape on the root", () => {
    const { container } = render(<PixelText text="O" pixelShape="diamond" />);
    expect(
      container.querySelector(".digital-font.df-shape-diamond"),
    ).toBeInTheDocument();
  });

  it("renders subpixel triangles for glyphs that use them", () => {
    const { container } = render(<PixelText text="A" />);
    expect(container.querySelector(".df-tri-tr")).toBeInTheDocument();
    expect(container.querySelector(".df-tri-tl")).toBeInTheDocument();
  });

  it("rounds outer corners when smartCorners is enabled on a square shape", () => {
    const { container } = render(
      <PixelText text="O" pixelShape="square" smartCorners smoothness={1} />,
    );
    const rounded = Array.from(
      container.querySelectorAll<HTMLElement>(".digital-font__pixel--on"),
    ).filter((pixel) => pixel.style.borderRadius.includes("calc"));
    expect(rounded.length).toBeGreaterThan(0);
  });

  it("does not round corners for shapes that own their radius (dot)", () => {
    const { container } = render(
      <PixelText text="O" pixelShape="dot" smartCorners smoothness={1} />,
    );
    const rounded = Array.from(
      container.querySelectorAll<HTMLElement>(".digital-font__pixel--on"),
    ).filter((pixel) => pixel.style.borderRadius.includes("calc"));
    expect(rounded).toHaveLength(0);
  });

  it("assigns a sequential animation index to lit pixels", () => {
    const { container } = render(<PixelText text="I" />);
    const lit = container.querySelectorAll<HTMLElement>(
      ".digital-font__pixel--on",
    );
    expect(lit[0].style.getPropertyValue("--df-i")).toBe("0");
    expect(lit[1].style.getPropertyValue("--df-i")).toBe("1");
  });

  it("applies styling props as CSS variables", () => {
    const { container } = render(
      <PixelText text="O" pixelSize={10} gap="2px" color="#0f0" />,
    );
    const root = container.querySelector<HTMLElement>(".digital-font");

    expect(root?.style.getPropertyValue("--df-pixel-size")).toBe("10px");
    expect(root?.style.getPropertyValue("--df-gap")).toBe("2px");
    expect(root?.style.getPropertyValue("--df-on-color")).toBe("#0f0");
  });

  it("trims side-bearing per glyph in proportional mode", () => {
    const { container } = render(<PixelText text="I" />);
    const char = container.querySelector<HTMLElement>(".digital-font__char");
    const cols = Number(char?.style.getPropertyValue("--df-cols"));

    expect(cols).toBeGreaterThan(0);
    expect(cols).toBeLessThan(METRICS.width);
  });

  it("keeps the full canvas width when proportional is disabled", () => {
    const { container } = render(<PixelText text="I" proportional={false} />);
    const char = container.querySelector<HTMLElement>(".digital-font__char");
    expect(char?.style.getPropertyValue("--df-cols")).toBe(String(METRICS.width));
  });

  it("renders a sized spacer for the space character", () => {
    const { container } = render(<PixelText text="A B" spaceWidth={3} />);
    const space = container.querySelector<HTMLElement>(".digital-font__space");

    expect(space).toBeInTheDocument();
    expect(space?.style.width).toContain("3");
  });

  it("derives pixel size from the parent width in fluid mode", () => {
    const { container } = render(<PixelText text="HI" fluid />);
    const root = container.querySelector<HTMLElement>(".digital-font--fluid");

    expect(root).toBeInTheDocument();
    expect(Number(root?.style.getPropertyValue("--df-units"))).toBeGreaterThan(0);
    expect(root?.style.getPropertyValue("--df-gap-ratio")).toBe("0.16");
  });

  it("ignores absolute pixelSize when fluid", () => {
    const { container } = render(<PixelText text="HI" fluid pixelSize={40} />);
    const root = container.querySelector<HTMLElement>(".digital-font");
    expect(root?.style.getPropertyValue("--df-pixel-size")).toBe("");
  });

  it("merges a custom className", () => {
    const { container } = render(<PixelText text="O" className="neon" />);
    expect(container.querySelector(".digital-font.neon")).toBeInTheDocument();
  });
});
