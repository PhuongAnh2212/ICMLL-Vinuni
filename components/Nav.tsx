"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { NAV, NAV_HEIGHT } from "@/lib/site";
import { onReady } from "@/lib/loader";
import Socials from "./Socials";

const CELL = 48; // px per pixel cell in the mobile menu
const TONES = ["#7be87a", "#86ea85", "#72de72", "#7be87a"];

/** `current` is set on sub-pages: links go back to the home sections and that item stays highlighted. */
export default function Nav({ current }: { current?: string }) {
  const root = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(current ?? "home");

  useEffect(() => {
    const el = root.current!;
    let offReady = () => {};
    const ctx = gsap.context(() => {
      const intro = gsap.from(".nav-cell", { yPercent: -100, duration: 0.9, stagger: 0.07, ease: "power4.out", paused: true });
      offReady = onReady(() => intro.play());

      // highlight the link of the section in view
      if (current) return;
      const links = gsap.utils.toArray<HTMLElement>(".nav-link", el);
      NAV.forEach(({ id }, i) => {
        const target = document.getElementById(id);
        if (!target) return;
        ScrollTrigger.create({
          trigger: target,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (!self.isActive) return;
            links.forEach((l, j) => l.classList.toggle("active", i === j));
            setActive(id);
          },
        });
      });
    }, el);
    return () => {
      offReady();
      ctx.revert();
    };
  }, [current]);

  // ---------- mobile menu: pixel cells fill the screen, then the links appear ----------
  const tl = useRef<gsap.core.Timeline | null>(null);

  const openMenu = () => {
    const m = menu.current!;
    const grid = m.querySelector<HTMLElement>(".menu-cells")!;
    const cols = Math.ceil(window.innerWidth / CELL);
    const rows = Math.ceil(window.innerHeight / CELL);
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < cols * rows; i++) {
      const c = document.createElement("i");
      c.style.background = TONES[(Math.random() * TONES.length) | 0];
      c.style.opacity = "0";
      frag.appendChild(c);
    }
    grid.replaceChildren(frag);

    tl.current?.kill();
    m.classList.add("is-open");
    document.documentElement.style.overflow = "hidden";
    setOpen(true);
    tl.current = gsap
      .timeline()
      .set(".menu-item", { autoAlpha: 0, y: 30 })
      .to(Array.from(grid.children), { opacity: 1, duration: 0.2, stagger: { amount: 0.5, from: "random" } })
      .to(".menu-item", { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" }, "-=0.15");
  };

  const closeMenu = () => {
    const m = menu.current!;
    setOpen(false);
    tl.current?.kill();
    tl.current = gsap
      .timeline({
        onComplete: () => {
          m.classList.remove("is-open");
          document.documentElement.style.overflow = "";
        },
      })
      .to(".menu-item", { autoAlpha: 0, y: -10, duration: 0.2, stagger: 0.03 })
      .to(Array.from(m.querySelectorAll(".menu-cells i")), { opacity: 0, duration: 0.2, stagger: { amount: 0.4, from: "random" } }, 0.1);
  };

  useEffect(
    () => () => {
      tl.current?.kill();
      document.documentElement.style.overflow = "";
    },
    []
  );

  const go = (e: React.MouseEvent, id: string, fromMenu = false) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (fromMenu) closeMenu();
    if (!target) return;
    gsap.to(window, {
      scrollTo: { y: id === "home" ? 0 : target, offsetY: NAV_HEIGHT - 1, autoKill: true },
      duration: 1.2,
      ease: "power3.inOut",
      delay: fromMenu ? 0.5 : 0,
    });
    history.replaceState(null, "", `#${id}`);
  };

  const href = (id: string) => (current ? (id === "home" ? "/" : `/#${id}`) : `#${id}`);

  return (
    <>
      <nav ref={root} className="nav">
        <div className="nav-cell nav-logo">
          <span className="nav-brand">ICML Lab</span>
        </div>
        {NAV.map((n, i) =>
          current ? (
            <Link key={n.id} href={href(n.id)} className={`nav-cell nav-link${n.id === current ? " active" : ""}`}>
              <span>{n.label}</span>
            </Link>
          ) : (
            <a
              key={n.id}
              href={href(n.id)}
              onClick={(e) => go(e, n.id)}
              className={`nav-cell nav-link${i === 0 ? " active" : ""}`}
            >
              <span>{n.label}</span>
            </a>
          )
        )}
        <div className="nav-cell nav-fill">
          <Socials />
        </div>
        <button
          type="button"
          className="nav-cell nav-burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => (open ? closeMenu() : openMenu())}
        >
          <span className="burger" aria-hidden>
            <i />
            <i />
            <i />
          </span>
        </button>
      </nav>

      <div ref={menu} className="menu" aria-hidden={!open}>
        <div className="menu-cells" />
        <ul className="menu-list">
          {NAV.map((n) => (
            <li key={n.id} className="menu-item">
              {current ? (
                <Link href={href(n.id)} className={`menu-link${n.id === active ? " active" : ""}`} onClick={closeMenu}>
                  {n.label}
                </Link>
              ) : (
                <a href={href(n.id)} className={`menu-link${n.id === active ? " active" : ""}`} onClick={(e) => go(e, n.id, true)}>
                  {n.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <div className="menu-foot menu-item">
          <p>Intelligent Computing &amp; Machine Learning Lab</p>
          <Socials className="socials-light" />
        </div>
      </div>
    </>
  );
}
