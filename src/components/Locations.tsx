import type { Locale } from "@/content/menu";
import { orderUrl } from "@/content/menu";
import { business, EFOOD_URL, MAPS_DIRECTIONS_URL } from "@/content/business";
import { getDictionary } from "@/i18n/dictionaries";
import { OpenStatus, TodayMarker } from "./OpenStatus";
import { MapEmbed } from "./MapEmbed";
import { ArrowIcon, ClockIcon, PhoneIcon, PinIcon } from "./icons";

export function Locations({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const a = business.address;
  const street = locale === "el" ? a.streetEl : a.street;
  const area = locale === "el" ? a.areaEl : a.area;
  const city = locale === "el" ? a.cityEl : a.city;
  return (
    <section id="locations" className="locations section" aria-labelledby="locations-title">
      <div className="container locations__grid">
        <div className="locations__info" data-reveal>
          <p className="eyebrow">{t.locations.eyebrow}</p>
          <h2 id="locations-title" className="display-lg">{t.locations.title}</h2>
          <OpenStatus labels={{ openNow: t.locations.openNow, closedNow: t.locations.closedNow, closes: t.locations.closes }} />

          <dl className="info-list">
            <div>
              <dt><PinIcon /> {t.locations.address}</dt>
              <dd>
                <address>
                  {street}<br />
                  {area}, {a.postalCode} {city}
                </address>
              </dd>
            </div>
            <div>
              <dt><PhoneIcon /> {t.locations.phone}</dt>
              <dd><a href={`tel:${business.phone.e164}`} className="link">{business.phone.display}</a></dd>
            </div>
            <div>
              <dt><ClockIcon /> {t.locations.hours}</dt>
              <dd>
                <table className="hours">
                  <caption className="sr-only">{t.locations.hours}</caption>
                  <tbody>
                    {business.hours.map((h) => (
                      <tr key={h.day}>
                        <th scope="row">{t.locations.days[h.day]} <TodayMarker day={h.day} label={t.locations.today} /></th>
                        <td>{h.opens && h.closes ? <><time>{h.opens}</time>–<time>{h.closes}</time></> : t.locations.closed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </dd>
            </div>
          </dl>

          <div className="locations__ctas">
            <a href={MAPS_DIRECTIONS_URL} className="btn btn--dark" target="_blank" rel="noopener noreferrer"><PinIcon /> {t.locations.directions}</a>
            <a href={`tel:${business.phone.e164}`} className="btn btn--outline"><PhoneIcon /> {t.locations.call}</a>
            <a href={orderUrl(undefined, locale)} className="btn btn--primary" target="_blank" rel="noopener noreferrer">{t.locations.order} <ArrowIcon /></a>
            <a href={EFOOD_URL} className="btn btn--outline" target="_blank" rel="noopener noreferrer">{t.locations.efood} <ArrowIcon /></a>
          </div>
        </div>
        <div className="locations__map" data-reveal>
          <MapEmbed labels={{ showMap: t.locations.showMap, mapTitle: t.locations.mapTitle }} />
        </div>
      </div>
    </section>
  );
}
