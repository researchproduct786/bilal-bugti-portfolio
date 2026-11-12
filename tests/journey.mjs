// Renders the process journey at several scroll positions. usage: node tests/journey.mjs <url> <outPrefix> [w] [h] [stepsCsv]
import { launch } from './browser.mjs';
const [url = 'http://localhost:3000/process', out = 'tests/shots/jr', w = '1440', h = '810', csv = '0,2,4,6'] = process.argv.slice(2);
const browser = await launch(); const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h });
const errors = []; page.on('pageerror', (e) => errors.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
await page.waitForFunction(() => !!window.__journey, { timeout: 120000 });
for (const s of csv.split(',')) {
  await page.evaluate((i) => { const el = document.querySelector('.jr'); const top = el.getBoundingClientRect().top + scrollY + (i / 6) * (el.offsetHeight - innerHeight); scrollTo(0, top); }, +s);
  await new Promise((r) => setTimeout(r, 900));
  await page.evaluate((i) => { window.__journey.jumpTo(i / 6); }, +s);
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `${out}${s}.png` });
}
console.log(errors.length ? 'ERRORS\n' + errors.join('\n') : 'no console errors');
await browser.close();
