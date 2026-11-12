import ar from './dict/ar.json'; import es from './dict/es.json'; import de from './dict/de.json'; import fr from './dict/fr.json'; import zh from './dict/zh-Hans.json';
import { isLocale, defaultLocale, type LocaleCode } from './config';
import { makeT, localize, type Dict, type T } from './core';

const dicts: Record<string, Dict | null> = { en: null, ar, es, de, fr, 'zh-Hans': zh };
export const getDict = (locale: string): Dict | null => dicts[locale] ?? null;
export function getT(locale: string): T & { x: <V>(v: V) => V; locale: LocaleCode } {
  const loc = isLocale(locale) ? locale : defaultLocale;
  const t = makeT(getDict(loc)) as T & { x: <V>(v: V) => V; locale: LocaleCode };
  t.x = (v) => localize(v, t); t.locale = loc; return t;
}
export type PageProps<P = object> = { params: Promise<{ locale: string } & P> };
