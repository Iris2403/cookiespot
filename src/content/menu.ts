/**
 * MENU CATALOGUE — single source of truth for every product, price and category.
 *
 * Source: The Cookie Spot's Wolt venue page (https://wolt.com/el/grc/athens/restaurant/cookie-spot),
 * read through search-indexed snapshots on MENU_LAST_VERIFIED. Wolt itself is always the
 * authoritative, live source: prices and availability are confirmed at checkout there.
 *
 * Rules for editors:
 *  - `price: null` means the price could not be verified → the UI shows "See price on Wolt".
 *  - Only write `description`, `facts` and `dietary` that appear on the official listing.
 *    Never invent ingredients, allergens or weights.
 *  - `image` is a path under /public (e.g. "/images/products/pistachio-cookie.webp").
 *    Use only photography owned or authorised by The Cookie Spot. When omitted, the site renders
 *    an art-directed illustration (see components/ProductArt.tsx) instead of stock photography.
 *  - `woltUrl` can point to the item's own Wolt page; otherwise the store page is used.
 */

export const MENU_LAST_VERIFIED = "2026-11-09";
export const MENU_SOURCE = "Wolt venue listing (indexed snapshot)";

export type Locale = "el" | "en";
export type Localized = Record<Locale, string>;

export type CategoryId =
  | "classic"
  | "ny-style"
  | "brookies"
  | "mini"
  | "vegan"
  | "skillet"
  | "dippers"
  | "ice-cream"
  | "milkshakes"
  | "cold-drinks"
  | "hot-drinks"
  | "cookie-drinks"
  | "coffee"
  | "combos";

export type ArtKind = "cookie" | "ny-cookie" | "brookie" | "skillet" | "mini" | "dippers" | "scoop" | "tub" | "shake" | "drink" | "combo";

/** Visual recipe for the illustration fallback. Colours are hex. */
export interface ArtSpec {
  kind: ArtKind;
  dough: string;
  chunks: string[];
  drizzle?: string;
  backdrop: string;
  accent?: string;
}

export type Dietary = "vegan" | "no-added-sugar";

export interface Product {
  slug: string;
  category: CategoryId;
  /** Product names are kept exactly as they appear on Wolt. */
  name: string;
  nameEl?: string;
  description?: Localized;
  /** Short verified facts (e.g. weight / piece count) shown as chips. */
  facts?: Localized[];
  price: number | null;
  /** Original price when the listing shows a discount. */
  compareAtPrice?: number;
  dietary?: Dietary[];
  signature?: boolean;
  image?: string;
  woltUrl?: string;
  art: ArtSpec;
}

export interface Category {
  id: CategoryId;
  label: Localized;
  /** Heading as it appears on Wolt, kept for traceability. */
  woltLabel: string;
  blurb?: Localized;
  /** Category is on the Wolt menu, but its items could not be verified yet. */
  itemsPending?: boolean;
  tone: "vanilla" | "biscuit" | "chocolate" | "pistachio" | "strawberry" | "orange";
}

