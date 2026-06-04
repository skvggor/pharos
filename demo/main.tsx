import { PixelText } from "@components/PixelText";
import type { PixelShape } from "@domain/index";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./demo.css";

const SHAPES: PixelShape[] = ["dot", "squircle", "diamond", "ring", "square"];

function Demo() {
  return (
    <main className="demo">
      <h1>digital-font</h1>

      <section className="panel">
        <span className="caption">accents and punctuation</span>
        <PixelText
          text="Olá, Mundo!"
          pixelShape="dot"
          pixelSize={12}
          gap={2}
          color="#f8fafc"
        />
      </section>

      <section className="panel">
        <span className="caption">pixel shapes (12×18 serif)</span>
        <div className="stack">
          {SHAPES.map((shape) => (
            <div key={shape} className="row">
              <span className="tag">{shape}</span>
              <PixelText
                text="HELLO"
                pixelShape={shape}
                pixelSize={12}
                gap={2}
                color="#22d3ee"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <span className="caption">smart corners (retro → organic)</span>
        <div className="stack">
          {[0, 0.4, 0.8, 1].map((smoothness) => (
            <div key={smoothness} className="row">
              <span className="tag">{smoothness.toFixed(1)}</span>
              <PixelText
                text="HOTEL"
                pixelShape="square"
                smartCorners
                smoothness={smoothness}
                pixelSize={12}
                gap={0}
                color="#a78bfa"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <span className="caption">subpixel triangles (A apex · O curve)</span>
        <PixelText
          text="AO"
          pixelShape="square"
          pixelSize={18}
          gap={0}
          color="#34d399"
        />
      </section>

      <section className="panel">
        <span className="caption">kerning — adjustable proportional spacing</span>
        <div className="stack">
          <div className="row">
            <span className="tag">mono</span>
            <PixelText
              text="land"
              proportional={false}
              pixelSize={11}
              color="#94a3b8"
            />
          </div>
          {[0, 3, 8].map((tracking) => (
            <div key={tracking} className="row">
              <span className="tag">{tracking}px</span>
              <PixelText
                text="land"
                letterSpacing={tracking}
                pixelSize={11}
                color="#22d3ee"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <span className="caption">fluid — width follows parent, height keeps ratio</span>
        <div className="resizer">
          <PixelText
            text="HELLO"
            fluid
            pixelShape="square"
            smartCorners
            smoothness={0.4}
            color="#fbbf24"
          />
        </div>
        <span className="hint">drag the handle ↘ to resize</span>
      </section>

      <section className="panel dark">
        <span className="caption">sweep animation (per pixel)</span>
        <PixelText
          text="HELLO"
          className="sweep"
          pixelShape="dot"
          pixelSize={14}
          gap={3}
          color="#f43f5e"
        />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
