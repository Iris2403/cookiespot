"use client";
/**
 * Google reviews carousel: one review at a time with previous/next arrows (keyboard and swipe
 * friendly), plus a link to all reviews on Google Maps. Shows only genuine reviews from
 * content/reviews.ts — no ratings or counts are added.
 */
import { useRef, useState } from "react";
import type { Locale } from "@/content/menu";
import { reviews } from "@/content/reviews";
import { MAPS_SEARCH_URL } from "@/content/business";
import { getDictionary } from "@/i18n/dictionaries";
import { ChevronIcon, ExternalIcon, StarIcon } from "./icons";

export function Reviews({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [i, setI] = useState(0);
  const touch = useRef<number | null>(null);
  const n = reviews.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const r = reviews[i];

  return (
    <section className="reviews section" aria-labelledby="reviews-title">
      <div className="container reviews__inner">
        <div className="reviews__head" data-reveal>
          <p className="eyebrow">{t.reviews.eyebrow}</p>
          <h2 id="reviews-title" className="display-lg">{t.reviews.title}</h2>
          <p className="lead">{t.reviews.lead}</p>
          <a href={MAPS_SEARCH_URL} className="text-link" target="_blank" rel="noopener noreferrer">
            {t.reviews.google} <ExternalIcon />
          </a>
        </div>

        {n > 0 && (
          <div
            className="review-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label={t.reviews.eyebrow}
            data-reveal
            onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touch.current == null) return;
              const dx = e.changedTouches[0].clientX - touch.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
              touch.current = null;
            }}
          >
            <figure className="review-slide" key={i} aria-live="polite">
              <span className="review-slide__mark" aria-hidden="true">“</span>
              <span className="review-slide__stars" role="img" aria-label={`${r.rating}/5`}>
                {Array.from({ length: r.rating }, (_, k) => <StarIcon key={k} />)}
              </span>
              <blockquote lang={r.lang} className={r.text.length > 260 ? "is-long" : undefined}>
                <p>{r.text}</p>
              </blockquote>
              <figcaption className="review-slide__meta">
                <span className="review-slide__author">{r.author}</span>
                <span>
                  {t.reviews.source}:{" "}
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="link">{r.source}</a>
                </span>
              </figcaption>
            </figure>
            {n > 1 && (
              <div className="review-carousel__nav">
                <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label={t.reviews.prev}><ChevronIcon dir="left" /></button>
                <span className="review-carousel__count" aria-hidden="true">{i + 1} / {n}</span>
                <button type="button" className="icon-btn" onClick={() => go(1)} aria-label={t.reviews.next}><ChevronIcon /></button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
