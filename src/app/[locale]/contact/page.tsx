import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { localeCodes, locales, type LocaleCode, href } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { Shell } from '@/components/site/Shell';
import { PageHero } from '@/components/site/Blocks';
import { InquiryForm } from '@/components/contact/InquiryForm';
import { site } from '@/data/site';

export const dynamicParams = false;
export function generateStaticParams() { return locales.map((l) => ({ locale: l.code })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const b = getBundle(locale as LocaleCode);
  return { title: `${b.t.nav.contact} — ${b.t.contact.title}`, description: b.t.contact.lede, alternates: { canonical: `/${locale}/contact`, languages: Object.fromEntries(localeCodes.map((c) => [c, `/${c}/contact`])) } };
}

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locales as readonly { code: string }[]).some((l) => l.code === locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;

  return (
    <Shell b={b}>
      <PageHero kicker={t.contact.kicker} title={t.contact.title} lede={t.contact.lede}>
        {site.email && <a className="tag" href={`mailto:${site.email}`}>{site.email}</a>}
        {site.whatsapp && <a className="tag" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">{t.contact.whatsapp}</a>}
      </PageHero>
      <section className="section tight">
        <div className="wrap">
          <InquiryForm locale={locale as LocaleCode} t={t} industries={c.industries} services={c.services} />
        </div>
      </section>
    </Shell>
  );
}
