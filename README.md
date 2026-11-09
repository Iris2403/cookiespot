# The Cookie Spot — website

Bilingual (Greek / English) website for **The Cookie Spot**, a cookie and dessert shop at Leof. Kifisias 129, Athens.
Ordering goes to the brand's existing [Wolt store](https://wolt.com/el/grc/athens/restaurant/cookie-spot). There is no cart or checkout on this site.

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /el or /en
npm run build && npm start
```

| Script | What it does |
| --- | --- |
| `npm run lint` / `npm run typecheck` | ESLint (Next config) / TypeScript |
| `npm test` | Unit tests: form validation, spam checks, rate limiter, opening hours, catalogue integrity |
| `npm run test:e2e` | Browser checks against a running server (`BASE_URL`, needs Playwright) |
| `npm run illustrations` | Re-rasterises product illustrations to WebP (run after changing menu art) |
| `npm run audit:deps` | `npm audit` for production dependencies |

## Live preview on GitHub Pages

`.github/workflows/pages.yml` publishes a **static preview** to `https://iris2403.github.io/cookiespot/` on every push to `main`.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Then push to `main`, or run the workflow from the Actions tab.

The Pages copy is built with `STATIC_EXPORT=1` (`output: "export"`, base path `/cookiespot`). Because there is no server:

