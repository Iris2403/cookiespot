import type { MetadataRoute } from "next";
import { MENU_LAST_VERIFIED } from "@/content/menu";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/privacy"];
  return pages.flatMap((p) =>
    (["el", "en"] as const).map((lang) => ({
      url: absoluteUrl(`/${lang}${p}`),
      lastModified: MENU_LAST_VERIFIED,
      changeFrequency: p ? ("yearly" as const) : ("weekly" as const),
      priority: p ? 0.2 : lang === "el" ? 1 : 0.9,
      alternates: { languages: { el: absoluteUrl(`/el${p}`), en: absoluteUrl(`/en${p}`) } },
    })),
  );
}
