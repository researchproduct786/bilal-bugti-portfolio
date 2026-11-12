// One-off codemod: wraps JSX text and human-facing string attributes in t('…').
// usage: node tools/i18n-wrap.mjs <file.tsx> [...]
import ts from 'typescript'; import fs from 'fs';
const ATTRS = new Set(['alt', 'aria-label', 'title', 'placeholder', 'kicker', 'lede', 'q', 'a', 'label', 'note', 'heading', 'sub']);
const q = (s) => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const ent = (s) => s.replace(/&nbsp;/g, '\u00a0').replace(/&amp;/g, '&').replace(/&rarr;/g, '→').replace(/&mdash;/g, '—');
const client = process.argv.includes('--client');
for (const file of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
  const src = fs.readFileSync(file, 'utf8'); const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  const visit = (n) => {
    if (ts.isJsxText(n)) {
      const raw = n.getFullText(); const m = raw.match(/^(\s*)([\s\S]*?)(\s*)$/); const body = ent(m[2].replace(/\s*\n\s*/g, ' '));
      if (/\p{L}/u.test(body) && !/&[a-z]+;/.test(body)) edits.push([n.getFullStart(), n.getEnd(), `${m[1]}{t(${q(body)})}${m[3]}`]);
    } else if (ts.isJsxAttribute(n) && n.initializer && ts.isStringLiteral(n.initializer) && ATTRS.has(n.name.getText()) && /\p{L}/u.test(n.initializer.text)) {
      edits.push([n.initializer.getStart(), n.initializer.getEnd(), `{t(${q(n.initializer.text)})}`]);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  if (client && edits.length) {
    const hosts = new Set();
    for (const [a] of edits) { let n = ts.getTokenAtPosition ? null : null; const find = (node) => { let best = null; const walk = (x) => { if (x.getFullStart() <= a && a < x.getEnd()) { if ((ts.isFunctionDeclaration(x) || ts.isArrowFunction(x) || ts.isFunctionExpression(x)) && x.body && ts.isBlock(x.body)) { const nm = ts.isFunctionDeclaration(x) ? x.name?.text : (ts.isVariableDeclaration(x.parent) ? x.parent.name.getText() : ''); if (nm && /^[A-Z]/.test(nm) && !best) best = x; } ts.forEachChild(x, walk); } }; walk(node); return best; }; const h = find(sf); if (h) hosts.add(h); else console.log('  no host for edit at', sf.getLineAndCharacterOfPosition(a).line + 1); }
    for (const h of hosts) edits.push([h.body.getStart() + 1, h.body.getStart() + 1, '\n  const t = useT();']);
    if (!src.includes("@/i18n/client")) { const m = src.match(/^('use client';\n)?/); edits.push([m[0].length, m[0].length, "import { useT } from '@/i18n/client';\n"]); }
  }
  let out = src; for (const [a, b, r] of edits.sort((x, y) => y[0] - x[0])) out = out.slice(0, a) + r + out.slice(b);
  fs.writeFileSync(file, out); console.log(file, edits.length);
}
