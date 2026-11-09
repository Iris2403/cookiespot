import type { Locale } from "@/content/menu";
import { orderUrl } from "@/content/menu";
import { media } from "@/content/media";
import { getDictionary } from "@/i18n/dictionaries";
import { PhotoSlot, FlatGraphic, type SlotKind } from "./PhotoSlot";
import { Parallax } from "./Parallax";
import { ArrowIcon } from "./icons";

/**
 * Campaign-style hero on brand orange. Everything is flat 2D: big type, a cutout photo slot,
 * flat graphic cookie motifs and a chocolate wave into the next section.
 */
export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const h = media.hero;
  const spec = (kind: SlotKind, base: string, chips: string[], bg = "transparent") => ({ kind, dough: base, chunks: chips, backdrop: bg });
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Parallax className="hero__stage">
        <div className="hero__copy">
          <p className="hero__eyebrow">{t.hero.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line hero__line--a">{t.hero.titleA}</span>
            <span className="hero__line hero__line--b">{t.hero.titleB}</span>
          </h1>
          <p className="hero__lead">{t.hero.lead}</p>
          <div className="hero__ctas">
            <a href={orderUrl(undefined, locale)} className="btn btn--choc btn--lg" target="_blank" rel="noopener noreferrer">
              {t.hero.order} <ArrowIcon />
            </a>
            <a href="#featured" className="btn btn--outline btn--lg">{t.hero.explore}</a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__disc layer" style={{ ["--d" as string]: 8 }} aria-hidden="true" />
          <div className="hero__photo layer" style={{ ["--d" as string]: 16 }}>
            <PhotoSlot
              locale={locale}
              src={h.src}
              alt={h.alt[locale]}
              note={h.brief[locale]}
              spec={spec(h.kind, h.colors.base, h.colors.chips, h.colors.bg)}
              sizes="(min-width: 960px) 44vw, 86vw"
              priority
            />
          </div>
          <div className="hero__motif hero__motif--a layer" style={{ ["--d" as string]: 30 }} aria-hidden="true">
            <FlatGraphic spec={spec("cookie", "#D9A066", ["#3D2618", "#6B3E22"])} />
          </div>
          <div className="hero__motif hero__motif--b layer" style={{ ["--d" as string]: 22 }} aria-hidden="true">
            <FlatGraphic spec={spec("cookie", "#E9D8C5", ["#3D2618", "#8E9C6B"])} />
          </div>
          <p className="hero__sticker layer" style={{ ["--d" as string]: 26 }}>
            <span>{t.hero.sticker}</span>
          </p>
        </div>
      </Parallax>
      <svg className="hero__wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 40 C 180 80 360 0 540 40 S 900 80 1080 40 S 1300 0 1440 40 V80 H0Z" />
      </svg>
    </section>
  );
}
