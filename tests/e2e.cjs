const { chromium, devices } = require('playwright');
const assert = require('assert');
// Usage: npm run build && npm start, then: BASE_URL=http://localhost:3000 node tests/e2e.cjs
const B = process.env.BASE_URL || 'http://localhost:3000';
const ok = (m) => console.log('✓', m);
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type()==='error' && errs.push(m.text()));
  await p.goto(B + '/en', { waitUntil: 'networkidle' });
  assert.equal(await p.evaluate(() => scrollY), 0); ok('no scroll jump on load');
  // all links
  const hrefs = await p.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
  const internal = [...new Set(hrefs.filter(h => h.startsWith('#')))];
  for (const h of internal) if (!h.startsWith('#menu-')) assert.ok(await p.$(h), 'anchor ' + h);
  ok(`internal anchors resolve (${internal.length})`);
  const wolt = hrefs.filter(h => h.includes('wolt.com')); assert.ok(wolt.every(h => h.startsWith('https://wolt.com/el/grc/athens/restaurant/cookie-spot') || h.startsWith('https://wolt.com/en/grc/athens/restaurant/cookie-spot')));
  ok(`order links → Wolt store (${wolt.length})`);
  assert.ok(hrefs.includes('tel:+302106983637')); ok('tel link');
  const efood = hrefs.filter(h => h === 'https://www.e-food.gr/delivery/ampelokipoi/the-cookie-spot'); assert.ok(efood.length >= 1); ok(`e-food links (${efood.length})`);
  await p.click('.hero .btn--primary'); await p.waitForSelector('dialog.order-chooser[open]');
  const opts = await p.$$eval('dialog.order-chooser[open] a', as => as.map(a => a.href));
  assert.ok(opts.some(h => h.includes('wolt.com')) && opts.some(h => h.includes('e-food.gr'))); ok('order button opens Wolt / e-food chooser');
  await p.keyboard.press('Escape'); await p.waitForSelector('dialog.order-chooser:not([open])', { state: 'attached' });
  assert.equal(await p.$$eval('text=/may differ|μπορεί να διαφέρουν|διαμορφώνεται/', e => e.length), 0); ok('no price disclaimers');
  const r1 = await p.textContent('.review-slide blockquote'); await p.click('.review-carousel__nav button:last-child'); assert.notEqual(r1, await p.textContent('.review-slide blockquote')); ok('reviews carousel arrows');
  assert.equal(await p.$$eval('text=/Hours as listed on Wolt|Loads Google Maps/', e => e.length), 0); ok('hours/map notes removed');
  // category filter
  await p.click('.menu-tab:has-text("Brookies")');
  assert.equal(await p.$$eval('.menu-sec', g => g.length), 1);
  assert.equal(await p.$$eval('.menu-card', g => g.length), 2); ok('category filter');
  await p.click('.menu-tab:text-is("NY Style Cookies")');
  // dialog
  await p.click('.menu-card__main:has-text("Pistachio Cookie")');
  await p.waitForSelector('dialog.product-dialog[open]');
  assert.match(await p.textContent('#product-dialog-title'), /Pistachio Cookie/);
  assert.ok((await p.evaluate(() => location.hash)).includes('#p/pistachio-cookie'));
  assert.ok(await p.evaluate(() => document.activeElement.closest('dialog') !== null)); ok('dialog opens, focus inside, deep link hash');
  await p.keyboard.press('Escape');
  await p.waitForSelector('dialog.product-dialog:not([open])', { state: 'attached' });
  await p.waitForFunction(() => location.hash === '');
  await p.waitForTimeout(300); // let the Next.js router finish mirroring history.replaceState
  assert.match(await p.evaluate(() => document.activeElement.textContent), /Pistachio/); ok('Escape closes, focus restored');
  // deep link on load
  await p.goto(B + '/en#p/caramel-brookie', { waitUntil: 'networkidle' });
  await p.waitForSelector('dialog.product-dialog[open]'); ok('deep link opens product');
  await p.keyboard.press('Escape');
  // cravings deep link to category
  await p.click('a[href="#menu-skillet"]');
  await p.waitForTimeout(300);
  assert.match(await p.textContent('.menu-tab[aria-pressed="true"]'), /skillet/i); ok('"more than a cookie" panel selects menu category');
  // favourites open dialog
  await p.click('.fav-card__open >> nth=0'); await p.waitForSelector('dialog.product-dialog[open]'); await p.keyboard.press('Escape'); ok('favourite opens dialog');
  await p.waitForTimeout(300);
  await p.click('.menu-tab:text-is("Coffee")'); await p.click('.menu-card__main >> nth=0'); await p.waitForSelector('dialog.product-dialog[open]'); await p.keyboard.press('Escape'); ok('coffee item opens dialog');
  await p.waitForTimeout(300);
  assert.equal(await p.$$eval('.menu-tab', b => b.filter(x => /^(All|Όλα)$/.test(x.textContent.trim())).length), 0); ok('no "All" tab');
  assert.ok(await p.$('#gallery a[href^="https://www.instagram.com/thecookiespotathens"]')); ok('gallery links to the brand Instagram');
  assert.equal(await p.$$eval('header img.logo[src*="logo.svg"]', e => e.length), 1); ok('real brand logo in header');
  const broken = await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } await new Promise(r => setTimeout(r, 800)); return [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src); });
  assert.deepEqual(broken, []); ok('all images load');
  assert.equal(await p.$$eval('text=/Photo coming soon/i', e => e.length), 0); ok('no placeholder photo boxes');
  const nNav = await p.evaluate(() => { document.getElementById('gallery').scrollIntoView({ behavior: 'instant' }); return new Promise(r => setTimeout(() => r(document.querySelector('.site-nav__link.is-current')?.textContent), 500)); });
  assert.match(nNav || '', /gallery/i); ok('scroll-spy highlights current section');
  // gallery lightbox is exercised only when gallery photos exist (content/gallery.ts)
  if (await p.$('.gallery__btn')) {
    await p.click('.gallery__btn >> nth=0'); await p.waitForSelector('dialog.lightbox[open]'); await p.keyboard.press('Escape'); ok('gallery lightbox');
  }
  // map click-to-load
  assert.equal(await p.$('.map iframe'), null);
  await p.click('.map button'); assert.ok(await p.$('.map iframe')); ok('map loads only on click');
  // contact client validation
  await p.click('.form button[type=submit]');
  assert.ok(await p.$('#cf-name-err')); assert.equal(await p.evaluate(() => document.activeElement.id), 'cf-name'); ok('form client validation + focus first error');
  await p.fill('#cf-name', 'Test Person'); await p.fill('#cf-email', 't@example.com'); await p.fill('#cf-message', 'Hello there, testing the form.'); await p.check('#cf-consent');
  await p.waitForTimeout(2600);
  await p.click('.form button[type=submit]'); await p.waitForFunction(() => document.querySelector('.form__status').textContent.length > 0);
  console.log('  form status (no email provider configured):', await p.textContent('.form__status'));
  await p.evaluate(() => scrollTo({ top: 4000, behavior: 'instant' })); await p.click('.site-header__logo'); await p.waitForFunction(() => scrollY === 0, null, { timeout: 4000 }); ok('logo scrolls to the very top');
  // keyboard: tab from top reaches skip link
  await p.goto(B + '/en'); await p.keyboard.press('Tab');
  assert.equal(await p.evaluate(() => document.activeElement.className), 'skip-link'); ok('skip link first in tab order');
  // mobile menu
  const m = await (await b.newContext({ ...devices['Pixel 7'] })).newPage();
  await m.goto(B + '/el', { waitUntil: 'networkidle' });
  await m.click('.menu-toggle'); assert.equal(await m.isVisible('#mobile-menu'), true);
  await m.keyboard.press('Escape'); assert.equal(await m.isVisible('#mobile-menu'), false); ok('mobile menu open/Escape');
  await m.click('.menu-toggle'); await m.click('#mobile-menu a[href="#menu"]'); await m.waitForTimeout(600);
  assert.equal(await m.isVisible('#mobile-menu'), false); ok('mobile menu link navigates + closes');
  console.log('console errors:', errs);
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
