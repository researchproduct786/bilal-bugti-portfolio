'use client';
import { createContext, useContext, type ReactNode } from 'react';
import { defaultLocale, href, type LocaleCode } from './config';

const LocaleContext = createContext<LocaleCode>(defaultLocale);

/**
 * A real component, not the raw `Context.Provider`.
 *
 * `export const LocaleProvider = LocaleContext.Provider` looks equivalent but breaks at
 * hydration: a server component importing it from a client module gets a client reference,
 * and React 19 resolves that to a lazy value whose type is a `Context` object rather than a
 * component ("Received a promise that resolves to: Context"). Wrapping it in a function keeps
 * the same API and renders correctly on both sides.
 */
export function LocaleProvider({ value, children }: { value: LocaleCode; children: ReactNode }) {
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleCode {
  return useContext(LocaleContext);
}

/** `useL()` → `/es/work` for a href of `/work`, always inside the current language. */
export function useL() {
  const locale = useLocale();
  return (path: string) => href(locale, path);
}

export { LocaleContext };
