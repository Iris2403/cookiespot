import type { Localized } from "./menu";

/**
 * Gallery photos. ONLY authorised brand photography (files in /public/images/gallery/).
 * The gallery section appears automatically once at least one photo is listed here; until then
 * the page shows an Instagram invitation instead of empty frames.
 */
export interface GalleryItem {
  id: string;
  src: string;
  alt: Localized;
  shape: "tall" | "wide" | "square" | "hero";
}

export const gallery: GalleryItem[] = [];
