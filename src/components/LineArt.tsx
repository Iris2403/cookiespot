/**
 * LineArt — fine single-stroke ink drawings used as editorial ornaments (like the drawings on a
 * printed bakery menu). Flat 2D, one stroke colour (currentColor), no fills that imitate photos.
 * They decorate typography; they never stand in for product photography.
 */
import type { ArtKind } from "@/content/menu";

export type LineKind = ArtKind | "coffee" | "shop" | "bag" | "whisk";

const CHIPS = "M44 46h.01M70 40h.01M58 62h.01M78 66h.01M48 78h.01M66 84h.01";

const shapes: Record<LineKind, React.ReactNode> = {
  cookie: (
    <>
      <path d="M60 18c14 0 20 6 28 10 9 5 14 16 13 28-1 10 4 18-2 28-6 11-17 18-31 18-10 0-16-4-25-8-11-5-18-15-18-29 0-10-3-16 3-25 7-12 18-22 32-22z" />
      <path d={CHIPS} strokeWidth="7" />
      <path d="M36 54c4-2 8-2 11 0M72 52c3 2 4 5 4 8M54 90c4 1 8 1 12-1" />
    </>
  ),
  "ny-cookie": (
    <>
      <path d="M58 14c18-1 30 8 38 18 8 11 10 26 6 39-4 15-14 28-31 33-15 5-32 1-43-10C17 83 12 68 15 53c3-14 10-25 22-32 6-4 13-7 21-7z" />
      <path d="M38 40l8-4 4 8-8 4zM70 32l9 2-2 9-9-2zM58 58l10-2 2 10-10 2zM82 64l7 3-3 7-7-3zM40 74l8 1-1 8-8-1zM62 86l7-2 2 7-7 2z" />
    </>
  ),
  mini: (
    <>
      <circle cx="40" cy="44" r="20" />
      <circle cx="82" cy="40" r="16" />
      <circle cx="62" cy="82" r="22" />
      <path d="M34 40h.01M46 50h.01M80 36h.01M86 44h.01M56 78h.01M68 88h.01M64 74h.01" strokeWidth="6" />
    </>
  ),
  brookie: (
    <>
      <path d="M16 46l44-16 44 16-44 16z" />
      <path d="M16 46v32l44 16 44-16V46M60 62v32" />
      <path d="M16 60l44 16 44-16" />
      <path d="M40 44h.01M60 40h.01M74 48h.01" strokeWidth="6" />
      <path d="M24 70l4 1M36 74l3 1M78 78l4-1M90 72l3-1" />
    </>
  ),
  skillet: (
    <>
      <circle cx="54" cy="62" r="38" />
      <circle cx="54" cy="62" r="30" />
      <path d="M92 58h22M92 66h22" />
      <path d="M38 58c0-10 7-16 16-16s16 6 16 16c-3 6-7 4-9 2-2 6-7 6-9 1-3 4-8 4-10-1-3 2-4 0-4-2z" />
      <path d="M40 76h.01M64 80h.01M70 70h.01" strokeWidth="6" />
    </>
  ),
  dippers: (
    <>
      <rect x="14" y="22" width="22" height="22" rx="4" />
      <rect x="42" y="22" width="22" height="22" rx="4" />
      <rect x="14" y="50" width="22" height="22" rx="4" />
      <rect x="42" y="50" width="22" height="22" rx="4" />
      <ellipse cx="88" cy="36" rx="16" ry="10" />
      <ellipse cx="88" cy="64" rx="16" ry="10" />
      <ellipse cx="54" cy="94" rx="16" ry="10" />
      <path d="M80 34c4-3 10-3 14 0M80 62c4-3 10-3 14 0M46 92c4-3 10-3 14 0" />
    </>
  ),
  scoop: (
    <>
      <path d="M36 58h48l-8 46H44z" />
      <path d="M38 70h44" />
      <path d="M34 58c-4-18 10-32 26-32s30 14 26 32" />
      <path d="M48 40c4-4 10-5 14-3" />
    </>
  ),
  tub: (
    <>
      <ellipse cx="60" cy="40" rx="40" ry="12" />
      <path d="M20 40l6 56c1 6 15 10 34 10s33-4 34-10l6-56" />
      <path d="M26 66c10 4 22 6 34 6s24-2 34-6" />
      <path d="M40 38c6-4 14-4 20 0s14 4 20 0" />
    </>
  ),
  shake: (
    <>
      <path d="M38 44h44l-6 64H44z" />
      <path d="M34 44c0-12 12-18 26-18s26 6 26 18z" />
      <path d="M66 26l8-22" />
      <path d="M44 64c6 3 26 3 32 0" />
    </>
  ),
  drink: (
    <>
      <path d="M36 28h48l-6 80H42z" />
      <path d="M38 48h44" />
      <rect x="50" y="60" width="12" height="12" rx="2" />
      <rect x="60" y="78" width="11" height="11" rx="2" />
      <circle cx="84" cy="28" r="12" />
      <path d="M84 16v24M72 28h24" />
    </>
  ),
  coffee: (
    <>
      <path d="M28 52h56v20c0 16-12 28-28 28S28 88 28 72z" />
      <path d="M84 60h8c6 0 10 4 10 9s-4 9-10 9h-10" />
      <path d="M18 108h76" />
      <path d="M46 22c-4 6 4 10 0 18M60 18c-4 6 4 10 0 18M74 22c-4 6 4 10 0 18" />
    </>
  ),
  combo: (
    <>
      <path d="M14 46h92v52H14z" />
      <path d="M14 46l12-18h68l12 18" />
      <circle cx="38" cy="72" r="13" />
      <circle cx="82" cy="72" r="13" />
      <path d="M60 46v52" />
      <path d="M34 70h.01M42 76h.01M78 68h.01M86 76h.01" strokeWidth="6" />
    </>
  ),
  shop: (
    <>
      <path d="M18 50h84v54H18z" />
      <path d="M12 50l10-24h76l10 24" />
      <path d="M12 50c4 8 14 8 18 0 4 8 14 8 18 0 4 8 14 8 18 0 4 8 14 8 18 0 4 8 14 8 18 0" />
      <path d="M30 104V72h22v32M64 72h26v18H64z" />
    </>
  ),
  bag: (
    <>
      <path d="M28 40h64l8 68H20z" />
      <path d="M44 40c0-14 6-22 16-22s16 8 16 22" />
      <circle cx="60" cy="74" r="14" />
      <path d="M56 70h.01M64 76h.01" strokeWidth="5" />
    </>
  ),
  whisk: (
    <>
      <path d="M60 104V64" />
      <path d="M60 64c-18-8-22-40 0-52 22 12 18 44 0 52z" />
      <path d="M60 64c-8-10-10-34 0-50M60 64c8-10 10-34 0-50" />
    </>
  ),
};

export function LineArt({ kind, className, title }: { kind: LineKind; className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`line-art ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {shapes[kind]}
    </svg>
  );
}
