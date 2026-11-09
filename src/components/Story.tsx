import type { Locale } from "@/content/menu";
import { media } from "@/content/media";
import { getDictionary } from "@/i18n/dictionaries";
import { BrandPhoto } from "./BrandPhoto";

/** "We bake it personally" — the shop, the counter and the brand line from its own packaging. */
export function Story({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section id="story" className="story section" aria-labelledby="story-title">
      <div className="container story__grid">
        <div className="story__copy" data-reveal>
          <p className="kicker kicker--light">{t.story.eyebrow}</p>
          <h2 id="story-title" className="story__title" lang="en">
            {t.story.titleA} <span>{t.story.titleB}</span>
          </h2>
          <p className="story__lead">{t.story.lead}</p>
          <ol className="story__points">
            {t.story.points.map((pt, i) => (
              <li key={pt.k}>
                <span className="story__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <strong>{pt.k}</strong>
                  <span>{pt.v}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="story__photos">
          <figure className="story__photo story__photo--shop" data-reveal>
            <BrandPhoto photo={media.storefront} locale={locale} sizes="(min-width: 1000px) 46vw, 92vw" />
            <figcaption>{t.story.shopCaption}</figcaption>
          </figure>
          <figure className="story__photo story__photo--counter" data-reveal style={{ ["--i" as string]: 1 }}>
            <BrandPhoto photo={media.counter} locale={locale} sizes="(min-width: 1000px) 30vw, 60vw" />
            <figcaption>{t.story.packCaption}</figcaption>
          </figure>
          <figure className="story__photo story__photo--stack" data-reveal style={{ ["--i" as string]: 2 }}>
            <BrandPhoto photo={media.stack} locale={locale} sizes="(min-width: 1000px) 22vw, 40vw" />
            <figcaption>{t.story.closeCaption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
