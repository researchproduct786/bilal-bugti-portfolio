import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@/styles/globals.css';
import '@/styles/home.css';
import '@/styles/pages.css';
import '@/styles/demos.css';
import '@/styles/journey.css';
import '@/styles/rtl.css';
import { site } from '@/data/site';
import { isLocale, localeCodes, localeMeta } from '@/i18n/config';
import { getDict, getT, type PageProps } from '@/i18n/server';
import { I18nProvider } from '@/i18n/client';
import { pageMeta } from '@/i18n/meta';
import { i18n } from '@/i18n/core';
import { Nav } from '@/components/site/Nav';
import { Footer } from '@/components/site/Footer';
import { Interactions } from '@/components/site/Interactions';

export const dynamicParams = false;
export function generateStaticParams() { return localeCodes.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params; const t = getT(locale);
  const title = `${site.name} — ${t(site.role)} | ${t(site.discipline)}`;
  return {
    metadataBase: new URL(site.url),
    ...pageMeta(locale, '/', title, t(site.description)),
    title: { default: title, template: `%s — ${site.name}` },
    applicationName: site.name, authors: [{ name: site.name }], creator: site.name,
    twitter: { card: 'summary_large_image', title, description: t(site.description) },
    robots: { index: true, follow: true },
  };
}
export const viewport: Viewport = { themeColor: '#060709', colorScheme: 'dark', width: 'device-width', initialScale: 1 };

export default async function RootLayout({ children, params }: { children: React.ReactNode } & PageProps) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const t = getT(locale); const meta = localeMeta(locale);
  const personLd = {
    '@context': 'https://schema.org', '@type': 'Person', name: site.name, url: site.url, jobTitle: t(site.role), description: t(site.description), inLanguage: locale,
    knowsAbout: ['Shopify', ...t.x(i18n(['E-commerce', 'Mobile app development', 'Web development', 'Business automation', 'Digital marketing']))],
    ...(site.socials.length ? { sameAs: site.socials.map((s) => s.url) } : {}),
  };
  return (
    <html lang={locale} dir={meta.dir}>
      <body>
        <noscript><style>{'.reveal{opacity:1!important;transform:none!important}'}</style></noscript>
        <I18nProvider locale={locale} dict={getDict(locale)}>
          <a className="skip-link" href="#main">{t('Skip to content')}</a>
          <Nav />
          <main id="main" tabIndex={-1} style={{ outline: 'none' }}>{children}</main>
          <Footer />
          <Interactions />
        </I18nProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </body>
    </html>
  );
}
