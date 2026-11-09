import Image from "next/image";
import type { Product } from "@/content/menu";
import { asset } from "@/lib/site";
import { LineArt } from "./LineArt";

interface Props {
  product: Product;
  /** "thumb" = menu photo, "feature" = large editorial photo when available. */
  variant?: "thumb" | "feature";
  sizes?: string;
  priority?: boolean;
  label?: string;
  className?: string;
}

/** The product's photo (next/image: AVIF/WebP, responsive, lazy) — ink drawing only if none exists. */
export function ProductVisual({ product, variant = "thumb", sizes = "(min-width: 1024px) 160px, 120px", priority, label, className }: Props) {
  const src = variant === "feature" ? product.photo ?? product.image : product.image ?? product.photo;
  if (src) {
    return (
      <span className={`visual visual--photo ${className ?? ""}`}>
        <Image src={asset(src)} alt={label ?? ""} fill sizes={sizes} priority={priority} style={{ objectFit: "cover" }} />
      </span>
    );
  }
  return (
    <span className={`visual visual--drawing ${className ?? ""}`}>
      <LineArt kind={product.kind} />
    </span>
  );
}
