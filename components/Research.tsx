"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Title } from "./Sections";

const WORKS = [
  { title: "Medical AI", text: "Clinically useful models for diagnosis and decision support, built with calibrated uncertainty.", img: "medical-ai" },
  { title: "Multimodal AI", text: "Joint learning across vision, language and structured signals for grounded perception and generation.", img: "multimodal-ai" },
  { title: "Machine Learning Foundations", text: "Optimization, generalization and efficient learning with limited data and compute.", img: "ml-foundations" },
  { title: "Natural Language Processing", text: "Language models, reasoning and multilingual understanding, including low-resource languages.", img: "nlp" },
  { title: "Computer Vision", text: "Perception, 3D understanding and generative models for images and video.", img: "vision" },
  { title: "Intelligent Systems", text: "Agents that learn, reason and interact in complex, real-world environments.", img: "intelligent-systems" },
];

// pixel overlay grid; the image lives in the bottom-right block of it
const COLS = 9;
const ROWS = 6;
const IMG_COL = 4; // first column of the image block
const IMG_ROW = 3; // first row of the image block
const GREEN = "#7be87a";

const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  return { inImg: c >= IMG_COL && r >= IMG_ROW, ring: !(c >= IMG_COL && r >= IMG_ROW) && c >= 2 && r >= 2 };
});

function WorkCard({ title, text, img }: (typeof WORKS)[number]) {
  const ref = useRef<HTMLAnchorElement>(null);

  const cells = (sel: string) => Array.from(ref.current!.querySelectorAll<HTMLElement>(sel));

  const enter = () => {
    const inner = cells(".px.in");
    const stray = gsap.utils.shuffle(cells(".px.ring")).slice(0, 7);
    gsap.killTweensOf([...inner, ...stray]);
    gsap
      .timeline()
      // image block: cells flash white, then drop away to reveal the picture
      .to(inner, { backgroundColor: "#fff", duration: 0.08, stagger: { amount: 0.35, from: "random" } }, 0)
      .to(inner, { opacity: 0, duration: 0.18, stagger: { amount: 0.35, from: "random" } }, 0.1)
      // a few stray white pixels blink around it
      .fromTo(stray, { opacity: 0, backgroundColor: "#fff" }, { opacity: 1, duration: 0.05, stagger: { amount: 0.4, from: "random" } }, 0)
      .to(stray, { opacity: 0, duration: 0.3, stagger: { amount: 0.4, from: "random" } }, 0.25);
  };

  const leave = () => {
    const inner = cells(".px.in");
    const stray = cells(".px.ring");
    gsap.killTweensOf([...inner, ...stray]);
    gsap.set(stray, { opacity: 0 });
    gsap.to(inner, { opacity: 1, backgroundColor: GREEN, duration: 0.12, stagger: { amount: 0.25, from: "random" } });
  };

  return (
    <a
      ref={ref}
      href="#research"
      className="work"
      data-reveal="up"
      onClick={(e) => e.preventDefault()}
      onPointerEnter={enter}
      onPointerLeave={leave}
    >
      <div className="work-img" style={{ backgroundImage: `url(/work/${img}.svg)` }} />
      <div className="work-px" aria-hidden>
        {CELLS.map((c, i) => (
          <i key={i} className={`px ${c.inImg ? "in" : c.ring ? "ring" : "off"}`} />
        ))}
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <span className="work-arrow" aria-hidden>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M6 18 18 6M8 6h10v10" />
        </svg>
      </span>
    </a>
  );
}

export default function Research() {
  return (
    <section id="research" className="section section-white">
      <Title lines={["Discover", "our work"]} />
      <div className="grid grid-3">
        {WORKS.map((w) => (
          <WorkCard key={w.title} {...w} />
        ))}
      </div>
    </section>
  );
}
