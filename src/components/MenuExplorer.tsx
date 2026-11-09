"use client";
import { useEffect, useRef, useState } from "react";
import type { Category, CategoryId, Locale, Product } from "@/content/menu";
import { categories, discountPercent, formatPrice, orderUrl, products, MENU_LAST_VERIFIED } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { useProductDialog } from "./ProductDialog";
import { ProductVisual } from "./ProductVisual";
import { Carousel } from "./Carousel";
import { ArrowIcon, ExternalIcon } from "./icons";

/**
 * Menu groups → one tab each, and a layout per group so the menu doesn't read as one long,
 * repetitive grid. Products/prices always come from content/menu.ts.
 */
type Layout = "feature" | "grid" | "wide" | "dark" | "compact" | "carousel" | "board";
interface Group {
  id: string;
  cats: CategoryId[];
  layout: Layout;
  label?: { el: string; en: string };
}

const GROUPS: Group[] = [
  { id: "ny-style", cats: ["ny-style"], layout: "feature" },
  { id: "classic", cats: ["classic"], layout: "grid" },
  { id: "brookies", cats: ["brookies"], layout: "wide" },
  { id: "vegan", cats: ["vegan"], layout: "grid" },
  { id: "mini", cats: ["mini", "dippers"], layout: "wide", label: { el: "Mini & Dippers", en: "Mini & Dippers" } },
  { id: "skillet", cats: ["skillet"], layout: "dark" },
  { id: "ice-cream", cats: ["ice-cream"], layout: "compact" },
  { id: "milkshakes", cats: ["milkshakes"], layout: "carousel" },
  { id: "drinks", cats: ["cold-drinks", "hot-drinks", "cookie-drinks", "coffee"], layout: "board", label: { el: "Ροφήματα & καφές", en: "Drinks & coffee" } },
  { id: "combos", cats: ["combos"], layout: "grid" },
];

const catById = (id: CategoryId) => categories.find((c) => c.id === id)!;
const groupLabel = (g: Group, locale: Locale) => g.label?.[locale] ?? catById(g.cats[0]).label[locale];
const HASH_PREFIX = "#menu-";

