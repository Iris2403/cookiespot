import type { Locale, Product } from "@/content/menu";
import { PhotoSlot } from "./PhotoSlot";

interface Props {
  product: Product;
  locale: Locale;
  sizes?: string;
  priority?: boolean;
  /** Accessible text. Omit for decorative usage (the product name is next to the image). */
  label?: string;
  quiet?: boolean;
  className?: string;
}

/** Product image: the authorised photo when `product.image` is set, else a labelled flat placeholder. */
export function ProductVisual({ product, locale, sizes, priority, label, quiet, className }: Props) {
  return (
    <PhotoSlot
      locale={locale}
      src={product.image}
      alt={label ?? ""}
      spec={product.art}
      sizes={sizes}
      priority={priority}
      quiet={quiet}
      className={className}
    />
  );
}
