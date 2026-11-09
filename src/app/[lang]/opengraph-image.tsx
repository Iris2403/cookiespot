import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "The Cookie Spot — Good cookies. Great mood.";

export function generateStaticParams() {
  return [{ lang: "el" }, { lang: "en" }];
}

// Flat 2D brand card. Text kept in Latin script: the built-in OG font has no Greek glyphs.
export default function OgImage() {
  const chip = (x: number, y: number, r: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: "#3D2618" }} />
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ED7033", position: "relative", fontFamily: "sans-serif" }}>
        <div style={{ position: "absolute", right: -90, top: 60, width: 560, height: 560, borderRadius: 560, background: "#3D2618", display: "flex" }} />
        <div style={{ position: "absolute", right: -30, top: 110, width: 460, height: 460, borderRadius: 460, background: "#D9A066", border: "8px solid #3D2618", display: "flex" }}>
          {chip(110, 100, 50)}{chip(270, 80, 38)}{chip(200, 220, 60)}{chip(80, 300, 42)}{chip(310, 300, 48)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", width: 760, color: "#3D2618" }}>
          <div style={{ fontSize: 28, letterSpacing: 6, fontWeight: 800 }}>THE COOKIE SPOT · ATHENS</div>
          <div style={{ fontSize: 112, lineHeight: 0.95, fontWeight: 900, marginTop: 24 }}>GOOD COOKIES.</div>
          <div style={{ fontSize: 112, lineHeight: 0.95, fontWeight: 900, color: "#FFFFFF" }}>GREAT MOOD.</div>
          <div style={{ fontSize: 30, marginTop: 30 }}>Freshly baked the moment you order.</div>
        </div>
      </div>
    ),
    size,
  );
}
