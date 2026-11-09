/**
 * MENU CATALOGUE — single source of truth for every product, price, description and photo.
 *
 * Source: The Cookie Spot's Wolt store (https://wolt.com/el/grc/athens/restaurant/cookie-spot),
 * from screenshots of the live app supplied by the brand on MENU_LAST_VERIFIED. Greek
 * descriptions are copied from Wolt (cut where Wolt truncated them); English is a translation.
 * Wolt stays the authoritative, live source — prices and availability are confirmed at checkout.
 *
 * Editors:
 *  - `price: null` → the UI shows "See price on Wolt".
 *  - `priceFrom: true` → price depends on the choices made on Wolt (combos); shown as "from".
 *  - `image` = square-ish product photo (menu thumbnail), `photo` = large editorial photo.
 *    Paths are under /public. Only use photography owned or authorised by The Cookie Spot.
 *  - `kind` picks the ink drawing used when a product has no photo.
 */

export const MENU_LAST_VERIFIED = "2026-11-09";
export const MENU_SOURCE = "Wolt store (app screenshots supplied by the brand)";

export type Locale = "el" | "en";
export type Localized = Record<Locale, string>;

export type CategoryId =
  | "combos"
  | "classic"
  | "brookies"
  | "mini"
  | "vegan"
  | "ny-style"
  | "skillet"
  | "ice-cream"
  | "milkshakes"
  | "cold-drinks"
  | "drinks"
  | "cookie-drinks"
  | "coffee";

export type ArtKind = "cookie" | "ny-cookie" | "brookie" | "skillet" | "mini" | "dippers" | "scoop" | "tub" | "shake" | "drink" | "combo";

export type Dietary = "vegan" | "no-added-sugar";

export interface Product {
  slug: string;
  category: CategoryId;
  name: string;
  nameEl?: string;
  description?: Localized;
  facts?: Localized[];
  price: number | null;
  compareAtPrice?: number;
  priceFrom?: boolean;
  dietary?: Dietary[];
  /** Marked "Δημοφιλές" (popular) on Wolt. */
  popular?: boolean;
  /** Marked "Νέο" (new) on Wolt. */
  isNew?: boolean;
  /** Featured on the homepage. */
  signature?: boolean;
  image?: string;
  photo?: string;
  woltUrl?: string;
  kind: ArtKind;
}

export interface Category {
  id: CategoryId;
  label: Localized;
  woltLabel: string;
  blurb?: Localized;
  note?: Localized;
}

