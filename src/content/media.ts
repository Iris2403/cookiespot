import type { Localized } from "./menu";
import type { SlotKind } from "@/components/PhotoSlot";

/**
 * Brand photography slots (hero, story, gallery).
 *
 * Add ONLY photographs owned or authorised by The Cookie Spot (e.g. exported from the brand's
 * own Instagram archive or a commissioned shoot). Put files in /public/images/brand/ and set `src`.
 * Until then each slot renders a clearly labelled flat placeholder; `brief` describes the shot
 * that belongs there (shown on large placeholders, and useful as a shot list for a photographer).
 */
export interface MediaSlot {
  id: string;
  src?: string;
  alt: Localized;
  brief: Localized;
  kind: SlotKind;
  colors: { base: string; chips: string[]; bg: string; accent?: string };
}

const dough = "#D9A066";
const choc = ["#3D2618", "#6B3E22"];

export const media: Record<"hero" | "shop" | "packaging" | "closeup", MediaSlot> = {
  hero: {
    id: "hero",
    alt: { el: "Φρεσκοψημένα cookies της The Cookie Spot", en: "Freshly baked cookies from The Cookie Spot" },
    brief: { el: "Cutout: στοίβα από NY-style cookies", en: "Cutout: a stack of NY-style cookies" },
    kind: "ny-cookie",
    colors: { base: dough, chips: choc, bg: "#FFFFFF" },
  },
  shop: {
    id: "shop",
    alt: { el: "Το κατάστημα στη Λεωφ. Κηφισίας 129", en: "The shop at Leof. Kifisias 129" },
    brief: { el: "Το πορτοκαλί εσωτερικό του καταστήματος", en: "The orange shop interior" },
    kind: "shop",
    colors: { base: dough, chips: choc, bg: "#E9D8C5" },
  },
  packaging: {
    id: "packaging",
    alt: { el: "Η συσκευασία της The Cookie Spot", en: "The Cookie Spot packaging" },
    brief: { el: "Συσκευασία / κουτί με cookies", en: "Packaging / a box of cookies" },
    kind: "packaging",
    colors: { base: dough, chips: choc, bg: "#FFF8EF" },
  },
  closeup: {
    id: "closeup",
    alt: { el: "Cookie σπασμένο στη μέση, από κοντά", en: "A cookie broken in half, close-up" },
    brief: { el: "Close-up: cookie σπασμένο στη μέση", en: "Close-up: a cookie broken in half" },
    kind: "cookie",
    colors: { base: dough, chips: choc, bg: "#3D2618" },
  },
};
