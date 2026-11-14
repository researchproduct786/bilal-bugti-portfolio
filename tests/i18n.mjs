/**
 * Translation completeness check.
 *
 * Compiles the dictionary/content modules with esbuild-free TypeScript stripping via a small
 * transform, then walks the English shape and asserts that every other locale:
 *   1. has the same keys,
 *   2. has a non-empty string for each one,
 *   3. does not simply repeat the English string (a sign of an untranslated key),
 *   4. keeps arrays the same length (so a project cannot lose a feature list).
 *
 * Names and proper nouns legitimately repeat; they are listed in `ALLOWED_SAME`.
 */
import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const ALLOWED_SAME = new Set([
  'meta.role', 'home.heroTitle', 'home.heroCta1',
  'projects.*.brand', 'projects.*.skills', 'projects.*.features',
  // Proper nouns, and product words that are correct in the target language too.
  'contact.whatsapp', 'contact.preferredWhatsApp', 'contact.flexible', 'industries[*].name', 'services[*].steps[*].title',
  // Words that are spelled identically in the target language and are not an error.
  'nav.services', 'nav.contact', 'services.kicker', 'contact.kicker', 'ui.demo', 'story[*].title',
]);

const flatten = (obj, prefix = '', out = {}) => {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else {
    out[prefix] = obj;
  }
  return out;
};

const keyPath = (p) => p.replace(/\[\d+\]/g, '[*]').replace(/\.projects\.[\w-]+\./g, '.projects.*.');
/** Structural values (slugs, enum ids, technology names) never need translating. */
const STRUCTURAL = /(\.(slug|id|visual|service|project|accent|n|brand)|capabilities|demos|skills|features|tech)(\[|$|\.)/;
const stripBrands = (p) => p.replace(/projects\[(\d+)\]\.brand$/, 'projects.*.brand');

const dir = await mkdtemp(path.join(tmpdir(), 'i18n-'));
const entry = path.join(dir, 'entry.ts');
await writeFile(entry, `
  export { dictionaries, contents } from '${process.cwd()}/src/i18n/dictionaries';
  export { uiLabels, demoNotes } from '${process.cwd()}/src/i18n/ui-labels';
  export { defaultUiLabels } from '${process.cwd()}/src/components/visuals/Ui';
`);
const out = path.join(dir, 'bundle.mjs');
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent', jsx: 'automatic' });
const { dictionaries, contents, uiLabels, demoNotes, defaultUiLabels } = await import(pathToFileURL(out).href);

const locales = Object.keys(dictionaries);
const fails = [];
const base = flatten(dictionaries.en);
const baseContent = flatten(contents.en);

for (const loc of locales.filter((l) => l !== 'en')) {
  const t = flatten(dictionaries[loc]);
  const c = flatten(contents[loc]);

  for (const [k, v] of Object.entries(base)) {
    if (!(k in t)) { fails.push(`${loc}: missing key "${k}"`); continue; }
    if (typeof t[k] !== 'string' || !t[k].trim()) fails.push(`${loc}: empty "${k}"`);
    else if (t[k] === v && !ALLOWED_SAME.has(keyPath(k)) && !STRUCTURAL.test(k) && v.length > 3) fails.push(`${loc}: untranslated "${k}" = "${v.slice(0, 40)}"`);
  }
  for (const k of Object.keys(t)) if (!(k in base)) fails.push(`${loc}: extra key "${k}"`);

  for (const [k, v] of Object.entries(baseContent)) {
    if (!(k in c)) { fails.push(`${loc}: missing content "${k}"`); continue; }
    if (typeof c[k] !== 'string' || !c[k].trim()) fails.push(`${loc}: empty content "${k}"`);
    else if (typeof v === 'string' && c[k] === v && !ALLOWED_SAME.has(stripBrands(keyPath(k))) && !STRUCTURAL.test(k) && v.length > 3) {
      fails.push(`${loc}: untranslated content "${k}" = "${v.slice(0, 40)}"`);
    }
  }
  for (const k of Object.keys(c)) if (!(k in baseContent)) fails.push(`${loc}: extra content "${k}"`);
}

/* 4 — interface labels drawn inside the product mockups */
const baseUi = flatten(defaultUiLabels);
for (const loc of locales.filter((l) => l !== 'en')) {
  const labels = uiLabels[loc];
  if (!labels) { fails.push(`${loc}: no interface labels`); continue; }
  const t = flatten(labels);
  // These are spelled identically in the target language and are not errors.
  const UI_SAME_OK = new Set(['source', 'pipeline', 'table', 'guides', 'contact', 'campaign', 'menu', 'items']);
  for (const [k, v] of Object.entries(baseUi)) {
    if (!(k in t)) fails.push(`${loc}: missing interface label "${k}"`);
    else if (!String(t[k]).trim()) fails.push(`${loc}: empty interface label "${k}"`);
    else if (String(t[k]) === v && v.length > 3 && !(loc === 'fr' && UI_SAME_OK.has(k))) {
      fails.push(`${loc}: untranslated interface label "${k}" = "${v}"`);
    }
  }
  for (const k of Object.keys(t)) if (!(k in baseUi)) fails.push(`${loc}: extra interface label "${k}"`);
  // every demo note must exist in every language
  for (const [note, tr] of Object.entries(demoNotes)) {
    if (!tr[loc]?.trim()) fails.push(`${loc}: missing demo note "${note}"`);
  }
}

console.log(`${locales.length} locales checked (${Object.keys(base).length} UI keys, ${Object.keys(baseContent).length} content strings)`);
if (fails.length) {
  console.log(`\n${fails.length} problem(s):`);
  for (const f of fails.slice(0, 60)) console.log('  ✗ ' + f);
  if (fails.length > 60) console.log(`  … and ${fails.length - 60} more`);
  process.exitCode = 1;
} else {
  console.log('All translations complete, non-empty and distinct.');
}
