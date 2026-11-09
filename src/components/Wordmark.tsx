/**
 * The Cookie Spot logo — vector trace of the brand's handwritten logo (public/brand/logo*.svg).
 */
import { asset } from "@/lib/site";

export function Wordmark({ tone = "dark", height = 46 }: { tone?: "dark" | "light"; height?: number }) {
  const width = Math.round((height * 1838) / 1200);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny vector logo, no optimisation needed
    <img
      className="logo"
      src={asset(tone === "light" ? "/brand/logo-white.svg" : "/brand/logo.svg")}
      width={width}
      height={height}
      alt="The Cookie Spot"
      decoding="async"
    />
  );
}
