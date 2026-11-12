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
  return pageMeta(locale, '/work', t('Work — six original concept projects'), t('Six self-initiated demonstration projects by Bilal Bugti: e-commerce, a mobile business app, an AI assistant interface, a CRM, restaurant ordering and a marketing campaign. Fictional brands, working screens.'));
}

export default async function Work({ params }: PageProps) {
  const { locale } = await params; const t = getT(locale); const projects = t.x(projectsEn);
  return (
    <>
      <PageHero kicker={t('Work')} title={<>{t('Six concept projects.')} <span className="serif muted">{t('All of them work.')}</span></>} lede={t('Each project below was designed and built for this portfolio, with a fictional brand and sample data. They exist to show how I approach a problem — and so that confidential client work stays confidential.')}>
        <span className="tag concept">{t('Concept Projects')}</span><span className="tag">{t('Self-initiated demonstrations')}</span>
      </PageHero>
      <section className="section tight">
        <div className="wrap">
          <ol className="worklist">
            {projects.map((p) => (
              <li key={p.slug} className="reveal">
                <Link href={`/work/${p.slug}`} className="workrow" data-cursor>
                  <Cover project={p} />
                  <span className="workrow-t">
                    <span className="mono muted">{p.n} — {p.category}</span>
                    <span className="h2">{p.brand}</span>
                    <span className="lede" style={{ fontSize: 18 }}>{p.summary}</span>
                    <span className="chips">{p.features.slice(0, 4).map((f) => <span className="chip" key={f}>{f}</span>)}</span>
                    <span className="textlink" style={{ justifySelf: 'start', marginTop: 8 }}>{t('Open the demonstration')} <span aria-hidden="true">→</span></span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
