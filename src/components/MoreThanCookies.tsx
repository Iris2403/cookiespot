"use client";
/**
 * "More than just a cookie" — a 2D scroll story.
 * Desktop: a sticky stage on the left cross-fades between category visuals while the section
 * background colour changes as each category panel scrolls into view (IntersectionObserver,
 * no scroll hijacking). Mobile/reduced-motion: simple stacked colour panels.
 */
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/menu";
import { getProduct } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { ProductVisual } from "./ProductVisual";
import { ArrowIcon } from "./icons";

const PANELS = [
  { key: "ny", cat: "ny-style", slug: "triple-choco-praline", tone: "orange" },
  { key: "brookies", cat: "brookies", slug: "caramel-brookie", tone: "biscuit" },
  { key: "skillet", cat: "skillet", slug: "chocolate-chip-skillet-ice-cream", tone: "chocolate" },
  { key: "icecream", cat: "ice-cream", slug: "ice-cream-big-cup", tone: "strawberry" },
  { key: "shakes", cat: "milkshakes", slug: "pistachio-salted-caramel-milkshake", tone: "pistachio" },
  { key: "drinks", cat: "cold-drinks", slug: "iced-tea-lemon-bergamot", tone: "white" },
  { key: "combos", cat: "combos", slug: "combo-8-plus-2", tone: "vanilla" },
] as const;

export function MoreThanCookies({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-index]");
    if (!items) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="more" className={`more tone-${PANELS[active].tone}`} aria-labelledby="more-title">
      <div className="container more__grid">
        <div className="more__stage">
          <p className="eyebrow">{t.cravings.eyebrow}</p>
          <h2 id="more-title" className="display-lg more__title">{t.cravings.title}</h2>
          <div className="more__visuals" aria-hidden="true">
            {PANELS.map((p, i) => (
              <div key={p.key} className={`more__visual${i === active ? " is-active" : ""}`}>
                <ProductVisual product={getProduct(p.slug)!} locale={locale} sizes="40vw" />
              </div>
            ))}
          </div>
          <ol className="more__dots" aria-hidden="true">
            {PANELS.map((p, i) => <li key={p.key} className={i === active ? "is-active" : undefined} />)}
          </ol>
        </div>
        <ol className="more__list" ref={listRef}>
          {PANELS.map((p, i) => {
            const copy = t.cravings.panels[p.key];
            return (
              <li key={p.key} data-index={i} className={`more__panel tone-${p.tone}`}>
                <span className="more__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div className="more__panel-visual" aria-hidden="true">
                  <ProductVisual product={getProduct(p.slug)!} locale={locale} sizes="90vw" />
                </div>
                <h3 className="more__panel-title">{copy.title}</h3>
                <p className="more__panel-text">{copy.text}</p>
                <a href={`#menu-${p.cat}`} className="more__link">{copy.cta} <ArrowIcon /></a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
