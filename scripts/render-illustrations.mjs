/**
 * Rasterises the SVG product illustrations (/art/<slug>.svg, rendered by the app) into WebP
 * files in public/illustrations/ — <slug>-480.webp and <slug>-960.webp.
 *
 * Why: complex SVG filters (turbulence + lighting) are expensive to paint on mid-range phones;
 * a WebP decodes far faster and keeps LCP low. Run after changing menu art:
 *
 *   npm run build && npm start   # in another terminal
 *   npm run illustrations        # ART_BASE_URL defaults to http://localhost:3000
 *
 * Requires Playwright (dev-only, pre-installed in CI images) and sharp (bundled with Next.js).
 */
import { createRequire } from "node:module";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Playwright is resolved via require so a globally installed copy (NODE_PATH) also works.
const { chromium } = createRequire(import.meta.url)("playwright");

const base = process.env.ART_BASE_URL || "http://localhost:3000";
const outDir = fileURLToPath(new URL("../public/illustrations/", import.meta.url));

const html = await (await fetch(`${base}/sitemap.xml`)).text(); // fail fast if server is down
if (!html.includes("<urlset")) throw new Error(`No server at ${base}`);

// Slugs come from the generated art route list.
const menuSrc = await (await import("node:fs/promises")).readFile(new URL("../src/content/menu.ts", import.meta.url), "utf8");
const slugs = [...menuSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 960 }, deviceScaleFactor: 1 });
for (const slug of slugs) {
  await page.setContent(`<style>html,body{margin:0}img{display:block;width:960px;height:960px}</style><img src="${base}/art/${slug}.svg">`);
  await page.waitForFunction(() => document.images[0]?.complete);
  const png = await page.screenshot({ clip: { x: 0, y: 0, width: 960, height: 960 } });
  for (const size of [480, 960]) {
    const webp = await sharp(png).resize(size, size).webp({ quality: 80, effort: 6 }).toBuffer();
    await writeFile(`${outDir}${slug}-${size}.webp`, webp);
  }
  console.log("✓", slug);
}
await browser.close();
