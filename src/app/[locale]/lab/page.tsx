import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { localeCodes, href, type LocaleCode } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { Shell } from '@/components/site/Shell';
import { PageHero, FinalCTA } from '@/components/site/Blocks';
import { ReferenceReel } from '@/components/home/HomeSections';
import { CapabilityVisual } from '@/components/visuals/Capability';

export const dynamicParams = false;
export function generateStaticParams() { return localeCodes.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const b = getBundle(locale as LocaleCode);
  return { title: `${b.t.nav.lab} — ${b.c.pages.lab.title}`, description: b.c.pages.lab.lede, alternates: { canonical: `/${locale}/lab`, languages: Object.fromEntries(localeCodes.map((c) => [c, `/${c}/lab`])) } };
}

export default async function Lab({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const L = (p: string) => href(locale as LocaleCode, p);

  return (
    <Shell b={b}>
      <PageHero kicker={t.nav.lab} title={c.pages.lab.title} lede={c.pages.lab.lede} />
      <section className="section tight">
        <div className="wrap"><ReferenceReel
            title={t.nav.lab}
            body={c.pages.lab.note}
            caption={t.ui.reelCaption}
            alt={`${t.nav.lab} — ${c.pages.lab.title}`}
          /></div>
      </section>
      <section className="section tight rule">
        <div className="wrap">
          <div className="capgrid">
            {['branding', 'marketing', 'automation', 'web'].map((k) => (
              <div key={k} className="capcard reveal"><span className="capcard-media"><CapabilityVisual id={k} todayLabel={t.home.today} /></span></div>
            ))}
          </div>
          <p className="notice reveal" style={{ marginTop: 28 }}><b>{t.ui.concept}</b>{c.pages.lab.note}</p>
        </div>
      </section>
      <FinalCTA kicker={t.ui.next} q={t.home.finalQ} a={t.home.finalA} primaryHref={L('/contact')} primaryLabel={t.home.finalCta} secondaryHref={L('/work')} secondaryLabel={t.work.kicker} />
    </Shell>
  );
}
