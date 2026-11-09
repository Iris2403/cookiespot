import type { Localized } from "./menu";

/**
 * Brand photography (optional). The site is designed to look finished without photos; when an
 * authorised photo is added here (file in /public/images/brand/ + `src`), it appears in its spot.
 * `brief` describes the ideal shot (a shot list for a photographer).
 */
export interface MediaSlot {
  src?: string;
  alt: Localized;
  brief: Localized;
}

export const media: Record<"hero" | "shop", MediaSlot> = {
  hero: {
    alt: { el: "Φρεσκοψημένα cookies της The Cookie Spot", en: "Freshly baked cookies from The Cookie Spot" },
    brief: { el: "Cutout: στοίβα από NY-style cookies", en: "Cutout: a stack of NY-style cookies" },
  },
  shop: {
    alt: { el: "Το κατάστημα στη Λεωφ. Κηφισίας 129", en: "The shop at Leof. Kifisias 129" },
    brief: { el: "Το εσωτερικό του καταστήματος", en: "The shop interior" },
  },
};
