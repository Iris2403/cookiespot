import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * STATIC_EXPORT=1 builds a fully static copy (GitHub Pages preview). In that mode there is no
 * server: no contact API, no language-negotiating proxy and no custom headers (Pages can't set
 * them). BASE_PATH is the sub-path the site is served from, e.g. "/cookiespot".
 */
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = staticExport ? process.env.BASE_PATH || "" : "";

/**
 * Content Security Policy.
 * - Pages are statically pre-rendered for speed, so we cannot use per-request nonces.
 *   Next.js injects small inline bootstrap scripts, which requires 'unsafe-inline' for scripts.
 *   'unsafe-eval' is only allowed in development (React Refresh).
 * - No third-party scripts are loaded at all. The only third-party origin is the Google Maps
 *   embed, which is loaded only after the visitor clicks "Show map".
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-src https://www.google.com https://maps.google.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  ...(staticExport ? { output: "export" as const, trailingSlash: true, basePath } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: staticExport ? "1" : "",
  },
  images: {
    unoptimized: staticExport,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 2048],
  },
  async headers() {
    if (staticExport) return [];
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/illustrations/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
      },
    ];
  },
};

export default nextConfig;
