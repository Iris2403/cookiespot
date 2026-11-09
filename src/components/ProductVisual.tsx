import Image from "next/image";
import type { CSSProperties } from "react";
import type { Product } from "@/content/menu";

interface Props {
  product: Product;
  sizes?: string;
  priority?: boolean;
  /** Accessible text. Omit for decorative usage (alt=""). */
  label?: string;
  /** Close-up crop of the 400×400 illustration: "x y w h" (ignored for photos). */
  crop?: string;
  className?: string;
}

/**
 * Product imagery.
 * - `product.image` (authorised photography) → next/image: AVIF/WebP, responsive srcset, lazy by default.
 * - otherwise → the art-directed illustration, pre-rasterised to WebP (public/illustrations,
 *   generated from /art/<slug>.svg by `npm run illustrations`), as a responsive lazy <img>.
 * Both fill their (positioned) parent; containers define the aspect ratio, so there is no layout shift.
 */
export function ProductVisual({ product, sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw", priority, label, crop, className }: Props) {
  if (product.image) {
    return <Image src={product.image} alt={label ?? ""} fill sizes={sizes} priority={priority} className={className} style={{ objectFit: "cover" }} />;
  }
  let style: CSSProperties | undefined;
  if (crop) {
    const [x, y, w, h] = crop.split(" ").map(Number);
    const scale = 400 / Math.min(w, h);
    style = { transform: `scale(${scale.toFixed(3)})`, transformOrigin: `${((x + w / 2) / 4).toFixed(1)}% ${((y + h / 2) / 4).toFixed(1)}%` };
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- pre-optimised static WebP with its own srcset
    <img
      src={`/illustrations/${product.slug}-960.webp`}
      srcSet={`/illustrations/${product.slug}-480.webp 480w, /illustrations/${product.slug}-960.webp 960w`}
      sizes={crop ? "(min-width: 960px) 50vw, 100vw" : sizes}
      alt={label ?? ""}
      width={960}
      height={960}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`art-img${className ? ` ${className}` : ""}`}
      style={style}
    />
  );
}
