import type { Locale } from "@/content/menu";
import { categories, formatPrice, orderUrl, products } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { ProductVisual } from "./ProductVisual";
import { OpenProductButton } from "./ProductDialog";
import { ArrowIcon } from "./icons";

const COOKIE_CATS = new Set(["ny-style", "classic", "vegan", "brookies"]);

/** "House favourites": a numbered, typographic list — like the contents page of a magazine. */
export function FeaturedCookies({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const items = products.filter((p) => p.signature && COOKIE_CATS.has(p.category));
  return (
    <section id="favourites" className="favs section" aria-labelledby="favs-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="kicker">{t.featured.eyebrow}</p>
          <h2 id="favs-title" className="heading-xl">{t.featured.title}</h2>
        </header>
        <ol className="favs__list">
          {items.map((p, i) => {
            const cat = categories.find((c) => c.id === p.category)!;
            return (
              <li key={p.slug} className="fav" data-reveal style={{ ["--i" as string]: i % 3 }}>
                <span className="fav__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="fav__art" aria-hidden="true"><ProductVisual product={p} sizes="160px" /></span>
                <div className="fav__text">
                  <h3 className="fav__name">
                    <OpenProductButton slug={p.slug} className="fav__open">{p.name}</OpenProductButton>
                  </h3>
                  <p className="fav__cat">{cat.label[locale]}</p>
                </div>
                <span className="fav__price">{p.price != null ? formatPrice(p.price, locale) : t.menu.seePrice}</span>
                <a href={orderUrl(p, locale)} className="fav__order" target="_blank" rel="noopener noreferrer" aria-label={`${t.nav.order}: ${p.name} (Wolt)`}>
                  <ArrowIcon />
                </a>
              </li>
            );
          })}
        </ol>
        <p className="favs__more"><a href="#menu" className="text-link">{t.featured.all} <ArrowIcon /></a></p>
      </div>
    </section>
  );
}
