// Finds English source strings still visible on translated pages. usage: node tests/leaks.mjs [baseUrl] [locale]
import fs from 'fs';
const base = process.argv[2] || 'http://localhost:3000'; const l = process.argv[3] || 'de';
const keys = JSON.parse(fs.readFileSync('src/i18n/keys.json', 'utf8')); const dict = JSON.parse(fs.readFileSync(`src/i18n/dict/${l}.json`, 'utf8'));
const cand = Object.entries(keys).filter(([id, en]) => en.length > 18 && dict[id] && dict[id] !== en).map(([, en]) => en);
const paths = ['', '/about', '/services', '/services/digital-product-development', '/services/ai-business-systems', '/services/digital-growth-creative', '/work', '/work/halden-objects', '/work/tillo', '/work/deskhand', '/work/linework-crm', '/work/ember-and-rye', '/work/slowtide', '/case-studies', '/process', '/industries', '/results', '/testimonials', '/insights', '/lab', '/contact'];
const dec = (s) => s.replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
let n = 0;
for (const p of paths) { const h = dec((await (await fetch(`${base}/${l}${p}`)).text()).replace(/<script[\s\S]*?<\/script>/g, '')); const hits = cand.filter((en) => h.includes(en)); n += hits.length; for (const x of hits) console.log(`${p || '/'}  ←  ${x.slice(0, 90)}`); }
console.log(`${n} leaks`); process.exit(n ? 1 : 0);
