import type { Localized } from "./menu";

/**
 * Brand photography used across the page. Files live in /public/images (cropped from the
 * brand's own Wolt, Instagram and press photos supplied by the owner). Swap a `src` to change
 * a photo; keep `width`/`height` in sync (they prevent layout shift).
 */
export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: Localized;
}

const img = (src: string, width: number, height: number, el: string, en: string): Photo => ({ src: `/images/${src}.webp`, width, height, alt: { el, en } });

export const media = {
  hero: img("brand/we-bake-it-personally", 923, 1122, "Χέρια κρατούν στοίβα από Cookies & Cream μπροστά σε πορτοκαλί φόντο με τη φράση «We bake it personally»", "Hands holding a stack of Cookies & Cream cookies against orange, with the line “We bake it personally”"),
  peachSix: img("brand/peach-six", 792, 462, "Έξι cookies σε πορτοκαλί φόντο με κομμάτια σοκολάτας και ξηρούς καρπούς", "Six cookies on a peach background with chocolate drops and nuts"),
  peachTen: img("brand/peach-ten", 923, 462, "Δέκα διαφορετικά cookies σε δύο σειρές", "Ten different cookies in two rows"),
  storefront: img("brand/storefront", 923, 614, "Η βιτρίνα του The Cookie Spot στη Λεωφ. Κηφισίας 129", "The Cookie Spot shop window on Leof. Kifisias 129"),
  counter: img("brand/counter", 923, 614, "Ο πάγκος με φρεσκοψημένα cookies και χειρόγραφες ετικέτες τιμών", "The counter with freshly baked cookies and handwritten price cards"),
  stack: img("brand/cookie-stack", 923, 794, "Στοίβα από cookies κομμένα στη μέση, με λιωμένη σοκολάτα", "A stack of halved cookies with melted chocolate inside"),
  iceCream: img("products/ice-cream-cup", 750, 492, "Κύπελλο παγωτού με το λογότυπο The Cookie Spot", "An ice cream cup with The Cookie Spot logo"),
  brookie: img("products/classic-brookie-box", 923, 1230, "Classic Brookie στη φόρμα του, μπροστά από τα κουτιά The Cookie Spot", "A Classic Brookie in its tray in front of The Cookie Spot boxes"),
} satisfies Record<string, Photo>;
