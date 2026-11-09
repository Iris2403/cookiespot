"use client";
import Image from "next/image";
import { useState } from "react";
import { asset } from "@/lib/site";
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
          <Image src={asset("/images/brand/storefront.webp")} alt="" fill sizes="(min-width: 960px) 50vw, 92vw" style={{ objectFit: "cover" }} className="map__photo" />
          <button type="button" className="btn btn--dark" onClick={() => setOn(true)}>
            <PinIcon /> {labels.showMap}
          </button>
          <p className="map__note">{labels.mapNote}</p>
        </div>
      )}
    </div>
  );
}
