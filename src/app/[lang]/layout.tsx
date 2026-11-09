import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Alegreya, Caveat, Manrope } from "next/font/google";
import { getDictionary, isLocale, locales } from "@/i18n/dictionaries";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { RevealObserver } from "@/components/RevealObserver";
import { OrderChooser } from "@/components/OrderChooser";
import "../globals.css";

// Headings: Alegreya — warm, slightly calligraphic serif (Greek included) that sits well beside
// the hand-lettered logo.
const display = Alegreya({
  subsets: ["latin", "greek"],
  weight: ["700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "optional",
});

// Text: Manrope — clean, warm sans with Greek.
const sans = Manrope({
  subsets: ["latin", "greek"],
  variable: "--font-sans",
  display: "swap",
});

// Hand-lettering accent (Latin only), used for the brand line "We bake it personally".
const script = Caveat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-script",
  display: "swap",
  preload: false,
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
    <html lang={lang} className={`${display.variable} ${sans.variable} ${script.variable}`}>
      <body>
        <a className="skip-link" href="#main">{t.skip}</a>
        {children}
        <OrderChooser locale={lang} />
        <RevealObserver />
      </body>
    </html>
  );
}