export function MenuExplorer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [filter, setFilter] = useState<string>("all");
  const sectionRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Deep links: #menu-<categoryId> (used by other sections) selects the matching group.
  useEffect(() => {
    const fromHash = () => {
      if (!location.hash.startsWith(HASH_PREFIX)) return;
      const id = location.hash.slice(HASH_PREFIX.length);
      const g = GROUPS.find((x) => x.id === id || x.cats.includes(id as CategoryId));
      if (g) {
        setFilter(g.id);
        document.getElementById("menu")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Keep the active tab visible inside the horizontal tab scroller (never scrolls the page).
  useEffect(() => {
    const scroller = tabsRef.current?.querySelector<HTMLElement>(".menu-tabs__scroller");
    const el = scroller?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!scroller || !el) return;
    scroller.scrollTo({ left: Math.max(0, el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [filter]);

  const select = (f: string) => {
    setFilter(f);
    if ((sectionRef.current?.getBoundingClientRect().top ?? 0) < 0) sectionRef.current?.scrollIntoView({ block: "start" });
  };

  const visible = filter === "all" ? GROUPS : GROUPS.filter((g) => g.id === filter);
  const count = visible.reduce((n, g) => n + products.filter((p) => g.cats.includes(p.category)).length, 0);

  return (
    <div className="menu-explorer" ref={sectionRef}>
      <div className="menu-tabs" ref={tabsRef}>
        <div className="menu-tabs__scroller" role="toolbar" aria-label={t.menu.categories}>
          <button type="button" className="menu-tab" aria-pressed={filter === "all"} onClick={() => select("all")}>{t.menu.all}</button>
          {GROUPS.map((g) => (
            <button key={g.id} type="button" className="menu-tab" aria-pressed={filter === g.id} onClick={() => select(g.id)}>
              {groupLabel(g, locale)}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{t.menu.count(count)}</p>

      <div className="menu-groups" key={filter}>
        {visible.map((g) => (
          <MenuGroup key={g.id} group={g} locale={locale} />
        ))}
      </div>

      <p className="fineprint menu-verified">
        {t.menu.verified}: <time dateTime={MENU_LAST_VERIFIED}>{MENU_LAST_VERIFIED}</time>. {t.menu.verifiedNote}
      </p>
    </div>
  );
}

function MenuGroup({ group, locale }: { group: Group; locale: Locale }) {
  const t = getDictionary(locale);
  const first = catById(group.cats[0]);
  const items = products.filter((p) => group.cats.includes(p.category));
  const head = (
    <header className="menu-group__head">
      <h3 id={`grp-${group.id}`} className="menu-group__title">{groupLabel(group, locale)}</h3>
      {first.blurb && <p className="menu-group__blurb">{first.blurb[locale]}</p>}
      {items.length > 0 && <span className="menu-group__count">{t.menu.count(items.length)}</span>}
    </header>
  );

  if (group.layout === "board") {
    return (
      <section className="menu-group menu-group--board" aria-labelledby={`grp-${group.id}`}>
        {head}
        <div className="board">
          {group.cats.map((id) => {
            const c = catById(id);
            const list = products.filter((p) => p.category === id);
            return <BoardColumn key={id} category={c} list={list} locale={locale} />;
          })}
        </div>
      </section>
    );
  }

  return (
    <section className={`menu-group menu-group--${group.layout} menu-group--${group.id}`} aria-labelledby={`grp-${group.id}`}>
      {head}
      {group.layout === "carousel" ? (
        <Carousel label={groupLabel(group, locale)} prevLabel={t.featured.prev} nextLabel={t.featured.next} className="menu-carousel">
          {items.map((p) => (
            <li key={p.slug} className="menu-carousel__item"><ProductCard product={p} locale={locale} /></li>
          ))}
        </Carousel>
      ) : (
        <ul className={`product-grid product-grid--${group.layout}`}>
          {items.map((p, i) => (
            <li key={p.slug} style={{ ["--i" as string]: i }}>
              <ProductCard product={p} locale={locale} featured={group.layout === "feature" && i === 0} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function BoardColumn({ category, list, locale }: { category: Category; list: Product[]; locale: Locale }) {
  const t = getDictionary(locale);
  const { open } = useProductDialog();
  return (
    <div className="board__col">
      <h4 className="board__title">{category.label[locale]}</h4>
      {list.length ? (
        <ul className="board__list">
          {list.map((p) => (
            <li key={p.slug} className="board__row">
              <button type="button" className="board__name" aria-haspopup="dialog" onClick={(e) => open(p.slug, e.currentTarget)}>{p.name}</button>
              <span className="board__dots" aria-hidden="true" />
              <span className="board__price">{p.price != null ? formatPrice(p.price, locale) : t.menu.seePrice}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="board__pending">
          {t.menu.pending}{" "}
          <a href={orderUrl(undefined, locale)} className="link" target="_blank" rel="noopener noreferrer">{t.menu.pendingCta} <ExternalIcon /></a>
        </p>
      )}
    </div>
  );
}

export function ProductCard({ product, locale, featured }: { product: Product; locale: Locale; featured?: boolean }) {
  const t = getDictionary(locale);
  const { open } = useProductDialog();
  const name = locale === "el" && product.nameEl ? product.nameEl : product.name;
  const off = discountPercent(product);
  const cat = catById(product.category);
  const info = product.description?.[locale] ?? cat.blurb?.[locale];
  return (
    <article className={`product-card${featured ? " product-card--featured" : ""}`}>
      <div className="product-card__media">
        <ProductVisual product={product} locale={locale} sizes={featured ? "(min-width: 960px) 50vw, 92vw" : "(min-width: 1100px) 25vw, (min-width: 760px) 33vw, 46vw"} />
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
        {(info || product.facts) && (
          <p className="product-card__info">
            {product.facts?.map((f) => f[locale]).join(" · ")}
            {product.facts && info ? " — " : ""}
            {info}
          </p>
        )}
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
          <a href={orderUrl(product, locale)} className="product-card__order" target="_blank" rel="noopener noreferrer" aria-label={`${t.nav.order}: ${name} (Wolt)`}>
            <span className="product-card__order-text" aria-hidden="true">{t.nav.order}</span>
            <ArrowIcon />
          </a>
        </div>
      </div>
    </article>
  );
}
