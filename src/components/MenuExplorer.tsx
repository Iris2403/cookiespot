"use client";
import { OrderLink } from "./OrderChooser";
/**
 * The full menu: category tabs + product cards with the real Wolt product photos.
 * Every card opens the product dialog; the round button orders on Wolt.
 */
import { useEffect, useRef, useState } from "react";
import type { CategoryId, Locale, Product } from "@/content/menu";
import { categories, discountPercent, displayName, formatPrice, products } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { useProductDialog } from "./ProductDialog";
import { ProductVisual } from "./ProductVisual";
import { ArrowIcon } from "./icons";

const HASH_PREFIX = "#menu-";

export function MenuExplorer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [filter, setFilter] = useState<CategoryId>(categories[0].id);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Deep links such as #menu-brookies (used by other sections).
  useEffect(() => {
    const fromHash = () => {
      if (!location.hash.startsWith(HASH_PREFIX)) return;
      const id = location.hash.slice(HASH_PREFIX.length) as CategoryId;
      if (categories.some((c) => c.id === id)) {
        setFilter(id);
        document.getElementById("menu")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Keep the active tab visible in the horizontal tab row (never scrolls the page).
  useEffect(() => {
    const scroller = tabsRef.current?.querySelector<HTMLElement>(".menu-tabs__scroller");
    const el = scroller?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!scroller || !el) return;
    scroller.scrollTo({ left: Math.max(0, el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [filter]);

  const select = (f: CategoryId) => {
    setFilter(f);
    if ((rootRef.current?.getBoundingClientRect().top ?? 0) < 0) rootRef.current?.scrollIntoView({ block: "start" });
  };

  const visible = categories.filter((c) => c.id === filter);
  const count = visible.reduce((n, c) => n + products.filter((p) => p.category === c.id).length, 0);

  return (
    <div className="menu-explorer" ref={rootRef}>
      <div className="menu-tabs" ref={tabsRef}>
        <div className="menu-tabs__scroller" role="toolbar" aria-label={t.menu.categories}>
          {categories.map((c) => (
            <button key={c.id} type="button" className="menu-tab" aria-pressed={filter === c.id} onClick={() => select(c.id)}>
              {c.label[locale]}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{t.menu.count(count)}</p>

      <div className="menu-sections" key={filter}>
        {visible.map((c) => {
          const list = products.filter((p) => p.category === c.id);
          return (
            <section key={c.id} className={`menu-sec menu-sec--${c.id}`} aria-labelledby={`cat-${c.id}`}>
              <header className="menu-sec__head">
                <h3 id={`cat-${c.id}`} className="menu-sec__title">{c.label[locale]}</h3>
                {c.blurb && <p className="menu-sec__blurb">{c.blurb[locale]}</p>}
                {c.note && <p className="menu-sec__note">{c.note[locale]}</p>}
              </header>
              <ul className="menu-grid">
                {list.map((p) => <MenuCard key={p.slug} product={p} locale={locale} />)}
              </ul>
            </section>
          );
        })}
      </div>

    </div>
  );
}

export function MenuCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = getDictionary(locale);
  const { open } = useProductDialog();
  const name = displayName(product, locale);
  const off = discountPercent(product);
  const note = [product.facts?.map((f) => f[locale]).join(" · "), product.description?.[locale]].filter(Boolean).join(" — ");
  return (
    <li className="menu-card">
      <button type="button" className="menu-card__main" aria-haspopup="dialog" onClick={(e) => open(product.slug, e.currentTarget)}>
        <span className="menu-card__text">
          <span className="menu-card__name">{name}</span>
          {note && <span className="menu-card__note">{note}</span>}
          <span className="menu-card__meta">
            <span className="menu-card__price">
              {product.price != null ? (
                <>
                  {formatPrice(product.price, locale)}
                </>
              ) : (
                <span className="menu-card__pending">{t.menu.seePrice}</span>
              )}
              {product.compareAtPrice ? <s aria-label={`${t.menu.was} ${formatPrice(product.compareAtPrice, locale)}`}>{formatPrice(product.compareAtPrice, locale)}</s> : null}
            </span>
            {product.popular && <span className="tag tag--accent">{t.menu.popular}</span>}
            {product.isNew && <span className="tag tag--accent">{t.menu.new}</span>}
            {off ? <span className="tag tag--accent">{t.menu.save(off)}</span> : null}
            {product.dietary?.map((d) => <span key={d} className="tag tag--green">{t.menu.dietary[d]}</span>)}
          </span>
        </span>
        <span className="menu-card__media">
          <ProductVisual product={product} sizes="(min-width: 1024px) 140px, 112px" />
        </span>
      </button>
      <OrderLink locale={locale} className="menu-card__order" label={`${t.nav.order}: ${name}`}>
        <ArrowIcon />
      </OrderLink>
    </li>
  );
}
