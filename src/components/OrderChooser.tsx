"use client";
/**
 * Ordering: every "Order" button on the site opens this one chooser with the two platforms the
 * shop sells on — Wolt and e-food. Buttons are real links to Wolt (works without JavaScript);
 * with JavaScript the click opens the chooser instead.
 */
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import type { Locale } from "@/content/menu";
import { orderUrl } from "@/content/menu";
import { EFOOD_URL } from "@/content/business";
import { getDictionary } from "@/i18n/dictionaries";
import { ArrowIcon, CloseIcon } from "./icons";

const EVENT = "tcs:order";

export function OrderLink({ locale, className, children, label }: { locale: Locale; className?: string; children: ReactNode; label?: string }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab etc.) go straight to Wolt.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { trigger: e.currentTarget } }));
  };
  return (
    <a href={orderUrl(undefined, locale)} className={className} target="_blank" rel="noopener noreferrer" aria-haspopup="dialog" aria-label={label} onClick={onClick}>
      {children}
    </a>
  );
}

export function OrderChooser({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const open = (e: Event) => {
      trigger.current = (e as CustomEvent<{ trigger?: HTMLElement }>).detail?.trigger ?? null;
      if (ref.current && !ref.current.open) ref.current.showModal();
    };
    window.addEventListener(EVENT, open);
    return () => window.removeEventListener(EVENT, open);
  }, []);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      className="order-chooser"
      aria-labelledby="order-chooser-title"
      onClose={() => trigger.current?.focus({ preventScroll: true })}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="order-chooser__panel">
        <button type="button" className="icon-btn order-chooser__close" onClick={close} aria-label={t.chooser.close}>
          <CloseIcon />
        </button>
        <h2 id="order-chooser-title" className="order-chooser__title">{t.chooser.title}</h2>
        <div className="order-chooser__options">
          <a href={orderUrl(undefined, locale)} className="order-option order-option--wolt" target="_blank" rel="noopener noreferrer" onClick={close}>
            <span className="order-option__name">Wolt</span>
            <ArrowIcon />
          </a>
          <a href={EFOOD_URL} className="order-option order-option--efood" target="_blank" rel="noopener noreferrer" onClick={close}>
            <span className="order-option__name">e-food</span>
            <ArrowIcon />
          </a>
        </div>
      </div>
    </dialog>
  );
}
