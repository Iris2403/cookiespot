"use client";
import { useState } from "react";
import { MAPS_EMBED_URL } from "@/content/business";
import { PinIcon } from "./icons";

/** Click-to-load map: no third-party request until the visitor asks for it. */
export function MapEmbed({ labels }: { labels: { showMap: string; mapNote: string; mapTitle: string } }) {
  const [on, setOn] = useState(false);
  return (
    <div className="map">
      {on ? (
        <iframe
          title={labels.mapTitle}
          src={MAPS_EMBED_URL}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="map__placeholder">
          <div className="map__streets" aria-hidden="true">
            <span /><span /><span /><span />
            <i className="map__pin"><PinIcon /></i>
          </div>
          <button type="button" className="btn btn--dark" onClick={() => setOn(true)}>
            <PinIcon /> {labels.showMap}
          </button>
          <p className="map__note">{labels.mapNote}</p>
        </div>
      )}
    </div>
  );
}
