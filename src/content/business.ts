/**
 * Business information — single source of truth.
 *
 * Every fact here carries a source. Update `lastVerified` whenever you re-check it.
 * Do NOT add ratings, review counts, awards or extra locations unless they are verified
 * against the Google Business Profile.
 */

export const WOLT_STORE_URL = "https://wolt.com/el/grc/athens/restaurant/cookie-spot";
export const WOLT_STORE_URL_EN = "https://wolt.com/en/grc/athens/restaurant/cookie-spot";
/** Second ordering platform (supplied by the owner). Prices there may differ from Wolt. */
export const EFOOD_URL = "https://www.e-food.gr/delivery/ampelokipoi/the-cookie-spot";
export const INSTAGRAM_URL = "https://www.instagram.com/thecookiespotathens/";
export const INSTAGRAM_HANDLE = "@thecookiespotathens";
export const GOOGLE_PROFILE_URL = "https://share.google/j63nFPKLzOhn16pUl";

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface OpeningPeriod {
  day: DayKey;
  /** 24h "HH:MM" in Europe/Athens, or null when closed. */
  opens: string | null;
  closes: string | null;
}

export const business = {
  name: "The Cookie Spot",
  legalNote: "The Cookie Spot Athens",
  address: {
    street: "Leof. Kifisias 129",
    streetEl: "Λεωφ. Κηφισίας 129",
    area: "Panormou",
    areaEl: "Πανόρμου",
    postalCode: "11524",
    city: "Athens",
    cityEl: "Αθήνα",
    country: "GR",
  },
  /** E.164 and display formats. Source: Wolt venue listing & Tripadvisor listing. */
  phone: { e164: "+302106983637", display: "+30 210 698 3637" },
  /**
   * Hours as listed on the Wolt venue page (indexed snapshot). Wolt hours describe when the
   * store accepts orders. Confirm against the Google Business Profile before launch.
   */
  hours: [
    { day: "mon", opens: "09:00", closes: "21:30" },
    { day: "tue", opens: "09:00", closes: "21:30" },
    { day: "wed", opens: "09:00", closes: "21:30" },
    { day: "thu", opens: "09:00", closes: "21:30" },
    { day: "fri", opens: "09:00", closes: "22:30" },
    { day: "sat", opens: "10:00", closes: "22:30" },
    { day: "sun", opens: null, closes: null },
  ] satisfies OpeningPeriod[],
  timeZone: "Europe/Athens",
  sources: {
    address: "Wolt venue listing; Tripadvisor listing",
    phone: "Wolt venue listing; Tripadvisor listing",
    hours: "Wolt venue listing",
  },
  lastVerified: "2026-11-09",
  /** Set to true only after the details above were re-checked on the Google Business Profile. */
  verifiedAgainstGoogleProfile: false,
} as const;

const mapsQuery = encodeURIComponent(
  `${business.name}, ${business.address.street}, ${business.address.postalCode} ${business.address.city}`,
);

export const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;
export const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
/** Key-less Google Maps embed. Loaded only on user request (privacy + performance). */
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
