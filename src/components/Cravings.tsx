import type { Locale } from "@/content/menu";
import { getProduct } from "@/content/menu";
import { getDictionary } from "@/i18n/dictionaries";
import { ProductVisual } from "./ProductVisual";
import { ArrowIcon } from "./icons";

const PANELS = [
  { key: "cookies", cat: "ny-style", slug: "triple-choco-praline", tone: "chocolate", n: "01" },
  { key: "brookies", cat: "brookies", slug: "classic-brookie", tone: "biscuit", n: "02" },
  { key: "skillet", cat: "skillet", slug: "triple-chocolate-skillet-ice-cream", tone: "orange", n: "03" },
  { key: "cold", cat: "milkshakes", slug: "red-velvet-milkshake", tone: "strawberry", n: "04" },
  { key: "combos", cat: "combos", slug: "combo-8-plus-2", tone: "pistachio", n: "05" },
] as const;

export function Cravings({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="cravings section" aria-labelledby="cravings-title">
      <div className="container">
        <div className="section-head section-head--split" data-reveal>
          <p className="eyebrow">{t.cravings.eyebrow}</p>
          <h2 id="cravings-title" className="display-lg">{t.cravings.title}</h2>
        </div>
      </div>
      <ul className="cravings__list container-wide">
        {PANELS.map((p, i) => {
          const copy = t.cravings.panels[p.key];
          const product = getProduct(p.slug)!;
          return (
            <li key={p.key} className={`craving tone-${p.tone}`} data-reveal style={{ ["--i" as string]: i }}>
              <a href={`#menu-${p.cat}`} className="craving__link">
                <span className="craving__num" aria-hidden="true">{p.n}</span>
                <span className="craving__art" aria-hidden="true">
                  <ProductVisual product={product} sizes="(min-width: 960px) 30vw, 80vw" />
                </span>
                <span className="craving__text">
                  <span className="craving__title">{copy.title}</span>
                  <span className="craving__desc">{copy.text}</span>
                  <span className="craving__cta">{copy.cta} <ArrowIcon /></span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
