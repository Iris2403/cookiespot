import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["el", "en"] as const;

/** Pick Greek or English from Accept-Language; Greek is the default audience. */
function negotiate(header: string | null): (typeof LOCALES)[number] {
  if (!header) return "el";
  const prefs = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().slice(0, 2), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const p of prefs) if (p.lang === "el" || p.lang === "en") return p.lang;
  return "el";
}

/** Redirect locale-less URLs (/, /privacy, …) to the right language prefix. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const url = req.nextUrl.clone();
  url.pathname = `/${negotiate(req.headers.get("accept-language"))}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.redirect(url, 307);
  res.headers.set("Vary", "Accept-Language");
  return res;
}

export const config = {
  // Skip API, Next internals, metadata files and anything with a file extension.
  matcher: ["/((?!api|_next|images|brand|favicon|icon|apple-icon|robots.txt|sitemap.xml|manifest.webmanifest|.*\\..*).*)"],
};
