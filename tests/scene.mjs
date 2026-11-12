// Renders stills of the studio scene from /lab (used for posters and visual review).
// usage: node tests/scene.mjs <base> <outDir> <name:w:h:cam:morph> ...
import { launch } from './browser.mjs';
const [base, outDir, ...jobs] = process.argv.slice(2);
const b = await launch(); const p = await b.newPage();
p.on('console', (m) => { if (m.type() === 'error') console.log('[console]', m.text().slice(0, 400)); });
p.on('pageerror', (e) => console.log('[pageerror]', e.message));
for (const j of jobs) {
  const [name, w, h, cam, morph] = j.split(':');
  await p.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
  await p.goto(base + '/lab', { waitUntil: 'networkidle2', timeout: 120000 });
  await p.waitForFunction(() => window.__studio && window.__studio.avatarLoaded, { timeout: 90000 });
  await p.evaluate((w, h) => {
    const v = document.querySelector('.labstudio-view'); const c = v.querySelector('canvas');
    Object.assign(v.style, { position: 'fixed', inset: '0', zIndex: 999, aspectRatio: 'auto', width: w + 'px', height: h + 'px', border: 0 });
    document.querySelector('.nav').style.display = 'none';
    window.__studio.resize();
  }, +w, +h);
  await p.evaluate((cam, morph) => { const s = window.__studio; s.setActive(false); s.jumpTo(cam); s.setMorph(Number.isNaN(morph) ? null : morph); s.resize(); s.renderOnce(); }, +cam, +morph);
  await new Promise((r) => setTimeout(r, 400));
  await p.evaluate(() => window.__studio.renderOnce());
  const el = await p.$('.labstudio-view canvas');
  const ext = name.endsWith('.webp') ? 'webp' : 'png';
  await el.screenshot({ path: `${outDir}/${name}`, type: ext, ...(ext === 'webp' ? { quality: 82 } : {}) });
  console.log('wrote', name);
}
await b.close();
