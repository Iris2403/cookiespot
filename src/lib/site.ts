import type { Locale } from "@/content/menu";

/** Canonical origin of the deployed site. Configure NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const localePath = (locale: Locale, path = "") => `/${locale}${path}`;
export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;
