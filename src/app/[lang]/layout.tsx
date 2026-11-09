import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Syne, Commissioner } from "next/font/google";
import { getDictionary, isLocale, locales } from "@/i18n/dictionaries";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { RevealObserver } from "@/components/RevealObserver";
import "../globals.css";

// Display face: Syne (contemporary, confident, has Greek). Two static weights keep bytes low.
const display = Syne({
  subsets: ["latin", "greek"],
  weight: ["700", "800"],
  variable: "--font-display",
  // "optional": headlines never wait for, or re-paint with, the web font on slow first visits.
  display: "optional",
});

const sans = Commissioner({
  subsets: ["latin", "greek"],
  variable: "--font-sans",
  display: "swap",
});

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#3D2618",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: "%s · The Cookie Spot" },
    description: t.meta.description,
    applicationName: "The Cookie Spot",
    alternates: {
      canonical: absoluteUrl(`/${lang}`),
      languages: { el: absoluteUrl("/el"), en: absoluteUrl("/en"), "x-default": absoluteUrl("/el") },
    },
    openGraph: {
      type: "website",
      siteName: "The Cookie Spot",
      title: t.meta.title,
      description: t.meta.description,
      url: absoluteUrl(`/${lang}`),
      locale: lang === "el" ? "el_GR" : "en_GB",
      alternateLocale: lang === "el" ? ["en_GB"] : ["el_GR"],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <html lang={lang} className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#main">{t.skip}</a>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
