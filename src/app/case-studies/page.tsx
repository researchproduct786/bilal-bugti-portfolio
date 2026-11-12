import type { Metadata } from 'next';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { Cover } from '@/components/demos/Cover';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export const metadata: Metadata = { title: 'Case Studies — the reasoning behind six concept projects', description: 'Problem, approach, design decisions and what would be measured — written up for each of Bilal Bugti’s six self-initiated concept projects.', alternates: { canonical: '/case-studies' } };

export default function CaseStudies() {
  return (
    <>
      <PageHero kicker="Case studies" title={<>The reasoning, <span className="serif muted">not just the screens.</span></>} lede="These write-ups cover the six concept projects on this site. They are self-initiated, so there are no client outcomes to report — instead, each one explains the problem, the decisions made, and what I would measure in a real engagement.">
        <span className="tag concept">Concept case studies</span><span className="tag">No client results claimed</span>
      </PageHero>
      {projects.map((p, i) => (
        <section key={p.slug} id={p.slug} className={`section tight ${i ? 'rule' : ''} ${i % 2 ? 'alt' : ''}`} aria-labelledby={`cs-${p.slug}`}>
          <div className="wrap">
            <div className="cs-head">
              <div className="reveal"><p className="mono muted">{p.n} — {p.category} · Concept project</p><h2 id={`cs-${p.slug}`} className="h1" style={{ marginTop: 14 }}>{p.brand}</h2><p className="serif muted" style={{ fontSize: 'clamp(24px, 2.6vw, 38px)', marginTop: 6 }}>{p.title}</p></div>
              <div className="reveal"><Cover project={p} /></div>
            </div>
            <div className="cs-body">
              <div className="reveal"><p className="kicker">Problem</p><p className="body" style={{ marginTop: 14 }}>{p.problem}</p></div>
              <div className="reveal"><p className="kicker">Approach</p><p className="body" style={{ marginTop: 14 }}>{p.solution}</p></div>
              <div className="reveal"><p className="kicker">Would measure</p><ul className="ticks" style={{ marginTop: 14 }}>{p.measure.map((m) => <li key={m}>{m}</li>)}</ul></div>
            </div>
            <ol className="ledger" style={{ marginTop: 40 }}>{p.decisions.map((d, k) => <li key={d.title} className="reveal"><span className="n">{String(k + 1).padStart(2, '0')}</span><h3 className="h3">{d.title}</h3><p className="body">{d.body}</p></li>)}</ol>
            <div className="reveal" style={{ marginTop: 32 }}><Link className="textlink" href={`/work/${p.slug}`}>Open the working demonstration <span aria-hidden="true">→</span></Link></div>
          </div>
        </section>
      ))}
      <FinalCTA />
    </>
  );
}
