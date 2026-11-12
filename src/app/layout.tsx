import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@/styles/globals.css';
import '@/styles/home.css';
import '@/styles/pages.css';
import '@/styles/demos.css';
import { site } from '@/data/site';
import { en } from '@/i18n/en';
import { Nav } from '@/components/site/Nav';
import { Footer } from '@/components/site/Footer';
import { Interactions } from '@/components/site/Interactions';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role} | ${site.discipline}`, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: site.name, title: `${site.name} — ${site.discipline}`, description: site.description, url: '/', locale: 'en' },
  twitter: { card: 'summary_large_image', title: `${site.name} — ${site.discipline}`, description: site.description },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#060709', colorScheme: 'dark', width: 'device-width', initialScale: 1 };

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: site.url,
  jobTitle: site.role,
  description: site.description,
  knowsAbout: ['E-commerce', 'Shopify', 'Mobile app development', 'Web development', 'Business automation', 'Digital marketing'],
  ...(site.socials.length ? { sameAs: site.socials.map((s) => s.url) } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <noscript><style>{'.reveal{opacity:1!important;transform:none!important}'}</style></noscript>
        <a className="skip-link" href="#main">{en.skipToContent}</a>
        <Nav />
        <main id="main" tabIndex={-1} style={{ outline: 'none' }}>{children}</main>
        <Footer />
        <Interactions />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </body>
    </html>
  );
}
