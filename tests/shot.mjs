// usage: node tests/shot.mjs <url> <out.png> [width] [height] [scrollY] [fullPage]
import { launch } from './browser.mjs';
const [url, out, w = 1440, h = 900, y = 0, full = ''] = process.argv.slice(2);
const b = await launch(); const p = await b.newPage();
await p.setViewport({ width: +w, height: +h, deviceScaleFactor: 1, isMobile: +w < 700, hasTouch: +w < 700 });
p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) console.log('[console]', m.type(), m.text().slice(0, 300)); });
p.on('pageerror', (e) => console.log('[pageerror]', e.message));
await p.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, 2500));
if (+y) { await p.evaluate((yy) => window.scrollTo(0, yy), +y); await new Promise((r) => setTimeout(r, 3500)); }
if (full) { await p.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in'))); await new Promise((r) => setTimeout(r, 900)); }
await p.screenshot({ path: out, fullPage: !!full });
await b.close();
