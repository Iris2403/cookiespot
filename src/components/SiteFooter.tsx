import { OrderLink } from "./OrderChooser";
import Link from "next/link";
import type { Locale } from "@/content/menu";
import { orderUrl } from "@/content/menu";
import { business, EFOOD_URL, INSTAGRAM_HANDLE, INSTAGRAM_URL, MAPS_DIRECTIONS_URL } from "@/content/business";
import { getDictionary } from "@/i18n/dictionaries";
import { Wordmark } from "./Wordmark";
import { ArrowIcon, InstagramIcon } from "./icons";

export function SiteFooter({ locale, onHome = true }: { locale: Locale; onHome?: boolean }) {
  const t = getDictionary(locale);
  const base = onHome ? "" : `/${locale}`;
  const a = business.address;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__cta">
          <p className="site-footer__big">{t.hero.titleA} <em>{t.hero.titleB}</em></p>
          <OrderLink locale={locale} className="btn btn--primary btn--lg">{t.footer.orderWolt} <ArrowIcon /></OrderLink>
        </div>
        <div className="site-footer__grid">
          <div>
            <Wordmark tone="light" />
            <p className="site-footer__tag">{t.footer.tagline}</p>
          </div>
          <nav aria-label={t.footer.explore}>
            <h2 className="site-footer__h">{t.footer.explore}</h2>
            <ul>
              <li><a href={`${base}#menu`}>{t.nav.menu}</a></li>
              <li><a href={`${base}#offers`}>{t.offers.eyebrow}</a></li>
              <li><a href={`${base}#story`}>{t.nav.story}</a></li>
              <li><a href={`${base}#gallery`}>{t.nav.gallery}</a></li>
              <li><a href={`${base}#contact`}>{t.nav.contact}</a></li>
            </ul>
          </nav>
          <div>
            <h2 className="site-footer__h">{t.footer.visit}</h2>
            <address>
              <a href={MAPS_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                {locale === "el" ? a.streetEl : a.street}<br />
                {locale === "el" ? a.areaEl : a.area}, {a.postalCode} {locale === "el" ? a.cityEl : a.city}
              </a>
              <br />
              <a href={`tel:${business.phone.e164}`}>{business.phone.display}</a>
            </address>
          </div>
          <div>
            <h2 className="site-footer__h">{t.footer.follow}</h2>
            <ul>
              <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><InstagramIcon /> {INSTAGRAM_HANDLE}</a></li>
              <li><a href={orderUrl(undefined, locale)} target="_blank" rel="noopener noreferrer">Wolt</a></li>
              <li><a href={EFOOD_URL} target="_blank" rel="noopener noreferrer">e-food</a></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__legal">
          <p>© {new Date().getFullYear()} The Cookie Spot. {t.footer.rights}</p>
          <p>{t.footer.dataNote}</p>
          <Link href={`/${locale}/privacy`}>{t.footer.privacy}</Link>
        </div>
      </div>
    </footer>
  );
}
