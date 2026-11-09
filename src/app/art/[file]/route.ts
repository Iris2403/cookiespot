import { createElement } from "react";
import { getProduct, products } from "@/content/menu";
import { ProductArt } from "@/components/ProductArt";

/**
 * Serves each product illustration as a static SVG file: /art/<slug>.svg
 * Pre-rendered at build time → tiny HTML, browser-cached, lazy-loadable via <img>.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ file: `${p.slug}.svg` }));
}

export async function GET(_req: Request, ctx: RouteContext<"/art/[file]">) {
  const { file } = await ctx.params;
  const product = file.endsWith(".svg") ? getProduct(file.slice(0, -4)) : undefined;
  if (!product) return new Response("Not found", { status: 404 });
  const { renderToStaticMarkup } = await import("react-dom/server");
  const svg = renderToStaticMarkup(createElement(ProductArt, { spec: product.art, seed: product.slug }));
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
