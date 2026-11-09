import Image from "next/image";
import type { Locale } from "@/content/menu";
import { orderUrl } from "@/content/menu";
import { media } from "@/content/media";
import { getDictionary } from "@/i18n/dictionaries";
import { asset } from "@/lib/site";
import { LineArt } from "./LineArt";
import { ArrowIcon } from "./icons";

/** Editorial hero: serif headline, generous space, one orange brand disc with an ink drawing. */
export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const photo = media.hero.src;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="kicker hero__kicker">{t.hero.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line">{t.hero.titleA}</span>
            <em className="hero__line hero__line--accent">{t.hero.titleB}</em>
          </h1>
          <p className="hero__lead">{t.hero.lead}</p>
          <div className="hero__ctas">
            <a href={orderUrl(undefined, locale)} className="btn btn--primary btn--lg" target="_blank" rel="noopener noreferrer">
              {t.hero.order} <ArrowIcon />
            </a>
            <a href="#favourites" className="text-link">{t.hero.explore} <ArrowIcon /></a>
          </div>
        </div>

        <div className="hero__art">
          <div className="hero__disc">
            {photo ? (
              <Image src={asset(photo)} alt={media.hero.alt[locale]} fill priority sizes="(min-width: 1000px) 40vw, 80vw" style={{ objectFit: "cover" }} />
            ) : (
              <LineArt kind="ny-cookie" className="hero__drawing" />
            )}
          </div>
          <svg className="hero__ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
            <defs>
              <path id="hero-ring-path" d="M100 100 m-88 0 a88 88 0 1 1 176 0 a88 88 0 1 1 -176 0" />
            </defs>
            <text>
              <textPath href="#hero-ring-path" textLength="548" lengthAdjust="spacing">{t.hero.sticker} {t.hero.sticker}</textPath>
            </text>
          </svg>
        </div>

        <dl className="hero__facts">
          {t.hero.facts.map((f) => (
            <div key={f.k}>
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
