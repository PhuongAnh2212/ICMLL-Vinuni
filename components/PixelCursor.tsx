"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const CELL = 40; // px, size of one pixel cube
const COLORS = ["#4b3df0", "#ff5b3d", "#372fb0", "#ffffff", "#16161c"];
const HEAD = "#16161c";

type Cell = { a: number; c: string };

/** Pixel-grid cursor: a snapped cube tracks the mouse and leaves a fading trail of cubes. */
export default function PixelCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d")!;
    const cells = new Map<string, Cell>();
    let w = 0, h = 0, dpr = 1;
    // head follows the pointer with easing, then is snapped to the grid when drawn
    const head = { x: -999, y: -999, on: false, s: 0 };
    let last: { cx: number; cy: number } | null = null;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const light = (cx: number, cy: number, a: number) => {
      const k = `${cx},${cy}`;
      const prev = cells.get(k);
      if (!prev || prev.a < a) {
        cells.set(k, { a, c: COLORS[(Math.random() * COLORS.length) | 0] });
      }
    };

    const stamp = (cx: number, cy: number) => {
      light(cx, cy, 1);
      // scatter a few neighbours for the pixel-dust look
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++)
          if ((dx || dy) && Math.random() < 0.18) light(cx + dx, cy + dy, 0.55 + Math.random() * 0.3);
    };

    // the effect only lives on the home section
    const home = () => document.getElementById("home")!.getBoundingClientRect();

    const onMove = (e: PointerEvent) => {
      const hr = home();
      if (e.clientY < hr.top || e.clientY > hr.bottom) return onLeave();
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = Math.floor(x / CELL);
      const cy = Math.floor(y / CELL);
      if (!head.on) {
        head.x = x;
        head.y = y;
        head.on = true;
        gsap.to(head, { s: 1, duration: 0.3, ease: "back.out(2)" });
      }
      gsap.to(head, { x, y, duration: 0.25, ease: "power3.out", overwrite: true });

      // fill every cell between the last and current cell so fast moves leave no gaps
      if (last && (last.cx !== cx || last.cy !== cy)) {
        const n = Math.max(Math.abs(cx - last.cx), Math.abs(cy - last.cy));
        for (let i = 1; i <= n; i++)
          stamp(Math.round(last.cx + ((cx - last.cx) * i) / n), Math.round(last.cy + ((cy - last.cy) * i) / n));
      } else if (!last) stamp(cx, cy);
      last = { cx, cy };
    };
    function onLeave() {
      if (!head.on && !last) return;
      head.on = false;
      last = null;
      gsap.to(head, { s: 0, duration: 0.25 });
    }

    const tick = (_t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const hr = home();
      const top = Math.max(hr.top, 0);
      const bottom = Math.min(hr.bottom, h);
      if (bottom <= top) return cells.clear(); // home is scrolled out of view
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, top, w, bottom - top);
      ctx.clip();
      const decay = dt / 900; // ~0.9s trail
      cells.forEach((cell, k) => {
        cell.a -= decay;
        if (cell.a <= 0) return cells.delete(k);
        const [cx, cy] = k.split(",").map(Number);
        ctx.globalAlpha = cell.a;
        ctx.fillStyle = cell.c;
        ctx.fillRect(cx * CELL, cy * CELL, CELL, CELL);
      });
      if (head.s > 0.01) {
        // the cube snaps to the grid cell under the eased pointer
        const gx = Math.floor(head.x / CELL) * CELL;
        const gy = Math.floor(head.y / CELL) * CELL;
        const s = CELL * head.s;
        const o = (CELL - s) / 2;
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(75,61,240,0.9)";
        ctx.fillRect(gx + o, gy + o, s, s);
        ctx.strokeStyle = HEAD;
        ctx.lineWidth = 2;
        ctx.strokeRect(gx + o + 1, gy + o + 1, s - 2, s - 2);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.ticker.remove(tick);
      gsap.killTweensOf(head);
    };
  }, []);

  return <canvas ref={ref} className="pixel-canvas" aria-hidden />;
}
