import type { Locale } from "@/content/menu";
import { categories, formatPrice, orderUrl, products } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { Carousel } from "./Carousel";
import { ProductVisual } from "./ProductVisual";
import { OpenProductButton } from "./ProductDialog";
import { ArrowIcon } from "./icons";

const COOKIE_CATS = new Set(["ny-style", "classic", "vegan"]);

export function FeaturedCookies({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const items = products.filter((p) => COOKIE_CATS.has(p.category) && (p.signature || p.category === "ny-style"));
  return (
    <section id="featured" className="featured section" aria-labelledby="featured-title">
      <div className="container">
        <div className="section-head section-head--row" data-reveal>
          <div>
            <p className="eyebrow">{t.featured.eyebrow}</p>
            <h2 id="featured-title" className="display-lg">{t.featured.title}</h2>
          </div>
          <a href="#menu" className="btn btn--outline">{t.featured.all} <ArrowIcon /></a>
        </div>
      </div>
      <Carousel label={t.featured.eyebrow} prevLabel={t.featured.prev} nextLabel={t.featured.next} className="featured__carousel">
        {items.map((p, i) => {
          const cat = categories.find((c) => c.id === p.category)!;
          return (
            <li key={p.slug} className={`feature-card feature-card--${i % 3}`}>
              <OpenProductButton slug={p.slug} className="feature-card__open">
                <span className="sr-only">{`${p.name} — ${t.menu.details}`}</span>
                <span className="feature-card__media">
                  <ProductVisual product={p} locale={locale} sizes="(min-width: 960px) 30vw, 78vw" />
                </span>
              </OpenProductButton>
              <div className="feature-card__body">
                <p className="feature-card__cat">{cat.label[locale]}</p>
                <h3 className="feature-card__name">{p.name}</h3>
                <div className="feature-card__foot">
                  <span className="price">{p.price != null ? formatPrice(p.price, locale) : <span className="price__pending">{t.menu.seePrice}</span>}</span>
                  <a href={orderUrl(p, locale)} className="btn btn--primary btn--sm" target="_blank" rel="noopener noreferrer" aria-label={`${t.nav.order}: ${p.name} (Wolt)`}>
                    {t.nav.order} <ArrowIcon />
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </Carousel>
    </section>
  );
}