export const categories: Category[] = [
  {
    id: "classic",
    label: { el: "Classic Cookies", en: "Classic Cookies" },
    woltLabel: "COOKIES",
    blurb: {
      el: "Τα κλασικά μας cookies, ψημένα φρέσκα τη στιγμή της παραγγελίας.",
      en: "Our classic cookies, freshly baked the moment you order.",
    },
    tone: "biscuit",
  },
  {
    id: "ny-style",
    label: { el: "New York Style", en: "New York Style" },
    woltLabel: "NY STYLE COOKIES",
    blurb: {
      el: "Μεγάλα, παχιά cookies 140g. Chunky, μαλακά μέσα, τραγανά στις άκρες, γεμάτα υλικά.",
      en: "Big, thick 140g cookies. Chunky, soft inside, crispy at the edges and loaded with mix-ins.",
    },
    tone: "chocolate",
  },
  {
    id: "brookies",
    label: { el: "Brookies", en: "Brookies" },
    woltLabel: "BROOKIES",
    blurb: { el: "Brownie και cookie, σε ένα.", en: "Brownie meets cookie, in one bake." },
    tone: "chocolate",
  },
  {
    id: "mini",
    label: { el: "Mini Cookies", en: "Mini Cookies" },
    woltLabel: "MINI COOKIES",
    blurb: { el: "Για να μοιραστείς (ή όχι).", en: "Made for sharing (or not)." },
    tone: "strawberry",
  },
  {
    id: "vegan",
    label: { el: "Νηστίσιμα · Vegan", en: "Vegan Cookies" },
    woltLabel: "ΝΗΣΤΙΣΙΜΑ - VEGAN COOKIES",
    tone: "pistachio",
  },
  {
    id: "skillet",
    label: { el: "Skillet Cookies", en: "Skillet Cookies" },
    woltLabel: "SKILLET COOKIES",
    blurb: { el: "Ζεστό cookie στο τηγανάκι, με παγωτό.", en: "A warm cookie in the skillet, served with ice cream." },
    tone: "orange",
  },
  {
    id: "dippers",
    label: { el: "Cookie Dippers", en: "Cookie Dippers" },
    woltLabel: "COOKIE DIPPERS",
    tone: "biscuit",
  },
  {
    id: "ice-cream",
    label: { el: "Παγωτό", en: "Ice Cream" },
    woltLabel: "ΠΑΓΩΤΟ / ICE CREAM",
    tone: "strawberry",
  },
  {
    id: "milkshakes",
    label: { el: "Milkshakes", en: "Milkshakes" },
    woltLabel: "MILKSHAKES",
    tone: "pistachio",
  },
  {
    id: "cold-drinks",
    label: { el: "Κρύα ροφήματα", en: "Cold Drinks" },
    woltLabel: "ΚΡΥΑ ΡΟΦΗΜΑΤΑ",
    tone: "vanilla",
  },
  {
    id: "hot-drinks",
    label: { el: "Ζεστά ροφήματα", en: "Hot Drinks" },
    woltLabel: "ΖΕΣΤΑ ΡΟΦΗΜΑΤΑ",
    itemsPending: true,
    tone: "vanilla",
  },
  {
    id: "cookie-drinks",
    label: { el: "Cookie Drinks", en: "Cookie Drinks" },
    woltLabel: "COOKIE DRINKS",
    itemsPending: true,
    tone: "biscuit",
  },
  {
    id: "coffee",
    label: { el: "Καφές", en: "Coffee" },
    woltLabel: "COFFEE",
    itemsPending: true,
    tone: "chocolate",
  },
  {
    id: "combos",
    label: { el: "Combos & Προσφορές", en: "Combos & Offers" },
    woltLabel: "COMBOS",
    tone: "orange",
  },
];

/* Palette shortcuts for illustrations */
const C = {
  dough: "#C98A4B",
  doughLight: "#D9A066",
  doughDark: "#8A5530",
  cocoa: "#4A2A1A",
  darkChoc: "#2B160C",
  milkChoc: "#6B3E22",
  white: "#F3E6D0",
  pistachio: "#93B060",
  strawberry: "#D9586B",
  caramel: "#C7772E",
  biscoff: "#B0672F",
  blueberry: "#4B4F8F",
  lemon: "#F2D36B",
  vanilla: "#FFF8EF",
  biscuit: "#E9D8C5",
  chocolateBg: "#3D2618",
  orange: "#ED7033",
  pistachioBg: "#DCE6C4",
  strawberryBg: "#F6D3D6",
};

