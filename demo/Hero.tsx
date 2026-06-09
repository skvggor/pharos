import { PixelText } from "@components/PixelText";
import { GithubLogo, GlobeHemisphereWest, LinkedinLogo } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, TransitionEvent } from "react";
import "./hero.css";

type Phase = "idle" | "countdown" | "matrix";
type HoldKind = null | "mouse" | "touch";

const COUNTDOWN_FROM = 9;

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const glyphs = "アカサタナハマヤラワ0123456789=+*<>".split("");
    const fontSize = 16;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.ceil(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -60);
    };
    resize();

    let raf = 0;
    let last = 0;
    const draw = () => {
      context.fillStyle = "rgba(0, 10, 4, 0.09)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = `${fontSize}px monospace`;
      for (let i = 0; i < columns; i++) {
        const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
        const y = drops[i] * fontSize;
        context.fillStyle = Math.random() > 0.97 ? "#d7ffe3" : "#22c55e";
        context.fillText(glyph, i * fontSize, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        else drops[i] += 1;
      }
    };
    const loop = (time: number) => {
      if (time - last > 55) {
        draw();
        last = time;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero__rain" aria-hidden="true" />;
}

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
  const eyeRef = useRef<HTMLButtonElement>(null);
  const ledsRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(COUNTDOWN_FROM);
  const [holding, setHolding] = useState<HoldKind>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Hold the eye to darken the screen; complete the hold to start the
  // countdown. Release before it finishes and it just fades back. Mouse keeps
  // the hover gesture (enter/leave); touch and pen use a captured press so a
  // small finger slide — or the page trying to scroll — can't steal the hold
  // mid-way.
  const startHover = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (phase === "idle" && event.pointerType === "mouse") setHolding("mouse");
  };
  const stopHover = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse") {
      setHolding((kind) => (kind === "mouse" ? null : kind));
    }
  };
  const startPress = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (phase !== "idle" || event.pointerType === "mouse") return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture unsupported; the hold still works without it.
    }
    setHolding("touch");
  };
  const endPress = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse") return;
    setHolding((kind) => (kind === "touch" ? null : kind));
  };

  const onEyeClick = () => {
    if (phase === "matrix") setPhase("idle");
  };

  const onFadeEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== "opacity" || !holding) return;
    setHolding(null);
    setCount(COUNTDOWN_FROM);
    setPhase("countdown");
  };

  useEffect(() => {
    if (phase !== "countdown") return;
    if (count <= 0) {
      const timer = window.setTimeout(() => setPhase("matrix"), 700);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setCount((value) => value - 1), 450);
    return () => window.clearTimeout(timer);
  }, [phase, count]);

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
    window.addEventListener("pointerdown", onMove);
    window.addEventListener("pointerup", relax);
    window.addEventListener("pointercancel", relax);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("mouseleave", relax);
    window.addEventListener("blur", relax);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", relax);
      window.removeEventListener("pointercancel", relax);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      document.removeEventListener("mouseleave", relax);
      window.removeEventListener("blur", relax);
    };
  }, []);

  useEffect(() => {
    const container = ledsRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let init = 0;
    let pointerX = -9999;
    let pointerY = -9999;
    let radius = 44;
    // Positions are cached relative to the container, so the effect stays
    // correct when the container moves (scroll) or the fluid text resizes.
    let cells: { el: HTMLElement; rx: number; ry: number; off: boolean }[] = [];

    const sample = () => {
      const bounds = container.getBoundingClientRect();
      // The "about" toggle renders with Pharos too, but it shouldn't take part
      // in the cursor light-off effect — only the name and divider do.
      const pixels = Array.from(
        container.querySelectorAll<HTMLElement>(".pharos__pixel--on"),
      ).filter((el) => !el.closest(".hero__about-label"));
      cells = pixels.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          rx: r.left + r.width / 2 - bounds.left,
          ry: r.top + r.height / 2 - bounds.top,
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
      const bounds = container.getBoundingClientRect();
      const reach = radius * radius;
      for (const cell of cells) {
        const dx = bounds.left + cell.rx - pointerX;
        const dy = bounds.top + cell.ry - pointerY;
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

    const observer = new ResizeObserver(sample);
    observer.observe(container);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onMove);
    window.addEventListener("pointerup", onLeave);
    window.addEventListener("pointercancel", onLeave);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(init);
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onLeave);
      window.removeEventListener("pointercancel", onLeave);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className={phase === "matrix" ? "hero hero--matrix" : "hero"}>
      {phase === "matrix" && <MatrixRain />}

      <a
        className="hero__repo hud-frame"
        href="https://github.com/skvggor/pharos"
        target="_blank"
        rel="noreferrer"
      >
        <GithubLogo size={18} weight="bold" />
        <span>skvggor/pharos</span>
      </a>

      <div className="hero__stage">
        <button
          type="button"
          className={[
            "hero__eye",
            holding && "is-holding",
            holding === "touch" && "is-touch",
          ]
            .filter(Boolean)
            .join(" ")}
          ref={eyeRef}
          aria-label="Activate"
          onClick={onEyeClick}
          onPointerEnter={startHover}
          onPointerLeave={stopHover}
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerCancel={endPress}
        >
          <div className="hero__lens">
            <span className="hero__pupil" />
            <svg
              className="hero__etch"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <defs>
                <path
                  id="hero-etch-path"
                  fill="none"
                  d="M 16,72 A 41,41 0 0 0 84,72"
                />
              </defs>
              <text textAnchor="middle">
                <textPath href="#hero-etch-path" startOffset="50%">
                  {"DON'T TOUCH!"}
                </textPath>
              </text>
            </svg>
          </div>
          <svg
            className="hero__progress"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="47" pathLength="100" />
          </svg>
        </button>

        <div className="hero__content" ref={ledsRef}>
          <h1 className="hero__name hero__glow">
            <PixelText
              text="Pharos"
              fluid
              pixelShape="dot"
              color={phase === "matrix" ? "#22c55e" : "#ff2d1a"}
              aria-label="Pharos"
            />
          </h1>

          <p className="hero__tagline">
            A serif pixel display font for React — each character is a glyph on
            a grid, rendered as configurable squares, dots, diamonds or rings.
          </p>

          <div className="hero__divider" aria-hidden="true">
            <PixelText
              text="-------"
              fluid
              pixelShape="ring"
              color={phase === "matrix" ? "#22c55e" : "#ff2d1a"}
            />
          </div>

          <div className="hero__about-block">
            <button
              type="button"
              className={
                aboutOpen
                  ? "hero__about-toggle hud-frame is-open"
                  : "hero__about-toggle hud-frame"
              }
              aria-label="About the author"
              aria-expanded={aboutOpen}
              aria-controls="hero-about"
              onClick={() => setAboutOpen((open) => !open)}
            >
              <span className="hero__about-label">
                <PixelText
                  text="about"
                  pixelSize={2}
                  gap={1}
                  pixelShape="square"
                  color={phase === "matrix" ? "#22c55e" : "#ff2d1a"}
                  aria-hidden="true"
                />
              </span>
              <span className="hero__about-caret" aria-hidden="true" />
            </button>

            <div
              id="hero-about"
              className={aboutOpen ? "hero__about is-open" : "hero__about"}
              inert={!aboutOpen}
            >
              <div className="hero__about-inner">
                <p className="hero__role">
                  Made by{" "}
                  <a
                    href="https://skvggor.dev"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Marcos Lima
                  </a>
                </p>

                <p className="hero__line">
                  Front-end web developer with 15 years on large-scale projects
                  across advertising, marketing, telecom and developer tools. I
                  fold generative AI into a disciplined engineering process —
                  XP, TDD, security checklists — treating it as a tool, not a
                  shortcut.
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
          </div>
        </div>
      </div>

      {phase === "idle" && (
        <div
          className={[
            "hero__fade",
            holding && "is-holding",
            holding === "touch" && "is-touch",
          ]
            .filter(Boolean)
            .join(" ")}
          onTransitionEnd={onFadeEnd}
        />
      )}

      {phase === "countdown" && (
        <div className="hero__countdown">
          <div className="hero__count">
            <PixelText
              text={String(Math.max(0, count))}
              fluid
              pixelShape="dot"
              color="#86efac"
              aria-label={`${Math.max(0, count)}`}
            />
          </div>
        </div>
      )}
    </section>
  );
}
