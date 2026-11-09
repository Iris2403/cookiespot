/**
 * Typographic wordmark.
 * PLACEHOLDER for the official logo, which could not be downloaded in this build environment.
 * To use the real logo: add it to /public/brand/logo.svg and set OFFICIAL_LOGO below.
 */
import Image from "next/image";

const OFFICIAL_LOGO: { src: string; width: number; height: number } | null = null;

export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  if (OFFICIAL_LOGO) {
    return <Image src={OFFICIAL_LOGO.src} width={OFFICIAL_LOGO.width} height={OFFICIAL_LOGO.height} alt="The Cookie Spot" priority />;
  }
  return (
    <span className={`wordmark wordmark--${tone}`}>
      <span className="sr-only">The Cookie Spot</span>
      <span className="wordmark__the" aria-hidden="true">the</span>
      <span className="wordmark__name" aria-hidden="true">Cookie<span className="wordmark__dot" />Spot</span>
    </span>
  );
}
