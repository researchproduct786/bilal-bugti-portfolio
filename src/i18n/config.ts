/**
 * Locale registry.
 *
 * All six languages are live and routed: every page exists under `/<locale>/...`.
 * URLs without a locale prefix are rewritten to English by `middleware.ts`, so the old
 * addresses keep working.
 */
export const localeCodes = ['en', 'ar', 'es', 'de', 'fr', 'zh'] as const;
export type LocaleCode = (typeof localeCodes)[number];

export interface LocaleMeta {
  code: LocaleCode;
  /** Endonym, shown in the language selector. */
  label: string;
  /** English name, used in metadata and the accessibility label. */
  english: string;
  dir: 'ltr' | 'rtl';
  ogLocale: string;
  /** Extra font stacks so Arabic and Chinese render correctly without shipping multi-megabyte webfonts. */
  fontStack: { sans?: string; serif?: string };
}

export const locales: LocaleMeta[] = [
  { code: 'en', label: 'English', english: 'English', dir: 'ltr', ogLocale: 'en_US', fontStack: {} },
  {
    code: 'ar', label: 'العربية', english: 'Arabic', dir: 'rtl', ogLocale: 'ar_AR',
    fontStack: { sans: "'Noto Sans Arabic', 'Geeza Pro', 'Segoe UI', Tahoma, sans-serif", serif: "'Noto Naskh Arabic', 'Geeza Pro', 'Traditional Arabic', serif" },
  },
  { code: 'es', label: 'Español', english: 'Spanish', dir: 'ltr', ogLocale: 'es_ES', fontStack: {} },
  { code: 'de', label: 'Deutsch', english: 'German', dir: 'ltr', ogLocale: 'de_DE', fontStack: {} },
  { code: 'fr', label: 'Français', english: 'French', dir: 'ltr', ogLocale: 'fr_FR', fontStack: {} },
  {
    code: 'zh', label: '简体中文', english: 'Chinese (Simplified)', dir: 'ltr', ogLocale: 'zh_CN',
    fontStack: { sans: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', var(--f-sans)" },
  },
];

export const defaultLocale: LocaleCode = 'en';

export const isLocale = (value: string): value is LocaleCode => (localeCodes as readonly string[]).includes(value);
export const getLocaleMeta = (code: LocaleCode): LocaleMeta => locales.find((l) => l.code === code) ?? locales[0];

/** Build a path that keeps the visitor inside their chosen language. */
export function href(locale: LocaleCode, path = '/'): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Strip a locale prefix from a pathname: `/es/work` → `/work`. */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/');
  if (isLocale(parts[1] ?? '')) return `/${parts.slice(2).join('/')}`.replace(/\/$/, '') || '/';
  return pathname || '/';
}
