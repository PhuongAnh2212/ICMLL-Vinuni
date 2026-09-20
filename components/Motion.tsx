"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Scroll-triggered reveals for everything marked data-reveal in the sections. */
export default function Motion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // section titles: same wipe + slide-up as the hero
      gsap.utils.toArray<HTMLElement>("[data-reveal='title']").forEach((h) => {
        const block = h.querySelector(".title-block");
        const text = h.querySelector(".title-text");
        gsap
          .timeline({ scrollTrigger: { trigger: h, start: "top 85%", once: true } })
          .from(block, { clipPath: "inset(0 100% 0 0)", duration: 0.9, ease: "expo.out" })
          .from(text, { yPercent: 110, duration: 0.9, ease: "power4.out" }, 0.1);
      });

      // everything else fades up in batches
      gsap.set("[data-reveal='up']", { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch("[data-reveal='up']", {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", overwrite: true }),
      });
    });
    return () => ctx.revert();
  }, []);
  return null;
}
