import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { services } from '@/data/services';
import { projects } from '@/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/work', '/services', '/industries', '/case-studies', '/process', '/results', '/about', '/testimonials', '/insights', '/lab', '/contact',
    ...services.map((s) => `/services/${s.slug}`), ...projects.map((p) => `/work/${p.slug}`)];
  return paths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: 'monthly', priority: p === '' ? 1 : p.split('/').length > 2 ? 0.6 : 0.8 }));
}
