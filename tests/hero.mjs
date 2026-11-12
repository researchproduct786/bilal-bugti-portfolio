// Captures the full (WebGL, scroll-driven) hero at several scroll positions.
// Headless Chromium reports no fine pointer, so the pointer media query is forced to match.
import { launch } from './browser.mjs';
const [url = 'http://localhost:3000/', out = 'tests/shots/hero'] = process.argv.slice(2);
const b = await launch(); const p = await b.newPage();
await p.setViewport({ width: 1440, height: 810 });
await p.evaluateOnNewDocument(() => { const mm = window.matchMedia.bind(window); window.matchMedia = (q) => (/pointer: fine/.test(q) ? { matches: innerWidth >= 900, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} } : mm(q)); });
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await p.goto(url, { waitUntil: 'networkidle2' });
await new Promise((r) => setTimeout(r, 2500));
const info = await p.evaluate(() => ({ canvas: !!document.querySelector('.hero canvas'), heroH: document.querySelector('.hero')?.getBoundingClientRect().height, lite: !!document.querySelector('.morph-lite') }));
console.log(JSON.stringify(info));
const span = (info.heroH || 4000) - 810;
for (const [i, f] of [0, 0.35, 0.62, 0.95].entries()) {
  await p.evaluate((y) => scrollTo(0, y), span * f); await new Promise((r) => setTimeout(r, 2200));
  await p.screenshot({ path: `${out}-${i}.jpg`, quality: 70 });
}
console.log('errors', errs.length, errs.slice(0, 3).join(' | '));
await b.close();
