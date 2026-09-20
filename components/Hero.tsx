"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { onReady } from "@/lib/loader";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    let offReady = () => {};
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);

      const intro = gsap
        .timeline({ defaults: { ease: "power4.out" }, paused: true })
        .from(q(".title-block"), { clipPath: "inset(0 100% 0 0)", duration: 1, stagger: 0.18, ease: "expo.out" }, 0.25)
        .from(q(".title-text"), { yPercent: 110, duration: 1, stagger: 0.18 }, 0.35)
        .from(q(".quote > *"), { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.1 }, 1);
      offReady = onReady(() => intro.play());
    }, el);
    return () => {
      offReady();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="home" className="hero">
      <div className="content">
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
      </div>
    </section>
  );
}
