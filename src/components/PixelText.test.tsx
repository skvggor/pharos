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
    expect(container.querySelectorAll(".pharos__char")).toHaveLength(2);
  });

  it("renders the full grid of cells per character", () => {
    const { container } = render(<PixelText text="A" />);
    const pixels = container.querySelectorAll(".pharos__pixel");
    expect(pixels).toHaveLength(METRICS.width * METRICS.height);
  });

  it("renders only lit cells with explicit placement when renderOff is false", () => {
    const { container } = render(<PixelText text="A" renderOff={false} />);
    const pixels = container.querySelectorAll<HTMLElement>(".pharos__pixel");
    const lit = container.querySelectorAll(".pharos__pixel--on");

    expect(pixels.length).toBe(lit.length);
    expect(pixels.length).toBeLessThan(METRICS.width * METRICS.height);
    expect(pixels[0].style.gridRow).not.toBe("");
    expect(pixels[0].style.gridColumn).not.toBe("");
  });

  it("marks lit pixels with the on modifier", () => {
    const { container } = render(<PixelText text="A" />);
    const lit = container.querySelectorAll(".pharos__pixel--on");
    expect(lit.length).toBeGreaterThan(0);
  });

  it("applies the default dot shape on the root", () => {
    const { container } = render(<PixelText text="O" />);
    expect(container.querySelector(".pharos.ph-shape-dot")).toBeInTheDocument();
  });

  it("applies a custom pixel shape on the root", () => {
    const { container } = render(<PixelText text="O" pixelShape="diamond" />);
    expect(
      container.querySelector(".pharos.ph-shape-diamond"),
    ).toBeInTheDocument();
  });

  it("renders subpixel triangles for glyphs that use them", () => {
    const { container } = render(<PixelText text="A" />);
    expect(container.querySelector(".ph-tri-tr")).toBeInTheDocument();
    expect(container.querySelector(".ph-tri-tl")).toBeInTheDocument();
  });

  it("rounds outer corners when smartCorners is enabled on a square shape", () => {
    const { container } = render(
      <PixelText text="O" pixelShape="square" smartCorners smoothness={1} />,
    );
    const rounded = Array.from(
      container.querySelectorAll<HTMLElement>(".pharos__pixel--on"),
    ).filter((pixel) => pixel.style.borderRadius.includes("calc"));
    expect(rounded.length).toBeGreaterThan(0);
  });

  it("does not round corners for shapes that own their radius (dot)", () => {
    const { container } = render(
      <PixelText text="O" pixelShape="dot" smartCorners smoothness={1} />,
    );
    const rounded = Array.from(
      container.querySelectorAll<HTMLElement>(".pharos__pixel--on"),
    ).filter((pixel) => pixel.style.borderRadius.includes("calc"));
    expect(rounded).toHaveLength(0);
  });

  it("assigns a sequential animation index to lit pixels", () => {
    const { container } = render(<PixelText text="I" />);
    const lit = container.querySelectorAll<HTMLElement>(
      ".pharos__pixel--on",
    );
    expect(lit[0].style.getPropertyValue("--ph-i")).toBe("0");
    expect(lit[1].style.getPropertyValue("--ph-i")).toBe("1");
  });

  it("applies styling props as CSS variables", () => {
    const { container } = render(
      <PixelText text="O" pixelSize={10} gap="2px" color="#0f0" />,
    );
    const root = container.querySelector<HTMLElement>(".pharos");

    expect(root?.style.getPropertyValue("--ph-pixel-size")).toBe("10px");
    expect(root?.style.getPropertyValue("--ph-gap")).toBe("2px");
    expect(root?.style.getPropertyValue("--ph-on-color")).toBe("#0f0");
  });

  it("trims side-bearing per glyph in proportional mode", () => {
    const { container } = render(<PixelText text="I" />);
    const char = container.querySelector<HTMLElement>(".pharos__char");
    const cols = Number(char?.style.getPropertyValue("--ph-cols"));

    expect(cols).toBeGreaterThan(0);
    expect(cols).toBeLessThan(METRICS.width);
  });

  it("keeps the full canvas width when proportional is disabled", () => {
    const { container } = render(<PixelText text="I" proportional={false} />);
    const char = container.querySelector<HTMLElement>(".pharos__char");
    expect(char?.style.getPropertyValue("--ph-cols")).toBe(String(METRICS.width));
  });

  it("renders a sized spacer for the space character", () => {
    const { container } = render(<PixelText text="A B" spaceWidth={3} />);
    const space = container.querySelector<HTMLElement>(".pharos__space");

    expect(space).toBeInTheDocument();
    expect(space?.style.width).toContain("3");
  });

  it("derives pixel size from the parent width in fluid mode", () => {
    const { container } = render(<PixelText text="HI" fluid />);
    const root = container.querySelector<HTMLElement>(".pharos--fluid");

    expect(root).toBeInTheDocument();
    expect(Number(root?.style.getPropertyValue("--ph-units"))).toBeGreaterThan(0);
    expect(root?.style.getPropertyValue("--ph-gap-ratio")).toBe("0.16");
  });

  it("ignores absolute pixelSize when fluid", () => {
    const { container } = render(<PixelText text="HI" fluid pixelSize={40} />);
    const root = container.querySelector<HTMLElement>(".pharos");
    expect(root?.style.getPropertyValue("--ph-pixel-size")).toBe("");
  });

  it("merges a custom className", () => {
    const { container } = render(<PixelText text="O" className="neon" />);
    expect(container.querySelector(".pharos.neon")).toBeInTheDocument();
  });
});
