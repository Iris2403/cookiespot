import type { Locale } from "@/content/menu";
import { reviews } from "@/content/reviews";
import { MAPS_SEARCH_URL, WOLT_STORE_URL, WOLT_STORE_URL_EN } from "@/content/business";
import { getDictionary } from "@/i18n/dictionaries";
import { ExternalIcon } from "./icons";

/**
 * Social proof without fabrication: renders verified quotes from content/reviews.ts when present,
 * and always links to the live review pages. No ratings are shown because they change and
 * cannot be verified at build time.
 */
export function Reviews({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="reviews section" aria-labelledby="reviews-title">
      <div className="container reviews__inner">
        <div className="reviews__head" data-reveal>
          <p className="eyebrow">{t.reviews.eyebrow}</p>
          <h2 id="reviews-title" className="display-lg">{t.reviews.title}</h2>
          <p className="lead">{t.reviews.lead}</p>
        </div>

        {reviews.length > 0 && (
          <ul className="reviews__list">
            {reviews.map((r) => (
              <li key={`${r.source}-${r.author}-${r.date}`} className="review-card" data-reveal>
                <blockquote lang={r.lang}>
                  <p>“{r.text}”</p>
                </blockquote>
                <p className="review-card__meta">
                  <span>{r.author}</span> · <time dateTime={r.date}>{r.date}</time> ·{" "}
                  <a href={r.url} target="_blank" rel="noopener noreferrer">{t.reviews.source}: {r.source}</a>
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="reviews__links" data-reveal>
          <a href={MAPS_SEARCH_URL} className="review-link" target="_blank" rel="noopener noreferrer">
            <span className="review-link__quote" aria-hidden="true">“</span>
            <span className="review-link__label">{t.reviews.google}</span>
            <ExternalIcon />
          </a>
          <a href={locale === "en" ? WOLT_STORE_URL_EN : WOLT_STORE_URL} className="review-link review-link--alt" target="_blank" rel="noopener noreferrer">
            <span className="review-link__quote" aria-hidden="true">“</span>
            <span className="review-link__label">{t.reviews.wolt}</span>
            <ExternalIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
