import { NextResponse, type NextRequest } from "next/server";
import { isSpam, normalize, validate } from "@/lib/contact";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 10_000;
const json = (status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

function clientIp(req: NextRequest) {
  return req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** CSRF defence: the request must come from this site's own origin (JSON + same-origin). */
function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json(403, { error: "forbidden" });
  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json(415, { error: "unsupported" });

  const limit = rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60_000);
  if (!limit.ok) return json(429, { error: "rate" }, { "Retry-After": String(Math.ceil((limit.reset - Date.now()) / 1000)) });

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return json(413, { error: "too_large" });
    raw = JSON.parse(text);
  } catch {
    return json(400, { error: "invalid" });
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return json(400, { error: "invalid" });

  const input = normalize(raw as Record<string, unknown>);
  // Silently accept spam so bots get no signal.
  if (isSpam(input)) return json(200, { ok: true });

  const errors = validate(input);
  if (Object.keys(errors).length) return json(422, { error: "validation", fields: Object.keys(errors) });

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) return json(503, { error: "unavailable" });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: input.email,
        subject: `Website message from ${input.name.slice(0, 60)}`,
        // Plain text only: nothing the visitor typed is ever rendered as HTML.
        text: `Name: ${input.name}\nEmail: ${input.email}\n\n${input.message}\n\n— Sent from the website contact form (consent given).`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("contact: provider responded", res.status);
      return json(502, { error: "delivery" });
    }
  } catch (err) {
    console.error("contact: delivery failed", err instanceof Error ? err.name : "unknown");
    return json(502, { error: "delivery" });
  }
  return json(200, { ok: true });
}

export function GET() {
  return json(405, { error: "method" }, { Allow: "POST" });
}
