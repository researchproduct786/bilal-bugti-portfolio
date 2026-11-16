import { ar } from './ar';
import { de } from './de';
import { en, type Dict } from './en';
import { es } from './es';
import { fr } from './fr';
import { getLocaleMeta, locales, type LocaleCode } from './config';
import { contentAr } from './content/ar';
import { contentDe } from './content/de';
import { contentEn } from './content/en';
import { contentEs } from './content/es';
import { contentFr } from './content/fr';
import { contentZh } from './content/zh';
import type { SiteContent } from './content/types';
import { zh } from './zh';

export const dictionaries: Record<LocaleCode, Dict> = { en, ar, es, de, fr, zh };

export const contents: Record<LocaleCode, SiteContent> = {
  en: contentEn,
  ar: contentAr,
  es: contentEs,
  de: contentDe,
  fr: contentFr,
  zh: contentZh,
};

export interface LocaleBundle {
  locale: LocaleCode;
  t: Dict;
  c: SiteContent;
  dir: 'ltr' | 'rtl';
  meta: (typeof locales)[number];
}

/** Server-side helper: everything a page needs for one language. */
export function getBundle(locale: LocaleCode): LocaleBundle {
  return { locale, t: dictionaries[locale], c: contents[locale], dir: getLocaleMeta(locale).dir, meta: getLocaleMeta(locale) };
}

export const getProjectContent = (locale: LocaleCode, slug: string) => contents[locale].projects.find((p) => p.slug === slug);
export const getServiceContent = (locale: LocaleCode, slug: string) => contents[locale].services.find((s) => s.slug === slug);

export type { Dict };
export type { SiteContent };
