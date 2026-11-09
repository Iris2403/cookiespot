import type { Locale } from "@/content/menu";
import { getProduct, orderUrl } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { ProductVisual } from "./ProductVisual";
import { Parallax } from "./Parallax";
import { ArrowIcon } from "./icons";

export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const star = getProduct("pistachio-cookie")!;
  const brookie = getProduct("caramel-brookie")!;
  const shake = getProduct("pistachio-salted-caramel-milkshake")!;
  const skillet = getProduct("chocolate-chip-skillet-ice-cream")!;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <Parallax className="hero__stage">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow"><span className="dot" aria-hidden="true" />{t.hero.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line hero__line--a">{t.hero.titleA}</span>
            <span className="hero__line hero__line--b"><em>{t.hero.titleB}</em></span>
            <span className="hero__line hero__line--c">{t.hero.titleC}</span>
          </h1>
          <p className="hero__lead">{t.hero.lead}</p>
          <div className="hero__ctas">
            <a href={orderUrl(undefined, locale)} className="btn btn--primary btn--lg" target="_blank" rel="noopener noreferrer">
              {t.hero.order} <ArrowIcon />
            </a>
            <a href="#menu" className="btn btn--outline btn--lg">{t.hero.explore}</a>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__arch layer" style={{ ["--d" as string]: 6 }} />
          <div className="hero__sprinkles layer" style={{ ["--d" as string]: 28 }}>
            <i /><i /><i /><i /><i /><i />
          </div>
          <figure className="hero__main layer" style={{ ["--d" as string]: 14 }}>
            <div className="hero__main-art">
              <ProductVisual product={star} priority sizes="(min-width: 960px) 55vw, 100vw" />
            </div>
            <figcaption className="hero__note hero__note--main">
              <span className="hero__note-name">{star.name}</span>
              <span className="hero__note-meta">{t.hero.noteNY}</span>
            </figcaption>
          </figure>
          <figure className="hero__card hero__card--shake layer" style={{ ["--d" as string]: 30 }}>
            <ProductVisual product={shake} sizes="220px" />
            <figcaption>{t.hero.noteShake}</figcaption>
          </figure>
          <figure className="hero__card hero__card--brookie layer" style={{ ["--d" as string]: 22 }}>
            <ProductVisual product={brookie} sizes="260px" />
            <figcaption>{brookie.name}</figcaption>
          </figure>
          <figure className="hero__card hero__card--skillet layer" style={{ ["--d" as string]: 38 }}>
            <ProductVisual product={skillet} sizes="200px" />
            <figcaption>{t.hero.noteSkillet}</figcaption>
          </figure>
          <div className="hero__badge layer" style={{ ["--d" as string]: 18 }}>
            <svg viewBox="0 0 200 200">
              <defs>
                <path id="badge-circle" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
              </defs>
              <circle cx="100" cy="100" r="98" className="hero__badge-bg" />
              <text className="hero__badge-text">
                <textPath href="#badge-circle">{t.hero.badge} {t.hero.badge}</textPath>
              </text>
              <g transform="translate(100 100)" className="hero__badge-mark">
                <circle r="26" />
                <path d="M-9 -4a3 3 0 1 0 0.1 0M6 -9a2.5 2.5 0 1 0 0.1 0M2 7a3.2 3.2 0 1 0 0.1 0" />
              </g>
            </svg>
          </div>
        </div>
      </Parallax>
    </section>
  );
}
