/**
 * Process lockstep test.
 *
 * A full-page screenshot cannot show whether the image actually changes with the
 * copy, so this walks the seven steps one at a time: it scrolls each step's own box
 * into the reading band, waits for the cross-fade, and captures the *pinned frame*
 * together with the step's number, its title and the image source that is currently
 * visible. The assertion is that all seven states are distinct — seven different
 * pictures, seven different titles — and that each one is actually painted.
 */
import { launch } from '/home/user/bilal-bugti-portfolio/tests/browser.mjs';

const base = process.env.BASE || 'http://127.0.0.1:3100';
const out = process.env.OUT || '/tmp/process';

const b = await launch();
const p = await b.newPage();
const errs = [];
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));

await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await p.goto(base + '/en', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 900));

const states = [];
const steps = await p.$$eval('[data-step]', (els) => els.length);
if (steps !== 7) errs.push(`expected 7 steps, found ${steps}`);

for (let i = 0; i < steps; i += 1) {
  // Park the step in the middle of the viewport, which is the band the observer uses.
  await p.evaluate((n) => {
    const el = document.querySelector(`[data-step="${n}"]`);
    const r = el.getBoundingClientRect();
    window.scrollBy({ top: r.top - window.innerHeight / 2 + r.height / 2, behavior: 'instant' });
  }, i);
  await new Promise((r) => setTimeout(r, 1300));

  const state = await p.evaluate(() => {
    const on = [...document.querySelectorAll('.jx-layer')].findIndex((l) => l.classList.contains('is-on'));
    // Only the scene photograph: a layer may also contain a small interface whose
    // own images would otherwise shift the index and mis-report which picture is up.
    const layers = [...document.querySelectorAll('.jx-layer .scene-img > img')].map((im) => im.getAttribute('src'));
    const tag = document.querySelector('.jx-frame-t')?.textContent ?? '';
    const num = document.querySelector('.jx-frame-n')?.textContent ?? '';
    const opacity = on >= 0 ? getComputedStyle(document.querySelectorAll('.jx-layer')[on]).opacity : '0';
    return { on, src: layers[on] ?? null, tag, num, opacity, allSrc: layers };
  });
  states.push(state);

  const box = await p.evaluate(() => {
    // `clip` is in page coordinates, not viewport coordinates: the frame is sticky,
    // so its viewport rect has to be offset by the scroll position or the shot
    // silently captures whatever happens to sit at that page offset.
    const r = document.querySelector('.jx-frame').getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), width: Math.round(r.width), height: Math.round(r.height) };
  });
  if (box.height > 40) await p.screenshot({ path: `${out}-${i + 1}.png`, clip: box });
}

await b.close();

const srcs = states.map((s) => s.src);
const tags = states.map((s) => s.tag);
const problems = [];
if (new Set(srcs).size !== 7) problems.push(`only ${new Set(srcs).size} distinct images: ${srcs.join(', ')}`);
if (new Set(tags).size !== 7) problems.push(`only ${new Set(tags).size} distinct titles: ${tags.join(' | ')}`);
if (states.some((s) => Number(s.opacity) < 0.99)) problems.push(`a layer did not finish its cross-fade: ${states.map((s) => s.opacity).join(',')}`);
if (states.some((s, i) => s.on !== i)) problems.push('the active layer index did not follow the step');

console.log(JSON.stringify({ states, problems, errs }, null, 1));
if (problems.length || errs.length) process.exitCode = 1;
