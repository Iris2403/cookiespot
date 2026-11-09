"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/menu";
import { gallery, type GalleryItem } from "@/content/gallery";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/content/business";
import { getDictionary } from "@/i18n/dictionaries";
import { PhotoSlot } from "./PhotoSlot";
import { ChevronIcon, CloseIcon, InstagramIcon } from "./icons";

const spec = (g: GalleryItem) => ({ kind: g.kind, dough: g.colors.base, chunks: g.colors.chips, backdrop: g.colors.bg, accent: g.colors.accent });

export function Gallery({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const items = gallery;

  const show = (i: number, el: HTMLElement) => {
    triggerRef.current = el;
    setIndex(i);
  };
  const step = useCallback((d: number) => setIndex((i) => (i == null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (index != null && dlg && !dlg.open) dlg.showModal();
  }, [index]);

  // Swipe support on touch devices
  const touch = useRef<number | null>(null);

  const current = index != null ? items[index] : null;

  return (
    <section id="gallery" className="gallery section" aria-labelledby="gallery-title">
      <div className="container">
        <div className="section-head section-head--split" data-reveal>
          <p className="eyebrow">{t.gallery.eyebrow}</p>
          <div className="gallery__head">
            <div>
              <h2 id="gallery-title" className="display-lg">{t.gallery.title}</h2>
              {gallery.some((g) => !g.src) && <p className="muted gallery__note">{t.gallery.note}</p>}
            </div>
            <a href={INSTAGRAM_URL} className="btn btn--outline" target="_blank" rel="noopener noreferrer">
              <InstagramIcon /> {t.gallery.follow} {INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
        <ul className="gallery__grid">
          {items.map((g, i) => (
            <li key={g.id} className={`gallery__item gallery__item--${g.shape}`} data-reveal style={{ ["--i" as string]: i % 4 }}>
              <button type="button" className="gallery__btn" aria-haspopup="dialog" aria-label={`${t.gallery.open}: ${g.alt[locale]}`} onClick={(e) => show(i, e.currentTarget)}>
                <PhotoSlot locale={locale} src={g.src} alt={g.alt[locale]} spec={spec(g)} sizes="(min-width: 960px) 40vw, 90vw" quiet={g.shape === "square"} />
                <span className="gallery__caption" aria-hidden="true">{g.alt[locale]}</span>
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
            <div className="lightbox__media">
              <PhotoSlot locale={locale} src={current.src} alt={current.alt[locale]} spec={spec(current)} sizes="90vw" />
            </div>
            <figcaption>
              <span>{current.alt[locale]}</span>
              <span className="lightbox__count">{(index ?? 0) + 1} {t.gallery.of} {items.length}</span>
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
