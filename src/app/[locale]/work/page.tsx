import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { localeCodes, href, type LocaleCode } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { Shell } from '@/components/site/Shell';
import { PageHero, FinalCTA } from '@/components/site/Blocks';
import { ProjectCard } from '@/components/home/ProjectCard';
import { uiLabels } from '@/i18n/ui-labels';

export const dynamicParams = false;
export function generateStaticParams() { return localeCodes.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const b = getBundle(locale as LocaleCode);
  return { title: `${b.t.nav.work} — ${b.t.work.title}`, description: b.t.work.lede, alternates: { canonical: `/${locale}/work`, languages: Object.fromEntries(localeCodes.map((c) => [c, `/${c}/work`])) } };
}

export default async function Work({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const L = (p: string) => href(locale as LocaleCode, p);

  return (
    <Shell b={b}>
      <PageHero kicker={t.work.kicker} title={t.work.title} lede={t.work.lede}>
        <span className="tag concept">{t.ui.concept}</span>
        <span className="tag">{t.ui.selfInitiated}</span>
        <span className="tag">{t.ui.fictional}</span>
      </PageHero>
      <section className="section tight">
        <div className="wrap">
          <ul className="workgrid2">
            {c.projects.map((p) => <li key={p.slug}><ProjectCard project={p} t={t} L={L} ui={uiLabels[locale as LocaleCode]} /></li>)}
          </ul>
          <p className="notice reveal" style={{ marginTop: 40 }}><b>{t.ui.concept}</b>{t.ui.footerNote}</p>
          <div className="reveal" style={{ marginTop: 24 }}>
            <Link className="textlink" href={L('/contact')}>{t.contact.kicker} <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
      <FinalCTA kicker={t.ui.next} q={t.home.finalQ} a={t.home.finalA} primaryHref={L('/contact')} primaryLabel={t.home.finalCta} secondaryHref={L('/services')} secondaryLabel={t.nav.services} />
    </Shell>
  );
}
