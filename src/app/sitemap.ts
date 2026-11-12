import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { localeCodes, href } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of localeCodes) {
    const b = getBundle(locale);
    const paths = [
      '', '/work', '/services', '/process', '/industries', '/about', '/insights', '/lab', '/contact', '/case-studies', '/testimonials',
      ...b.c.services.map((s) => `/services/${s.slug}`),
      ...b.c.projects.map((p) => `/work/${p.slug}`),
    ];
    for (const p of paths) {
      entries.push({
        url: `${site.url}${href(locale, p)}`,
        changeFrequency: 'monthly',
        priority: p === '' ? 1 : p.split('/').length > 2 ? 0.6 : 0.8,
        alternates: { languages: Object.fromEntries(localeCodes.map((c) => [c, `${site.url}${href(c, p)}`])) },
      });
    }
  }
  return entries;
}
