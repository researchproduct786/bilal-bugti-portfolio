// usage: node tests/tiles.mjs <url> <prefix> [width] [tileHeight]  — full page split into tiles for review
import { launch } from './browser.mjs';
const [url, prefix, w = 1440, th = 1500] = process.argv.slice(2);
const b = await launch(); const p = await b.newPage();
await p.setViewport({ width: +w, height: 900, deviceScaleFactor: 1, isMobile: +w < 700, hasTouch: +w < 700 });
p.on('console', (m) => { if (m.type() === 'error') console.log('[console]', m.text().slice(0, 300)); });
p.on('pageerror', (e) => console.log('[pageerror]', e.message));
await p.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, 1500));
await p.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in')));
await new Promise((r) => setTimeout(r, 1200));
const H = await p.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < H; y += +th) { await p.screenshot({ path: `${prefix}-${i++}.png`, clip: { x: 0, y, width: +w, height: Math.min(+th, H - y) }, captureBeyondViewport: true }); }
console.log('height', H, 'tiles', i);
await b.close();
