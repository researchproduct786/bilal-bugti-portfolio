// Lists string literals that look like prose but are not passed through t()/i18n().
import ts from 'typescript'; import fs from 'fs'; import path from 'path';
const files = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.tsx$/.test(f)) files.push(p); } })('src');
const OK_ATTR = /^(className|href|src|id|type|name|role|viewBox|d|fill|stroke|key|rel|target|lang|dir|htmlFor|autoComplete|inputMode|media|srcSet|sizes|as|variant|points|transform|method|decoding|loading|fetchPriority|strokeLinecap|strokeLinejoin|textAnchor|fontFamily|dominantBaseline|preserveAspectRatio|x|y|width|height|aria-controls|aria-labelledby|aria-describedby|aria-current|aria-live|aria-hidden|slug|pattern|value|step|min|max|dangerouslySetInnerHTML|property|content|strokeDasharray|accept|crossOrigin|data-\w+|style|pathname|scroll|tone|kind|size|mode)$/;
let n = 0;
for (const f of files) {
  if (/avdev|opengraph/.test(f)) continue;
  const sf = ts.createSourceFile(f, fs.readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = (node, safe) => {
    if (ts.isImportDeclaration(node) || ts.isTypeNode(node) || ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) return;
    if (ts.isCallExpression(node)) { const c = node.expression.getText(); if (c === 't' || c === 'tr' || c === 'i18n' || c.endsWith('.t') || /matchMedia|querySelector|getContext|addEventListener|removeEventListener|import|console\.|createElement|setAttribute|toggleAttribute|getAttribute|classList|startsWith|includes|replace|split|join|padStart|localeCompare|searchParams|pageMeta$/.test(c)) safe = true; }
    if (ts.isJsxAttribute(node) && OK_ATTR.test(node.name.getText())) safe = true;
    if (ts.isPropertyAssignment(node) && /^(slug|id|service|project|accent|n|href|key|code|icon|tone|kind|url|font|fontFamily|display|position|type|className|color|background|border\w*|padding\w*|margin\w*|grid\w*|transform|transition|opacity|width|height|inset|top|left|right|bottom|gap|flex\w*|align\w*|justify\w*|overflow|cursor|pointerEvents|textAlign|whiteSpace|letterSpacing|textTransform|fontSize|fontWeight|lineHeight|max\w+|min\w+|aspectRatio|objectFit|filter|rootMargin|behavior|block|start|end|trigger|ease|canonical|card|themeColor|colorScheme|initialScale|'@\w+')$/.test(node.name.getText())) safe = true;
    if (ts.isBinaryExpression(node) && /===|!==|==|!=/.test(node.operatorToken.getText())) safe = true;
    if (ts.isCaseClause(node)) { ts.forEachChild(node, (c) => visit(c, c === node.expression ? true : safe)); return; }
    if (ts.isElementAccessExpression(node)) safe = true;
    const text = ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ? node.text : ts.isTemplateExpression(node) ? node.head.text + node.templateSpans.map((s) => s.literal.text).join('§') : null;
    if (text !== null && !safe) {
      const prose = /\p{L}{2,}/u.test(text) && (/\s/.test(text.trim()) || /^[A-Z][a-z]+/.test(text)) && !/^[\w-]+( [\w-]+)* ?(\$\{|§)?$/.test(text.replace(/[A-Z]/g, 'x')) || (/^[A-Z][a-z]{2,}/.test(text) && !/^(Enter|Escape|Tab|Arrow\w+|Promise|Bilal Bugti)$/.test(text));
      const cls = /^[a-z0-9\-_ §:./()%,#]*$/.test(text);
      if (prose && !cls) { n++; console.log(`${f}:${sf.getLineAndCharacterOfPosition(node.getStart()).line + 1}  ${text.slice(0, 90)}`); }
    }
    ts.forEachChild(node, (c) => visit(c, safe));
  };
  visit(sf, false);
}
console.log('untranslated candidates:', n); process.exitCode = n ? 1 : 0;
