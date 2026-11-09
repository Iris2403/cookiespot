import type { Locale } from "@/content/menu";
import { media, type MediaSlot } from "@/content/media";
import { getDictionary } from "@/i18n/dictionaries";
import { PhotoSlot } from "./PhotoSlot";

const slotSpec = (m: MediaSlot) => ({ kind: m.kind, dough: m.colors.base, chunks: m.colors.chips, backdrop: m.colors.bg, accent: m.colors.accent });

/** Brand story: only verified facts + the brand line supplied in the brief. */
export function Story({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const shots = [
    { m: media.shop, cap: t.story.shopCaption, cls: "story__shot--shop" },
    { m: media.packaging, cap: t.story.packCaption, cls: "story__shot--pack" },
    { m: media.closeup, cap: t.story.closeCaption, cls: "story__shot--close" },
  ];
  return (
    <section id="story" className="story section" aria-labelledby="story-title">
      <div className="container story__grid">
        <div className="story__copy" data-reveal>
          <p className="eyebrow">{t.story.eyebrow}</p>
          <h2 id="story-title" className="story__title">
            <span>{t.story.titleA}</span>
            <span className="story__title-accent">{t.story.titleB}</span>
          </h2>
          <p className="lead">{t.story.lead}</p>
          <dl className="story__points">
            {t.story.points.map((pt, i) => (
              <div key={pt.k} className="story__point" data-reveal style={{ ["--i" as string]: i }}>
                <dt>{pt.k}</dt>
                <dd>{pt.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="story__shots">
          {shots.map(({ m, cap, cls }, i) => (
            <figure key={m.id} className={`story__shot ${cls}`} data-reveal style={{ ["--i" as string]: i }}>
              <PhotoSlot locale={locale} src={m.src} alt={m.alt[locale]} note={m.brief[locale]} spec={slotSpec(m)} sizes="(min-width: 960px) 30vw, 90vw" />
              <figcaption>{cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
