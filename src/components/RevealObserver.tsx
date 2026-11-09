"use client";
import { useEffect } from "react";

/**
 * One shared IntersectionObserver for every [data-reveal] element on the page.
 * CSS only hides those elements once <html> has the `reveal-ready` class, so content is
 * fully visible without JavaScript and for reduced-motion users.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const vh = window.innerHeight;
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      // Elements already on screen are shown immediately (no flash, no layout shift).
      if (el.getBoundingClientRect().top < vh) el.classList.add("is-visible");
      else io.observe(el);
    });
    root.classList.add("reveal-ready");
    return () => io.disconnect();
  }, []);
  return null;
}
