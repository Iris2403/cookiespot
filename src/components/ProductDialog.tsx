"use client";
/**
 * Product detail dialog + context.
 *
 * Any client component can call `useProductDialog().open(slug, triggerEl)`.
 * Uses the native <dialog> element (showModal): built-in focus containment, Escape to close,
 * inert background and a top layer — no focus-trap library needed. Focus returns to the trigger.
 * The URL hash (#p/<slug>) is updated so a product can be shared/deep-linked.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Locale } from "@/content/menu";
import { categories, discountPercent, formatPrice, getProduct, orderUrl, MENU_LAST_VERIFIED } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { ProductVisual } from "./ProductVisual";
import { EFOOD_URL } from "@/content/business";
import { ArrowIcon, CloseIcon } from "./icons";

interface Ctx {
  open: (slug: string, trigger?: HTMLElement | null) => void;
}
const ProductDialogContext = createContext<Ctx>({ open: () => {} });
export const useProductDialog = () => useContext(ProductDialogContext);

const HASH_PREFIX = "#p/";

export function ProductDialogProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = getDictionary(locale);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const product = slug ? getProduct(slug) : undefined;
  // Slug currently displayed in the modal vs. the latest requested one — lets onClose ignore
  // a stale close event that arrives after a new product was requested.
  const shownRef = useRef<string | null>(null);
  const requestedRef = useRef<string | null>(null);

  const open = useCallback((s: string, trigger?: HTMLElement | null) => {
    if (!getProduct(s)) return;
    triggerRef.current = trigger ?? (document.activeElement as HTMLElement | null);
    requestedRef.current = s;
    setSlug(s);
    history.replaceState(null, "", `${HASH_PREFIX}${s}`);
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const d = dialogRef.current;
    if (product && d && !d.open) {
      d.showModal();
      shownRef.current = product.slug;
    }
  }, [product]);

  // Deep link on load
  useEffect(() => {
    const fromHash = () => {
      if (location.hash.startsWith(HASH_PREFIX)) {
        const s = decodeURIComponent(location.hash.slice(HASH_PREFIX.length));
        if (getProduct(s)) {
          requestedRef.current = s;
          setSlug(s);
        }
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const onClose = () => {
    // A queued close event can arrive after the dialog was reopened (fast close → open); ignore it.
    if (dialogRef.current?.open || requestedRef.current !== shownRef.current) return;
    requestedRef.current = shownRef.current = null;
    setSlug(null);
    if (location.hash.startsWith(HASH_PREFIX)) history.replaceState(null, "", location.pathname + location.search);
    triggerRef.current?.focus({ preventScroll: true });
  };

  const ctx = useMemo(() => ({ open }), [open]);
  const category = product ? categories.find((c) => c.id === product.category) : undefined;
  const off = product ? discountPercent(product) : null;
  const displayName = product ? (locale === "el" && product.nameEl ? product.nameEl : product.name) : "";

  return (
    <ProductDialogContext.Provider value={ctx}>
      {children}
      <dialog
        ref={dialogRef}
        className="product-dialog"
        aria-labelledby="product-dialog-title"
        onClose={onClose}
        onClick={(e) => {
          // Click on the backdrop (the dialog element itself) closes it.
          if (e.target === e.currentTarget) close();
        }}
      >
        {product && (
          <div className="product-dialog__body">
            <div className={`product-dialog__media${product.photo ? " has-photo" : ""}`}>
              <ProductVisual product={product} variant="feature" sizes="(min-width: 900px) 50vw, 100vw" label={displayName} />
            </div>
            <div className="product-dialog__content">
              <button type="button" className="icon-btn product-dialog__close" onClick={close} aria-label={t.menu.close}>
                <CloseIcon />
              </button>
              {category && <p className="eyebrow">{category.label[locale]}</p>}
              <h2 id="product-dialog-title" className="product-dialog__title">{displayName}</h2>
              {(product.dietary?.length || product.popular || product.isNew) && (
                <ul className="chips" aria-label="Tags">
                  {product.popular && <li className="chip chip--accent">{t.menu.popular}</li>}
                  {product.isNew && <li className="chip chip--accent">{t.menu.new}</li>}
                  {product.dietary?.map((d) => <li key={d} className="chip chip--green">{t.menu.dietary[d]}</li>)}
                </ul>
              )}
              {product.description ? (
                <p className="product-dialog__desc">{product.description[locale]}</p>
              ) : category?.blurb ? (
                <p className="product-dialog__desc">{category.blurb[locale]}</p>
              ) : null}
              {product.facts && (
                <ul className="chips">
                  {product.facts.map((fct) => <li key={fct.en} className="chip">{fct[locale]}</li>)}
                </ul>
              )}
              <div className="product-dialog__ingredients">
                <h3>{t.menu.ingredients}</h3>
                <p>{t.menu.ingredientsNote}</p>
              </div>
              <div className="product-dialog__buy">
                <div className="price price--lg">
                  {product.price != null ? (
                    <>
                      {product.priceFrom && <small className="price__from">{t.menu.from}</small>}
                      <span>{formatPrice(product.price, locale)}</span>
                      {product.compareAtPrice && (
                        <s aria-label={`${t.menu.was} ${formatPrice(product.compareAtPrice, locale)}`}>{formatPrice(product.compareAtPrice, locale)}</s>
                      )}
                      {off && <span className="chip chip--accent">{t.menu.save(off)}</span>}
                    </>
                  ) : (
                    <span className="price__pending">{t.menu.seePrice}</span>
                  )}
                </div>
                <div className="product-dialog__ctas">
                  <a href={orderUrl(product, locale)} className="btn btn--primary btn--lg" target="_blank" rel="noopener noreferrer">
                    {t.menu.order} <ArrowIcon />
                  </a>
                  <a href={EFOOD_URL} className="btn btn--outline" target="_blank" rel="noopener noreferrer">e-food</a>
                </div>
              </div>
              <p className="fineprint">
                {t.menu.verified}: <time dateTime={MENU_LAST_VERIFIED}>{MENU_LAST_VERIFIED}</time>. {t.menu.verifiedNote}
              </p>
            </div>
          </div>
        )}
      </dialog>
    </ProductDialogContext.Provider>
  );
}

/** Small client button that opens the dialog — lets server components stay server components. */
export function OpenProductButton({ slug, className, children, label }: { slug: string; className?: string; children: ReactNode; label?: string }) {
  const { open } = useProductDialog();
  return (
    <button type="button" className={className} aria-label={label} aria-haspopup="dialog" onClick={(e) => open(slug, e.currentTarget)}>
      {children}
    </button>
  );
}
