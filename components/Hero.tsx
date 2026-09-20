"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import PixelCursor from "./PixelCursor";

const NAV = ["Home", "About", "Research", "People", "News"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);

      // ---------- intro ----------
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(q(".nav-cell"), { yPercent: -100, duration: 0.9, stagger: 0.07 })
        .from(q(".bg-blob"), { autoAlpha: 0, scale: 0.6, duration: 1.8, stagger: 0.12 }, 0)
        .from(
          q(".title-block"),
          { clipPath: "inset(0 100% 0 0)", duration: 1, stagger: 0.18, ease: "expo.out" },
          0.25
        )
        .from(q(".title-text"), { yPercent: 110, duration: 1, stagger: 0.18 }, 0.35)
        .from(q(".quote > *"), { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.1 }, 1);

      if (reduce) return;

      // ---------- idle drift ----------
      q(".bg-blob").forEach((b, i) => {
        gsap.to(b, {
          x: `random(-80, 80)`,
          y: `random(-60, 60)`,
          scale: `random(0.9, 1.15)`,
          duration: `random(6, 10)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.4,
        });
      });

      // ---------- mouse tracking ----------
      const W = () => window.innerWidth;
      const H = () => window.innerHeight;

      // wrapper layers move with different depth (parallax)
      const layers = q<HTMLElement>("[data-depth]").map((n) => ({
        depth: parseFloat(n.dataset.depth || "0"),
        x: gsap.quickTo(n, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(n, "y", { duration: 1.2, ease: "power3.out" }),
      }));

      // tilt on the title
      const title = q<HTMLElement>(".title")[0];
      const rotX = gsap.quickTo(title, "rotationX", { duration: 0.9, ease: "power3.out" });
      const rotY = gsap.quickTo(title, "rotationY", { duration: 0.9, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / W() - 0.5; // -0.5 … 0.5
        const ny = e.clientY / H() - 0.5;
        layers.forEach((l) => {
          l.x(nx * l.depth);
          l.y(ny * l.depth);
        });
        rotY(nx * 6);
        rotX(-ny * 6);
      };

      const onLeave = () => {
        layers.forEach((l) => {
          l.x(0);
          l.y(0);
        });
        rotX(0);
        rotY(0);
      };
      // hovering a title block nudges it toward the pointer
      q<HTMLElement>(".title-block").forEach((b) => {
        const bx = gsap.quickTo(b, "x", { duration: 0.6, ease: "power3.out" });
        b.addEventListener("pointermove", (e) => {
          const r = b.getBoundingClientRect();
          bx(((e.clientX - r.left) / r.width - 0.5) * 24);
        });
        b.addEventListener("pointerleave", () => bx(0));
      });

      window.addEventListener("pointermove", onMove);
      document.documentElement.addEventListener("pointerleave", onLeave);
      return () => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="hero">
      {/* animated gradient field */}
      <div className="bg" aria-hidden>
        <div data-depth="-60" className="layer">
          <div className="bg-blob b1" />
          <div className="bg-blob b3" />
        </div>
        <div data-depth="-140" className="layer">
          <div className="bg-blob b2" />
          <div className="bg-blob b4" />
        </div>
        <div className="grain" />
      </div>

      <PixelCursor />

      <nav className="nav">
        <div className="nav-cell nav-logo" />
        {NAV.map((n, i) => (
          <a key={n} href="#" className={`nav-cell nav-link${i === 0 ? " active" : ""}`}>
            <span>{n}</span>
          </a>
        ))}
        <div className="nav-cell nav-fill" />
      </nav>

      <section className="content" data-depth="18">
        <h1 className="title">
          <span className="title-block">
            <span className="title-text">Intelligent</span>
            <span className="title-text">Computing &amp;</span>
          </span>
          <span className="title-block">
            <span className="title-text">Machine Learning</span>
          </span>
          <span className="last-row">
            <span className="title-block">
              <span className="title-text">Lab</span>
            </span>
            <span className="quote">
              <span>Imagination is more important than knowledge.</span>
              <span>For knowledge is limited, whereas imagination embraces the entire world.</span>
              <span>-Albert Einstein-</span>
            </span>
          </span>
        </h1>
      </section>

    </main>
  );
}
