"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronIcon } from "./icons";

/**
 * Native horizontal scroller (scroll-snap, touch/trackpad/keyboard scrolling) with prev/next
 * buttons. No scroll hijacking, no dependency.
 */
export function Carousel({ children, label, prevLabel, nextLabel, className }: { children: ReactNode; label: string; prevLabel: string; nextLabel: string; className?: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={`carousel ${className ?? ""}`} role="region" aria-roledescription="carousel" aria-label={label}>
      <ul ref={track} className="carousel__track" tabIndex={0}>
        {children}
      </ul>
      <div className="carousel__nav">
        <button type="button" className="icon-btn" onClick={() => go(-1)} disabled={edges.start} aria-label={prevLabel}><ChevronIcon dir="left" /></button>
        <button type="button" className="icon-btn" onClick={() => go(1)} disabled={edges.end} aria-label={nextLabel}><ChevronIcon /></button>
      </div>
    </div>
  );
}
