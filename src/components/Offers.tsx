import { OrderLink } from "./OrderChooser";
import type { Locale } from "@/content/menu";
import { discountPercent, displayName, formatPrice, productsByCategory } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { ProductVisual } from "./ProductVisual";
import { OpenProductButton } from "./ProductDialog";
import { ArrowIcon } from "./icons";

function headline(name: string) {
  const m = name.match(/^(\d+)\s+Cookies?\s*\+\s*(\d+)\s+Cookies?\s+FREE/i);
  return m ? { a: m[1], b: m[2] } : null;
}

/** Combos on peach — the same backdrop as the brand's studio shots, so the photos blend in. */
export function Offers({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const combos = productsByCategory("combos");
  return (
    <section id="offers" className="offers section" aria-labelledby="offers-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="kicker">{t.offers.eyebrow}</p>
          <h2 id="offers-title" className="heading-xl">{t.offers.title}</h2>
          <p className="lead">{t.offers.lead}</p>
        </header>
        <ul className="offers__grid">
          {combos.map((p, i) => {
            const h = headline(p.name);
            const off = discountPercent(p);
            return (
              <li key={p.slug} className={`offer offer--${i}`} data-reveal style={{ ["--i" as string]: i }}>
                <div className="offer__media">
                  <ProductVisual product={p} variant="feature" sizes="(min-width: 900px) 46vw, 92vw" label={displayName(p, locale)} />
                  <p className="offer__badge" aria-hidden="true">
                    {h ? <>{h.a}<span>+</span>{h.b}</> : off ? <>−{off}%</> : null}
                  </p>
                </div>
                <div className="offer__body">
                  <h3 className="offer__name">
                    <OpenProductButton slug={p.slug} className="link-btn">{displayName(p, locale)}</OpenProductButton>
                  </h3>
                  {p.description && <p className="offer__desc">{p.description[locale]}</p>}
                  <div className="offer__foot">
                    <p className="offer__price">
                      {p.price != null && <span>{formatPrice(p.price, locale)}</span>}
                      {p.compareAtPrice && <s aria-label={`${t.menu.was} ${formatPrice(p.compareAtPrice, locale)}`}>{formatPrice(p.compareAtPrice, locale)}</s>}
                    </p>
                    <OrderLink locale={locale} className="btn btn--primary btn--sm" label={`${t.offers.cta}: ${p.name}`}>
                      {t.offers.cta} <ArrowIcon />
                    </OrderLink>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
