"use client";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Lightweight parallax: writes --px/--py (pointer, -1..1) and --sy (scroll progress, px) as CSS
 * variables on the wrapper; layers translate with calc() in CSS → GPU-composited transforms,
 * one rAF per frame, no layout reads in the loop. Disabled for reduced motion and coarse pointers
 * (scroll part still runs on touch, it is cheap).
 */
export function Parallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let px = 0, py = 0, sy = 0;
    let visible = true;
    const write = () => {
      frame = 0;
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
      el.style.setProperty("--sy", `${sy.toFixed(1)}px`);
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(write); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !visible) return;
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = (e.clientY / window.innerHeight) * 2 - 1;
      queue();
    };
    const onScroll = () => { if (!visible) return; sy = Math.min(window.scrollY, window.innerHeight * 1.2); queue(); };
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
