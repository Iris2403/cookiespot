/**
 * Contact form validation — shared by the browser (instant feedback) and the API route
 * (authoritative). Pure functions, no dependencies, unit-tested in tests/contact.test.ts.
 */
export interface ContactInput {
  name: string;
  email: string;
  message: string;
  consent: boolean;
  /** Honeypot — must stay empty. */
  website?: string;
  /** ms timestamp when the form was rendered; bots submit instantly. */
  startedAt?: number;
}

export type ContactField = "name" | "email" | "message" | "consent";
export type ContactErrors = Partial<Record<ContactField, true>>;

export const LIMITS = { name: [2, 80], message: [10, 2000], email: 254 } as const;
export const MIN_FILL_MS = 2500;

// Pragmatic email check (RFC 5322 is not worth implementing in a regex).
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

/** Remove control characters (except newlines/tabs in messages) and trim. */
export function clean(value: unknown, multiline = false): string {
  if (typeof value !== "string") return "";
  const pattern = multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return value.replace(pattern, "").normalize("NFC").trim();
}

export function normalize(raw: Record<string, unknown>): ContactInput {
  return {
    name: clean(raw.name),
    email: clean(raw.email).toLowerCase(),
    message: clean(raw.message, true).replace(/\n{3,}/g, "\n\n"),
    consent: raw.consent === true || raw.consent === "on" || raw.consent === "true",
    website: clean(raw.website),
    startedAt: typeof raw.startedAt === "number" ? raw.startedAt : Number(raw.startedAt) || undefined,
  };
}

export function validate(input: ContactInput): ContactErrors {
  const e: ContactErrors = {};
  const len = (s: string) => [...s].length;
  if (len(input.name) < LIMITS.name[0] || len(input.name) > LIMITS.name[1]) e.name = true;
  if (input.email.length > LIMITS.email || !EMAIL_RE.test(input.email)) e.email = true;
  if (len(input.message) < LIMITS.message[0] || len(input.message) > LIMITS.message[1]) e.message = true;
  if (!input.consent) e.consent = true;
  return e;
}

/** True when the submission looks automated. */
export function isSpam(input: ContactInput, now = Date.now()): boolean {
  if (input.website) return true;
  if (!input.startedAt || now - input.startedAt < MIN_FILL_MS) return true;
  if (now - input.startedAt > 1000 * 60 * 60 * 24) return true;
  const links = (input.message.match(/https?:\/\//gi) || []).length;
  return links > 3;
}
