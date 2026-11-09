import type { Locale } from "@/content/menu";
import { orderUrl } from "@/content/menu";
import { media } from "@/content/media";
import { EFOOD_URL } from "@/content/business";
import { getDictionary } from "@/i18n/dictionaries";
import { BrandPhoto } from "./BrandPhoto";
import { ArrowIcon } from "./icons";

/** Photo-led hero: the brand's own "We bake it personally" campaign shot, framed like its orange box. */
export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="kicker">{t.hero.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line">{t.hero.titleA}</span>{" "}
            <span className="hero__line hero__line--accent">{t.hero.titleB}</span>
          </h1>
          <p className="hero__lead">{t.hero.lead}</p>
          <div className="hero__ctas">
            <a href={orderUrl(undefined, locale)} className="btn btn--primary btn--lg" target="_blank" rel="noopener noreferrer">
              {t.hero.order} <ArrowIcon />
            </a>
            <a href="#menu" className="btn btn--outline btn--lg">{t.hero.explore}</a>
          </div>
          <p className="hero__also">
            {t.hero.alsoOn}{" "}
            <a href={EFOOD_URL} className="text-link" target="_blank" rel="noopener noreferrer">e-food <ArrowIcon /></a>
          </p>
          <dl className="hero__facts">
            {t.hero.facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero__media">
          <figure className="hero__photo">
            <BrandPhoto photo={media.hero} locale={locale} fill priority sizes="(min-width: 1000px) 42vw, 92vw" />
          </figure>
          <figure className="hero__polaroid" aria-hidden="true">
            <BrandPhoto photo={media.peachSix} locale={locale} fill sizes="240px" />
          </figure>
        </div>
      </div>
      <div className="paper-band" aria-hidden="true" />
    </section>
  );
}
