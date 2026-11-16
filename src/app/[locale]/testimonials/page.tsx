import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { localeCodes, href, type LocaleCode } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { Shell } from '@/components/site/Shell';
import { PageHero, FinalCTA } from '@/components/site/Blocks';

export const dynamicParams = false;
export function generateStaticParams() { return localeCodes.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const b = getBundle(locale as LocaleCode);
  return { title: `${b.t.nav.testimonials} — ${b.c.pages.testimonials.title}`, description: b.c.pages.testimonials.lede, alternates: { canonical: `/${locale}/testimonials`, languages: Object.fromEntries(localeCodes.map((c) => [c, `/${c}/testimonials`])) } };
}

export default async function Testimonials({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const L = (p: string) => href(locale as LocaleCode, p);

  return (
    <Shell b={b}>
      <PageHero kicker={t.nav.testimonials} title={c.pages.testimonials.title} lede={c.pages.testimonials.lede} />
      <section className="section tight">
        <div className="wrap">
          <div className="twall">
            <figure className="tcard demo reveal">
              <span className="tag concept">{t.ui.sampleData}</span>
              <blockquote>“{c.pages.testimonials.lede}”</blockquote>
              <figcaption><b>{c.pages.testimonials.title}</b><span>{t.ui.concept}</span></figcaption>
            </figure>
            {[1, 2, 3].map((i) => (
              <div key={i} className="tcard empty reveal"><span className="mono">{String(i).padStart(2, '0')}</span><p>{c.pages.testimonials.note}</p></div>
            ))}
          </div>
        </div>
      </section>
      <FinalCTA kicker={t.ui.next} q={t.home.finalQ} a={t.home.finalA} primaryHref={L('/contact')} primaryLabel={t.home.finalCta} secondaryHref={L('/work')} secondaryLabel={t.work.kicker} />
    </Shell>
  );
}
