import Image from "next/image";
import type { Locale } from "@/content/menu";
import { media } from "@/content/media";
import { getDictionary } from "@/i18n/dictionaries";
import { asset } from "@/lib/site";
import { LineArt } from "./LineArt";

/** Brand story — verified facts only, plus the brand line supplied in the brief. */
export function Story({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const shop = media.shop;
  return (
    <section id="story" className="story section" aria-labelledby="story-title">
      <div className="container story__grid">
        <div className="story__intro" data-reveal>
          <p className="kicker">{t.story.eyebrow}</p>
          <h2 id="story-title" className="story__title">
            {t.story.titleA} <em>{t.story.titleB}</em>
          </h2>
          <div className="story__figure">
            {shop.src ? (
              <Image src={asset(shop.src)} alt={shop.alt[locale]} fill sizes="(min-width: 1000px) 40vw, 90vw" style={{ objectFit: "cover" }} />
            ) : (
              <LineArt kind="shop" className="story__drawing" />
            )}
          </div>
        </div>
        <div className="story__body" data-reveal>
          <p className="story__lead">{t.story.lead}</p>
          <ol className="story__points">
            {t.story.points.map((pt, i) => (
              <li key={pt.k}>
                <span className="story__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <strong>{pt.k}</strong>
                  <span>{pt.v}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
