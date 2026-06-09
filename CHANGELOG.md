# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-06-08

### Added

- `createGlyphRegistry()` for isolated glyph registries with their own glyph
  table and parse cache — useful for SSR, tests, or rendering different glyph
  sets side by side without touching global state.
- `registry` prop on `PixelText` to render from a custom registry instead of the
  shared global one.
- `countLit()` is now exported. It is memoized per matrix reference, so repeated
  characters reuse the count instead of rescanning the grid.
- `pharos__space--fallback` class on the spacer rendered in place of an unknown
  character, so missing glyphs can be surfaced via CSS.

### Changed

- Internal: extracted the smart-corner and fluid-sizing math out of `PixelText`
  into pure, individually tested engine helpers (`corners`, `layout`, `lit`).
  No behavioural change.

## [1.0.0] - 2026-06-04

### Added

- Initial release: `PixelText` React component rendering text on a 12×18 serif
  pixel grid.
- Pixel shapes (`dot`, `squircle`, `diamond`, `ring`, `square`), smart corners,
  proportional kerning, fluid sizing and per-pixel animation variables.
- Runtime glyph registration via `registerGlyph`, plus letters, digits, accents
  and punctuation.

[1.1.0]: https://github.com/skvggor/pharos/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/skvggor/pharos/releases/tag/v1.0.0
