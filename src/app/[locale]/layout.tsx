import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { localeCodes, type LocaleCode, getLocaleMeta } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { site } from '@/data/site';

export function generateStaticParams() {
  return localeCodes.map((locale) => ({ locale }));
}

export const dynamicParams = false;

/** Per-language metadata: title, description, canonical and hreflang alternates. */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) return {};
  const { t, meta } = getBundle(locale as LocaleCode);
  const languages: Record<string, string> = {};
  for (const code of localeCodes) languages[code] = `/${code}`;

  return {
    title: { default: `${site.name} — ${t.meta.role} | ${t.meta.discipline}`, template: `%s — ${site.name}` },
    description: t.meta.description,
    alternates: { canonical: `/${locale}`, languages },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${site.name} — ${t.meta.discipline}`,
      description: t.meta.description,
      url: `/${locale}`,
      locale: meta.ogLocale,
    },
    twitter: { card: 'summary_large_image', title: `${site.name} — ${t.meta.discipline}`, description: t.meta.description },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const { dir, meta } = getBundle(locale as LocaleCode);
  const stack = meta.fontStack;

  return (
    <div
      lang={locale}
      dir={dir}
      data-locale={locale}
      style={{
        ['--f-sans' as string]: stack.sans ?? "var(--f-sans-base)",
        ['--f-serif' as string]: stack.serif ?? "var(--f-serif-base)",
      }}
    >
      {children}
    </div>
  );
}
