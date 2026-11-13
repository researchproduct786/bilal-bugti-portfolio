import type { ReactNode } from 'react';
import { href, type LocaleCode } from '@/i18n/config';
import type { LocaleBundle } from '@/i18n/dictionaries';
import { site } from '@/data/site';
import { LocaleProvider } from '@/i18n/client';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { Interactions } from './Interactions';
import { DepthMotion } from './DepthMotion';
import { MobileBar } from './MobileBar';

/**
 * The chrome every page shares. Locale-aware navigation labels are assembled on the server
 * and handed to the client components as plain data.
 */
export function Shell({ b, children }: { b: LocaleBundle; children: ReactNode }) {
  const { locale, t, c } = b;
  const L = (p: string) => href(locale, p as string);

  const labels = {
    t: {
      menu: t.ui.menu,
      close: t.ui.close,
      language: t.ui.language,
      changeLanguage: t.ui.changeLanguage,
      start: t.ui.start,
      siteIndex: t.ui.siteIndex,
      primaryNav: t.ui.primaryNav,
    },
    nav: t.nav,
    primary: [
      { href: '/work', label: t.nav.work },
      { href: '/services', label: t.nav.services },
      { href: '/process', label: t.nav.process },
      { href: '/about', label: t.nav.about },
    ],
    index: [
      { href: '/', label: t.ui.home, note: c.projects.length ? `${c.projects.length} ${t.nav.work}` : '' },
      { href: '/work', label: t.nav.work, note: t.work.title },
      { href: '/services', label: t.nav.services, note: t.services.title },
      { href: '/process', label: t.nav.process, note: t.process.kicker },
      { href: '/industries', label: t.nav.industries, note: c.pages.industries.title },
      { href: '/case-studies', label: t.nav.caseStudies, note: c.pages.caseStudies.title },
      { href: '/about', label: t.nav.about, note: t.about.title },
      { href: '/insights', label: t.nav.insights, note: t.insights.title },
      { href: '/testimonials', label: t.nav.testimonials, note: t.home.testimonialTitle },
      { href: '/lab', label: t.nav.lab, note: c.pages.lab.title },
      { href: '/contact', label: t.nav.contact, note: t.contact.title },
    ],
  };

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: `${site.url}/${locale}`,
    jobTitle: t.meta.role,
    description: t.meta.description,
    knowsAbout: ['E-commerce', 'Shopify', 'Mobile app development', 'Web development', 'Business automation', 'Digital marketing'],
    ...(site.socials.length ? { sameAs: site.socials.map((s) => s.url) } : {}),
  };

  return (
    <LocaleProvider value={locale as LocaleCode}>
      <a className="skip-link" href="#main">{t.ui.skip}</a>
      <Nav labels={labels} name={site.name} />
      <main id="main" tabIndex={-1} style={{ outline: 'none' }}>{children}</main>
      <Footer b={b} name={site.name} />
      <MobileBar label={t.contact.kicker} closeLabel={t.ui.close} />
      <Interactions />
      <DepthMotion />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <span className="sr-only">{L('/')}</span>
    </LocaleProvider>
  );
}
