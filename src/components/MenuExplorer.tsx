"use client";
/**
 * The menu, laid out like a printed bakery menu: serif names, italic notes, dotted leaders to
 * the price. Tabs filter by group; every row opens the product detail dialog and has its own
 * order link. Data always comes from content/menu.ts.
 */
import { useEffect, useRef, useState } from "react";
import type { CategoryId, Locale, Product } from "@/content/menu";
import { categories, discountPercent, formatPrice, orderUrl, products, MENU_LAST_VERIFIED } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { useProductDialog } from "./ProductDialog";
import { LineArt, type LineKind } from "./LineArt";
import { ArrowIcon, ExternalIcon } from "./icons";

interface Group {
  id: string;
  cats: CategoryId[];
  icon: LineKind;
  label?: { el: string; en: string };
}

const GROUPS: Group[] = [
  { id: "ny-style", cats: ["ny-style"], icon: "ny-cookie" },
  { id: "classic", cats: ["classic"], icon: "cookie" },
  { id: "brookies", cats: ["brookies"], icon: "brookie" },
  { id: "vegan", cats: ["vegan"], icon: "cookie" },
  { id: "mini", cats: ["mini", "dippers"], icon: "mini", label: { el: "Mini & Dippers", en: "Mini & Dippers" } },
  { id: "skillet", cats: ["skillet"], icon: "skillet" },
  { id: "ice-cream", cats: ["ice-cream"], icon: "scoop" },
  { id: "milkshakes", cats: ["milkshakes"], icon: "shake" },
  { id: "drinks", cats: ["cold-drinks", "hot-drinks", "cookie-drinks", "coffee"], icon: "coffee", label: { el: "Ροφήματα & καφές", en: "Drinks & coffee" } },
  { id: "combos", cats: ["combos"], icon: "combo" },
];

const catById = (id: CategoryId) => categories.find((c) => c.id === id)!;
const groupLabel = (g: Group, locale: Locale) => g.label?.[locale] ?? catById(g.cats[0]).label[locale];
const HASH_PREFIX = "#menu-";

export function MenuExplorer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [filter, setFilter] = useState<string>("all");
  const rootRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Deep links: #menu-<categoryId> selects the matching group (used by other sections).
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

  // Keep the active tab visible in the horizontal tab row (never scrolls the page).
  useEffect(() => {
    const scroller = tabsRef.current?.querySelector<HTMLElement>(".menu-tabs__scroller");
    const el = scroller?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!scroller || !el) return;
    scroller.scrollTo({ left: Math.max(0, el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [filter]);

  const select = (f: string) => {
    setFilter(f);
    if ((rootRef.current?.getBoundingClientRect().top ?? 0) < 0) rootRef.current?.scrollIntoView({ block: "start" });
  };

  const visible = filter === "all" ? GROUPS : GROUPS.filter((g) => g.id === filter);
  const count = visible.reduce((n, g) => n + products.filter((p) => g.cats.includes(p.category)).length, 0);

  return (
    <div className="menu-explorer" ref={rootRef}>
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

      <div className="menu-sections" key={filter}>
        {visible.map((g) => (
          <MenuSection key={g.id} group={g} locale={locale} />
        ))}
      </div>

      <p className="fineprint menu-verified">
        {t.menu.verified}: <time dateTime={MENU_LAST_VERIFIED}>{MENU_LAST_VERIFIED}</time>. {t.menu.verifiedNote}
      </p>
    </div>
  );
}

function MenuSection({ group, locale }: { group: Group; locale: Locale }) {
  const t = getDictionary(locale);
  const first = catById(group.cats[0]);
  const multi = group.cats.length > 1;
  return (
    <section className="menu-sec" aria-labelledby={`grp-${group.id}`}>
      <header className="menu-sec__head">
        <LineArt kind={group.icon} className="menu-sec__icon" />
        <div>
          <h3 id={`grp-${group.id}`} className="menu-sec__title">{groupLabel(group, locale)}</h3>
          {first.blurb && <p className="menu-sec__blurb">{first.blurb[locale]}</p>}
        </div>
      </header>
      {group.cats.map((id) => {
        const list = products.filter((p) => p.category === id);
        const cat = catById(id);
        return (
          <div key={id} className="menu-sub">
            {multi && <h4 className="menu-sub__title">{cat.label[locale]}</h4>}
            {list.length ? (
              <ul className="menu-list">
                {list.map((p) => <MenuRow key={p.slug} product={p} locale={locale} />)}
              </ul>
            ) : (
              <p className="menu-pending">
                {t.menu.pending}{" "}
                <a href={orderUrl(undefined, locale)} className="text-link" target="_blank" rel="noopener noreferrer">{t.menu.pendingCta} <ExternalIcon /></a>
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}

export function MenuRow({ product, locale }: { product: Product; locale: Locale }) {
  const t = getDictionary(locale);
  const { open } = useProductDialog();
  const name = locale === "el" && product.nameEl ? product.nameEl : product.name;
  const off = discountPercent(product);
  const note = [product.facts?.map((f) => f[locale]).join(" · "), product.description?.[locale]].filter(Boolean).join(" — ");
  return (
    <li className="menu-row">
      <button type="button" className="menu-row__main" aria-haspopup="dialog" onClick={(e) => open(product.slug, e.currentTarget)}>
        <span className="menu-row__line">
          <span className="menu-row__name">{name}</span>
          <span className="menu-row__dots" aria-hidden="true" />
          <span className="menu-row__price">
            {product.price != null ? formatPrice(product.price, locale) : <span className="menu-row__pending">{t.menu.seePrice}</span>}
            {product.compareAtPrice ? <s aria-label={`${t.menu.was} ${formatPrice(product.compareAtPrice, locale)}`}>{formatPrice(product.compareAtPrice, locale)}</s> : null}
          </span>
        </span>
        {(note || product.signature || product.dietary?.length || off) && (
          <span className="menu-row__meta">
            {product.signature && <span className="tag tag--accent">{t.menu.signature}</span>}
            {product.dietary?.map((d) => <span key={d} className="tag tag--green">{t.menu.dietary[d]}</span>)}
            {off ? <span className="tag tag--accent">{t.menu.save(off)}</span> : null}
            {note && <span className="menu-row__note">{note}</span>}
          </span>
        )}
      </button>
      <a href={orderUrl(product, locale)} className="menu-row__order" target="_blank" rel="noopener noreferrer" aria-label={`${t.nav.order}: ${name} (Wolt)`}>
        <ArrowIcon />
      </a>
    </li>
  );
}