export const categories: Category[] = [
  { id: "classic", label: { el: "Cookies", en: "Cookies" }, woltLabel: "COOKIES", blurb: { el: "Τα κλασικά μας cookies, ψημένα τη στιγμή που τα παραγγέλνεις.", en: "Our classic cookies, baked the moment you order." } },
  {
    id: "ny-style",
    label: { el: "NY Style Cookies", en: "NY Style Cookies" },
    woltLabel: "NY STYLE COOKIES",
    blurb: {
      el: "Μεγάλα, παχιά (140 g), chunky — μαλακά μέσα, τραγανά στις άκρες και γεμάτα υλικά.",
      en: "Big, thick (140 g) and chunky — soft on the inside, crispy on the edges and full of mix-ins.",
    },
  },
  { id: "brookies", label: { el: "Brookies", en: "Brookies" }, woltLabel: "BROOKIES", blurb: { el: "Βάση brownie με soft cookie topping.", en: "A brownie base with a soft cookie topping." } },
  { id: "skillet", label: { el: "Skillet Cookies", en: "Skillet Cookies" }, woltLabel: "SKILLET COOKIES", blurb: { el: "Μεγάλο, ζεστό cookie στο ταψάκι, με παγωτό.", en: "A big, warm cookie in the skillet, with ice cream." } },
  { id: "vegan", label: { el: "Νηστίσιμα · Vegan", en: "Vegan Cookies" }, woltLabel: "ΝΗΣΤΙΣΙΜΑ - VEGAN COOKIES" },
  { id: "mini", label: { el: "Mini Cookies", en: "Mini Cookies" }, woltLabel: "MINI COOKIES", blurb: { el: "Για κέρασμα — ελάχιστη παραγγελία 20 cookies.", en: "For treating others — minimum order 20 cookies." } },
  { id: "ice-cream", label: { el: "Παγωτό", en: "Ice Cream" }, woltLabel: "ΠΑΓΩΤΟ" },
  { id: "milkshakes", label: { el: "Milkshakes", en: "Milkshakes" }, woltLabel: "MILKSHAKES" },
  { id: "cookie-drinks", label: { el: "Ζεστά ροφήματα cookies", en: "Hot cookie drinks" }, woltLabel: "ΖΕΣΤΑ ΡΟΦΗΜΑΤΑ COOKIES" },
  { id: "coffee", label: { el: "Καφέδες", en: "Coffee" }, woltLabel: "ΚΑΦΕΔΕΣ", note: { el: "Περιλαμβάνεται 0,05 € περιβαλλοντικό τέλος.", en: "Includes a €0.05 environmental fee." } },
  { id: "cold-drinks", label: { el: "Κρύα ροφήματα", en: "Cold drinks" }, woltLabel: "ΚΡΥΑ ΡΟΦΗΜΑΤΑ" },
  { id: "drinks", label: { el: "Ροφήματα", en: "Drinks" }, woltLabel: "ΡΟΦΗΜΑΤΑ" },
  { id: "combos", label: { el: "Combos & προσφορές", en: "Combos & offers" }, woltLabel: "COMBOS", blurb: { el: "Η τελική τιμή διαμορφώνεται βάσει των επιλογών σου στη Wolt.", en: "The final price depends on your choices on Wolt." } },
];

const T = (name: string) => `/images/thumbs/${name}.webp`;
const P = (path: string) => `/images/${path}.webp`;

