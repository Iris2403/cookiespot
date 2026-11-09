/**
 * ProductArt — art-directed SVG illustrations used wherever authorised product photography
 * is not yet available. Deliberately NOT stock photography and NOT cartoon characters:
 * textured, lit, editorial "still life" renderings driven by each product's ArtSpec.
 *
 * Rendering notes
 *  - Pure component (no hooks) → works in server and client components, output is deterministic
 *    from `seed`, so hydration is stable.
 *  - Each illustration is served as a standalone static file (/art/<slug>.svg) with its own defs, so
 *    pages stay light (no inline SVG in the DOM) and the files are cached and lazy-loaded.
 *  - When `product.image` exists, <ProductVisual/> renders the photo instead of this component.
 */
import type { ArtSpec } from "@/content/menu";

type Rng = () => number;

function rngFrom(seed: string): Rng {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => Math.round(n * 10) / 10;

function chunkPath(rng: Rng, cx: number, cy: number, size: number) {
  const pts = 5 + Math.floor(rng() * 3);
  const rot = rng() * Math.PI * 2;
  let d = "";
  for (let i = 0; i < pts; i++) {
    const a = rot + (i / pts) * Math.PI * 2;
    const r = size * (0.62 + rng() * 0.48);
    d += `${i ? "L" : "M"}${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r * 0.86)}`;
  }
  return d + "Z";
}

/** Scatter points in an ellipse with a minimum distance, deterministic. */
function scatter(rng: Rng, n: number, cx: number, cy: number, rx: number, ry: number, minDist: number) {
  const out: [number, number][] = [];
  let guard = 0;
  while (out.length < n && guard++ < n * 40) {
    const a = rng() * Math.PI * 2;
    const r = Math.sqrt(rng());
    const x = cx + Math.cos(a) * rx * r;
    const y = cy + Math.sin(a) * ry * r;
    if (out.every(([px, py]) => Math.hypot(px - x, py - y) > minDist)) out.push([x, y]);
  }
  return out;
}

function Chunks({ rng, spec, cx, cy, rx, ry, n, size }: { rng: Rng; spec: ArtSpec; cx: number; cy: number; rx: number; ry: number; n: number; size: number }) {
  const pts = scatter(rng, n, cx, cy, rx, ry, size * 1.2);
  return (
    <g>
      {pts.map(([x, y], i) => {
        const color = spec.chunks[i % spec.chunks.length];
        const s = size * (0.6 + rng() * 0.7);
        return (
          <g key={i}>
            <path d={chunkPath(rng, x + 2, y + 3, s)} fill="#000" opacity={0.22} />
            <path d={chunkPath(rng, x, y, s)} fill={color} />
            <path d={`M${f(x - s * 0.45)} ${f(y - s * 0.2)}q${f(s * 0.3)} ${f(-s * 0.35)} ${f(s * 0.7)} ${f(-s * 0.25)}`} stroke="#fff" strokeOpacity={0.35} strokeWidth={s * 0.18} strokeLinecap="round" fill="none" />
          </g>
        );
      })}
    </g>
  );
}

function Drizzle({ rng, color, cx, cy, w, h, width = 5 }: { rng: Rng; color: string; cx: number; cy: number; w: number; h: number; width?: number }) {
  const lines = 3 + Math.floor(rng() * 2);
  return (
    <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      {Array.from({ length: lines }, (_, i) => {
        const y0 = cy - h / 2 + (i + 0.5) * (h / lines) + (rng() - 0.5) * 12;
        let d = `M${f(cx - w / 2)} ${f(y0)}`;
        const segs = 6;
        for (let s = 1; s <= segs; s++) {
          const x = cx - w / 2 + (s / segs) * w;
          d += ` Q${f(x - w / segs / 2)} ${f(y0 + (s % 2 ? -1 : 1) * (10 + rng() * 14))} ${f(x)} ${f(y0 + (rng() - 0.5) * 10)}`;
        }
        return <path key={i} d={d} strokeWidth={width * (0.7 + rng() * 0.6)} opacity={0.92} />;
      })}
    </g>
  );
}

function Cookie({ rng, spec, cx, cy, r, thick = 0, chunkCount = 14, chunkSize = 13, drizzle = true }: { rng: Rng; spec: ArtSpec; cx: number; cy: number; r: number; thick?: number; chunkCount?: number; chunkSize?: number; drizzle?: boolean }) {
  const ry = r * (thick ? 0.9 : 0.96);
  return (
    <g>
      <ellipse cx={cx + r * 0.06} cy={cy + ry * 0.12 + thick} rx={r * 1.02} ry={ry * 0.98} fill="url(#tcs-cast)" />
      <g filter="url(#tcs-cookie)">
        {thick > 0 && (
          <>
            <ellipse cx={cx} cy={cy + thick} rx={r} ry={ry} fill={spec.dough} />
            <ellipse cx={cx} cy={cy + thick} rx={r} ry={ry} fill="#000" opacity={0.32} />
          </>
        )}
        <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={spec.dough} />
        <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill="url(#tcs-dome)" />
        <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill="none" stroke="#5a2d10" strokeOpacity={0.28} strokeWidth={r * 0.1} />
        {Array.from({ length: 5 }, (_, i) => {
          const a = rng() * Math.PI * 2;
          const rr = r * (0.25 + rng() * 0.5);
          const x = cx + Math.cos(a) * rr;
          const y = cy + Math.sin(a) * rr * 0.9;
          return <path key={i} d={`M${f(x)} ${f(y)}q${f((rng() - 0.5) * 50)} ${f((rng() - 0.5) * 30)} ${f((rng() - 0.5) * 70)} ${f((rng() - 0.5) * 40)}`} stroke="#3b1d0b" strokeOpacity={0.18} strokeWidth={3 + rng() * 3} fill="none" strokeLinecap="round" />;
        })}
        <Chunks rng={rng} spec={spec} cx={cx} cy={cy} rx={r * 0.86} ry={ry * 0.84} n={chunkCount} size={chunkSize} />
        {drizzle && spec.drizzle && <Drizzle rng={rng} color={spec.drizzle} cx={cx} cy={cy} w={r * 1.5} h={r * 1.1} width={r * 0.04} />}
      </g>
    </g>
  );
}

function Scoop({ cx, cy, r, color, rng, chunks }: { cx: number; cy: number; r: number; color: string; rng: Rng; chunks?: string[] }) {
  const bumps = 9;
  let d = "";
  for (let i = 0; i <= bumps; i++) {
    const a = Math.PI + (i / bumps) * Math.PI;
    const rr = r * (0.92 + rng() * 0.14);
    d += `${i ? "L" : "M"}${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)}`;
  }
  d += ` Q${f(cx + r * 0.9)} ${f(cy + r * 0.35)} ${f(cx + r * 0.55)} ${f(cy + r * 0.28)} Q${f(cx + r * 0.42)} ${f(cy + r * 0.6)} ${f(cx + r * 0.3)} ${f(cy + r * 0.3)} Q${f(cx)} ${f(cy + r * 0.42)} ${f(cx - r * 0.35)} ${f(cy + r * 0.3)} Q${f(cx - r * 0.5)} ${f(cy + r * 0.52)} ${f(cx - r * 0.62)} ${f(cy + r * 0.26)} Q${f(cx - r)} ${f(cy + r * 0.3)} ${f(cx - r)} ${f(cy)}Z`;
  return (
    <g filter="url(#tcs-cream)">
      <path d={d} fill={color} />
      <path d={d} fill="url(#tcs-dome)" />
      {chunks?.map((c, i) => {
        const [x, y] = [cx + (rng() - 0.5) * r * 1.2, cy - rng() * r * 0.7];
        return <path key={i} d={chunkPath(rng, x, y, r * 0.09)} fill={c} />;
      })}
    </g>
  );
}

export interface ProductArtProps {
  spec: ArtSpec;
  seed: string;
  /** Hide the coloured backdrop (for layering over other surfaces). */
  bleed?: boolean;
  /** Optional viewBox crop for close-ups, e.g. "120 120 160 160". */
  crop?: string;
  label?: string;
  className?: string;
}

/**
 * Renders a complete, standalone SVG document (defs included). Used by the /art/[file] route,
 * which serves each illustration as a static, cacheable image file.
 */
export function ProductArt({ spec, seed, bleed }: Omit<ProductArtProps, "label" | "className" | "crop">) {
  const rng = rngFrom(seed);
  const body = renderKind(spec, rng);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="800" height="800" preserveAspectRatio="xMidYMid slice">
      <ArtDefs />
      {!bleed && (
        <>
          <rect x="-50" y="-50" width="500" height="500" fill={spec.backdrop} />
          <rect x="-50" y="-50" width="500" height="500" fill="url(#tcs-vignette)" />
          <rect x="-50" y="-50" width="500" height="500" filter="url(#tcs-grain)" opacity={0.5} />
        </>
      )}
      {body}
    </svg>
  );
}

