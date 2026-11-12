import type { Metadata } from 'next';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { Cover } from '@/components/demos/Cover';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export const metadata: Metadata = { title: 'Work — six original concept projects', description: 'Six self-initiated demonstration projects by Bilal Bugti: e-commerce, a mobile business app, an AI assistant interface, a CRM, restaurant ordering and a marketing campaign. Fictional brands, working screens.', alternates: { canonical: '/work' } };

export default function Work() {
  return (
    <>
      <PageHero kicker="Work" title={<>Six concept projects. <span className="serif muted">All of them work.</span></>} lede="Each project below was designed and built for this portfolio, with a fictional brand and sample data. They exist to show how I approach a problem — and so that confidential client work stays confidential.">
        <span className="tag concept">Concept Projects</span><span className="tag">Self-initiated demonstrations</span>
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
                    <span className="textlink" style={{ justifySelf: 'start', marginTop: 8 }}>Open the demonstration <span aria-hidden="true">→</span></span>
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
