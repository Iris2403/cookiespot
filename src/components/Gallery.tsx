"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/menu";
import { gallery } from "@/content/gallery";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/content/business";
import { getDictionary } from "@/i18n/dictionaries";
import { asset } from "@/lib/site";
import { ChevronIcon, CloseIcon, InstagramIcon } from "./icons";

/** Masonry gallery of the brand's photography with an accessible full-screen viewer. */
export function Gallery({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const touch = useRef<number | null>(null);

  const step = useCallback((d: number) => setIndex((i) => (i == null ? i : (i + d + gallery.length) % gallery.length)), []);
  useEffect(() => {
    const dlg = dialogRef.current;
    if (index != null && dlg && !dlg.open) dlg.showModal();
  }, [index]);

  const current = index != null ? gallery[index] : null;

  return (
    <section id="gallery" className="gallery section" aria-labelledby="gallery-title">
      <div className="container">
        <header className="section-head section-head--row" data-reveal>
          <div>
            <p className="kicker">{t.gallery.eyebrow}</p>
            <h2 id="gallery-title" className="heading-xl">{t.gallery.title}</h2>
          </div>
          <a href={INSTAGRAM_URL} className="btn btn--outline" target="_blank" rel="noopener noreferrer">
            <InstagramIcon /> {INSTAGRAM_HANDLE}
          </a>
        </header>
        <ul className="gallery__grid">
          {gallery.map((g, i) => (
            <li key={g.id} className={`gallery__item gallery__item--${g.shape}`} data-reveal style={{ ["--i" as string]: i % 4 }}>
              <button
                type="button"
                className="gallery__btn"
                aria-haspopup="dialog"
                aria-label={`${t.gallery.open}: ${g.alt[locale]}`}
                onClick={(e) => {
                  triggerRef.current = e.currentTarget;
                  setIndex(i);
                }}
              >
                <Image src={asset(g.src)} alt="" fill sizes="(min-width: 960px) 40vw, 90vw" style={{ objectFit: "cover" }} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={current ? current.alt[locale] : t.gallery.eyebrow}
        onClose={() => {
          if (dialogRef.current?.open) return;
          setIndex(null);
          triggerRef.current?.focus({ preventScroll: true });
        }}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        {current && (
          <figure className="lightbox__figure" key={current.id}>
            <div className="lightbox__media" style={{ aspectRatio: `${current.width} / ${current.height}` }}>
              <Image src={asset(current.src)} alt={current.alt[locale]} fill sizes="92vw" style={{ objectFit: "contain" }} />
            </div>
            <figcaption>
              <span>{current.alt[locale]}</span>
              <span className="lightbox__count">{(index ?? 0) + 1} {t.gallery.of} {gallery.length}</span>
            </figcaption>
          </figure>
        )}
        <button type="button" className="icon-btn lightbox__close" onClick={() => dialogRef.current?.close()} aria-label={t.gallery.close}><CloseIcon /></button>
        <button type="button" className="icon-btn lightbox__nav lightbox__nav--prev" onClick={() => step(-1)} aria-label={t.gallery.prev}><ChevronIcon dir="left" /></button>
        <button type="button" className="icon-btn lightbox__nav lightbox__nav--next" onClick={() => step(1)} aria-label={t.gallery.next}><ChevronIcon /></button>
      </dialog>
    </section>
  );
}
