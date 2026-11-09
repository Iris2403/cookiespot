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
| `npm run audit:deps` | `npm audit` for production dependencies |

## Live preview on GitHub Pages

`.github/workflows/pages.yml` publishes a **static preview** to `https://iris2403.github.io/cookiespot/` on every push to `main`.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Then push to `main`, or run the workflow from the Actions tab.

The Pages copy is built with `STATIC_EXPORT=1` (`output: "export"`, base path `/cookiespot`). Because there is no server:

- The contact form shows the "please call / Instagram" message instead of sending.
- `/` always opens the Greek site; the language switch still works.
- No custom security headers are sent (Pages can't set them).

For the full site, deploy the normal build to a Node host such as Vercel.

## Design system (photography-led, strictly 2D)

No Three.js, WebGL, 3D models, perspective or fake-depth effects. Motion is CSS plus small `IntersectionObserver` scripts and respects `prefers-reduced-motion`.

The design is built from the brand's real touchpoints, taken from the photos supplied by the owner:

| Element | Source | Use on the site |
| --- | --- | --- |
| Hand-lettered logo | Profile picture / boxes | Traced to vector: `public/brand/logo.svg` and `logo-white.svg`. Used in the header, footer, favicon and sharing image |
| Logo-printed wrapping paper | Instagram product shots | `public/brand/pattern.svg` (mobile menu) and `pattern-band.svg` (one row with equal space above and below), used for the band under the hero and the footer edge |
| Box orange `#ED7033` | Packaging | Buttons and accents. Button text is deep brown `#2A1409` for contrast |
| Logo brown `#542B16` | Logo | Text colour |
| Studio peach `#FCBD8E` | Wolt studio shots | Offers section and bento tiles, so the studio photos blend in |
| Shop terracotta `#5D2821` | Shop interior | "We bake it personally" story section |
| "We bake it personally" | Printed inside the boxes | Story headline in a hand-lettered face (Caveat), and in the hero photo |

- **Type:**
  - Alegreya for headings: a warm serif with Greek glyphs that sits well beside the hand-lettered logo.
  - Manrope for text and UI.
- **Sections:**
  1. Hero: the campaign photo in an arch, plus a peach studio shot
  2. Logo-paper band
  3. Favourites: large photo cards
  4. Menu: every product with its real Wolt photo
  5. "More than just a cookie": a bento grid of real photos
  6. Story: terracotta, with shop and counter photos
  7. Offers: peach, with the studio shots
  8. Gallery and full-screen viewer
  9. Reviews
  10. Location: a storefront photo; the Google map loads only when clicked
  11. Contact and footer

### Photo assets

The 57 images in `public/images/` were cropped from screenshots supplied by the owner:
- Wolt app product photos: `thumbs/`, `brand/peach-*`, `products/ice-cream-cup`, `products/mini-cookies-box`.
- Instagram posts: product feature photos, `brand/we-bake-it-personally`, `brand/cookie-stack`, and the gallery.
- Press photos from lifo.gr and ethnos.gr: `brand/storefront`, `brand/counter`, `gallery/box-of-six`.

All phone UI (status bars, buttons, captions) was removed. Wolt's close button was edited out of the 10-cookie studio shot (`peach-ten`); the 6-cookie shot (`peach-six`) was cropped to drop it.

**Confirm usage rights for the press photos** with their photographers or publications before launch, or swap in the brand's own originals. Higher-resolution originals will also look sharper: the menu thumbnails are only about 236px wide. Replacing a file with the same name is enough.

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
src/content/media.ts      ← brand photo slots (hero, shop, packaging, close-up)
src/proxy.ts              ← "/" → /el or /en based on Accept-Language
```

### Editing the menu

Edit `src/content/menu.ts`. That is the only place prices live; every card, dialog, offer and the JSON-LD menu read from it.

- Set `price: null` when you can't verify a price. The UI then shows "See price on Wolt".
- Only write `description`, `facts` and `dietary` that appear on the official listing.
- Add `woltUrl` to deep-link a product to its own Wolt item page. Otherwise links go to the store page.
- Add `image: "/images/products/<slug>.webp"` once you have **authorised product photography**. `next/image` then serves AVIF/WebP in responsive sizes and replaces the "Photo coming soon" placeholder.
- Update `MENU_LAST_VERIFIED`. It is shown to visitors.

### Photography

Products use `image` (menu photo) and optionally `photo` (large editorial photo) in `src/content/menu.ts`. Brand photos are in `src/content/media.ts` and the gallery in `src/content/gallery.ts`. Paths are under `/public`. A product without a photo falls back to a small ink drawing.

### Logo

`public/brand/logo.svg` is a vector trace of the brand's hand-lettered logo. If the brand has the original vector file, replace it, keeping the same file name and a similar aspect ratio (about 1838×1200).

## Ordering integration

- Every "Order" call to action goes through `orderUrl()` in `menu.ts`. It returns the Wolt store URL in the page's language, or the item's `woltUrl` when one is set.
- The site doesn't call or scrape any Wolt API.
- **Ordering:** every "Order" button opens one chooser with **Wolt** and **e-food** (`src/components/OrderChooser.tsx`; URLs in `src/content/business.ts`). Without JavaScript the buttons link straight to Wolt. Prices are identical on both platforms.
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

- **Menu (`src/content/menu.ts`):**
  - 52 products in 13 categories, transcribed from screenshots of the live Wolt app supplied by the owner on 2026-11-09.
  - Names, Greek descriptions and prices all come from those screenshots.
  - Where Wolt cut a description short, the text stops at what was visible.
  - English descriptions are translations.
- **Combos:** prices depend on the cookies chosen, so they are shown as "from".
- **Address and phone:** from the Wolt and Tripadvisor listings.
- **Hours:** from the Wolt listing. `business.verifiedAgainstGoogleProfile` is `false`. Confirm the hours against the Google Business Profile, then flip it.
- **Reviews:** a carousel of 5 genuine 5-star Google reviews, copied word for word from Google Maps screenshots supplied by the owner (`src/content/reviews.ts`). Reviewers appear by initials only, to protect their data; one review is shortened at the owner's request. Dates are left out because Google only shows relative dates ("3 months ago"), which would go out of date.
- **Not on the site:**
  - Cookie Dippers: not in Wolt's current categories.
  - Strawberry cookie and the frosted cookie cake: seen on Instagram but not on Wolt. The strawberry cookie appears only as a gallery photo.
