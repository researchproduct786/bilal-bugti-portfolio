/**
 * Internationalisation registry.
 *
 * English is the only complete, reviewed language. The others are registered so the
 * architecture (dictionary shape, text direction, selector UI) is ready, but they are
 * NOT published: we do not ship unreviewed machine translation as if it were verified.
 *
 * To launch a language: add `src/i18n/<code>.ts` implementing `Dictionary`,
 * have it professionally reviewed, then switch its status to 'live'.
 */
export type LocaleCode = 'en' | 'ar' | 'es' | 'de' | 'fr' | 'zh-Hans';

export interface LocaleMeta {
  code: LocaleCode;
  label: string; // endonym
  english: string;
  dir: 'ltr' | 'rtl';
  status: 'live' | 'planned';
}

export const locales: LocaleMeta[] = [
  { code: 'en', label: 'English', english: 'English', dir: 'ltr', status: 'live' },
  { code: 'ar', label: 'العربية', english: 'Arabic', dir: 'rtl', status: 'planned' },
  { code: 'es', label: 'Español', english: 'Spanish', dir: 'ltr', status: 'planned' },
  { code: 'de', label: 'Deutsch', english: 'German', dir: 'ltr', status: 'planned' },
  { code: 'fr', label: 'Français', english: 'French', dir: 'ltr', status: 'planned' },
  { code: 'zh-Hans', label: '简体中文', english: 'Simplified Chinese', dir: 'ltr', status: 'planned' },
];

export const defaultLocale: LocaleCode = 'en';