function renderKind(spec: ArtSpec, rng: Rng) {
  switch (spec.kind) {
    case "cookie":
      return <Cookie rng={rng} spec={spec} cx={200} cy={196} r={142} chunkCount={13} chunkSize={13} />;
    case "ny-cookie":
      return <Cookie rng={rng} spec={spec} cx={200} cy={188} r={150} thick={22} chunkCount={16} chunkSize={20} />;
    case "mini": {
      const spots: [number, number, number][] = [
        [110, 120, 62], [255, 105, 56], [330, 220, 50], [190, 230, 68], [85, 285, 54], [290, 320, 60], [170, 350, 44],
      ];
      return <g>{spots.map(([x, y, r], i) => <Cookie key={i} rng={rng} spec={{ ...spec, chunks: [spec.chunks[i % spec.chunks.length], spec.chunks[(i + 1) % spec.chunks.length]] }} cx={x} cy={y} r={r} chunkCount={5} chunkSize={7} drizzle={false} />)}</g>;
    }
    case "brookie":
      return (
        <g>
          <ellipse cx={210} cy={330} rx={170} ry={28} fill="url(#tcs-cast)" />
          <g filter="url(#tcs-slab)">
            {/* top face */}
            <path d="M60 170 L250 120 L350 175 L160 230Z" fill={spec.dough} />
            <path d="M60 170 L250 120 L350 175 L160 230Z" fill="url(#tcs-dome)" />
            {/* front-left face: cookie band + brownie band */}
            <path d="M60 170 L160 230 L160 262 L60 202Z" fill={spec.dough} />
            <path d="M60 170 L160 230 L160 262 L60 202Z" fill="#000" opacity={0.18} />
            <path d="M60 202 L160 262 L160 318 L60 258Z" fill="#2E170B" />
            {/* front-right face */}
            <path d="M160 230 L350 175 L350 207 L160 262Z" fill={spec.dough} />
            <path d="M160 230 L350 175 L350 207 L160 262Z" fill="#000" opacity={0.3} />
            <path d="M160 262 L350 207 L350 263 L160 318Z" fill="#24120A" />
            {/* crumbs in brownie */}
            {Array.from({ length: 22 }, (_, i) => {
              const left = i % 2 === 0;
              const t = rng();
              const x = left ? 64 + t * 92 : 166 + t * 180;
              const yBase = left ? 206 + t * 58 : 266 - t * 55;
              return <circle key={i} cx={f(x)} cy={f(yBase + rng() * 44)} r={f(1.5 + rng() * 3)} fill="#4A2614" />;
            })}
            <Chunks rng={rng} spec={spec} cx={205} cy={175} rx={110} ry={34} n={11} size={13} />
            {spec.drizzle && <Drizzle rng={rng} color={spec.drizzle} cx={205} cy={172} w={210} h={60} width={6} />}
          </g>
        </g>
      );
    case "skillet":
      return (
        <g>
          <rect x="300" y="182" width="130" height="34" rx="14" fill="#151010" transform="rotate(-8 300 200)" />
          <circle cx={190} cy={210} r={168} fill="#120c0a" />
          <circle cx={190} cy={210} r={168} fill="url(#tcs-iron)" />
          <circle cx={190} cy={210} r={150} fill="#0c0807" />
          <Cookie rng={rng} spec={spec} cx={190} cy={212} r={140} chunkCount={14} chunkSize={14} drizzle={false} />
          <Scoop cx={200} cy={190} r={70} color={spec.drizzle ?? "#F3E6D0"} rng={rng} />
          <path d="M150 196 q8 30 -4 52" stroke={spec.drizzle ?? "#F3E6D0"} strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.9} />
        </g>
      );
    case "dippers": {
      const colors = spec.chunks;
      return (
        <g>
          <rect x="34" y="44" width="332" height="312" rx="22" fill="#000" opacity={0.08} />
          <g filter="url(#tcs-slab)">
            {Array.from({ length: 12 }, (_, i) => {
              const col = i % 4;
              const row = Math.floor(i / 4);
              const x = 58 + col * 62 + (rng() - 0.5) * 6;
              const y = 70 + row * 62 + (rng() - 0.5) * 6;
              return (
                <g key={i} transform={`rotate(${f((rng() - 0.5) * 14)} ${x + 24} ${y + 24})`}>
                  <rect x={x} y={y} width="50" height="50" rx="8" fill={colors[row % colors.length]} />
                  <rect x={x} y={y} width="50" height="50" rx="8" fill="url(#tcs-dome)" />
                  <circle cx={x + 16} cy={y + 18} r="3.5" fill="#fff" opacity={0.25} />
                  <circle cx={x + 33} cy={y + 30} r="3" fill="#000" opacity={0.25} />
                </g>
              );
            })}
          </g>
          {[["#6b3a1a", 120], [spec.drizzle ?? "#C7772E", 200], ["#E9C77B", 280]].map(([c, x], i) => (
            <g key={i} filter="url(#tcs-cream)">
              <ellipse cx={x as number} cy={302} rx={36} ry={30} fill="#fff" />
              <ellipse cx={x as number} cy={298} rx={28} ry={21} fill={c as string} />
              <ellipse cx={(x as number) - 8} cy={292} rx={8} ry={4} fill="#fff" opacity={0.35} />
            </g>
          ))}
        </g>
      );
    }
    case "scoop":
      return (
        <g>
          <ellipse cx={200} cy={352} rx={110} ry={16} fill="url(#tcs-cast)" />
          <path d="M120 210 L280 210 L256 350 L144 350Z" fill="#FFFDF8" />
          <path d="M120 210 L280 210 L274 244 L126 244Z" fill={spec.accent ?? "#ED7033"} />
          <path d="M120 210 L280 210 L256 350 L144 350Z" fill="url(#tcs-cup)" />
          <Scoop cx={200} cy={200} r={92} color={spec.dough} rng={rng} chunks={spec.chunks.concat(spec.chunks)} />
        </g>
      );
    case "tub":
      return (
        <g>
          <ellipse cx={200} cy={340} rx={150} ry={26} fill="url(#tcs-cast)" />
          <path d="M70 170 L330 170 L310 330 Q200 356 90 330Z" fill="#FFFDF8" />
          <path d="M70 170 L330 170 L310 330 Q200 356 90 330Z" fill="url(#tcs-cup)" />
          <path d="M78 228 L322 228 L318 262 L82 262Z" fill={spec.accent ?? "#ED7033"} />
          <ellipse cx={200} cy={170} rx={130} ry={40} fill="#EFE6D8" />
          <g filter="url(#tcs-cream)">
            <ellipse cx={200} cy={168} rx={118} ry={33} fill={spec.dough} />
            <path d="M110 168 q40 -30 90 -6 q50 22 92 -4" stroke="#fff" strokeOpacity={0.45} strokeWidth={9} fill="none" strokeLinecap="round" />
            <path d="M120 176 q60 18 150 -2" stroke="#000" strokeOpacity={0.12} strokeWidth={8} fill="none" strokeLinecap="round" />
            {spec.chunks.map((c, i) => <path key={i} d={chunkPath(rng, 150 + i * 70, 160 + rng() * 10, 9)} fill={c} />)}
          </g>
        </g>
      );
    case "shake":
      return (
        <g>
          <ellipse cx={200} cy={366} rx={90} ry={12} fill="url(#tcs-cast)" />
          <rect x="226" y="20" width="18" height="190" rx="9" fill={spec.accent ?? "#ED7033"} transform="rotate(12 235 115)" />
          <path d="M128 150 L272 150 L252 362 L148 362Z" fill={spec.dough} />
          <path d="M128 150 L272 150 L252 362 L148 362Z" fill="url(#tcs-glass)" />
          {spec.drizzle && <path d="M140 160 q20 60 6 120 M262 160 q-16 50 -6 110 M200 152 q12 50 -4 90" stroke={spec.drizzle} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.85} />}
          <Scoop cx={200} cy={150} r={82} color="#FFF6E8" rng={rng} chunks={spec.chunks.concat(spec.chunks, spec.chunks)} />
          {spec.drizzle && <Drizzle rng={rng} color={spec.drizzle} cx={200} cy={110} w={120} h={30} width={5} />}
        </g>
      );
    case "drink":
      return (
        <g>
          <ellipse cx={200} cy={362} rx={86} ry={12} fill="url(#tcs-cast)" />
          <path d="M126 110 L274 110 L256 360 L144 360Z" fill={spec.dough} opacity={0.85} />
          {[[170, 170, 8], [220, 200, -14], [184, 250, 20]].map(([x, y, r], i) => (
            <rect key={i} x={x} y={y} width="48" height="48" rx="8" fill="#fff" opacity={0.42} transform={`rotate(${r} ${x + 24} ${y + 24})`} />
          ))}
          <path d="M126 110 L274 110 L256 360 L144 360Z" fill="url(#tcs-glass)" />
          <circle cx={262} cy={112} r={42} fill={spec.accent ?? "#F2D36B"} />
          <circle cx={262} cy={112} r={34} fill="#FFF3C4" />
          {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M262 112 L${f(262 + Math.cos((i / 8) * Math.PI * 2) * 32)} ${f(112 + Math.sin((i / 8) * Math.PI * 2) * 32)}`} stroke={spec.accent ?? "#F2D36B"} strokeWidth={3} />)}
        </g>
      );
    case "combo": {
      const withCup = Boolean(spec.accent);
      const cells: [number, number][] = withCup
        ? [[110, 120], [230, 110], [100, 250], [215, 240]]
        : [[100, 110], [205, 100], [305, 125], [95, 230], [200, 220], [305, 245], [140, 335], [255, 340]];
      const r = withCup ? 62 : 52;
      return (
        <g>
          <rect x="30" y="40" width="340" height="330" rx="18" fill="#C9A377" />
          <rect x="30" y="40" width="340" height="330" rx="18" fill="url(#tcs-cup)" />
          <rect x="44" y="54" width="312" height="302" rx="12" fill="#B48D62" />
          {cells.map(([x, y], i) => (
            <Cookie key={i} rng={rng} spec={{ ...spec, chunks: [spec.chunks[i % spec.chunks.length], "#2B160C"] }} cx={x} cy={y} r={r} chunkCount={6} chunkSize={9} drizzle={false} />
          ))}
          {withCup && (
            <g transform="translate(110 150) scale(0.62)">
              <path d="M120 210 L280 210 L256 350 L144 350Z" fill="#FFFDF8" />
              <path d="M120 210 L280 210 L274 244 L126 244Z" fill={spec.accent} />
              <Scoop cx={200} cy={200} r={92} color="#FFF3E2" rng={rng} chunks={["#2B160C", "#2B160C"]} />
            </g>
          )}
        </g>
      );
    }
  }
}

/** Filter + gradient definitions, embedded in every standalone illustration file. */
export function ArtDefs() {
  return (
      <defs>
        <filter id="tcs-cookie" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="14" xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="4" seed="3" result="tex" />
          <feDiffuseLighting in="tex" surfaceScale="2.6" lightingColor="#ffffff" result="light">
            <feDistantLight azimuth="235" elevation="48" />
          </feDiffuseLighting>
          <feComposite in="shape" in2="light" operator="arithmetic" k1="1.32" k2="0" k3="0" k4="0" result="lit" />
          <feComposite in="lit" in2="shape" operator="in" />
        </filter>
        <filter id="tcs-slab" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="2" seed="11" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="6" xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="4" seed="5" result="tex" />
          <feDiffuseLighting in="tex" surfaceScale="2" lightingColor="#ffffff" result="light">
            <feDistantLight azimuth="235" elevation="50" />
          </feDiffuseLighting>
          <feComposite in="shape" in2="light" operator="arithmetic" k1="1.28" k2="0" k3="0" k4="0" result="lit" />
          <feComposite in="lit" in2="shape" operator="in" />
        </filter>
        <filter id="tcs-cream" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="9" result="tex" />
          <feDiffuseLighting in="tex" surfaceScale="1.4" lightingColor="#ffffff" result="light">
            <feDistantLight azimuth="235" elevation="62" />
          </feDiffuseLighting>
          <feComposite in="SourceGraphic" in2="light" operator="arithmetic" k1="1.12" k2="0" k3="0" k4="0" result="lit" />
          <feComposite in="lit" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="tcs-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.24  0 0 0 0 0.15  0 0 0 0 0.09  0 0 0 0.35 0" />
        </filter>
        <radialGradient id="tcs-dome" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#2b1205" stopOpacity="0.38" />
        </radialGradient>
        <radialGradient id="tcs-cast" cx="50%" cy="50%" r="50%">
          <stop offset="0.55" stopColor="#1b0d05" stopOpacity="0.42" />
          <stop offset="1" stopColor="#1b0d05" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tcs-vignette" cx="50%" cy="45%" r="75%">
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#1b0d05" stopOpacity="0.22" />
        </radialGradient>
        <radialGradient id="tcs-iron" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#5a4a44" stopOpacity="0.5" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tcs-glass" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="0.85" stopColor="#000" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="tcs-cup" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.14" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
      </defs>
  );
}
