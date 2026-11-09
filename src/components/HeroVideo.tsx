"use client";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/site";

/**
 * Hero background video (the shop counter, filmed by the brand). Decorative and silent.
 * - The poster (a still frame) renders immediately; the video sources are attached only after
 *   mount, so they never compete with the page's first paint.
 * - Skipped entirely (poster only) for prefers-reduced-motion and Save-Data users.
 * - Paused while the hero is off screen, to save battery and CPU.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!play || !v) return;
    v.load();
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [play]);

  return (
    <video
      ref={ref}
      className="hero__video"
      poster={asset("/video/counter-poster.webp")}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    >
      {play && <source src={asset("/video/counter.webm")} type="video/webm" />}
      {play && <source src={asset("/video/counter.mp4")} type="video/mp4" />}
    </video>
  );
}