export const products: Product[] = [
  /* ---------------- COOKIES ---------------- */
  { slug: "chocolate-chip", category: "classic", name: "Chocolate Chip Cookie", price: 2.0, popular: true, kind: "cookie", image: T("chocolate-chip"),
    description: { el: "Με Βελγική σοκολάτα.", en: "With Belgian chocolate." } },
  { slug: "peanut-butter-chocolate-chips", category: "classic", name: "Peanut Butter Chocolate Chips Cookie", price: 3.0, kind: "cookie", image: T("peanut-butter-chocolate-chips"),
    description: { el: "Με φυστικοβούτυρο και κομματάκια Βέλγικης σοκολάτας.", en: "With peanut butter and Belgian chocolate chunks." } },
  { slug: "blueberry-lemon-white-chocolate", category: "classic", name: "Blueberry Lemon with White Chocolate", price: 3.0, kind: "cookie", image: T("blueberry-lemon-white-chocolate"),
    description: { el: "Με φρέσκο μύρτιλο, ξύσμα λεμονιού και λευκή Βέλγικη σοκολάτα.", en: "With fresh blueberries, lemon zest and Belgian white chocolate." } },
  { slug: "lemon-poppyseeds", category: "classic", name: "Lemon and Poppyseeds", price: 2.0, kind: "cookie", image: T("lemon-poppyseeds"),
    description: { el: "Με λεμόνι, παπαρουνόσπορο και cream cheese.", en: "With lemon, poppy seeds and cream cheese." } },
  { slug: "red-velvet", category: "classic", name: "Red Velvet", price: 2.5, signature: true, kind: "cookie", image: T("red-velvet"), photo: P("products/red-velvet-feature"),
    description: { el: "Με κομματάκια λευκής σοκολάτας.", en: "With white chocolate chunks." } },
  { slug: "reverse-chocolate-chip", category: "classic", name: "Reverse Chocolate Chip", price: 2.5, kind: "cookie", image: T("reverse-chocolate-chip"),
    description: { el: "Cookie με κακάο και κομματάκια λευκής σοκολάτας.", en: "A cocoa cookie with white chocolate chunks." } },
  { slug: "milk-chocolate-chip", category: "classic", name: "Milk Chocolate Chip Cookies", price: 2.5, popular: true, kind: "cookie", image: T("milk-chocolate-chip"),
    description: { el: "Με κομμάτια βέλγικης σοκολάτας γάλακτος.", en: "With chunks of Belgian milk chocolate." } },
  { slug: "confetti-cookie", category: "classic", name: "Confetti Cookie", price: 2.5, kind: "cookie", image: T("confetti-cookie"),
    description: { el: "Cookie με βάση βανίλια, πολύχρωμη τρούφα και γέμιση cream cheese frosting.", en: "A vanilla cookie with rainbow sprinkles and a cream cheese frosting filling." } },

  /* ---------------- NY STYLE ---------------- */
  { slug: "triple-choco-praline", category: "ny-style", name: "Triple Choco-Praline", price: 3.7, signature: true, kind: "ny-cookie", image: T("triple-choco-praline"), photo: P("products/triple-choco-praline-paper"),
    facts: [{ el: "140 g", en: "140 g" }],
    description: { el: "Με ζύμη κακάο, λευκή σοκολάτα, σοκολάτα γάλακτος και γέμιση πραλίνας.", en: "Cocoa dough, white chocolate, milk chocolate and a praline filling." } },
  { slug: "pistachio-cookie", category: "ny-style", name: "Pistachio Cookie", price: 4.1, signature: true, kind: "ny-cookie", image: T("pistachio-cookie"),
    facts: [{ el: "140 g", en: "140 g" }],
    description: { el: "Cookie από φυστίκι Αιγίνης, με πάστα φυστικιού.", en: "Made with Aegina pistachio and pistachio paste." } },
  { slug: "dubai-chocolate-cookie", category: "ny-style", name: "Dubai Chocolate Cookie", price: 3.9, kind: "ny-cookie", image: T("dubai-chocolate-cookie"),
    facts: [{ el: "140 g", en: "140 g" }],
    description: { el: "Ζύμη κακάο και σοκολάτα γάλακτος με γέμιση πραλίνα φυστίκι.", en: "Cocoa dough and milk chocolate with a pistachio praline filling." } },
  { slug: "biscoff-cookie", category: "ny-style", name: "Biscoff Cookie", price: 3.9, signature: true, kind: "ny-cookie", image: T("biscoff-cookie"), photo: P("gallery/biscoff-hand"),
    facts: [{ el: "140 g", en: "140 g" }],
    description: { el: "Με λευκή σοκολάτα, Biscoff cookie και γέμιση Biscoff spread.", en: "With white chocolate, a Biscoff cookie and a Biscoff spread filling." } },
  { slug: "cookies-and-cream", category: "ny-style", name: "Cookies and Cream", price: 3.9, kind: "ny-cookie", image: T("cookies-and-cream"), photo: P("brand/we-bake-it-personally"),
    facts: [{ el: "140 g", en: "140 g" }],
    description: { el: "Oreo cookie, ζύμη βανίλια, λευκή σοκολάτα και πραλίνα.", en: "Oreo cookie, vanilla dough, white chocolate and praline." } },

  /* ---------------- BROOKIES ---------------- */
  { slug: "classic-brookie", category: "brookies", name: "Classic Brookie", price: 10.5, popular: true, signature: true, kind: "brookie", image: T("classic-brookie"), photo: P("products/classic-brookie-box"),
    facts: [{ el: "470 g", en: "470 g" }],
    description: { el: "Βάση brownie και soft cookie topping.", en: "A brownie base with a soft cookie topping." } },
  { slug: "caramel-brookie", category: "brookies", name: "Caramel Brookie", price: 12.0, signature: true, kind: "brookie", image: T("caramel-brookie"), photo: P("products/caramel-brookie-bite"),
    description: { el: "Βάση brownie, soft cookie topping και dulce de leche (καραμέλα γάλακτος).", en: "A brownie base, a soft cookie topping and dulce de leche (milk caramel)." } },

  /* ---------------- SKILLET ---------------- */
  { slug: "skillet-chocolate-chip", category: "skillet", name: "Skillet Chocolate Chip Cookie with Ice Cream", price: 8.5, popular: true, kind: "skillet", image: T("skillet-chocolate-chip"),
    description: { el: "Συνοδεύεται από παγωτό σε κυπελάκι small της επιλογής σου (2 μπάλες).", en: "Served with a small cup of ice cream of your choice (2 scoops)." } },
  { slug: "skillet-peanut-butter", category: "skillet", name: "Skillet Peanut Butter with Ice Cream", price: 9.5, kind: "skillet", image: T("skillet-peanut-butter"),
    description: { el: "Μεγάλο cookie με φυστικοβούτυρο, κομμάτια βελγικής σοκολάτας και μικρό κυπελάκι παγωτού.", en: "A big peanut butter cookie with Belgian chocolate chunks and a small cup of ice cream." } },
  { slug: "skillet-chocolate-chip-double", category: "skillet", name: "Skillet Chocolate Chip Cookie Double Ice Cream", price: 11.5, kind: "skillet", image: T("skillet-chocolate-chip"),
    description: { el: "Συνοδεύεται από παγωτό σε κυπελάκι big της επιλογής σου (4 μπάλες).", en: "Served with a big cup of ice cream of your choice (4 scoops)." } },
  { slug: "skillet-peanut-butter-double", category: "skillet", name: "Skillet Peanut Butter Double Ice Cream", price: 12.5, kind: "skillet", image: T("skillet-peanut-butter"),
    description: { el: "Μεγάλο cookie με φυστικοβούτυρο, κομμάτια βελγικής σοκολάτας και μεγάλο κυπελάκι παγωτού (4 μπάλες).", en: "A big peanut butter cookie with Belgian chocolate chunks and a big cup of ice cream (4 scoops)." } },
  { slug: "triple-chocolate-skillet", category: "skillet", name: "Triple Chocolate Skillet with Ice Cream", price: 9.5, kind: "skillet", image: T("skillet-triple-chocolate"),
    description: { el: "Μεγάλο cookie σε ταψάκι με λευκή, μαύρη και γάλακτος σοκολάτα.", en: "A big skillet cookie with white, dark and milk chocolate." } },
  { slug: "triple-chocolate-skillet-double", category: "skillet", name: "Triple Chocolate Skillet Double Ice Cream", price: 12.5, kind: "skillet", image: T("skillet-triple-chocolate-double"),
    description: { el: "Μεγάλο cookie σε ταψάκι με λευκή, μαύρη και γάλακτος σοκολάτα.", en: "A big skillet cookie with white, dark and milk chocolate." } },

  /* ---------------- VEGAN ---------------- */
  { slug: "vegan-chocolate-chip", category: "vegan", name: "Vegan Chocolate Chip (V)", price: 2.5, dietary: ["vegan"], kind: "cookie", image: T("vegan-chocolate-chip"),
    description: { el: "Chocolate chip cookie χωρίς βούτυρο και αυγό, με ηλιέλαιο και γάλα αμυγδάλου.", en: "A chocolate chip cookie without butter or egg, made with sunflower oil and almond milk." } },
  { slug: "oatmeal-raisin-no-sugar", category: "vegan", name: "Oatmeal Raisin Cookie", nameEl: "Oatmeal Raisin Cookie Χωρίς Ζάχαρη", price: 3.0, dietary: ["no-added-sugar"], kind: "cookie", image: T("oatmeal-raisin-no-sugar"),
    description: { el: "Με βρώμη, σταφίδες, αμυγδαλοβούτυρο και κανέλα. Δεν περιέχει ζάχαρη.", en: "With oats, raisins, almond butter and cinnamon. Contains no sugar." } },

  /* ---------------- MINI ---------------- */
  { slug: "mini-cookies", category: "mini", name: "Mini Cookies", nameEl: "Μικρά Cookies για Κέρασμα", price: 25.0, kind: "mini", image: P("products/mini-cookies-box"), photo: P("products/mini-cookies-box"),
    facts: [{ el: "Ελάχιστη παραγγελία 20 cookies", en: "Minimum order 20 cookies" }],
    description: { el: "Μικρά cookies για κέρασμα. Επίλεξε τη γεύση που επιθυμείς.", en: "Mini cookies for treating others. Choose the flavour you like." } },

  /* ---------------- ICE CREAM ---------------- */
  { slug: "ice-cream-500g", category: "ice-cream", name: "Ice Cream 500 g", nameEl: "Παγωτό 500 g", price: 13.5, kind: "tub", image: T("ice-cream"), photo: P("products/ice-cream-cup") },
  { slug: "ice-cream-1kg", category: "ice-cream", name: "Ice Cream 1 kg", nameEl: "Παγωτό 1 kg", price: 24.0, kind: "tub", image: T("ice-cream"), photo: P("products/ice-cream-cup") },
  { slug: "ice-cream-small-cup", category: "ice-cream", name: "Ice Cream Small Cup", nameEl: "Παγωτό Small Cup", price: 3.8, kind: "scoop", image: T("ice-cream"), photo: P("products/ice-cream-cup"),
    facts: [{ el: "2 μπάλες", en: "2 scoops" }] },
  { slug: "ice-cream-big-cup", category: "ice-cream", name: "Ice Cream Big Cup", nameEl: "Παγωτό Big Cup", price: 7.2, kind: "scoop", image: T("ice-cream"), photo: P("products/ice-cream-cup") },

  /* ---------------- MILKSHAKES ---------------- */
  { slug: "milkshake-chocolate-chip", category: "milkshakes", name: "Chocolate Chip Milkshake", price: 5.6, kind: "shake", image: T("milkshake-chocolate-chip") },
  { slug: "milkshake-peanut-butter", category: "milkshakes", name: "Peanut Butter Choc Chunk Milkshake", price: 5.6, kind: "shake", image: T("milkshake-peanut-butter") },
  { slug: "milkshake-pistachio-salted-caramel", category: "milkshakes", name: "Pistachio Salted Caramel Milkshake", price: 5.5, kind: "shake", image: T("milkshake-pistachio-salted-caramel") },
  { slug: "milkshake-red-velvet", category: "milkshakes", name: "Red Velvet Milkshake", price: 5.6, isNew: true, kind: "shake", image: T("milkshake-red-velvet") },

  /* ---------------- HOT COOKIE DRINKS ---------------- */
  { slug: "hot-red-velvet", category: "cookie-drinks", name: "Hot Drink Red Velvet", nameEl: "Ζεστό Ρόφημα Red Velvet", price: 3.8, kind: "drink", image: T("hot-red-velvet") },
  { slug: "hot-chocolate-chip", category: "cookie-drinks", name: "Hot Drink Chocolate Chip", nameEl: "Ζεστό Ρόφημα Chocolate Chip", price: 3.8, kind: "drink", image: T("hot-chocolate-chip") },
  { slug: "hot-peanut-butter", category: "cookie-drinks", name: "Hot Drink Peanut Butter", nameEl: "Ζεστό Ρόφημα Peanut Butter", price: 4.0, kind: "drink", image: T("hot-peanut-butter") },

  /* ---------------- COFFEE ---------------- */
  { slug: "espresso", category: "coffee", name: "Espresso", price: 1.7, kind: "drink", image: T("espresso") },
  { slug: "macchiato", category: "coffee", name: "Macchiato", price: 1.9, kind: "drink", image: T("macchiato") },
  { slug: "filter-coffee", category: "coffee", name: "Premium Filter Coffee", price: 2.0, kind: "drink", image: T("filter-coffee") },
  { slug: "cappuccino", category: "coffee", name: "Cappuccino", price: 2.2, kind: "drink", image: T("cappuccino") },
  { slug: "freddo-espresso", category: "coffee", name: "Freddo Espresso", price: 2.3, kind: "drink", image: T("freddo-espresso") },
  { slug: "freddo-cappuccino", category: "coffee", name: "Freddo Cappuccino", price: 2.5, kind: "drink", image: T("freddo-cappuccino") },
  { slug: "latte", category: "coffee", name: "Latte", price: 2.7, kind: "drink", image: T("latte") },
  { slug: "iced-latte", category: "coffee", name: "Iced Latte", price: 2.8, kind: "drink", image: T("iced-latte") },

  /* ---------------- COLD DRINKS ---------------- */
  { slug: "ice-tea-lemon-bergamot", category: "cold-drinks", name: "Ice Tea Lemon & Bergamot", nameEl: "Ice Tea Λεμόνι Περγαμόντο", price: 2.4, kind: "drink",
    description: { el: "Tearoute", en: "Tearoute" } },
  { slug: "ice-tea-peach", category: "cold-drinks", name: "Ice Tea Peach", nameEl: "Ice Tea Ροδάκινο", price: 2.4, kind: "drink", image: T("ice-tea-peach"),
    description: { el: "Tearoute", en: "Tearoute" } },

  /* ---------------- DRINKS ---------------- */
  { slug: "hot-chocolate", category: "drinks", name: "Hot Chocolate", nameEl: "Ζεστή Σοκολάτα", price: 3.0, kind: "drink", image: T("hot-chocolate") },
  { slug: "tearoute", category: "drinks", name: "TeaRoute", price: 2.2, kind: "drink",
    description: { el: "Επίλεξε τη γεύση που επιθυμείς.", en: "Choose the flavour you like." } },
  { slug: "water", category: "drinks", name: "Bottled Water 0.5 l", nameEl: "Εμφιαλωμένο Νερό 0,5 l", price: 0.5, kind: "drink", image: T("water") },

  /* ---------------- COMBOS ---------------- */
  { slug: "combo-5-plus-1", category: "combos", name: "5 Cookies + 1 Cookie FREE", nameEl: "5 Cookies + 1 Cookie ΔΩΡΟ!", price: 10.0, compareAtPrice: 12.0, priceFrom: true, popular: true, kind: "combo", image: P("brand/peach-six"), photo: P("brand/peach-six"),
    description: { el: "Με 5 cookies της επιλογής σου, παίρνεις ακόμη 1 cookie ΔΩΡΟ!", en: "Choose 5 cookies and get 1 more cookie FREE!" } },
  { slug: "combo-8-plus-2", category: "combos", name: "8 Cookies + 2 Cookies FREE", nameEl: "8 Cookies + 2 Cookies ΔΩΡΟ!", price: 16.0, compareAtPrice: 20.0, priceFrom: true, kind: "combo", image: P("brand/peach-ten"), photo: P("brand/peach-ten"),
    description: { el: "Με 8 cookies της επιλογής σου, παίρνεις ακόμη 2 cookies ΔΩΡΟ!", en: "Choose 8 cookies and get 2 more cookies FREE!" } },
  { slug: "combo-4-cookies-big-cup", category: "combos", name: "4 Cookies + 1 Big Cup Ice Cream −30%", price: 10.64, compareAtPrice: 15.2, priceFrom: true, kind: "combo", image: P("products/ice-cream-cup"), photo: P("products/ice-cream-cup"),
    description: { el: "Επίλεξε 4 cookies και ένα μεγάλο κύπελλο παγωτό, με −30%.", en: "Choose 4 cookies and a big cup of ice cream, 30% off." } },
  { slug: "combo-6-cookies-500g", category: "combos", name: "6 Cookies + 500 g Ice Cream −30%", nameEl: "6 Cookies + 500 g Παγωτό −30%", price: 17.85, compareAtPrice: 25.5, priceFrom: true, kind: "combo", image: P("brand/peach-six"), photo: P("brand/peach-six"),
    description: { el: "Επίλεξε 6 cookies και 500 g παγωτό, με −30%.", en: "Choose 6 cookies and 500 g of ice cream, 30% off." } },
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

export const displayName = (p: Product, locale: Locale) => (locale === "el" && p.nameEl ? p.nameEl : p.name);
