import type { MetadataRoute } from "next";
import { asset } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Cookie Spot Athens",
    short_name: "Cookie Spot",
    start_url: asset("/el/"),
    display: "browser",
    background_color: "#FFF8EF",
    theme_color: "#3D2618",
    icons: [{ src: asset("/icon.svg"), sizes: "any", type: "image/svg+xml" }],
  };
}
