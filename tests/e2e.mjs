// End-to-end checks. Usage: node tests/e2e.mjs [baseUrl]   (default http://localhost:3000)
import { launch } from './browser.mjs';
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const routes = ['/', '/work', '/services', '/industries', '/case-studies', '/process', '/results', '/about', '/testimonials', '/insights', '/lab', '/contact',
  '/services/digital-product-development', '/services/ai-business-systems', '/services/digital-growth-creative',
  '/work/halden-objects', '/work/tillo', '/work/deskhand', '/work/linework-crm', '/work/ember-and-rye', '/work/slowtide'];
let pass = 0, fail = 0;
const ok = (c, name, extra = '') => { c ? pass++ : fail++; console.log(`${c ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`); };
const browser = await launch();
const errs = [];
const newPage = async (w = 1366, h = 850, mobile = false) => {
  const p = await browser.newPage();
  await p.setViewport({ width: w, height: h, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  p.on('pageerror', (e) => errs.push(`${p.url()} :: ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errs.push(`${p.url()} :: ${m.text()}`); });
  p.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(base) && !r.url().includes('definitely')) errs.push(`HTTP ${r.status()} ${r.url()}`); });
  return p;
};
const clickText = (p, sel, text) => p.evaluate((s, t) => { const el = [...document.querySelectorAll(s)].find((e) => e.textContent.trim().includes(t)); if (!el) return false; el.click(); return true; }, sel, text);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// 1. every route: 200, one h1, title, description, canonical, no horizontal overflow (desktop + mobile)
const titles = new Set();
for (const [w, h, m] of [[1366, 850, false], [390, 800, true]]) {
  const p = await newPage(w, h, m);
  for (const r of routes) {
    const res = await p.goto(base + r, { waitUntil: 'networkidle2', timeout: 60000 });
    const i = await p.evaluate(() => ({ h1: document.querySelectorAll('h1').length, title: document.title, desc: document.querySelector('meta[name=description]')?.content || '', canon: document.querySelector('link[rel=canonical]')?.href || '', over: document.documentElement.scrollWidth - innerWidth, imgs: [...document.images].filter((x) => !x.alt && x.getAttribute('aria-hidden') !== 'true' && x.alt !== '').length, main: !!document.querySelector('main') }));
    const good = res.status() < 400 && i.h1 === 1 && i.title.length > 8 && i.desc.length > 40 && i.canon && i.over <= 1 && i.main;
    ok(good, `${m ? 'mobile ' : 'desktop'} ${r}`, good ? '' : JSON.stringify({ status: res.status(), ...i }));
    if (!m) titles.add(i.title);
  }
  await p.close();
}
ok(titles.size === routes.length, 'unique <title> per route', `${titles.size}/${routes.length}`);

const p = await newPage();
// 2. 404
let res = await p.goto(base + '/definitely-not-a-page', { waitUntil: 'networkidle2' });
ok(res.status() === 404 && (await p.content()).includes('doesn’t exist'), '404 page');
// 3. SEO files
for (const f of ['/sitemap.xml', '/robots.txt', '/opengraph-image', '/icon.svg']) { res = await p.goto(base + f); ok(res.status() === 200, `GET ${f}`); }
res = await p.goto(base + '/sitemap.xml'); ok(((await res.text()).match(/<loc>/g) || []).length === routes.length, 'sitemap lists all routes');

// 4. home: hero, structured data, problem selector, honesty
await p.goto(base + '/', { waitUntil: 'networkidle2' });
const home = await p.evaluate(() => ({ h1: document.querySelector('h1').textContent, ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { return JSON.parse(s.textContent)['@type'] || 'graph'; } catch { return 'INVALID'; } }), text: document.body.innerText }));
ok(/bilal\s*bugti/i.test(home.h1), 'hero h1 is BILAL BUGTI', home.h1);
ok(home.ld.length > 0 && !home.ld.includes('INVALID'), 'structured data parses', home.ld.join(','));
ok(/Explore My Work/i.test(home.text) && /Start a Project/i.test(home.text), 'hero CTAs present');
ok(/Have a problem worth solving\?/.test(home.text), 'final CTA present');
ok(/not a real client testimonial/i.test(home.text), 'testimonial mock-up is labelled');
const psBefore = await p.evaluate(() => document.querySelector('.ps')?.innerText || '');
const psClicked = await p.evaluate(() => { const b = document.querySelectorAll('.ps button, .ps [role=tab]'); if (b.length < 8) return b.length; b[3].click(); return true; });
await wait(400);
const psAfter = await p.evaluate(() => document.querySelector('.ps')?.innerText || '');
ok(psClicked === true && psAfter !== psBefore, 'problem selector switches content', String(psClicked));

// 5. navigation overlay opens and lists all pages
await p.evaluate(() => [...document.querySelectorAll('header button')].find((b) => /menu/i.test(b.textContent + b.getAttribute('aria-label')))?.click());
await wait(700);
ok(await p.evaluate(() => document.querySelectorAll('[role=dialog] a[href], .overlay a[href]').length >= 12), 'menu overlay lists the site index');

// 6. demos
await p.goto(base + '/work/halden-objects', { waitUntil: 'networkidle2' });
await p.waitForSelector('.halden'); 
const hb = await p.evaluate(() => document.querySelector('.halden').innerText);
await p.evaluate(() => document.querySelector('.halden .h-tile, .halden [class*=h-prod] button, .halden .h-grid button')?.click()); await wait(300);
await clickText(p, '.halden button', 'Add'); await wait(300);
const ha = await p.evaluate(() => document.querySelector('.halden').innerText);
ok(ha !== hb && /Cart\s*1|1\s*item|Subtotal/i.test(ha), 'Halden: add to cart updates cart');
ok(await p.evaluate(() => /Concept project/i.test(document.querySelector('.demo').innerText)), 'demo carries concept-project flag');

await p.goto(base + '/work/deskhand', { waitUntil: 'networkidle2' }); await p.waitForSelector('.deskhand');
ok(/scripted|no AI model/i.test(await p.evaluate(() => document.querySelector('.deskhand').innerText)), 'Deskhand: disclosed as scripted, not AI');
const kb = await p.evaluate(() => document.querySelector('.deskhand').innerText.length);
await p.type('.deskhand input[type=text], .deskhand input:not([type]), .deskhand textarea', 'What is the refund policy?'); await p.keyboard.press('Enter'); await wait(1800);
ok((await p.evaluate(() => document.querySelector('.deskhand').innerText.length)) > kb + 30, 'Deskhand: question returns a scripted answer');

await p.goto(base + '/work/ember-and-rye', { waitUntil: 'networkidle2' }); await p.waitForSelector('.ember');
const eb = await p.evaluate(() => document.querySelector('.ember').innerText);
await clickText(p, '.ember button', 'Add'); await wait(300);
ok((await p.evaluate(() => document.querySelector('.ember').innerText)) !== eb, 'Ember & Rye: add dish updates basket');
await clickText(p, '.demo-tabs button', 'Kitchen'); await wait(400);
ok(/queue|ticket|kitchen/i.test(await p.evaluate(() => document.querySelector('.ember').innerText)), 'Ember & Rye: kitchen view opens');

for (const [slug, cls, tab] of [['linework-crm', '.linework', 'Automations'], ['slowtide', '.slowtide', 'Dashboard'], ['tillo', '.tillo', null]]) {
  await p.goto(base + '/work/' + slug, { waitUntil: 'networkidle2' }); await p.waitForSelector(cls);
  const b = await p.evaluate((c) => document.querySelector(c).innerText, cls);
  if (tab) await clickText(p, '.demo-tabs button', tab); else await p.evaluate((c) => { const bs = document.querySelectorAll(c + ' nav button, ' + c + ' .t-nav button, ' + c + ' .t-tabbar button'); bs[1]?.click(); }, cls);
  await wait(400);
  ok((await p.evaluate((c) => document.querySelector(c).innerText, cls)) !== b, `${slug}: screen switch works`);
}

// 7. inquiry form: validation, prefill, completion, honest handoff
await p.goto(base + '/contact?service=ai-business-systems&topic=' , { waitUntil: 'networkidle2' }); await p.waitForSelector('form.form');
await clickText(p, 'form.form button', 'Continue'); await wait(200);
ok((await p.$$('.f-err')).length === 3, 'form: empty step 1 shows 3 errors');
await p.type('#f-name', 'Test Visitor'); await p.type('#f-email', 'not-an-email'); await p.type('#f-country', 'Germany');
await clickText(p, 'form.form button', 'Continue'); await wait(200);
ok((await p.$$('.f-err')).length === 1 && (await p.$('#f-industry')) === null, 'form: invalid email blocks progress');
await p.click('#f-email', { clickCount: 3 }); await p.type('#f-email', 'visitor@example.com');
await clickText(p, 'form.form button', 'Continue'); await p.waitForSelector('#f-industry');
ok((await p.$eval('#f-service', (e) => e.value)) === 'AI & Business Systems', 'form: service prefilled from URL');
await clickText(p, 'form.form button', 'Continue'); await wait(200);
ok((await p.$$('.f-err')).length === 2, 'form: step 2 validates industry + description');
await p.select('#f-industry', 'Restaurants'); await p.type('#f-description', 'We lose phone orders at peak hours and need online ordering.');
await clickText(p, 'form.form button', 'Continue'); await p.waitForSelector('#f-budget');
await clickText(p, 'form.form button', 'Prepare my inquiry'); await p.waitForSelector('.f-preview');
const fin = await p.evaluate(() => document.querySelector('.form.done').innerText);
ok(/visitor@example\.com/.test(fin) && /Restaurants/.test(fin) && /does not store or transmit/.test(fin), 'form: completes with honest handoff + summary');

// 8. reduced motion: content visible without animation
const rp = await newPage(); await rp.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await rp.goto(base + '/', { waitUntil: 'networkidle2' }); await rp.evaluate(() => scrollTo(0, 3000)); await wait(500);
ok(await rp.evaluate(() => [...document.querySelectorAll('.reveal')].slice(0, 12).every((e) => getComputedStyle(e).opacity === '1')), 'reduced motion: content not hidden behind animation');
ok(await rp.evaluate(() => !document.querySelector('.hero canvas')), 'reduced motion: no WebGL hero canvas');

// 9. security headers
res = await p.goto(base + '/');
const hd = res.headers(); ok(hd['x-content-type-options'] === 'nosniff' && !!hd['referrer-policy'], 'security headers set');

ok(errs.length === 0, 'no console errors / failed requests across run', errs.slice(0, 6).join(' | '));
await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
