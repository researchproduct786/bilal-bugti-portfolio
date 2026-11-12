// Collects every translatable English string and maintains src/i18n/keys.json (id → English).
//   t('…') calls · string literals inside i18n(…) markers · every prose string in src/data/*.ts
// usage: node tools/i18n-extract.mjs [--report]
import ts from 'typescript'; import fs from 'fs'; import path from 'path'; import crypto from 'crypto';
const root = 'src'; const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(f) && !p.includes('i18n' + path.sep + 'dict')) files.push(p); } })(root);
const SKIP = new Set(['slug', 'id', 'service', 'project', 'accent', 'n', 'letter', 'href', 'demos', 'key', 'code', 'icon', 'tone', 'kind', 'url', 'source']);
const found = new Set();
const prose = (s) => /\p{L}/u.test(s) && !/^(#[0-9a-f]{3,8}|[a-z0-9]+(-[a-z0-9]+)+|\/[\w\-/[\]?=&]*|https?:.*|NEXT_PUBLIC_\w+)$/i.test(s);
const lit = (n) => (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) ? n.text : null;
function collectAll(n) {
  const s = lit(n);
  if (s !== null) { const p = n.parent; const skip = p && ts.isPropertyAssignment(p) && p.initializer === n && SKIP.has(p.name.getText().replace(/['"]/g, '')); const isKey = p && ts.isPropertyAssignment(p) && p.name === n; if (!skip && !isKey && prose(s)) found.add(s); }
  if (ts.isPropertyAssignment(n) && SKIP.has(n.name.getText().replace(/['"]/g, ''))) return;
  ts.forEachChild(n, collectAll);
}
for (const f of files) {
  const sf = ts.createSourceFile(f, fs.readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true, f.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const isData = f.startsWith(path.join('src', 'data'));
  const visit = (n) => {
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n) || ts.isTypeNode(n)) return;
    if (ts.isCallExpression(n)) {
      const c = n.expression.getText();
      if ((c === 't' || c.endsWith('.t')) && n.arguments[0]) { const s = lit(n.arguments[0]); if (s !== null && prose(s)) found.add(s); }
      if (c === 'i18n') { n.arguments.forEach(collectAll); return; }
    }
    if (isData) { const s = lit(n); if (s !== null) { const p = n.parent; const skip = p && ts.isPropertyAssignment(p) && (p.name === n || SKIP.has(p.name.getText().replace(/['"]/g, ''))); if (!skip && prose(s) && !/process\.env/.test(p?.getText() ?? '')) found.add(s); } if (ts.isPropertyAssignment(n) && SKIP.has(n.name.getText().replace(/['"]/g, ''))) return; }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}
const id = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 7);
const keys = {}; for (const s of [...found].sort()) keys[id(s)] = s;
fs.writeFileSync('src/i18n/keys.json', JSON.stringify(keys, null, 0).replace(/","/g, '",\n"') + '\n');
const words = Object.values(keys).join(' ').split(/\s+/).length;
console.log(`keys ${Object.keys(keys).length}  words ${words}`);
for (const l of ['ar', 'es', 'de', 'fr', 'zh-Hans']) {
  const p = `src/i18n/dict/${l}.json`; const d = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  const missing = Object.keys(keys).filter((k) => !d[k]); const stale = Object.keys(d).filter((k) => !keys[k]);
  if (process.argv.includes('--prune')) { for (const k of stale) delete d[k]; fs.writeFileSync(p, JSON.stringify(d, null, 0).replace(/","/g, '",\n"') + '\n'); }
  console.log(`${l}: translated ${Object.keys(keys).length - missing.length}/${Object.keys(keys).length}  missing ${missing.length}  stale ${stale.length}`);
  if (process.argv.includes('--missing') && l === (process.argv[process.argv.indexOf('--missing') + 1] || 'ar')) fs.writeFileSync('/tmp/missing.tsv', missing.map((k) => `${k}\t${keys[k]}`).join('\n'));
}
