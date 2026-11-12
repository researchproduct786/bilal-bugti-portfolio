// Merges translator work files (tools/i18n-work/*.txt) into src/i18n/dict/*.json.
// Line format:  <line number in source.tsv> ¦ ar ¦ es ¦ de ¦ fr ¦ zh-Hans      ("=" means: same as English, e.g. a name)
import fs from 'fs';
const src = fs.readFileSync('tools/i18n-work/source.tsv', 'utf8').split('\n').map((l) => l.split('\t'));
const langs = ['ar', 'es', 'de', 'fr', 'zh-Hans']; const out = Object.fromEntries(langs.map((l) => [l, {}])); let bad = 0; const seen = new Set();
for (const f of fs.readdirSync('tools/i18n-work').filter((f) => f.endsWith('.txt')).sort()) for (const line of fs.readFileSync(`tools/i18n-work/${f}`, 'utf8').split('\n')) {
  if (!line.trim()) continue; const parts = line.split('¦').map((s) => s.trim()); const n = +parts[0];
  if (!src[n - 1] || parts.length !== 6) { console.log('BAD', f, line.slice(0, 80)); bad++; continue; }
  const [id, en] = src[n - 1]; seen.add(n);
  langs.forEach((l, i) => { const v = parts[i + 1]; const val = v === '=' ? en : v; const ph = (s) => (s.match(/\{\w+\}/g) || []).sort().join(); if (ph(val) !== ph(en)) { console.log('PLACEHOLDER', n, l, en.slice(0, 50)); bad++; } const st = (s) => (s.match(/\*/g) || []).length; if (st(val) !== st(en)) { console.log('MARKER', n, l); bad++; } out[l][id] = val; });
}
const missing = src.map((_, i) => i + 1).filter((n) => !seen.has(n));
for (const l of langs) fs.writeFileSync(`src/i18n/dict/${l}.json`, JSON.stringify(out[l], null, 0).replace(/","/g, '",\n"') + '\n');
console.log(`lines ${seen.size}/${src.length}  bad ${bad}  missing ${missing.length}${missing.length ? ': ' + missing.slice(0, 30).join(',') : ''}`);
