import Image from "next/image";
import type { Locale } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { asset } from "@/lib/site";
import { ArrowIcon } from "./icons";

type Key = "brookies" | "skillet" | "icecream" | "shakes" | "drinks";
const TILES: { key: Key; cat: string; photos: string[]; tone: "peach" | "white" | "terracotta" | "cream" }[] = [
  { key: "brookies", cat: "brookies", photos: ["/images/products/classic-brookie-box.webp"], tone: "cream" },
  { key: "skillet", cat: "skillet", photos: ["/images/thumbs/skillet-chocolate-chip.webp"], tone: "peach" },
  { key: "icecream", cat: "ice-cream", photos: ["/images/products/ice-cream-cup.webp"], tone: "peach" },
  { key: "shakes", cat: "milkshakes", photos: ["/images/thumbs/milkshake-chocolate-chip.webp", "/images/thumbs/milkshake-peanut-butter.webp", "/images/thumbs/milkshake-pistachio-salted-caramel.webp"], tone: "peach" },
  { key: "drinks", cat: "coffee", photos: ["/images/thumbs/freddo-cappuccino.webp", "/images/thumbs/hot-red-velvet.webp"], tone: "white" },
];

/** "More than just a cookie" — a bento of the wider menu, using the brand's product photos. */
export function MoreThanCookies({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section id="more" className="beyond section" aria-labelledby="more-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="kicker">{t.cravings.eyebrow}</p>
          <h2 id="more-title" className="heading-xl">{t.cravings.title}</h2>
        </header>
        <ul className="bento">
          {TILES.map((tile, i) => {
            const copy = t.cravings.panels[tile.key];
            return (
              <li key={tile.key} className={`bento__tile bento__tile--${tile.key} tone-${tile.tone}`} data-reveal style={{ ["--i" as string]: i }}>
                <a href={`#menu-${tile.cat}`} className="bento__link">
                  <span className={`bento__photos bento__photos--${tile.photos.length}`} aria-hidden="true">
                    {tile.photos.map((src) => (
                      <span key={src} className="bento__photo">
                        <Image src={asset(src)} alt="" fill sizes="(min-width: 1000px) 30vw, 90vw" style={{ objectFit: "cover" }} />
                      </span>
                    ))}
                  </span>
                  <span className="bento__text">
                    <span className="bento__title">{copy.title}</span>
                    <span className="bento__desc">{copy.text}</span>
                    <span className="bento__cta">{copy.cta} <ArrowIcon /></span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
