// Locale sweep: every route in every language — status, lang/dir, hreflang, translated title, no untranslated leak.
// usage: node tests/locales.mjs [baseUrl]
import fs from 'fs';
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const locales = { en: 'ltr', ar: 'rtl', es: 'ltr', de: 'ltr', fr: 'ltr', 'zh-Hans': 'ltr' };
const paths = ['', '/about', '/services', '/services/digital-product-development', '/services/ai-business-systems', '/services/digital-growth-creative', '/work', '/work/halden-objects', '/work/tillo', '/work/deskhand', '/work/linework-crm', '/work/ember-and-rye', '/work/slowtide', '/case-studies', '/process', '/industries', '/results', '/testimonials', '/insights', '/lab', '/contact'];
const probe = { ar: 'ابدأ مشروعًا', es: 'Empezar un proyecto', de: 'Projekt starten', fr: 'Démarrer un projet', 'zh-Hans': '开始一个项目', en: 'Start a project' };
let pass = 0, fail = 0; const bad = (m) => { fail++; console.log('FAIL', m); }; const ok = () => pass++;
const titles = {};
for (const [l, dir] of Object.entries(locales)) for (const p of paths) {
  const url = base + (l === 'en' ? '' : '/' + l) + (p || (l === 'en' ? '/' : ''));
  const r = await fetch(url, { redirect: 'manual' }); if (r.status >= 400 || r.status >= 300) { bad(`${url} → ${r.status}`); continue; } ok();
  const h = await r.text();
  new RegExp(`<html[^>]*lang="${l}"[^>]*dir="${dir}"`).test(h) ? ok() : bad(`${url} lang/dir`);
  (h.match(/rel="alternate"[^>]*hrefLang=/gi) || []).length >= 6 ? ok() : bad(`${url} hreflang count ${(h.match(/hrefLang=/gi) || []).length}`);
  h.includes(probe[l]) ? ok() : bad(`${url} missing nav CTA in ${l}`);
  const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || ''; t ? ok() : bad(`${url} no title`);
  (titles[p] ||= {})[l] = t;
  if (l !== 'en') { const main = h.slice(h.indexOf('<main'), h.indexOf('</main>')).replace(/<script[\s\S]*?<\/script>/g, ''); for (const s of ['Start a project', 'Read the case studies', 'What is included', 'The problem', 'Key features', 'Concept project']) if (main.includes('>' + s + '<')) bad(`${url} untranslated “${s}”`); ok(); }
}
for (const [p, t] of Object.entries(titles)) for (const l of ['ar', 'zh-Hans']) (t[l] && t[l] !== t.en) ? ok() : bad(`${p} title not translated for ${l}: ${t[l]}`);
for (const [u, want] of [['/en/about', 308], ['/xx/about', 404], ['/de/nope', 404]]) { const r = await fetch(base + u, { redirect: 'manual' }); r.status === want ? ok() : bad(`${u} → ${r.status}, expected ${want}`); }
const sm = await (await fetch(base + '/sitemap.xml')).text(); (sm.match(/<loc>/g) || []).length >= paths.length * 6 ? ok() : bad('sitemap entries ' + (sm.match(/<loc>/g) || []).length);
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
