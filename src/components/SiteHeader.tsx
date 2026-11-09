"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/menu";
import { orderUrl } from "@/content/menu";
import { EFOOD_URL } from "@/content/business";
import { getDictionary } from "@/i18n/dictionaries";
import { Wordmark } from "./Wordmark";
import { ArrowIcon } from "./icons";

export function SiteHeader({ locale, onHome = true }: { locale: Locale; onHome?: boolean }) {
  const t = getDictionary(locale);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const base = onHome ? "" : `/${locale}`;
  const other: Locale = locale === "el" ? "en" : "el";

  const links = [
    { href: `${base}#menu`, label: t.nav.menu },
    { href: `${base}#story`, label: t.nav.story },
    { href: `${base}#gallery`, label: t.nav.gallery },
    { href: `${base}#locations`, label: t.nav.locations },
    { href: `${base}#contact`, label: t.nav.contact },
  ];

  // Scroll-spy: highlight the nav item of the section in the middle of the viewport.
  useEffect(() => {
    if (!onHome) return;
    const ids = ["menu", "story", "gallery", "locations", "contact"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const top = () => window.scrollY < 200 && setCurrent(null);
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", top);
    };
  }, [onHome]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock scroll, close on Escape, keep focus inside while open.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panel) {
        const items = [toggleRef.current, ...panel.querySelectorAll<HTMLElement>("a,button")].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 960px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="site-header__inner">
        <Link href={`/${locale}`} className="site-header__logo">
          <Wordmark />
        </Link>

        <nav aria-label={t.nav.primary} className="site-nav">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={`site-nav__link${current && l.href.endsWith(`#${current}`) ? " is-current" : ""}`} aria-current={current && l.href.endsWith(`#${current}`) ? "true" : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <Link href={`/${other}`} hrefLang={other} lang={other} className="lang-switch">
            <span aria-hidden="true">{other.toUpperCase()}</span>
            <span className="sr-only">{t.nav.switchTo}</span>
          </Link>
          <a href={orderUrl(undefined, locale)} className="btn btn--primary btn--sm site-header__order" target="_blank" rel="noopener noreferrer">
            {t.nav.order}
            <ArrowIcon />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={panelRef} className="mobile-menu" hidden={!open}>
        <nav aria-label={t.nav.primary}>
          <ul>
            {links.map((l, i) => (
              <li key={l.href} style={{ ["--i" as string]: i }}>
                <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__foot">
          <a href={orderUrl(undefined, locale)} className="btn btn--primary btn--lg" target="_blank" rel="noopener noreferrer">
            {t.nav.order} <ArrowIcon />
          </a>
          <a href={EFOOD_URL} className="btn btn--outline" target="_blank" rel="noopener noreferrer">
            {t.nav.efood}
          </a>
          <Link href={`/${other}`} hrefLang={other} lang={other} className="btn btn--ghost">
            {t.nav.switchTo}
          </Link>
        </div>
      </div>
    </header>
  );
}
