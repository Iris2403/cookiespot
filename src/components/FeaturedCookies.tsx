import type { Locale } from "@/content/menu";
import { categories, displayName, formatPrice, getProduct, orderUrl } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { ProductVisual } from "./ProductVisual";
import { OpenProductButton } from "./ProductDialog";
import { ArrowIcon } from "./icons";

const FAVOURITES = ["triple-choco-praline", "biscoff-cookie", "red-velvet", "caramel-brookie"];

/** Favourites: large editorial cards built on the brand's own product photography. */
export function FeaturedCookies({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const items = FAVOURITES.map((s) => getProduct(s)!).filter(Boolean);
  return (
    <section id="favourites" className="favs section" aria-labelledby="favs-title">
      <div className="container">
        <header className="section-head section-head--row" data-reveal>
          <div>
            <p className="kicker">{t.featured.eyebrow}</p>
            <h2 id="favs-title" className="heading-xl">{t.featured.title}</h2>
          </div>
          <a href="#menu" className="text-link">{t.featured.all} <ArrowIcon /></a>
        </header>
        <ul className="favs__grid">
          {items.map((p, i) => {
            const cat = categories.find((c) => c.id === p.category)!;
            return (
              <li key={p.slug} className="fav-card" data-reveal style={{ ["--i" as string]: i }}>
                <div className="fav-card__media">
                  <ProductVisual product={p} variant="feature" sizes="(min-width: 1100px) 24vw, (min-width: 640px) 46vw, 92vw" label={displayName(p, locale)} />
                </div>
                <div className="fav-card__body">
                  <p className="fav-card__cat">{cat.label[locale]}</p>
                  <h3 className="fav-card__name">
                    <OpenProductButton slug={p.slug} className="fav-card__open">{displayName(p, locale)}</OpenProductButton>
                  </h3>
                  {p.description && <p className="fav-card__desc">{p.description[locale]}</p>}
                  <div className="fav-card__foot">
                    <span className="fav-card__price">{p.price != null ? formatPrice(p.price, locale) : t.menu.seePrice}</span>
                    <a href={orderUrl(p, locale)} className="btn btn--primary btn--sm" target="_blank" rel="noopener noreferrer" aria-label={`${t.nav.order}: ${p.name} (Wolt)`}>
                      {t.nav.order} <ArrowIcon />
                    </a>
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
