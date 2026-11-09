import type { Locale } from "@/content/menu";
import { categories, products, MENU_LAST_VERIFIED } from "@/content/menu";
import { business, EFOOD_URL, INSTAGRAM_URL, WOLT_STORE_URL } from "@/content/business";
import { getDictionary } from "@/i18n/dictionaries";
import { absoluteUrl } from "@/lib/site";

const DAY_SCHEMA = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" } as const;

/**
 * Bakery (LocalBusiness) structured data built only from verified fields.
 * Deliberately omitted: aggregateRating/review (not verifiable at build), geo (no verified coordinates).
 */
export function JsonLd({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const a = business.address;
  const data = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": absoluteUrl("/#business"),
    name: business.name,
    description: t.meta.description,
    url: absoluteUrl(`/${locale}`),
    image: absoluteUrl("/images/brand/we-bake-it-personally.webp"),
    logo: absoluteUrl("/brand/logo.svg"),
    slogan: "We bake it personally",
    telephone: business.phone.e164,
    servesCuisine: ["Desserts", "Cookies", "Ice cream"],
    priceRange: "€",
    address: {
      "@type": "PostalAddress",
      streetAddress: locale === "el" ? a.streetEl : a.street,
      addressLocality: locale === "el" ? a.cityEl : a.city,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    openingHoursSpecification: business.hours
      .filter((h) => h.opens && h.closes)
      .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${DAY_SCHEMA[h.day]}`, opens: h.opens, closes: h.closes })),
    sameAs: [INSTAGRAM_URL],
    potentialAction: [
      { "@type": "OrderAction", target: WOLT_STORE_URL },
      { "@type": "OrderAction", target: EFOOD_URL },
    ],
    hasMenu: {
      "@type": "Menu",
      url: absoluteUrl(`/${locale}#menu`),
      dateModified: MENU_LAST_VERIFIED,
      hasMenuSection: categories
        .filter((c) => products.some((p) => p.category === c.id))
        .map((c) => ({
          "@type": "MenuSection",
          name: c.label[locale],
          hasMenuItem: products
            .filter((p) => p.category === c.id)
            .map((p) => ({
              "@type": "MenuItem",
              name: p.name,
              ...(p.description ? { description: p.description[locale] } : {}),
              ...(p.price != null ? { offers: { "@type": "Offer", price: p.price.toFixed(2), priceCurrency: "EUR", url: WOLT_STORE_URL } } : {}),
              ...(p.dietary?.includes("vegan") ? { suitableForDiet: "https://schema.org/VeganDiet" } : {}),
            })),
        })),
    },
  };
  // JSON.stringify output is escaped for "<" so content can never close the script tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
