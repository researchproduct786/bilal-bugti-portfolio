import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { services } from '@/data/services';
import { projects } from '@/data/projects';
import { localeCodes, localePath } from '@/i18n/config';

/** Every page in every language, each entry listing its hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/work', '/services', '/industries', '/case-studies', '/process', '/results', '/about', '/testimonials', '/insights', '/lab', '/contact',
    ...services.map((s) => `/services/${s.slug}`), ...projects.map((p) => `/work/${p.slug}`)];
  const abs = (l: string, p: string) => `${site.url}${localePath(l, p)}`.replace(/\/$/, '') || site.url;
  return paths.flatMap((p) => localeCodes.map((l) => ({
    url: abs(l, p), changeFrequency: 'monthly' as const, priority: p === '/' ? 1 : p.split('/').length > 2 ? 0.6 : 0.8,
    alternates: { languages: Object.fromEntries(localeCodes.map((x) => [x, abs(x, p)])) },
  })));
}