- The contact form shows the "please call / Instagram" message instead of sending.
- `/` always opens the Greek site; the language switch still works.
- No custom security headers are sent (Pages can't set them).

For the full site, deploy the normal build to a Node host such as Vercel.

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript.** Pages are pre-rendered at build time (`/el`, `/en`, `/el/privacy`, `/en/privacy`).
- **Plain CSS** with design tokens (`src/app/globals.css`). No UI or animation libraries.
- **Fonts:** Noto Serif Display (headlines, 800/900 + italic) and Commissioner (UI/body), both with Greek glyphs, self-hosted via `next/font`.
- **Runtime dependencies:** `next`, `react`, `react-dom` only.

## Where things live

```
src/content/menu.ts       ← THE product catalogue: categories, products, prices, MENU_LAST_VERIFIED
src/content/business.ts   ← address, phone, hours, links (each with its source and lastVerified)
src/content/reviews.ts    ← verified review quotes (ships empty, see below)
src/content/gallery.ts    ← gallery entries
src/i18n/dictionaries.ts  ← all UI copy, EL + EN
src/components/           ← sections & interactive pieces
src/app/api/contact/      ← contact form endpoint
src/app/art/[file]/       ← SVG source of each product illustration
src/proxy.ts              ← "/" → /el or /en based on Accept-Language
```

### Editing the menu

Edit `src/content/menu.ts`. That is the only place prices live; every card, dialog, offer and the JSON-LD menu read from it.

- Set `price: null` when you can't verify a price. The UI then shows "See price on Wolt".
- Only write `description`, `facts` and `dietary` that appear on the official listing.
- Add `woltUrl` to deep-link a product to its own Wolt item page. Otherwise links go to the store page.
- Add `image: "/images/products/<slug>.webp"` once you have **authorised product photography**. `next/image` then serves AVIF/WebP in responsive sizes and replaces the illustration.
- Update `MENU_LAST_VERIFIED`. It is shown to visitors.

### Product imagery

No brand photography could be downloaded during this build (see Limitations). Each product therefore has an **art-directed illustration**: a textured, lit SVG generated from its `art` spec (`src/components/ProductArt.tsx`). The illustrations are pre-rasterised to `public/illustrations/<slug>-{480,960}.webp` so phones decode a small WebP instead of painting heavy SVG filters. The dialog labels them as illustrations.

To regenerate the WebPs after changing `art` specs:

```bash
npm run build && npm start   # terminal 1 (port 3000)
npm run illustrations        # terminal 2 (ART_BASE_URL to override the server URL)
```

### Logo

`src/components/Wordmark.tsx` is a **typographic placeholder**. Add the official logo at `public/brand/logo.svg` and set `OFFICIAL_LOGO` in that file.

## Ordering integration

- Every "Order" call to action goes through `orderUrl()` in `menu.ts`. It returns the Wolt store URL in the page's language, or the item's `woltUrl` when one is set.
- The site doesn't call or scrape any Wolt API.
- Phone ordering and enquiries use `tel:+302106983637` links (header on mobile, sticky bottom bar, location section, contact section).
- Directions use a Google Maps directions URL. The embedded map is **click-to-load**, so Google is not contacted until the visitor asks for the map.

## Required external configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Yes, in production** | Canonical URLs, sitemap, Open Graph, JSON-LD. Defaults to `http://localhost:3000`. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | For the contact form | Delivery through [Resend](https://resend.com) (server-side only). If they are unset, the form answers with a friendly "use phone/Instagram" message (HTTP 503). |

Also recommended:

- Put platform-level rate limiting (Vercel Firewall, Cloudflare, etc.) in front of `POST /api/contact`. The built-in limiter is per server instance.
- Make sure your host sets `x-real-ip` / `x-forwarded-for` itself. The rate limiter keys on them.
- Add the production domain to Google Search Console and submit `/sitemap.xml`.

## Security

- **Headers** (`next.config.ts`): CSP (`default-src 'self'`, no third-party scripts, `frame-src` limited to Google Maps, `object-src 'none'`, `frame-ancestors 'none'`, `form-action 'self'`), HSTS, `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, COOP.
  - Trade-off: the pages are static for speed, so the CSP keeps `'unsafe-inline'` for scripts (needed by Next.js's inline bootstrap). Moving to per-request nonces would mean dynamic rendering.
  - Mitigations: no user content is ever rendered as HTML, and JSON-LD output is `<`-escaped.
- **Contact API:**
  - Same-origin check (CSRF), JSON content type only, 10 KB body cap.
  - Shared client/server validation and control-character stripping.
  - Spam defences: honeypot field, minimum fill time, link-count heuristic.
  - Rate limit of 5 per 10 minutes per IP.
  - Emails go out as plain text only, with a timeout on the provider call and generic error responses (no internals leaked).
  - The secret stays server-side.
- **Privacy:** no analytics, trackers or tracking cookies. The privacy notice is at `/el/privacy` and `/en/privacy`, and the consent checkbox links to it.

## SEO

- Per-locale titles and descriptions.
- `hreflang` alternates and canonical URLs.
- Open Graph image generated at build time.
- `sitemap.xml` and `robots.txt`.
- Semantic landmarks and heading order.
- `Bakery` JSON-LD built **only** from verified fields: address, phone, hours, menu with prices and Instagram. Ratings, reviews and geo-coordinates are deliberately omitted.

## Data provenance (read before launch)

During the build, the brand's Wolt, Instagram and Google pages could **not be opened directly** from the build environment (network policy). The data was gathered from search-engine snapshots of the Wolt listing and the Tripadvisor listing on 2026-11-09:

- **Address, phone, opening hours:** from the Wolt listing and Tripadvisor. `business.verifiedAgainstGoogleProfile` is `false`. Confirm against the Google Business Profile, then flip it.
- **Menu:** 29 items in 11 categories, with prices where the snapshot showed them. Some prices are `null`: Blueberry Lemon, both skillets, Cookie Dippers, two milkshakes.
- **Not verified:**
  - Item lists for Hot Drinks, Cookie Drinks and Coffee. Those categories show a "browse on Wolt" card.
  - The **Dubai Chocolate Cookie** wasn't found in the listing snapshots, so it is not shown.
- **Reviews:** no review text could be verified, so none is quoted. The section links to the live Google and Wolt reviews. Add genuine quotes to `src/content/reviews.ts` (author, date, source URL) and they render automatically.
