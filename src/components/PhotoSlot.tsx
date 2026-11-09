/**
 * PhotoSlot — every product/brand image position on the site.
 *
 * - With a real, authorised photograph (`src`) → next/image (AVIF/WebP, responsive, lazy).
 * - Without one → a FLAT 2D brand graphic plus a visible "Photo coming soon" badge, so nobody
 *   mistakes it for real product photography. No shading, perspective or depth effects.
 *
 * Pure component (no hooks): usable from server and client components.
 */
import Image from "next/image";
import type { ArtKind, ArtSpec, Locale } from "@/content/menu";
import { asset } from "@/lib/site";

const BADGE: Record<Locale, string> = { el: "Φωτογραφία σύντομα", en: "Photo coming soon" };

export type SlotKind = ArtKind | "shop" | "packaging" | "people";

interface Props {
  locale: Locale;
  /** Authorised photo path under /public. */
  src?: string;
  /** Alt text for the photo (or for the placeholder when it carries meaning). */
  alt?: string;
  /** Flat graphic recipe for the placeholder. */
  spec: Pick<ArtSpec, "dough" | "chunks" | "backdrop" | "accent"> & { kind: SlotKind };
  sizes?: string;
  priority?: boolean;
  /** Hide the "photo coming soon" badge (e.g. very small thumbnails, decorative use). */
  quiet?: boolean;
  /** Optional note describing which photo belongs here (shown on large placeholders). */
  note?: string;
  className?: string;
}

export function PhotoSlot({ locale, src, alt = "", spec, sizes = "(min-width: 1024px) 33vw, 90vw", priority, quiet, note, className }: Props) {
  if (src) {
    return (
      <span className={`photo ${className ?? ""}`}>
        <Image src={asset(src)} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: "cover" }} />
      </span>
    );
  }
  return (
    <span className={`photo photo--placeholder ${className ?? ""}`} style={{ ["--slot-bg" as string]: spec.backdrop }} role={alt ? "img" : undefined} aria-label={alt ? `${alt} — ${BADGE[locale]}` : undefined}>
      <FlatGraphic spec={spec} />
      {!quiet && (
        <span className="photo__badge" aria-hidden="true">
          <CameraGlyph /> {BADGE[locale]}
        </span>
      )}
      {note && !quiet && <span className="photo__note" aria-hidden="true">{note}</span>}
    </span>
  );
}

const CameraGlyph = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

/* ---------- flat graphics (viewBox 200×200) ---------- */

const INK = "#3D2618";
const CHIPS: [number, number, number][] = [
  [72, 74, 9], [118, 66, 7], [138, 102, 10], [92, 108, 8], [64, 128, 7], [112, 140, 9], [146, 140, 6], [100, 86, 5],
];

function chips(colors: string[], scale = 1, dx = 0, dy = 0, cx = 100, cy = 100) {
  return CHIPS.map(([x, y, r], i) => (
    <circle key={i} cx={cx + (x - 100) * scale + dx} cy={cy + (y - 100) * scale + dy} r={r * Math.max(scale, 0.5)} fill={colors[i % colors.length]} />
  ));
}

function cookie(base: string, colors: string[], cx = 100, cy = 100, r = 70) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={base} stroke={INK} strokeWidth={4} />
      {chips(colors, (r / 70) * 0.95, 0, 0, cx, cy)}
    </g>
  );
}

