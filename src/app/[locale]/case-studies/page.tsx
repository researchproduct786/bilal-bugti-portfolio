import type { Metadata } from 'next';
import { getT, type PageProps } from '@/i18n/server';
import { pageMeta } from '@/i18n/meta';
import { i18n } from '@/i18n/core';
import Link from '@/components/site/L';
import { projects as projectsEn } from '@/data/projects';
import { Cover } from '@/components/demos/Cover';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params; const t = getT(locale);
  return pageMeta(locale, '/case-studies', t('Case Studies — the reasoning behind six concept projects'), t('Problem, approach, design decisions and what would be measured — written up for each of Bilal Bugti’s six self-initiated concept projects.'));
}

export default async function CaseStudies({ params }: PageProps) {
  const { locale } = await params; const t = getT(locale); const projects = t.x(projectsEn);
  return (
    <>
      <PageHero kicker={t('Case studies')} title={<>{t('The reasoning,')} <span className="serif muted">{t('not just the screens.')}</span></>} lede={t('These write-ups cover the six concept projects on this site. They are self-initiated, so there are no client outcomes to report — instead, each one explains the problem, the decisions made, and what I would measure in a real engagement.')}>
        <span className="tag concept">{t('Concept case studies')}</span><span className="tag">{t('No client results claimed')}</span>
      </PageHero>
      {projects.map((p, i) => (
        <section key={p.slug} id={p.slug} className={`section tight ${i ? 'rule' : ''} ${i % 2 ? 'alt' : ''}`} aria-labelledby={`cs-${p.slug}`}>
          <div className="wrap">
            <div className="cs-head">
              <div className="reveal"><p className="mono muted">{p.n} — {p.category} {t('· Concept project')}</p><h2 id={`cs-${p.slug}`} className="h1" style={{ marginTop: 14 }}>{p.brand}</h2><p className="serif muted" style={{ fontSize: 'clamp(24px, 2.6vw, 38px)', marginTop: 6 }}>{p.title}</p></div>
              <div className="reveal"><Cover project={p} /></div>
            </div>
            <div className="cs-body">
              <div className="reveal"><p className="kicker">{t('Problem')}</p><p className="body" style={{ marginTop: 14 }}>{p.problem}</p></div>
              <div className="reveal"><p className="kicker">{t('Approach')}</p><p className="body" style={{ marginTop: 14 }}>{p.solution}</p></div>
              <div className="reveal"><p className="kicker">{t('Would measure')}</p><ul className="ticks" style={{ marginTop: 14 }}>{p.measure.map((m) => <li key={m}>{m}</li>)}</ul></div>
            </div>
            <ol className="ledger" style={{ marginTop: 40 }}>{p.decisions.map((d, k) => <li key={d.title} className="reveal"><span className="n">{String(k + 1).padStart(2, '0')}</span><h3 className="h3">{d.title}</h3><p className="body">{d.body}</p></li>)}</ol>
            <div className="reveal" style={{ marginTop: 32 }}><Link className="textlink" href={`/work/${p.slug}`}>{t('Open the working demonstration')} <span aria-hidden="true">→</span></Link></div>
          </div>
        </section>
      ))}
      <FinalCTA />
    </>
  );
}
