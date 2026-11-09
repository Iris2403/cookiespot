import { test } from "node:test";
import assert from "node:assert/strict";
import { clean, isSpam, normalize, validate } from "../src/lib/contact.ts";
import { rateLimit, __resetRateLimit } from "../src/lib/rateLimit.ts";
import { openState } from "../src/lib/hours.ts";
import { business } from "../src/content/business.ts";
import { products, categories, orderUrl } from "../src/content/menu.ts";

const good = { name: "Μαρία", email: "maria@example.gr", message: "Hello, I'd like to order for an event.", consent: true, startedAt: Date.now() - 10_000 };

test("valid input passes", () => assert.deepEqual(validate(normalize(good)), {}));
test("invalid fields are reported", () => {
  const e = validate(normalize({ name: "a", email: "nope", message: "short", consent: false }));
  assert.deepEqual(Object.keys(e).sort(), ["consent", "email", "message", "name"]);
});
test("control characters are stripped", () => assert.equal(clean("a\u0000b\u0007c "), "abc"));
test("honeypot and instant submits are spam", () => {
  assert.equal(isSpam(normalize({ ...good, website: "x" })), true);
  assert.equal(isSpam(normalize({ ...good, startedAt: Date.now() })), true);
  assert.equal(isSpam(normalize(good)), false);
});
test("rate limiter blocks after limit", () => {
  __resetRateLimit();
  const r = [1, 2, 3].map(() => rateLimit("k", 2, 1000, 0).ok);
  assert.deepEqual(r, [true, true, false]);
  assert.equal(rateLimit("k", 2, 1000, 2000).ok, true);
});
test("opening hours in Europe/Athens", () => {
  // Monday 2026-11-09 10:00 Athens (UTC+2) = 08:00Z → open; Sunday → closed; Monday 22:00 → closed
  assert.equal(openState(business.hours, new Date("2026-11-09T08:00:00Z")).open, true);
  assert.equal(openState(business.hours, new Date("2026-11-08T10:00:00Z")).open, false);
  assert.equal(openState(business.hours, new Date("2026-11-09T20:00:00Z")).open, false);
});
test("catalogue integrity", () => {
  const slugs = new Set(products.map((p) => p.slug));
  assert.equal(slugs.size, products.length, "unique slugs");
  for (const p of products) {
    assert.ok(categories.some((c) => c.id === p.category), `category of ${p.slug}`);
    assert.ok(p.price === null || p.price > 0);
    assert.match(orderUrl(p), /^https:\/\/wolt\.com\//);
  }
});
