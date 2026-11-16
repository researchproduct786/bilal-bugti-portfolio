/**
 * End-to-end checks.
 *
 * Run against a server:  npm run build && npm start &   then   npm run test:e2e
 *
 * These are HTTP-level checks (every route, every language, markup sanity, assets, sitemap)
 * plus the project's own static content checks. They deliberately do not claim to test
 * rendering, scrolling or touch: that needs a real browser, and this sandbox has none.
 */
const base = process.env.BASE || 'http://127.0.0.1:3000';
const locales = ['en', 'ar', 'es', 'de', 'fr', 'zh'];
const en = {
  projects: ['halden-objects', 'tillo', 'deskhand', 'linework-crm', 'ember-and-rye', 'slowtide'],
  services: ['digital-product-development', 'ai-business-systems', 'digital-growth-creative'],
};
const paths = [
  '', '/work', '/services', '/process', '/industries', '/about', '/insights', '/lab', '/contact',
  '/case-studies', '/testimonials', '/results',
  ...en.projects.map((p) => `/work/${p}`),
  ...en.services.map((s) => `/services/${s}`),
];

let pass = 0;
const fails = [];
const ok = (cond, msg) => (cond ? pass++ : fails.push(msg));

const html = async (path) => {
  const r = await fetch(base + path);
  return { status: r.status, body: await r.text() };
};

/* 1 — every route in every language */
for (const loc of locales) {
  for (const p of paths) {
    const url = `/${loc}${p}`;
    const { status, body } = await html(url);
    ok(status === 200, `${url} → ${status}`);
    if (status !== 200) continue;

    const h1 = (body.match(/<h1[\s>]/g) || []).length;
    ok(h1 === 1, `${url}: ${h1} h1 elements (expected 1)`);
    ok(body.includes(`<div lang="${loc}"`), `${url}: html lang`);
    ok(body.includes(`dir="${loc === 'ar' ? 'rtl' : 'ltr'}"`), `${url}: direction`);
    ok(body.includes('rel="canonical"'), `${url}: canonical`);
    ok(/hreflang="ar"/i.test(body) && /hreflang="zh"/i.test(body), `${url}: hreflang alternates`);
    ok(!body.includes('/scene/'), `${url}: references a removed 3D asset`);
    // Only inspect rendered markup: Next.js's RSC payload legitimately contains the word "undefined".
    const visible = body.replace(/<script[\s\S]*?<\/script>/g, '');
    ok(!/>\s*(undefined|NaN|\[object Object\])\s*</.test(visible), `${url}: rendered undefined/NaN/[object Object]`);
    ok(!visible.includes('[object Object]'), `${url}: rendered [object Object]`);

    // Untranslated English chrome would mean the language selector lies.
    if (loc !== 'en') {
      const leaks = ['Skip to content', 'Start a project', 'Explore my work', 'Concept project', 'Working demonstration']
        .filter((s) => body.includes(`>${s}<`));
      ok(leaks.length === 0, `${url}: untranslated UI text — ${leaks.join(', ')}`);
    }
  }
}

/* 2 — legacy URLs keep working via the middleware rewrite */
for (const p of ['/', '/work', '/contact', '/work/tillo']) {
  const r = await fetch(base + p, { redirect: 'manual' });
  ok(r.status === 200, `unprefixed ${p} → ${r.status}`);
}

/* 3 — real 404s */
for (const p of ['/xx', '/en/work/nope', '/en/services/nope', '/ar/work/nope']) {
  const { status } = await html(p);
  ok(status === 404, `${p} → ${status} (expected 404)`);
}

/* 4 — every image the site references exists and is not enormous */
const seen = new Set();
for (const loc of ['en', 'ar', 'zh']) {
  const { body } = await html(`/${loc}`);
  for (const m of body.matchAll(/\/img\/[\w-]+\.(?:webp|png|jpg)/g)) seen.add(m[0]);
}
ok(seen.size >= 10, `only ${seen.size} images referenced`);
for (const src of seen) {
  const r = await fetch(base + src);
  ok(r.status === 200, `image ${src} → ${r.status}`);
  const len = Number(r.headers.get('content-length') || 0);
  ok(len === 0 || len < 320_000, `image ${src} is ${Math.round(len / 1024)} KB (budget 320 KB)`);
}

/* 5 — no shipped route still refers to a missing photo */
for (const p of ['/en', '/en/services/ai-business-systems', '/en/work/deskhand']) {
  const { body } = await html(p);
  const refs = [...new Set([...body.matchAll(/\/img\/[\w-]+\.(?:webp|png|jpg)/g)].map((m) => m[0]))];
  for (const ref of refs) ok((await fetch(base + ref)).status === 200, `${p} → missing ${ref}`);
}

/* 6 — sitemap, robots, structured data */
const sm = await (await fetch(base + '/sitemap.xml')).text();
ok((sm.match(/<url>/g) || []).length >= 120, 'sitemap covers every locale');
for (const loc of locales) ok(sm.includes(`/${loc}/work`), `sitemap includes ${loc}`);
ok(/hreflang/i.test(sm), 'sitemap has hreflang alternates');
ok((await fetch(base + '/robots.txt')).status === 200, 'robots.txt');

const home = (await html('/en')).body;
ok(home.includes('application/ld+json'), 'Person structured data present');
ok(home.includes('Bilal Bugti'), 'name present in hero');
ok(/Concept project/i.test(home) || /concept/i.test(home), 'concept disclosure present');

/* 7 — the demos are interactive markup, not screenshots */
const demoPage = (await html('/en/work/halden-objects')).body;
ok(demoPage.includes('Add to cart'), 'store demo renders a real cart button');
ok(/<button/.test(demoPage), 'demo contains interactive buttons');
ok(!/demo[\s\S]{0,200}\.jpg/.test(demoPage), 'demo is not a static image');

/* 8 — security headers */
for (const h of ['x-content-type-options', 'referrer-policy', 'permissions-policy']) {
  const r = await fetch(base + '/en');
  ok(r.headers.has(h), `missing header ${h}`);
}

console.log(`\n${pass} passed, ${fails.length} failed`);
for (const f of fails) console.log('  ✗ ' + f);
if (fails.length) process.exitCode = 1;
