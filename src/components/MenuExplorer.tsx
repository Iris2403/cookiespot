"use client";
import { useEffect, useRef, useState } from "react";
import type { Category, CategoryId, Locale, Product } from "@/content/menu";
import { categories, discountPercent, formatPrice, orderUrl, products, MENU_LAST_VERIFIED } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { useProductDialog } from "./ProductDialog";
import { ProductVisual } from "./ProductVisual";
import { ArrowIcon, ExternalIcon } from "./icons";

type Filter = "all" | CategoryId;
const HASH_PREFIX = "#menu-";

export function MenuExplorer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [filter, setFilter] = useState<Filter>("all");
  const sectionRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Deep links such as #menu-brookies (used by the "cravings" panels).
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

  // Keep the active chip visible in the horizontal scroller (horizontal only — never scrolls the page).
  useEffect(() => {
    const scroller = tabsRef.current?.querySelector<HTMLElement>(".menu-tabs__scroller");
    const el = scroller?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!scroller || !el) return;
    const target = el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2;
    scroller.scrollTo({ left: Math.max(0, target), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [filter]);

  const select = (f: Filter) => {
    setFilter(f);
    const top = sectionRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) sectionRef.current?.scrollIntoView({ block: "start" });
  };

  const visible: Category[] = filter === "all" ? categories : categories.filter((c) => c.id === filter);
  const total = filter === "all" ? products.length : products.filter((p) => p.category === filter).length;

  return (
    <div className="menu-explorer" ref={sectionRef}>
      <div className="menu-tabs" ref={tabsRef}>
        <div className="menu-tabs__scroller" role="toolbar" aria-label={t.menu.categories}>
          <button type="button" className="menu-tab" aria-pressed={filter === "all"} onClick={() => select("all")}>
            {t.menu.all}
          </button>
          {categories.map((c) => (
            <button key={c.id} type="button" className={`menu-tab menu-tab--${c.tone}`} aria-pressed={filter === c.id} onClick={() => select(c.id)}>
              {c.label[locale]}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{t.menu.count(total)}</p>

      <div className="menu-groups" key={filter}>
        {visible.map((c) => {
          const items = products.filter((p) => p.category === c.id);
          return (
            <section key={c.id} className={`menu-group tone-${c.tone}`} aria-labelledby={`cat-${c.id}`}>
              <header className="menu-group__head">
                <h3 id={`cat-${c.id}`} className="menu-group__title">{c.label[locale]}</h3>
                {c.blurb && <p className="menu-group__blurb">{c.blurb[locale]}</p>}
                {items.length > 0 && <span className="menu-group__count">{t.menu.count(items.length)}</span>}
              </header>
              {items.length > 0 ? (
                <ul className={`product-grid product-grid--${c.id}`}>
                  {items.map((p, i) => (
                    <li key={p.slug} style={{ ["--i" as string]: i }}>
                      <ProductCard product={p} locale={locale} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="menu-pending">
                  <p>{t.menu.pending}</p>
                  <a href={orderUrl(undefined, locale)} className="btn btn--outline" target="_blank" rel="noopener noreferrer">
                    {t.menu.pendingCta} <ExternalIcon />
                  </a>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <p className="fineprint menu-verified">
        {t.menu.verified}: <time dateTime={MENU_LAST_VERIFIED}>{MENU_LAST_VERIFIED}</time>. {t.menu.verifiedNote}
      </p>
    </div>
  );
}

export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = getDictionary(locale);
  const { open } = useProductDialog();
  const name = locale === "el" && product.nameEl ? product.nameEl : product.name;
  const off = discountPercent(product);
  return (
    <article className={`product-card product-card--${product.art.kind}`}>
      <div className="product-card__media">
        <ProductVisual product={product} />
        {(product.signature || product.dietary?.length || off) && (
          <ul className="product-card__tags">
            {off ? <li className="chip chip--accent">{t.menu.save(off)}</li> : null}
            {product.signature && <li className="chip chip--dark">{t.menu.signature}</li>}
            {product.dietary?.map((d) => <li key={d} className="chip chip--green">{t.menu.dietary[d]}</li>)}
          </ul>
        )}
      </div>
      <div className="product-card__body">
        <h4 className="product-card__name">
          <button type="button" className="product-card__open" aria-haspopup="dialog" onClick={(e) => open(product.slug, e.currentTarget)}>
            {name}
          </button>
        </h4>
        <div className="product-card__foot">
          <p className="price">
            {product.price != null ? (
              <>
                <span>{formatPrice(product.price, locale)}</span>
                {product.compareAtPrice && <s aria-label={`${t.menu.was} ${formatPrice(product.compareAtPrice, locale)}`}>{formatPrice(product.compareAtPrice, locale)}</s>}
              </>
            ) : (
              <span className="price__pending">{t.menu.seePrice}</span>
            )}
          </p>
          <a
            href={orderUrl(product, locale)}
            className="product-card__order"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.menu.order}: ${name}`}
          >
            <ArrowIcon />
          </a>
        </div>
      </div>
    </article>
  );
}
