import { PixelText } from "@components/PixelText";
import { GithubLogo, GlobeHemisphereWest, LinkedinLogo } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import "./hero.css";

const LINKS = [
  {
    label: "skvggor.dev",
    href: "https://skvggor.dev",
    Icon: GlobeHemisphereWest,
  },
  {
    label: "GitHub",
    href: "https://github.com/skvggor",
    Icon: GithubLogo,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/marcker",
    Icon: LinkedinLogo,
  },
];

export function Hero() {
  const eyeRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const eye = eyeRef.current;
    if (!eye) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let currentFocus = 0.25;
    let targetFocus = 0.25;
    let rect = eye.getBoundingClientRect();

    const measure = () => {
      rect = eye.getBoundingClientRect();
    };

    const onMove = (event: PointerEvent) => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY) || 1;
      const radius = rect.width / 2;
      const reach = Math.min(1, distance / (radius * 2));
      const travel = radius * 0.18;
      targetX = (deltaX / distance) * reach * travel;
      targetY = (deltaY / distance) * reach * travel;
      // focus: brighter the closer the cursor is to the eye
      const span = Math.hypot(window.innerWidth, window.innerHeight) * 0.55;
      targetFocus = Math.max(0.15, Math.min(1, 1.1 - distance / span));
    };

    const relax = () => {
      targetFocus = 0.2;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      currentFocus += (targetFocus - currentFocus) * 0.08;
      eye.style.setProperty("--gx", `${currentX.toFixed(2)}px`);
      eye.style.setProperty("--gy", `${currentY.toFixed(2)}px`);
      eye.style.setProperty("--focus", currentFocus.toFixed(3));
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("mouseleave", relax);
    window.addEventListener("blur", relax);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      document.removeEventListener("mouseleave", relax);
      window.removeEventListener("blur", relax);
    };
  }, []);

  useEffect(() => {
    const container = nameRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let init = 0;
    let pointerX = -9999;
    let pointerY = -9999;
    let radius = 44;
    let cells: { el: HTMLElement; x: number; y: number; off: boolean }[] = [];

    const sample = () => {
      const pixels = Array.from(
        container.querySelectorAll<HTMLElement>(".digital-font__pixel--on"),
      );
      cells = pixels.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
          off: false,
        };
      });
      const first = pixels[0]?.getBoundingClientRect();
      if (first) radius = first.width * 2.4;
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    };
    const onLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
    };

    const tick = () => {
      const reach = radius * radius;
      for (const cell of cells) {
        const dx = cell.x - pointerX;
        const dy = cell.y - pointerY;
        const inside = dx * dx + dy * dy < reach;
        if (inside && !cell.off) {
          cell.off = true;
          cell.el.classList.remove("led-relight");
          cell.el.classList.add("led-off");
        } else if (!inside && cell.off) {
          cell.off = false;
          cell.el.classList.remove("led-off");
          cell.el.classList.add("led-relight");
          const { el } = cell;
          window.setTimeout(() => el.classList.remove("led-relight"), 650);
        }
      }
      frame = requestAnimationFrame(tick);
    };

    init = requestAnimationFrame(() => {
      sample();
      frame = requestAnimationFrame(tick);
    });

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onMove);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", sample);
    window.addEventListener("scroll", sample, { passive: true });

    return () => {
      cancelAnimationFrame(init);
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", sample);
      window.removeEventListener("scroll", sample);
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero__stage">
        <div className="hero__eye" ref={eyeRef} aria-hidden="true">
          <div className="hero__lens">
            <span className="hero__pupil" />
          </div>
        </div>

        <div className="hero__content">
          <h1 className="hero__name hero__glow" ref={nameRef}>
            <PixelText
              text="skvggor"
              fluid
              pixelShape="dot"
              color="#ff2d1a"
              aria-label="skvggor"
            />
          </h1>

          <p className="hero__role">SWE</p>

          <p className="hero__line">
            Front-end web developer with 15 years on large-scale projects across
            advertising, marketing, telecom and developer tools. I fold
            generative AI into a disciplined engineering process — XP, TDD,
            security checklists — treating it as a tool, not a shortcut.
          </p>

          <nav className="hero__links" aria-label="Links">
            {LINKS.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
              >
                <Icon size={24} weight="bold" />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
