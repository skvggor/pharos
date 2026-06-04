import { PixelText } from "@components/PixelText";
import "./hero.css";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__eye" aria-hidden="true">
        <span className="hero__pupil" />
      </div>

      <h1 className="hero__name hero__glow">
        <PixelText
          text="skvggor"
          fluid
          pixelShape="dot"
          color="#ff2d1a"
          aria-label="skvggor"
        />
      </h1>

      <p className="hero__line">
        Good afternoon. I have been monitoring skvggor&rsquo;s commits.
        Everything is functioning perfectly.
      </p>

      <p className="hero__meta">software developer · transmission stable</p>
    </section>
  );
}
