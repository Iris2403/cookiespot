import type { DayKey, OpeningPeriod } from "@/content/business";

const DAY_KEYS: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** Current weekday + minutes in a given IANA time zone (default Europe/Athens). */
export function zonedNow(date: Date, timeZone = "Europe/Athens") {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = get("weekday").toLowerCase().slice(0, 3) as DayKey;
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export interface OpenState {
  open: boolean;
  closesAt?: string;
}

export function openState(hours: readonly OpeningPeriod[], date: Date, timeZone = "Europe/Athens"): OpenState {
  const { day, minutes } = zonedNow(date, timeZone);
  const today = hours.find((h) => h.day === day);
  if (!today?.opens || !today.closes) return { open: false };
  const o = toMin(today.opens);
  const c = toMin(today.closes);
  return minutes >= o && minutes < c ? { open: true, closesAt: today.closes } : { open: false };
}

export { DAY_KEYS };
