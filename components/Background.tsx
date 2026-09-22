"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { onReady } from "@/lib/loader";

/** Fixed gradient field: drifts on its own, parallaxes with the mouse and slides with scroll. */
export default function Background() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    let offReady = () => {};
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const intro = gsap.from(q(".bg-blob"), { autoAlpha: 0, scale: 0.6, duration: 1.8, stagger: 0.12, ease: "power4.out", paused: true });
      offReady = onReady(() => intro.play());
      if (reduce) return;

      q(".bg-blob").forEach((b, i) =>
        gsap.to(b, {
          x: "random(-80, 80)",
          y: "random(-60, 60)",
          scale: "random(0.9, 1.15)",
          duration: "random(6, 10)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.4,
        })
      );

      // scroll: each depth group slides at its own rate
      q<HTMLElement>(".bg-scroll").forEach((s, i) =>
        gsap.to(s, {
          yPercent: i ? -28 : -14,
          ease: "none",
          scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 },
        })
      );

      // mouse parallax
      const layers = q<HTMLElement>("[data-depth]").map((n) => ({
        depth: parseFloat(n.dataset.depth || "0"),
        x: gsap.quickTo(n, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(n, "y", { duration: 1.2, ease: "power3.out" }),
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(nx * l.depth);
          l.y(ny * l.depth);
        });
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    }, el);
    return () => {
      offReady();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} className="bg" aria-hidden>
      <div className="bg-grid" />
      <div data-depth="-60" className="layer">
        <div className="bg-scroll">
          <div className="bg-blob b1" />
          <div className="bg-blob b3" />
        </div>
      </div>
      <div data-depth="-140" className="layer">
        <div className="bg-scroll">
          <div className="bg-blob b2" />
          <div className="bg-blob b4" />
        </div>
      </div>
      <div className="grain" />
    </div>
  );
}
