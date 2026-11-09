/**
 * Customer reviews.
 *
 * ONLY add genuine reviews copied from a verifiable public source (e.g. the Google Business
 * Profile), with the reviewer's display name as shown, the original language, the date and a
 * link to the source. Do not edit wording beyond trimming with an ellipsis. Do not add ratings
 * or review counts that you cannot link to.
 *
 * The list ships empty: no review text could be verified at build time, so the Reviews section
 * links visitors to the live review pages instead of quoting anything.
 */
export interface Review {
  author: string;
  text: string;
  lang: "el" | "en";
  date: string; // ISO yyyy-mm-dd
  source: "Google" | "Wolt" | "Tripadvisor";
  url: string;
}

export const reviews: Review[] = [];
