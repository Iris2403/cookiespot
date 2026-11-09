import type { Localized } from "./menu";

/** Gallery photos (the brand's own photography). Shape controls the masonry tile. */
export interface GalleryItem {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: Localized;
  shape: "tall" | "wide" | "square" | "hero";
}

const g = (id: string, src: string, width: number, height: number, shape: GalleryItem["shape"], el: string, en: string): GalleryItem => ({
  id, src: `/images/${src}.webp`, width, height, shape, alt: { el, en },
});

export const gallery: GalleryItem[] = [
  g("g1", "gallery/brookie-boxes", 923, 1137, "hero", "Classic και Caramel Brookie στα πορτοκαλί κουτιά «We bake it personally»", "Classic and Caramel Brookies in the orange “We bake it personally” boxes"),
  g("g2", "products/caramel-brookie-bite", 923, 1230, "tall", "Μπουκιά Caramel Brookie με dulce de leche", "A bite of Caramel Brookie with dulce de leche"),
  g("g3", "products/red-velvet-feature", 923, 827, "square", "Red Velvet cookie με λευκή σοκολάτα", "A Red Velvet cookie with white chocolate"),
  g("g4", "gallery/biscoff-rack", 923, 1237, "tall", "Biscoff cookies στη σχάρα", "Biscoff cookies on a cooling rack"),
  g("g5", "brand/counter", 923, 614, "wide", "Ο πάγκος του καταστήματος με φρέσκα cookies", "The shop counter with fresh cookies"),
  g("g6", "gallery/strawberry-cookie", 923, 1137, "square", "Strawberry cookie με μαρμελάδα φράουλα", "A strawberry cookie with strawberry jam"),
  g("g7", "products/mini-cookies-box", 923, 519, "wide", "Κουτί με mini cookies και dips", "A box of mini cookies with dips"),
  g("g8", "gallery/box-of-six", 923, 614, "square", "Κουτί με έξι διαφορετικά cookies", "A box of six different cookies"),
];
