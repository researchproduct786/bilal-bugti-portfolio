'use client';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { makeT, localize, type Dict, type T } from './core';
import { defaultLocale, localePath } from './config';

const Ctx = createContext<{ locale: string; t: T }>({ locale: defaultLocale, t: makeT(null) });
export function I18nProvider({ locale, dict, children }: { locale: string; dict: Dict | null; children: ReactNode }) {
  const value = useMemo(() => ({ locale, t: makeT(dict) }), [locale, dict]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useLocale = () => useContext(Ctx).locale;
/** `t('English source')` in client components; `t.x(data)` deep-translates data objects; `t.href('/work')` localises a path. */
export function useT() {
  const { locale, t } = useContext(Ctx);
  return useMemo(() => Object.assign(((s: string, v?: Record<string, string | number>) => t(s, v)) as T, { x: <V,>(v: V) => localize(v, t), locale, href: (h: string) => localePath(locale, h) }), [locale, t]);
}
