"use client";
import { OrderLink } from "./OrderChooser";
import { useEffect, useState } from "react";
import type { Locale } from "@/content/menu";
import { business } from "@/content/business";
import { getDictionary } from "@/i18n/dictionaries";
import { ArrowIcon, PhoneIcon } from "./icons";

/** Persistent ordering CTA on small screens, revealed after the hero scrolls away. */
export function MobileOrderBar({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".hero");
    const footer = document.querySelector(".site-footer");
    if (!hero) return;
    let heroOut = false, footerIn = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroOut = !e.isIntersecting;
        if (e.target === footer) footerIn = e.isIntersecting;
      }
      setShow(heroOut && !footerIn);
    });
    io.observe(hero);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`mobile-bar${show ? " is-visible" : ""}`} aria-hidden={!show} inert={!show}>
      <a href={`tel:${business.phone.e164}`} className="btn btn--ghost mobile-bar__call" aria-label={`${t.mobileBar.call} ${business.phone.display}`}>
        <PhoneIcon />
      </a>
      <OrderLink locale={locale} className="btn btn--primary mobile-bar__order">
        {t.mobileBar.order} <ArrowIcon />
      </OrderLink>
    </div>
  );
}
