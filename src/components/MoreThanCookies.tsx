import type { Locale } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { LineArt, type LineKind } from "./LineArt";
import { ArrowIcon } from "./icons";

const CHAPTERS: { key: "ny" | "brookies" | "skillet" | "icecream" | "shakes" | "drinks" | "combos"; cat: string; icon: LineKind }[] = [
  { key: "ny", cat: "ny-style", icon: "ny-cookie" },
  { key: "brookies", cat: "brookies", icon: "brookie" },
  { key: "skillet", cat: "skillet", icon: "skillet" },
  { key: "icecream", cat: "ice-cream", icon: "scoop" },
  { key: "shakes", cat: "milkshakes", icon: "shake" },
  { key: "drinks", cat: "cold-drinks", icon: "coffee" },
  { key: "combos", cat: "combos", icon: "combo" },
];

/** "More than just a cookie" — the wider menu as magazine chapters. */
export function MoreThanCookies({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section id="more" className="chapters section" aria-labelledby="more-title">
      <div className="container">
        <header className="section-head section-head--center" data-reveal>
          <p className="kicker">{t.cravings.eyebrow}</p>
          <h2 id="more-title" className="heading-xl">{t.cravings.title}</h2>
        </header>
        <ol className="chapters__grid">
          {CHAPTERS.map((c, i) => {
            const copy = t.cravings.panels[c.key];
            return (
              <li key={c.key} className={`chapter chapter--${i}`} data-reveal style={{ ["--i" as string]: i % 3 }}>
                <a href={`#menu-${c.cat}`} className="chapter__link">
                  <span className="chapter__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <LineArt kind={c.icon} className="chapter__art" />
                  <span className="chapter__title">{copy.title}</span>
                  <span className="chapter__text">{copy.text}</span>
                  <span className="chapter__cta">{copy.cta} <ArrowIcon /></span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
