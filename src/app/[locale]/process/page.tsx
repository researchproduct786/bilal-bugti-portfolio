import type { Metadata } from 'next';
import { getT, type PageProps } from '@/i18n/server';
import { pageMeta } from '@/i18n/meta';
import { i18n } from '@/i18n/core';
import { ProcessJourney } from '@/components/home/ProcessJourney';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params; const t = getT(locale);
  return pageMeta(locale, '/process', t('Process — seven steps from problem to delivered product'), t('How a project with Bilal Bugti runs: understand the business, identify the real problem, plan, design, build, test, deliver and support.'));
}

const principlesEn = i18n([
  { t: 'Plain language', b: 'Scope, cost and trade-offs are explained without jargon. If something cannot be explained simply, it is not understood well enough yet.' },
  { t: 'Visible progress', b: 'You see working software at each milestone — not a percentage in a status email.' },
  { t: 'No surprise costs', b: 'Any paid tool, API or subscription is raised before it is used, with free alternatives where they exist.' },
  { t: 'Built to hand over', b: 'The aim is a product you can run without me. Documentation and a walkthrough are part of delivery.' },
]);

export default async function Process({ params }: PageProps) {
  const { locale } = await params; const t = getT(locale); const principles = t.x(principlesEn);
  return (
    <>
      <PageHero kicker={t('Process')} title={<>{t('Seven steps.')} <span className="serif muted">{t('The first two matter most.')}</span></>} lede={t('Most failed projects were built well and aimed badly. So the work starts with understanding — and only then moves to design and code.')} />
      <section aria-label={t('The seven steps')}><ProcessJourney /></section>
      <section className="section tight rule alt" aria-labelledby="pr-h">
        <div className="wrap split">
          <div><p className="kicker reveal">{t('Working principles')}</p><h2 id="pr-h" className="h2 reveal" style={{ marginTop: 20 }}>{t('What you can expect from me.')}</h2></div>
          <ol className="notes">{principles.map((p, i) => <li key={p.t} className="reveal"><span className="mono muted">{String(i + 1).padStart(2, '0')}</span><h3 className="h3">{p.t}</h3><p className="body">{p.b}</p></li>)}</ol>
        </div>
      </section>
      <FinalCTA q={t('Ready for step one?')} a={t('It’s a conversation about your business. Nothing more.')} />
    </>
  );
}
