import Image from "next/image";
import type { Product } from "@/content/menu";
import { asset } from "@/lib/site";
import { LineArt } from "./LineArt";

interface Props {
  product: Product;
  sizes?: string;
  priority?: boolean;
  /** Alt text for a real photo. Line drawings are decorative. */
  label?: string;
  className?: string;
}

/**
 * Real, authorised photography when `product.image` is set (next/image: AVIF/WebP, responsive,
 * lazy) — otherwise the product's fine-line ink drawing. Never a placeholder box.
 */
export function ProductVisual({ product, sizes = "(min-width: 1024px) 33vw, 90vw", priority, label, className }: Props) {
  if (product.image) {
    return (
      <span className={`visual visual--photo ${className ?? ""}`}>
        <Image src={asset(product.image)} alt={label ?? ""} fill sizes={sizes} priority={priority} style={{ objectFit: "cover" }} />
      </span>
    );
  }
  return (
    <span className={`visual visual--drawing ${className ?? ""}`}>
      <LineArt kind={product.art.kind} />
    </span>
  );
}

export const hasPhoto = (p: Product) => Boolean(p.image);
