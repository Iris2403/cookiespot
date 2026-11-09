import type { Locale } from "@/content/menu";
import { formatPrice, getProduct, signatureProducts } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { ProductVisual } from "./ProductVisual";
import { OpenProductButton } from "./ProductDialog";
import { ArrowIcon } from "./icons";

export function Story({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const triple = getProduct("triple-choco-praline")!;
  const biscoff = getProduct("biscoff-cookie")!;
  const pb = getProduct("peanut-butter-chocolate-chips")!;
  const choc = getProduct("chocolate-chip")!;
  const favourites = signatureProducts();
  const detailCrops = [
    { product: biscoff, crop: "40 120 150 150" },
    { product: triple, crop: "130 90 150 150" },
    { product: pb, crop: "60 40 290 290" },
  ];

  return (
    <div id="story" className="story">
      {/* A — Intro */}
      <section className="story-intro section" aria-labelledby="story-intro-title">
        <div className="container story-intro__grid">
          <div className="story-intro__copy" data-reveal>
            <p className="eyebrow">{t.story.introEyebrow}</p>
            <h2 id="story-intro-title" className="display-lg">{t.story.introTitle}</h2>
            <p className="lead">{t.story.introText}</p>
          </div>
          <div className="story-intro__stack" aria-hidden="true" data-reveal>
            <div className="stack-card stack-card--1"><ProductVisual product={choc} sizes="320px" /></div>
            <div className="stack-card stack-card--2"><ProductVisual product={biscoff} sizes="320px" /></div>
            <div className="stack-card stack-card--3"><ProductVisual product={pb} sizes="320px" /></div>
          </div>
        </div>
      </section>

      {/* B — Freshly baked (dark editorial) */}
      <section className="fresh" aria-labelledby="fresh-title">
        <div className="fresh__art" aria-hidden="true">
          <ProductVisual product={triple} sizes="100vw" />
        </div>
        <div className="container fresh__inner">
          <p className="eyebrow eyebrow--light" data-reveal>{t.story.freshEyebrow}</p>
          <h2 id="fresh-title" className="fresh__title" data-reveal>
            <span>{t.story.freshTitleA}</span>
            <em>{t.story.freshTitleB}</em>
          </h2>
          <p className="fresh__text" data-reveal>{t.story.freshText}</p>
          <div className="fresh__clock" aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>
      </section>

      {/* C — The little details */}
      <section className="details section tone-biscuit-bg" aria-labelledby="details-title">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow">{t.story.detailsEyebrow}</p>
            <h2 id="details-title" className="display-lg">{t.story.detailsTitle}</h2>
            <p className="muted">{t.story.detailsHint}</p>
          </div>
          <ul className="details__grid">
            {detailCrops.map(({ product, crop }, i) => (
              <li key={product.slug} className="detail" data-reveal style={{ ["--i" as string]: i }}>
                {/* tabIndex makes the zoom reveal work for keyboard and touch (focus), not only hover */}
                <figure className="detail__fig" tabIndex={0} aria-label={`${t.story.details[i].title} — ${product.name}`}>
                  <div className="detail__lens">
                    <div className="detail__zoom">
                      <ProductVisual product={product} crop={product.image ? undefined : crop} sizes="(min-width: 960px) 33vw, 90vw" />
                    </div>
                  </div>
                  <figcaption>
                    <span className="detail__title">{t.story.details[i].title}</span>
                    <span className="detail__text">{t.story.details[i].text}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* D — Favourites */}
      <section className="favourites section" aria-labelledby="fav-title">
        <div className="container">
          <div className="section-head section-head--split" data-reveal>
            <p className="eyebrow">{t.story.favEyebrow}</p>
            <h2 id="fav-title" className="display-lg">{t.story.favTitle}</h2>
          </div>
          <ol className="fav-grid">
            {favourites.map((p, i) => (
              <li key={p.slug} className={`fav fav--${i}`} data-reveal style={{ ["--i" as string]: i % 4 }}>
                <OpenProductButton slug={p.slug} className="fav__btn">
                  <span className="fav__media" aria-hidden="true">
                    <ProductVisual product={p} sizes="(min-width: 960px) 30vw, 90vw" />
                  </span>
                  <span className="fav__meta">
                    <span className="fav__index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <span className="fav__name">{p.name}</span>
                    <span className="fav__price">{p.price != null ? formatPrice(p.price, locale) : t.menu.seePrice}</span>
                    <span className="fav__go" aria-hidden="true"><ArrowIcon /></span>
                  </span>
                </OpenProductButton>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
