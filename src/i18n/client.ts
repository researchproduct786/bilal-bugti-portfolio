'use client';
import { createContext, useContext } from 'react';
import { defaultLocale, href, type LocaleCode } from './config';

const LocaleContext = createContext<LocaleCode>(defaultLocale);

export const LocaleProvider = LocaleContext.Provider;

export function useLocale(): LocaleCode {
  return useContext(LocaleContext);
}

/** `useL()` → `/es/work` for a href of `/work`, always inside the current language. */
export function useL() {
  const locale = useLocale();
  return (path: string) => href(locale, path);
}

export { LocaleContext };
