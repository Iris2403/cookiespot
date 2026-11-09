import type { Localized } from "./menu";
import type { SlotKind } from "@/components/PhotoSlot";

/**
 * Gallery — a shot list for the brand's own photography. Each entry renders a labelled
 * placeholder until `src` (a path under /public/images/gallery/) is set.
 */
export interface GalleryItem {
  id: string;
  src?: string;
  alt: Localized;
  shape: "tall" | "wide" | "square" | "hero";
  kind: SlotKind;
  colors: { base: string; chips: string[]; bg: string; accent?: string };
}

const dough = "#D9A066";
const choc = ["#3D2618", "#6B3E22"];

export const gallery: GalleryItem[] = [
  { id: "g1", shape: "hero", kind: "ny-cookie", alt: { el: "NY-style cookies στον πάγκο", en: "NY-style cookies on the counter" }, colors: { base: dough, chips: ["#8E9C6B", "#FFF8EF", "#3D2618"], bg: "#ED7033" } },
  { id: "g2", shape: "tall", kind: "shop", alt: { el: "Το εσωτερικό του καταστήματος", en: "Inside the shop" }, colors: { base: dough, chips: choc, bg: "#E9D8C5" } },
  { id: "g3", shape: "square", kind: "brookie", alt: { el: "Brookie σε κομμάτια", en: "Brookie slices" }, colors: { base: dough, chips: ["#3D2618", "#C7772E"], bg: "#FFF8EF", accent: "#C7772E" } },
  { id: "g4", shape: "tall", kind: "shake", alt: { el: "Milkshake", en: "A milkshake" }, colors: { base: "#E8B8A5", chips: ["#C7655A"], bg: "#FFFFFF", accent: "#ED7033" } },
  { id: "g5", shape: "wide", kind: "skillet", alt: { el: "Skillet cookie με παγωτό", en: "Skillet cookie with ice cream" }, colors: { base: dough, chips: choc, bg: "#3D2618" } },
  { id: "g6", shape: "square", kind: "packaging", alt: { el: "Η συσκευασία", en: "The packaging" }, colors: { base: dough, chips: choc, bg: "#A9B68B" } },
  { id: "g7", shape: "square", kind: "mini", alt: { el: "Mini cookies", en: "Mini cookies" }, colors: { base: dough, chips: ["#3D2618", "#C7655A", "#8E9C6B"], bg: "#E8B8A5" } },
  { id: "g8", shape: "wide", kind: "combo", alt: { el: "Κουτί με cookies", en: "A box of cookies" }, colors: { base: dough, chips: ["#3D2618", "#8E9C6B", "#C7772E"], bg: "#E9D8C5" } },
];
