/**
 * Customer reviews shown in the Reviews carousel.
 *
 * ONLY genuine reviews from Google (the brand's Google Business Profile), copied word for word.
 * Fill in the reviewer's name and date exactly as Google shows them. Do not edit wording,
 * invent reviews or add star ratings you cannot see on the source.
 *
 * The two entries below are short quotes from Google reviews as republished by Restaurant Guru
 * (reviewer names not shown there). Replace/extend them with full reviews copied from Google Maps.
 */
export interface Review {
  text: string;
  /** Reviewer display name as shown on Google (leave empty if not shown by the source). */
  author?: string;
  lang: "el" | "en";
  /** As shown on the source, e.g. "2025-03" or "3 months ago". */
  date?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  source: "Google";
  /** Where the quote was taken from. */
  url: string;
  via?: string;
}

export const reviews: Review[] = [
  { text: "The best cookies!!!", lang: "en", source: "Google", via: "Restaurant Guru", url: "https://restaurantguru.com/The-Cookie-Spot-Athens" },
  { text: "The best cookie spot in town!", lang: "en", source: "Google", via: "Restaurant Guru", url: "https://restaurantguru.com/The-Cookie-Spot-Athens" },
];
