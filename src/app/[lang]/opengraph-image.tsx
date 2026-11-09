import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "The Cookie Spot — freshly baked cookies in Athens";

export function generateStaticParams() {
  return [{ lang: "el" }, { lang: "en" }];
}

// Text kept in Latin script: the built-in OG font has no Greek glyphs.
export default function OgImage() {
  const chip = (x: number, y: number, r: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: "#3D2618" }} />
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#FFF8EF", position: "relative", fontFamily: "serif" }}>
        <div style={{ position: "absolute", right: -120, top: -60, width: 720, height: 720, borderRadius: 720, background: "#E9D8C5", display: "flex" }} />
        <div style={{ position: "absolute", right: -40, top: 60, width: 520, height: 520, borderRadius: 520, background: "#C98A4B", display: "flex" }}>
          {chip(120, 110, 54)}{chip(300, 90, 40)}{chip(220, 250, 64)}{chip(90, 330, 44)}{chip(340, 340, 52)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", width: 720, color: "#3D2618" }}>
          <div style={{ fontSize: 30, letterSpacing: 6, textTransform: "uppercase", color: "#ED7033", fontFamily: "sans-serif", fontWeight: 700 }}>The Cookie Spot · Athens</div>
          <div style={{ fontSize: 108, lineHeight: 1, fontWeight: 900, marginTop: 24 }}>Your next</div>
          <div style={{ fontSize: 108, lineHeight: 1, fontWeight: 900, fontStyle: "italic", color: "#ED7033" }}>favourite</div>
          <div style={{ fontSize: 108, lineHeight: 1, fontWeight: 900 }}>bite.</div>
          <div style={{ fontSize: 30, marginTop: 30, fontFamily: "sans-serif" }}>Freshly baked the moment you order.</div>
        </div>
      </div>
    ),
    size,
  );
}
