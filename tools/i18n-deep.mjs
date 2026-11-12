// One-off codemod, second pass for client components (see i18n-wrap.mjs for the first):
//  · string literals in ternaries / && inside JSX → t('…')
//  · template literals in JSX children and human-facing attributes → t('… {name} …', { name })
//  · top-level data consts → i18n([...]) + `const x = t.x(xEn)` inside each component that uses them
import ts from 'typescript'; import fs from 'fs';
const ATTRS = new Set(['alt', 'aria-label', 'title', 'placeholder', 'kicker', 'lede', 'label', 'note', 'heading', 'sub', 'value']);
const q = (s) => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
const prose = (s) => /\p{L}{2,}/u.test(s);
for (const file of process.argv.slice(2)) {
  const src = fs.readFileSync(file, 'utf8'); const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = []; const done = new Set();
  const inT = (n) => { for (let p = n.parent; p; p = p.parent) if (ts.isCallExpression(p) && /^(t|i18n)$|\.x$/.test(p.expression.getText())) return true; return false; };
  const tpl = (n) => {
    let s = n.head.text; const vars = []; let k = 0;
    for (const sp of n.templateSpans) { const e = sp.expression; let name = ts.isIdentifier(e) ? e.text : ts.isPropertyAccessExpression(e) ? e.name.text : 'v' + k++; while (vars.some((v) => v[0] === name && v[1] !== e.getText())) name += '2'; if (!vars.some((v) => v[0] === name)) vars.push([name, e.getText()]); s += `{${name}}` + sp.literal.text; }
    return `t(${q(s)}, { ${vars.map(([a, b]) => (a === b ? a : `${a}: ${b}`)).join(', ')} })`;
  };
  const human = (n, ok) => {  // n: expression inside JSX; rewrite literals reachable through ?: && || + only
    if (done.has(n) || inT(n)) return;
    if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) && prose(n.text)) { done.add(n); edits.push([n.getStart(), n.getEnd(), `t(${q(n.text)})`]); }
    else if (ts.isTemplateExpression(n) && prose(n.head.text + n.templateSpans.map((s) => s.literal.text).join(''))) { done.add(n); edits.push([n.getStart(), n.getEnd(), tpl(n)]); }
    else if (ts.isConditionalExpression(n)) { human(n.whenTrue); human(n.whenFalse); }
    else if (ts.isBinaryExpression(n) && /^(&&|\|\||\?\?)$/.test(n.operatorToken.getText())) { human(n.right); if (n.operatorToken.getText() !== '&&') human(n.left); }
    else if (ts.isParenthesizedExpression(n)) human(n.expression);
  };
  const dataConsts = [];
  for (const st of sf.statements) if (ts.isVariableStatement(st) && !st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) for (const d of st.declarationList.declarations) {
    let init = d.initializer; if (!init || !ts.isIdentifier(d.name)) continue; const name = d.name.text; if (/^[A-Z_]+$/.test(name)) continue;
    const core = ts.isAsExpression(init) ? init.expression : init;
    if (!(ts.isArrayLiteralExpression(core) || ts.isObjectLiteralExpression(core))) continue;
    let has = false; const scan = (x) => { if ((ts.isStringLiteral(x) || ts.isNoSubstitutionTemplateLiteral(x)) && /\p{L}{3,}/u.test(x.text) && (/\s/.test(x.text) || /^[A-Z]/.test(x.text))) has = true; ts.forEachChild(x, scan); }; scan(core);
    if (!has) continue;
    dataConsts.push(name); edits.push([d.name.getStart(), d.name.getEnd(), name + 'En']); edits.push([init.getStart(), init.getStart(), 'i18n(']); edits.push([init.getEnd(), init.getEnd(), ')']);
  }
  const hosts = new Map();
  const visit = (n, host) => {
    if ((ts.isFunctionDeclaration(n) || ts.isArrowFunction(n) || ts.isFunctionExpression(n)) && n.body && ts.isBlock(n.body)) { const nm = ts.isFunctionDeclaration(n) ? n.name?.text : (n.parent && ts.isVariableDeclaration(n.parent) ? n.parent.name.getText() : ''); if (nm && /^[A-Z]/.test(nm)) { host = n; hosts.set(n, hosts.get(n) ?? new Set()); } }
    if (host && ts.isIdentifier(n) && dataConsts.includes(n.text) && !(n.parent && ts.isPropertyAccessExpression(n.parent) && n.parent.name === n) && !(ts.isPropertyAssignment(n.parent) && n.parent.name === n)) hosts.get(host).add(n.text);
    if (ts.isJsxExpression(n) && n.expression) { const attr = n.parent && ts.isJsxAttribute(n.parent) ? n.parent.name.getText() : null; if (attr === null || ATTRS.has(attr)) human(n.expression); }
    ts.forEachChild(n, (c) => visit(c, host));
  };
  visit(sf, null);
  for (const [h, names] of hosts) {
    const body = h.body.getText(); const needsT = !/const t = useT\(\)/.test(body.slice(0, 200));
    const lines = (needsT && (names.size || true) ? '\n  const t = useT();' : '') + [...names].map((n) => `\n  const ${n} = t.x(${n}En);`).join('');
    const at = needsT ? h.body.getStart() + 1 : h.body.getStart() + 1 + body.slice(1).indexOf('const t = useT();') + 'const t = useT();'.length;
    if (names.size || needsT) edits.push([at, at, needsT ? lines : lines]);
  }
  let head = ''; if (!src.includes("from '@/i18n/core'") && dataConsts.length) head += "import { i18n } from '@/i18n/core';\n"; if (!src.includes("@/i18n/client")) head += "import { useT } from '@/i18n/client';\n";
  if (head) { const m = src.match(/^('use client';\n)?/); edits.push([m[0].length, m[0].length, head]); }
  let out = src; for (const [a, b, r] of edits.sort((x, y) => y[0] - x[0] || (y[1] - x[1]))) out = out.slice(0, a) + r + out.slice(b);
  fs.writeFileSync(file, out); console.log(file, edits.length, 'data:', dataConsts.join(','));
}
