import type { Locale } from "@/content/menu";

/** Canonical origin of the deployed site. Configure NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const localePath = (locale: Locale, path = "") => `/${locale}${path}`;
export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;

/** Base path the site is served under ("" normally, e.g. "/cookiespot" on GitHub Pages). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
/** Prefix for raw (non-next/link, non-next/image) URLs to files in /public or static routes. */
export const asset = (path: string) => `${BASE_PATH}${path}`;
/** True in the static GitHub Pages build (no server, so no contact API). */
export const IS_STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
