/**
 * Internationalisation registry. Six languages, all published.
 * English is the source language; every other language is a dictionary keyed by a stable id
 * for each English string (see `keys.json`, maintained by `tools/i18n-extract.mjs`).
 * Translations were written and self-reviewed during development; they have not been
 * reviewed by professional human translators.
 */
export type LocaleCode = 'en' | 'ar' | 'es' | 'de' | 'fr' | 'zh-Hans';
export interface LocaleMeta { code: LocaleCode; label: string; english: string; dir: 'ltr' | 'rtl'; og: string }
export const locales: LocaleMeta[] = [
  { code: 'en', label: 'English', english: 'English', dir: 'ltr', og: 'en_US' },
  { code: 'ar', label: 'العربية', english: 'Arabic', dir: 'rtl', og: 'ar_AR' },
  { code: 'es', label: 'Español', english: 'Spanish', dir: 'ltr', og: 'es_ES' },
  { code: 'de', label: 'Deutsch', english: 'German', dir: 'ltr', og: 'de_DE' },
  { code: 'fr', label: 'Français', english: 'French', dir: 'ltr', og: 'fr_FR' },
  { code: 'zh-Hans', label: '简体中文', english: 'Simplified Chinese', dir: 'ltr', og: 'zh_CN' },
];
export const defaultLocale: LocaleCode = 'en';
export const localeCodes = locales.map((l) => l.code);
export const isLocale = (v: string | undefined): v is LocaleCode => !!v && (localeCodes as string[]).includes(v);
export const localeMeta = (c: string) => locales.find((l) => l.code === c) ?? locales[0];
export const LOCALE_COOKIE = 'bb_locale';

/** `/work` → `/ar/work` (English keeps the unprefixed URL). External links and anchors pass through. */
export function localePath(locale: string, href: string) {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const bare = stripLocale(href);
  return locale === defaultLocale ? bare : `/${locale}${bare === '/' ? '' : bare}`;
}
export function stripLocale(path: string) {
  const m = path.match(/^\/([A-Za-z-]+)(\/.*|$|\?.*|#.*)/);
  if (m && isLocale(m[1])) return m[2] && !m[2].startsWith('?') && !m[2].startsWith('#') ? m[2] : '/' + (m[2] ?? '');
  return path;
}
