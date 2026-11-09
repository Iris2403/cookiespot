"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/content/menu";
import { business, INSTAGRAM_URL } from "@/content/business";
import { getDictionary } from "@/i18n/dictionaries";
import { IS_STATIC_EXPORT } from "@/lib/site";
import { LIMITS, normalize, validate, type ContactErrors, type ContactField } from "@/lib/contact";
import { ArrowIcon, InstagramIcon, PhoneIcon } from "./icons";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState("");
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const fieldError = (f: ContactField) => (errors[f] ? t.contact.errors[f] : undefined);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
      consent: fd.get("consent") === "on",
      website: fd.get("website"),
      startedAt: startedAt.current,
    };
    const errs = validate(normalize(payload));
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = (["name", "email", "message", "consent"] as ContactField[]).find((f) => errs[f]);
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (IS_STATIC_EXPORT) {
      // Static preview (GitHub Pages) has no server to receive messages.
      setServerMsg(t.contact.errors.unavailable);
      setStatus("error");
      requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }
    setStatus("sending");
    setServerMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: ContactField[] };
        if (res.status === 422 && data.fields) setErrors(Object.fromEntries(data.fields.map((f) => [f, true])));
        setServerMsg(res.status === 429 ? t.contact.errors.rate : res.status === 503 ? t.contact.errors.unavailable : t.contact.errors.generic);
        setStatus("error");
      }
    } catch {
      setServerMsg(t.contact.errors.generic);
      setStatus("error");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  return (
    <section id="contact" className="contact section" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__intro" data-reveal>
          <p className="eyebrow eyebrow--light">{t.contact.eyebrow}</p>
          <h2 id="contact-title" className="display-lg">{t.contact.title}</h2>
          <p className="lead">{t.contact.lead}</p>
          <div className="contact__direct">
            <a href={`tel:${business.phone.e164}`} className="btn btn--primary"><PhoneIcon /> {business.phone.display}</a>
            <a href={INSTAGRAM_URL} className="btn btn--ghost-light" target="_blank" rel="noopener noreferrer"><InstagramIcon /> Instagram</a>
          </div>
        </div>

        <form ref={formRef} className="form" noValidate onSubmit={onSubmit} data-reveal>
          <Field id="cf-name" name="name" label={t.contact.name} error={fieldError("name")} required={t.contact.required}>
            <input id="cf-name" name="name" type="text" autoComplete="name" maxLength={LIMITS.name[1]} required aria-invalid={!!errors.name} aria-describedby={errors.name ? "cf-name-err" : undefined} />
          </Field>
          <Field id="cf-email" name="email" label={t.contact.email} error={fieldError("email")} required={t.contact.required}>
            <input id="cf-email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={LIMITS.email} required aria-invalid={!!errors.email} aria-describedby={errors.email ? "cf-email-err" : undefined} />
          </Field>
          <Field id="cf-message" name="message" label={t.contact.message} error={fieldError("message")} required={t.contact.required}>
            <textarea id="cf-message" name="message" rows={5} maxLength={LIMITS.message[1]} required aria-invalid={!!errors.message} aria-describedby={errors.message ? "cf-message-err" : undefined} />
          </Field>

          {/* Honeypot: hidden from people and assistive tech, attractive to bots. */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="cf-website">Website</label>
            <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className={`check${errors.consent ? " has-error" : ""}`}>
            <input id="cf-consent" name="consent" type="checkbox" required aria-invalid={!!errors.consent} aria-describedby={`cf-consent-help${errors.consent ? " cf-consent-err" : ""}`} />
            <label htmlFor="cf-consent">
              {t.contact.consent}{" "}
              <span id="cf-consent-help"><Link href={`/${locale}/privacy`} className="link">{t.contact.privacy}</Link></span>
            </label>
            {errors.consent && <p id="cf-consent-err" className="field__error">{t.contact.errors.consent}</p>}
          </div>

          <button type="submit" className="btn btn--primary btn--lg" disabled={status === "sending"} aria-disabled={status === "sending"}>
            {status === "sending" ? t.contact.sending : t.contact.send} <ArrowIcon />
          </button>

          <p ref={statusRef} tabIndex={-1} className={`form__status form__status--${status}`} role="status" aria-live="polite">
            {status === "success" ? t.contact.success : status === "error" ? serverMsg : ""}
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({ id, label, error, required, children }: { id: string; name: string; label: string; error?: string; required: string; children: React.ReactNode }) {
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={id}>
        {label} <span className="field__req">({required})</span>
      </label>
      {children}
      {error && <p id={`${id}-err`} className="field__error">{error}</p>}
    </div>
  );
}
