import Image from "next/image";
import type { Locale } from "@/content/menu";
import type { Photo } from "@/content/media";
import { asset } from "@/lib/site";

/** A brand photograph with intrinsic dimensions (no layout shift), responsive and lazy by default. */
export function BrandPhoto({ photo, locale, sizes, priority, className, fill }: { photo: Photo; locale: Locale; sizes: string; priority?: boolean; className?: string; fill?: boolean }) {
  if (fill) {
    return <Image src={asset(photo.src)} alt={photo.alt[locale]} fill sizes={sizes} priority={priority} className={className} style={{ objectFit: "cover" }} />;
  }
  return <Image src={asset(photo.src)} alt={photo.alt[locale]} width={photo.width} height={photo.height} sizes={sizes} priority={priority} className={className} />;
}
