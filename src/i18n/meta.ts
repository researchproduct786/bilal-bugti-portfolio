import type { Metadata } from 'next';
import { defaultLocale, localeCodes, localeMeta, localePath } from './config';

/** Title, description, canonical, hreflang alternates and Open Graph for one page in one language. */
export function pageMeta(locale: string, path: string, title: string, description: string): Metadata {
  const languages: Record<string, string> = Object.fromEntries(localeCodes.map((l) => [l, localePath(l, path)]));
  languages['x-default'] = localePath(defaultLocale, path);
  const url = localePath(locale, path);
  return {
    title, description,
    alternates: { canonical: url, languages },
    openGraph: { type: 'website', siteName: 'Bilal Bugti', title, description, url, locale: localeMeta(locale).og, alternateLocale: localeCodes.filter((l) => l !== locale).map((l) => localeMeta(l).og), images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Bilal Bugti' }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
  };
}