export function FlatGraphic({ spec }: { spec: Props["spec"] }) {
  const { kind, dough: base, chunks: colors, accent = "#ED7033" } = spec;
  let body: React.ReactNode;
  switch (kind) {
    case "cookie":
      body = cookie(base, colors);
      break;
    case "ny-cookie":
      body = (
        <g>
          <circle cx="100" cy="100" r="78" fill={base} stroke={INK} strokeWidth={4} />
          {CHIPS.map(([x, y, r], i) => (
            <rect key={i} x={x - r * 1.2} y={y - r} width={r * 2.4} height={r * 2} rx={3} fill={colors[i % colors.length]} transform={`rotate(${(i * 37) % 90 - 45} ${x} ${y})`} />
          ))}
        </g>
      );
      break;
    case "mini":
      body = (
        <g>
          {[[62, 64, 30], [134, 58, 26], [148, 128, 30], [80, 138, 32], [108, 100, 16]].map(([x, y, r], i) => (
            <g key={i}>{cookie(base, [colors[i % colors.length]], x, y, r)}</g>
          ))}
        </g>
      );
      break;
    case "brookie":
      body = (
        <g stroke={INK} strokeWidth={4}>
          <rect x="34" y="62" width="132" height="38" rx="8" fill={base} />
          <rect x="34" y="100" width="132" height="44" rx="8" fill="#4A2A1A" />
          {colors.map((c, i) => <circle key={i} cx={58 + i * 34} cy={80} r={6} fill={c} stroke="none" />)}
          {spec.accent && <path d="M44 72 q20 -10 40 0 t40 0 t36 0" fill="none" stroke={spec.accent} strokeWidth={5} />}
        </g>
      );
      break;
    case "skillet":
      body = (
        <g>
          <rect x="150" y="90" width="44" height="20" rx="10" fill={INK} />
          <circle cx="96" cy="100" r="78" fill={INK} />
          <circle cx="96" cy="100" r="64" fill={base} />
          {chips(colors, 0.85, -4, 0)}
          <path d="M70 92 a26 24 0 0 1 52 0 q-4 10 -10 6 q-4 12 -12 4 q-8 10 -14 0 q-10 6 -16 -10z" fill="#FFF8EF" stroke={INK} strokeWidth={3} />
        </g>
      );
      break;
    case "dippers":
      body = (
        <g stroke={INK} strokeWidth={3}>
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={40 + (i % 3) * 30} y={46 + Math.floor(i / 3) * 30} width="24" height="24" rx="5" fill={colors[Math.floor(i / 3) % colors.length]} />
          ))}
          {[["#6B3E22", 150, 62], [spec.accent ?? "#C7772E", 150, 100], ["#E9C77B", 150, 138]].map(([c, x, y], i) => (
            <circle key={i} cx={x as number} cy={y as number} r="15" fill={c as string} />
          ))}
        </g>
      );
      break;
    case "scoop":
      body = (
        <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
          <path d="M60 104 h80 l-12 64 h-56z" fill="#FFFFFF" />
          <path d="M62 116 h76" stroke={accent} strokeWidth={8} />
          <path d="M58 104 a42 40 0 0 1 84 0z" fill={base} />
          {colors.map((c, i) => <circle key={i} cx={84 + i * 18} cy={86} r={5} fill={c} stroke="none" />)}
        </g>
      );
      break;
    case "tub":
      body = (
        <g stroke={INK} strokeWidth={4}>
          <path d="M44 80 h112 l-10 82 h-92z" fill="#FFFFFF" />
          <rect x="52" y="108" width="96" height="18" fill={accent} stroke="none" />
          <ellipse cx="100" cy="80" rx="56" ry="16" fill={base} />
        </g>
      );
      break;
    case "shake":
      body = (
        <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
          <path d="M116 24 l-8 60" stroke={accent} strokeWidth={8} strokeLinecap="round" />
          <path d="M66 86 h68 l-10 92 h-48z" fill={base} />
          <path d="M60 86 q8 -26 40 -22 q32 -4 40 22z" fill="#FFF8EF" />
          {spec.chunks.slice(0, 1).map((c) => <circle key={c} cx="100" cy="66" r="6" fill={c} stroke="none" />)}
        </g>
      );
      break;
    case "drink":
      body = (
        <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
          <path d="M64 50 h72 l-10 124 h-52z" fill={base} />
          <rect x="80" y="84" width="20" height="20" rx="4" fill="#FFFFFF" />
          <rect x="100" y="112" width="18" height="18" rx="4" fill="#FFFFFF" />
          <circle cx="136" cy="52" r="18" fill={accent} />
        </g>
      );
      break;
    case "combo":
      body = (
        <g>
          <rect x="22" y="40" width="156" height="120" rx="12" fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          {[[58, 76], [100, 76], [142, 76], [58, 124], [100, 124], [142, 124]].map(([x, y], i) => (
            <g key={i}>{cookie(base, [colors[i % colors.length]], x, y, 18)}</g>
          ))}
        </g>
      );
      break;
    case "shop":
      body = (
        <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
          <rect x="30" y="70" width="140" height="100" fill="#FFFFFF" />
          <path d="M24 70 l12 -30 h128 l12 30z" fill="#ED7033" />
          <path d="M24 70 q14 16 28 0 q14 16 28 0 q14 16 28 0 q14 16 28 0 q14 16 32 0" fill="#ED7033" />
          <rect x="44" y="100" width="54" height="70" fill="#E9D8C5" />
          <rect x="110" y="100" width="46" height="40" fill="#E9D8C5" />
          <circle cx="133" cy="120" r="10" fill={base} />
        </g>
      );
      break;
    case "packaging":
      body = (
        <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
          <path d="M56 64 h88 l10 110 h-108z" fill="#ED7033" />
          <path d="M80 64 q0 -28 20 -28 q20 0 20 28" fill="none" />
          <circle cx="100" cy="118" r="22" fill="#FFF8EF" />
          {chips([INK], 0.22, 0, 18)}
        </g>
      );
      break;
    case "people":
      body = (
        <g stroke={INK} strokeWidth={4}>
          {cookie(base, colors, 70, 112, 40)}
          {cookie(base, colors, 134, 92, 40)}
        </g>
      );
      break;
  }
  return (
    <svg className="photo__graphic" viewBox="0 0 200 200" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      {body}
    </svg>
  );
}
