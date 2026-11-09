import type { Localized } from "./menu";

/**
 * Gallery entries. Replace `productSlug` illustrations with authorised photography by setting
 * `image` (path under /public, ideally 1600px+ wide, WebP/AVIF/JPEG) — e.g. images exported
 * from the brand's own Instagram archive with the owner's permission.
 */
export interface GalleryItem {
  id: string;
  productSlug: string;
  image?: string;
  alt: Localized;
  shape: "tall" | "wide" | "square" | "hero";
  crop?: string;
}

export const gallery: GalleryItem[] = [
  { id: "g1", productSlug: "pistachio-cookie", shape: "hero", alt: { el: "Pistachio NY-style cookie από κοντά", en: "Close-up of the Pistachio NY-style cookie" } },
  { id: "g2", productSlug: "chocolate-chip-skillet-ice-cream", shape: "tall", alt: { el: "Skillet cookie με παγωτό", en: "Skillet cookie topped with ice cream" } },
  { id: "g3", productSlug: "caramel-brookie", shape: "square", alt: { el: "Caramel Brookie σε κομμάτι", en: "A slice of Caramel Brookie" } },
  { id: "g4", productSlug: "pistachio-salted-caramel-milkshake", shape: "tall", alt: { el: "Milkshake Pistachio Salted Caramel", en: "Pistachio Salted Caramel milkshake" } },
  { id: "g5", productSlug: "triple-choco-praline", shape: "wide", crop: "90 70 220 160", alt: { el: "Η υφή του Triple Choco-Praline", en: "Texture of the Triple Choco-Praline" } },
  { id: "g6", productSlug: "mini-cookies", shape: "wide", alt: { el: "Mini cookies για μοίρασμα", en: "Mini cookies for sharing" } },
  { id: "g7", productSlug: "cookie-dippers", shape: "square", alt: { el: "Cookie Dippers με τρία dips", en: "Cookie Dippers with three dips" } },
  { id: "g8", productSlug: "combo-8-plus-2", shape: "wide", alt: { el: "Κουτί με cookies", en: "A box of cookies" } },
];
