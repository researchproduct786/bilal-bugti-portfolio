import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { localeCodes, href, type LocaleCode } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { Shell } from '@/components/site/Shell';
import { PageHero, FinalCTA } from '@/components/site/Blocks';
import { Scene } from '@/components/visuals/Scene';

export const dynamicParams = false;
export function generateStaticParams() { return localeCodes.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const b = getBundle(locale as LocaleCode);
  return { title: `${b.t.nav.industries} — ${b.c.pages.industries.title}`, description: b.c.pages.industries.lede, alternates: { canonical: `/${locale}/industries`, languages: Object.fromEntries(localeCodes.map((c) => [c, `/${c}/industries`])) } };
}

export default async function Industries({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const L = (p: string) => href(locale as LocaleCode, p);

  return (
    <Shell b={b}>
      <PageHero kicker={t.industries.kicker} title={c.pages.industries.title} lede={c.pages.industries.lede} />
      <section className="section tight">
        <div className="wrap">
          <div className="indgrid big">
            {c.industries.map((i) => (
              <div key={i.name} className="indcard reveal">
                <p className="indcard-n">{i.name}</p>
                <p className="indcard-d">{i.note}</p>
              </div>
            ))}
          </div>
          <p className="notice reveal" style={{ marginTop: 32 }}><b>{t.ui.concept}</b>{c.pages.industries.note}</p>
        </div>
      </section>
      <section className="section tight rule alt2">
        <div className="wrap duo">
          <Scene name="discover" caption={t.process.step1Vis} ratio="4 / 3" />
          <Scene name="operations" caption={t.process.step2Vis} ratio="4 / 3" />
        </div>
      </section>
      <FinalCTA kicker={t.ui.next} q={t.home.finalQ} a={t.home.finalA} primaryHref={L('/contact')} primaryLabel={t.home.finalCta} secondaryHref={L('/work')} secondaryLabel={t.work.kicker} />
    </Shell>
  );
}
