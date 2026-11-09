import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/i18n/dictionaries";
import { absoluteUrl } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const UPDATED = "2026-11-09";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.privacy.title,
    alternates: { canonical: absoluteUrl(`/${lang}/privacy`), languages: { el: absoluteUrl("/el/privacy"), en: absoluteUrl("/en/privacy") } },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <>
      <SiteHeader locale={lang} onHome={false} />
      <main id="main" className="legal section">
        <div className="container container--narrow">
          <h1 className="display-lg">{t.privacy.title}</h1>
          <p className="muted">{t.privacy.updated}: <time dateTime={UPDATED}>{UPDATED}</time></p>
          {t.privacy.body.map((p, i) => <p key={i}>{p}</p>)}
          <p><Link href={`/${lang}`} className="link">← {t.privacy.back}</Link></p>
        </div>
      </main>
      <SiteFooter locale={lang} onHome={false} />
    </>
  );
}
