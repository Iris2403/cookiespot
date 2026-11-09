"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { business } from "@/content/business";
import { openState, type OpenState } from "@/lib/hours";

/** Live "open now" pill. Rendered after mount only, so static HTML never shows a stale state. */
export function OpenStatus({ labels }: { labels: { openNow: string; closedNow: string; closes: string } }) {
  const [state, setState] = useState<OpenState | null>(null);
  useEffect(() => {
    const tick = () => setState(openState(business.hours, new Date(), business.timeZone));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  if (!state) return <span className="status status--loading" aria-hidden="true" />;
  return (
    <span className={`status ${state.open ? "status--open" : "status--closed"}`}>
      <span className="status__dot" aria-hidden="true" />
      {state.open ? `${labels.openNow} · ${labels.closes} ${state.closesAt}` : labels.closedNow}
    </span>
  );
}

export function TodayMarker({ day, label }: { day: string; label: string }) {
  // Server snapshot is null → no hydration mismatch; the client computes today's weekday in Athens.
  const today = useSyncExternalStore(
    noopSubscribe,
    () => new Intl.DateTimeFormat("en-GB", { timeZone: business.timeZone, weekday: "short" }).format(new Date()).toLowerCase().slice(0, 3),
    () => null,
  );
  return today === day ? (
    <>
      <span className="today-dot" aria-hidden="true" />
      <span className="sr-only">({label})</span>
    </>
  ) : null;
}

const noopSubscribe = () => () => {};