export const products: Product[] = [
  /* ---------- NY STYLE ---------- */
  {
    slug: "triple-choco-praline",
    category: "ny-style",
    name: "Triple Choco-Praline",
    facts: [{ el: "140g", en: "140g" }],
    price: 3.7,
    signature: true,
    art: { kind: "ny-cookie", dough: C.cocoa, chunks: [C.darkChoc, C.white, C.milkChoc], drizzle: C.caramel, backdrop: C.chocolateBg },
  },
  {
    slug: "pistachio-cookie",
    category: "ny-style",
    name: "Pistachio Cookie",
    facts: [{ el: "140g", en: "140g" }],
    price: 4.1,
    signature: true,
    art: { kind: "ny-cookie", dough: C.doughLight, chunks: [C.pistachio, C.white, "#6E8C3E"], drizzle: C.pistachio, backdrop: C.pistachioBg },
  },
  {
    slug: "biscoff-cookie",
    category: "ny-style",
    name: "Biscoff Cookie",
    facts: [{ el: "140g", en: "140g" }],
    price: 3.9,
    signature: true,
    art: { kind: "ny-cookie", dough: C.dough, chunks: [C.biscoff, C.white, C.caramel], drizzle: C.biscoff, backdrop: C.biscuit },
  },
  {
    slug: "cookies-and-cream",
    category: "ny-style",
    name: "Cookies and Cream",
    facts: [{ el: "140g", en: "140g" }],
    price: 3.9,
    art: { kind: "ny-cookie", dough: C.white, chunks: [C.darkChoc, C.darkChoc, "#1C120C"], backdrop: C.chocolateBg },
  },

  /* ---------- CLASSIC ---------- */
  {
    slug: "chocolate-chip",
    category: "classic",
    name: "Chocolate Chip",
    price: 2.0,
    art: { kind: "cookie", dough: C.dough, chunks: [C.darkChoc, C.milkChoc], backdrop: C.biscuit },
  },
  {
    slug: "milk-chocolate-chip",
    category: "classic",
    name: "Milk Chocolate Chip",
    price: 2.5,
    art: { kind: "cookie", dough: C.doughLight, chunks: [C.milkChoc, "#7D4A2A"], backdrop: C.vanilla },
  },
  {
    slug: "peanut-butter-chocolate-chips",
    category: "classic",
    name: "Peanut Butter Chocolate Chips",
    price: 3.0,
    signature: true,
    art: { kind: "cookie", dough: "#C78E52", chunks: [C.darkChoc, "#B07A3E"], drizzle: "#A8672E", backdrop: C.biscuit },
  },
  {
    slug: "blueberry-lemon-white-chocolate",
    category: "classic",
    name: "Blueberry Lemon Cookie with White Chocolate",
    price: null,
    art: { kind: "cookie", dough: "#E2B877", chunks: [C.blueberry, C.white, C.lemon], backdrop: C.vanilla },
  },

  /* ---------- BROOKIES ---------- */
  {
    slug: "classic-brookie",
    category: "brookies",
    name: "Classic Brookie",
    price: 10.5,
    signature: true,
    art: { kind: "brookie", dough: C.dough, chunks: [C.darkChoc, C.milkChoc], backdrop: C.biscuit },
  },
  {
    slug: "caramel-brookie",
    category: "brookies",
    name: "Caramel Brookie",
    price: 12.0,
    signature: true,
    art: { kind: "brookie", dough: C.doughLight, chunks: [C.darkChoc, C.caramel], drizzle: C.caramel, backdrop: C.vanilla },
  },

  /* ---------- SKILLET ---------- */
  {
    slug: "chocolate-chip-skillet-ice-cream",
    category: "skillet",
    name: "Chocolate Chip Skillet with Ice Cream",
    facts: [{ el: "Με παγωτό 100g", en: "With 100g ice cream" }],
    price: null,
    signature: true,
    art: { kind: "skillet", dough: C.dough, chunks: [C.darkChoc, C.milkChoc], drizzle: C.white, backdrop: "#2A1A10" },
  },
  {
    slug: "triple-chocolate-skillet-ice-cream",
    category: "skillet",
    name: "Triple Chocolate Skillet with Ice Cream",
    price: null,
    art: { kind: "skillet", dough: C.cocoa, chunks: [C.darkChoc, C.white, C.milkChoc], drizzle: C.white, backdrop: "#2A1A10" },
  },

  /* ---------- MINI ---------- */
  {
    slug: "mini-cookies",
    category: "mini",
    name: "Mini Cookies",
    description: { el: "Mini cookies για να τα μοιραστείτε.", en: "Mini cookies, made for sharing." },
    price: 25.0,
    art: { kind: "mini", dough: C.dough, chunks: [C.darkChoc, C.strawberry, C.pistachio], backdrop: C.strawberryBg },
  },

  /* ---------- VEGAN ---------- */
  {
    slug: "vegan-chocolate-chip",
    category: "vegan",
    name: "Vegan Chocolate Chip",
    price: 2.5,
    dietary: ["vegan"],
    art: { kind: "cookie", dough: C.dough, chunks: [C.darkChoc, C.cocoa], backdrop: C.pistachioBg },
  },
  {
    slug: "oatmeal-raisin-no-sugar",
    category: "vegan",
    name: "Oatmeal Raisin (no sugar)",
    price: 3.0,
    dietary: ["vegan", "no-added-sugar"],
    art: { kind: "cookie", dough: "#C99B63", chunks: ["#5A2A3A", "#E6CFA4"], backdrop: C.pistachioBg },
  },

  /* ---------- DIPPERS ---------- */
  {
    slug: "cookie-dippers",
    category: "dippers",
    name: "Cookie Dippers",
    description: {
      el: "20 μικρά τετράγωνα cookies σε τρεις γεύσεις — σοκολάτα γάλακτος, red velvet και brownie — με τρία dips: πραλίνα, αλατισμένη καραμέλα και waffle flakes.",
      en: "20 small square cookies in three flavours — milk chocolate, red velvet and brownie — served with three dips: praline, salted caramel and waffle flakes.",
    },
    facts: [{ el: "20 τεμάχια", en: "20 pieces" }, { el: "3 dips", en: "3 dips" }],
    price: null,
    art: { kind: "dippers", dough: C.dough, chunks: [C.milkChoc, "#9B2C3A", C.cocoa], drizzle: C.caramel, backdrop: C.biscuit },
  },

  /* ---------- ICE CREAM ---------- */
  {
    slug: "ice-cream-small-cup",
    category: "ice-cream",
    name: "Ice Cream — Small Cup",
    nameEl: "Παγωτό — Μικρό κύπελλο",
    price: 3.8,
    art: { kind: "scoop", dough: "#F4E3C1", chunks: [C.darkChoc], backdrop: C.strawberryBg, accent: C.strawberry },
  },
  {
    slug: "ice-cream-big-cup",
    category: "ice-cream",
    name: "Ice Cream — Big Cup",
    nameEl: "Παγωτό — Μεγάλο κύπελλο",
    price: 7.2,
    art: { kind: "scoop", dough: "#C9DBA0", chunks: [C.darkChoc, C.pistachio], backdrop: C.pistachioBg, accent: C.pistachio },
  },
  {
    slug: "ice-cream-500g",
    category: "ice-cream",
    name: "Ice Cream 500g",
    nameEl: "Παγωτό 500g",
    facts: [{ el: "500g", en: "500g" }],
    price: 13.5,
    art: { kind: "tub", dough: "#F4E3C1", chunks: [C.darkChoc], backdrop: C.vanilla, accent: C.orange },
  },
  {
    slug: "ice-cream-1kg",
    category: "ice-cream",
    name: "Ice Cream 1kg",
    nameEl: "Παγωτό 1kg",
    facts: [{ el: "1kg", en: "1kg" }],
    price: 24.0,
    art: { kind: "tub", dough: "#E9B9BF", chunks: [C.strawberry], backdrop: C.strawberryBg, accent: C.chocolateBg },
  },

  /* ---------- MILKSHAKES ---------- */
  {
    slug: "pistachio-salted-caramel-milkshake",
    category: "milkshakes",
    name: "Pistachio Salted Caramel",
    price: 5.5,
    signature: true,
    art: { kind: "shake", dough: "#C9DBA0", chunks: [C.pistachio], drizzle: C.caramel, backdrop: C.pistachioBg, accent: C.caramel },
  },
  {
    slug: "chocolate-chip-milkshake",
    category: "milkshakes",
    name: "Chocolate Chip",
    price: 5.6,
    art: { kind: "shake", dough: "#E8D3B4", chunks: [C.darkChoc], drizzle: C.cocoa, backdrop: C.biscuit, accent: C.cocoa },
  },
  {
    slug: "peanut-butter-choc-chunk-milkshake",
    category: "milkshakes",
    name: "Peanut Butter Choc Chunk",
    price: null,
    art: { kind: "shake", dough: "#D9B27E", chunks: [C.darkChoc], drizzle: "#A8672E", backdrop: C.vanilla, accent: "#A8672E" },
  },
  {
    slug: "red-velvet-milkshake",
    category: "milkshakes",
    name: "Red Velvet",
    price: null,
    art: { kind: "shake", dough: "#E7A3AC", chunks: ["#9B2C3A"], drizzle: C.white, backdrop: C.strawberryBg, accent: "#9B2C3A" },
  },

  /* ---------- COLD DRINKS ---------- */
  {
    slug: "iced-tea-lemon-bergamot",
    category: "cold-drinks",
    name: "Iced Tea Lemon & Bergamot",
    price: 2.4,
    art: { kind: "drink", dough: "#E2A53A", chunks: [C.lemon], backdrop: C.vanilla, accent: C.lemon },
  },

  /* ---------- COMBOS ---------- */
  {
    slug: "combo-5-plus-1",
    category: "combos",
    name: "5 Cookies + 1 Cookie FREE",
    description: {
      el: "Διάλεξε 5 cookies και πάρε 1 ακόμη δώρο.",
      en: "Choose 5 cookies and get 1 more free.",
    },
    price: 12.0,
    art: { kind: "combo", dough: C.dough, chunks: [C.darkChoc, C.pistachio, C.biscoff], backdrop: C.orange },
  },
  {
    slug: "combo-8-plus-2",
    category: "combos",
    name: "8 Cookies + 2 Cookies FREE",
    description: {
      el: "Διάλεξε 8 cookies και πάρε 2 ακόμη δώρο.",
      en: "Choose 8 cookies and get 2 more free.",
    },
    price: 16.0,
    compareAtPrice: 20.0,
    art: { kind: "combo", dough: C.doughLight, chunks: [C.darkChoc, C.strawberry, C.white], backdrop: C.chocolateBg },
  },
  {
    slug: "combo-4-cookies-big-cup",
    category: "combos",
    name: "4 Cookies + Big Cup of Ice Cream",
    description: { el: "4 cookies και ένα μεγάλο κύπελλο παγωτό.", en: "4 cookies with a big cup of ice cream." },
    price: 10.64,
    compareAtPrice: 15.2,
    art: { kind: "combo", dough: C.dough, chunks: [C.darkChoc, C.milkChoc], backdrop: C.strawberryBg, accent: C.strawberry },
  },
  {
    slug: "combo-6-cookies-500g",
    category: "combos",
    name: "6 Cookies + 500g Ice Cream",
    description: { el: "6 cookies και 500g παγωτό.", en: "6 cookies with 500g of ice cream." },
    price: 17.85,
    compareAtPrice: 25.5,
    art: { kind: "combo", dough: C.doughLight, chunks: [C.darkChoc, C.pistachio], backdrop: C.pistachioBg, accent: C.pistachio },
  },
];

export const productsByCategory = (id: CategoryId) => products.filter((p) => p.category === id);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const signatureProducts = () => products.filter((p) => p.signature);

export function orderUrl(product?: Pick<Product, "woltUrl">, locale: Locale = "el") {
  if (product?.woltUrl) return product.woltUrl;
  return locale === "en"
    ? "https://wolt.com/en/grc/athens/restaurant/cookie-spot"
    : "https://wolt.com/el/grc/athens/restaurant/cookie-spot";
}

export function formatPrice(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "el" ? "el-GR" : "en-IE", { style: "currency", currency: "EUR" }).format(value);
}

export function discountPercent(p: Product) {
  if (!p.price || !p.compareAtPrice) return null;
  return Math.round((1 - p.price / p.compareAtPrice) * 100);
}
