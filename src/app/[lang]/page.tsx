import { notFound } from "next/navigation";
import { isLocale, getDictionary } from "@/i18n/dictionaries";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Cravings } from "@/components/Cravings";
import { MenuExplorer } from "@/components/MenuExplorer";
import { ProductDialogProvider } from "@/components/ProductDialog";
import { Story } from "@/components/Story";
import { Offers } from "@/components/Offers";
import { Gallery } from "@/components/Gallery";
import { Reviews } from "@/components/Reviews";
import { Locations } from "@/components/Locations";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileOrderBar } from "@/components/MobileOrderBar";
import { JsonLd } from "@/components/JsonLd";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <ProductDialogProvider locale={lang}>
      <SiteHeader locale={lang} />
      <main id="main">
        <Hero locale={lang} />
        <Marquee items={t.marquee} />
        <Cravings locale={lang} />
        <section id="menu" className="menu section" aria-labelledby="menu-title">
          <div className="container">
            <div className="section-head section-head--split" data-reveal>
              <p className="eyebrow">{t.menu.eyebrow}</p>
              <div>
                <h2 id="menu-title" className="display-xl">{t.menu.title}</h2>
                <p className="lead">{t.menu.lead}</p>
              </div>
            </div>
            <MenuExplorer locale={lang} />
          </div>
        </section>
        <Offers locale={lang} />
        <Story locale={lang} />
        <Gallery locale={lang} />
        <Reviews locale={lang} />
        <Locations locale={lang} />
        <ContactForm locale={lang} />
      </main>
      <SiteFooter locale={lang} />
      <MobileOrderBar locale={lang} />
      <JsonLd locale={lang} />
    </ProductDialogProvider>
  );
}
