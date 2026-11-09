"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/menu";
import { gallery, type GalleryItem } from "@/content/gallery";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/content/business";
import { getDictionary } from "@/i18n/dictionaries";
import Image from "next/image";
import { asset } from "@/lib/site";
import { LineArt } from "./LineArt";
import { ArrowIcon } from "./icons";
import { ChevronIcon, CloseIcon, InstagramIcon } from "./icons";

const Photo = ({ g, locale, sizes }: { g: GalleryItem; locale: Locale; sizes: string }) => (
  <Image src={asset(g.src)} alt={g.alt[locale]} fill sizes={sizes} style={{ objectFit: "cover" }} />
);

/** Instagram invitation — shown instead of the gallery until real photos are added. */
function InstagramBand({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section id="gallery" className="ig section" aria-labelledby="ig-title">
      <div className="container ig__inner" data-reveal>
        <LineArt kind="bag" className="ig__art" />
        <div className="ig__copy">
          <p className="kicker">{t.gallery.igEyebrow}</p>
          <h2 id="ig-title" className="heading-xl">{t.gallery.igTitle}</h2>
          <p className="lead">{t.gallery.igText}</p>
        </div>
        <a href={INSTAGRAM_URL} className="ig__handle" target="_blank" rel="noopener noreferrer">
          <InstagramIcon /> {INSTAGRAM_HANDLE} <ArrowIcon />
        </a>
      </div>
    </section>
  );
}

export function Gallery({ locale }: { locale: Locale }) {
  if (gallery.length === 0) return <InstagramBand locale={locale} />;
  return <PhotoGallery locale={locale} />;
}

function PhotoGallery({ locale }: { locale: Locale }) {
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
                <Photo g={g} locale={locale} sizes="(min-width: 960px) 40vw, 90vw" />
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
              <Photo g={current} locale={locale} sizes="90vw" />
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
