import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@/styles/globals.css';
import '@/styles/home.css';
import '@/styles/pages.css';
import '@/styles/demos.css';
import '@/styles/visuals.css';
import { site } from '@/data/site';
import { defaultLocale } from '@/i18n/config';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#060709', colorScheme: 'dark', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={defaultLocale} dir="ltr">
      <body>
        <noscript><style>{'.reveal{opacity:1!important;transform:none!important}'}</style></noscript>
        {children}
      </body>
    </html>
  );
}
