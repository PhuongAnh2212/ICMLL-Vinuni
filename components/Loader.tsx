"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { markReady } from "@/lib/loader";

const SIZE = 56; // px per pixel cell
const TONES = ["#7be87a", "#86ea85", "#72de72", "#7be87a"];
const SEEN_KEY = "icmll-loader-seen"; // once per browser session

const seen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

/** Green pixel-block cover with a counter; dissolves cell by cell to reveal the site. */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const grid = el.querySelector<HTMLElement>(".loader-cells")!;
    const num = el.querySelector<HTMLElement>(".loader-num")!;
    const label = el.querySelectorAll<HTMLElement>(".loader-label, .loader-quote");
    const html = document.documentElement;

    if (seen() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.display = "none";
      markReady();
      return;
    }

    const cols = Math.ceil(window.innerWidth / SIZE);
    const rows = Math.ceil(window.innerHeight / SIZE);
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < cols * rows; i++) {
      const c = document.createElement("i");
      c.style.background = TONES[(Math.random() * TONES.length) | 0];
      frag.appendChild(c);
    }
    grid.replaceChildren(frag);
    el.style.background = "transparent";
    html.style.overflow = "hidden";

    const loaded = Promise.all([
      document.fonts.ready,
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((r) => window.addEventListener("load", r, { once: true })),
    ]);

    let dead = false;
    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        v: 100,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, "0")),
        onComplete: () =>
          loaded.then(() => {
            if (dead) return;
            try {
              sessionStorage.setItem(SEEN_KEY, "1");
            } catch {}
            gsap
              .timeline({
                onComplete: () => {
                  el.style.display = "none";
                  html.style.overflow = "";
                },
              })
              .to(label, { autoAlpha: 0, y: -20, duration: 0.3 })
              .call(markReady, [], 0.3)
              .to(Array.from(grid.children), { opacity: 0, duration: 0.3, stagger: { amount: 0.9, from: "random" } }, 0.2);
          }),
      });
    }, el);

    return () => {
      dead = true;
      ctx.revert();
      html.style.overflow = "";
      grid.replaceChildren();
      el.style.background = "";
      el.style.display = "";
    };
  }, []);

  return (
    <div ref={root} className="loader" aria-hidden>
      <div className="loader-cells" />
      <div className="loader-label">
        <span className="loader-small">ICMLL</span>
        <span className="loader-num">000</span>
        <span className="loader-pct">%</span>
      </div>
      <p className="loader-quote">
        Imagination is more important than knowledge.
        <span>— Albert Einstein</span>
      </p>
    </div>
  );
}
