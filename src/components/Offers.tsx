import type { Locale } from "@/content/menu";
import { discountPercent, formatPrice, orderUrl, productsByCategory } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { OpenProductButton } from "./ProductDialog";
import { ArrowIcon } from "./icons";

/** Extracts "5 + 1" style headline numbers from verified combo names. */
function headline(name: string) {
  const m = name.match(/^(\d+)\s+Cookies?\s*\+\s*(\d+)\s+Cookies?\s+FREE/i);
  return m ? { a: m[1], b: m[2] } : null;
}

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
              <li key={p.slug} className="offer" data-reveal style={{ ["--i" as string]: i }}>
                <p className="offer__figure" aria-hidden="true">
                  {h ? <>{h.a}<span>+</span>{h.b}</> : off ? <>−{off}<span>%</span></> : null}
                </p>
                <h3 className="offer__name">
                  <OpenProductButton slug={p.slug} className="link-btn">{p.name}</OpenProductButton>
                </h3>
                {p.description && <p className="offer__desc">{p.description[locale]}</p>}
                <div className="offer__foot">
                  <p className="offer__price">
                    {p.price != null && <span>{formatPrice(p.price, locale)}</span>}
                    {p.compareAtPrice && <s aria-label={`${t.menu.was} ${formatPrice(p.compareAtPrice, locale)}`}>{formatPrice(p.compareAtPrice, locale)}</s>}
                  </p>
                  <a href={orderUrl(p, locale)} className="text-link" target="_blank" rel="noopener noreferrer" aria-label={`${t.offers.cta}: ${p.name}`}>
                    {t.offers.cta} <ArrowIcon />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="fineprint">{t.offers.disclaimer}</p>
      </div>
    </section>
  );
}
