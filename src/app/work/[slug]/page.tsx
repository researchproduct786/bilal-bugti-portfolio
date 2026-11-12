import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DEMO_NOTE, getProject, projects } from '@/data/projects';
import { getService } from '@/data/services';
import { Demo } from '@/components/demos';
import { Cover } from '@/components/demos/Cover';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export const dynamicParams = false;
export function generateStaticParams() { return projects.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug); if (!p) return {};
  const title = `${p.brand} — ${p.title} (Concept Project)`;
  return { title, description: p.summary, alternates: { canonical: `/work/${p.slug}` }, openGraph: { title, description: p.summary, url: `/work/${p.slug}` } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug); if (!p) notFound();
  const service = getService(p.service)!;
  const i = projects.indexOf(p), next = projects[(i + 1) % projects.length];
  return (
    <>
      <PageHero crumbs={[{ href: '/work', label: 'Work' }, { label: p.brand }]} kicker={`${p.n} — ${p.category}`} title={<>{p.brand}<br /><span className="serif muted">{p.title}</span></>} lede={p.summary}>
        <span className="tag concept">Concept Project</span><span className="tag">Self-initiated demonstration</span><span className="tag">Fictional brand &amp; data</span>
      </PageHero>

      <section className="section tight" aria-labelledby="demo-h">
        <div className="wrap">
          <div className="demo-head"><h2 id="demo-h" className="h3">Try the working demonstration</h2><p className="mono muted">Runs in your browser · nothing is saved or sent</p></div>
          <Demo slug={p.slug} />
          <p className="notice" style={{ marginTop: 18 }}><b>About this demonstration</b>{DEMO_NOTE} Any resemblance to a real business is coincidental.</p>
        </div>
      </section>

      <section className="section tight rule">
        <div className="wrap split">
          <div className="reveal"><p className="kicker">The problem</p><p className="proj-lead" style={{ marginTop: 20 }}>{p.problem}</p></div>
          <div className="reveal"><p className="kicker">The solution</p><p className="proj-lead" style={{ marginTop: 20 }}>{p.solution}</p></div>
        </div>
      </section>

      <section className="section tight rule alt">
        <div className="wrap split">
          <div className="reveal"><p className="kicker">What’s in the demo</p><ul className="ticks" style={{ marginTop: 20 }}>{p.features.map((f) => <li key={f}>{f}</li>)}</ul></div>
          <div className="reveal">
            <dl className="spec">
              <dt>This demo runs on</dt><dd><span className="chips">{p.builtWith.map((t) => <span className="chip" key={t}>{t}</span>)}</span></dd>
              <dt>A client build would likely use</dt><dd><span className="chips">{p.productionStack.map((t) => <span className="chip" key={t}>{t}</span>)}</span></dd>
              <dt>Related service</dt><dd><Link className="link" href={`/services/${service.slug}`}>{service.title}</Link></dd>
              <dt>Status</dt><dd>Concept project — not built for, or commissioned by, a client.</dd>
            </dl>
          </div>
        </div>
      </section>

      <section className="section tight rule" aria-labelledby="dec-h">
        <div className="wrap">
          <p className="kicker reveal">Design decisions</p>
          <h2 id="dec-h" className="h2 reveal" style={{ margin: '20px 0 40px', maxWidth: '16em' }}>Three choices that shaped it.</h2>
          <ol className="ledger">{p.decisions.map((d, k) => <li key={d.title} className="reveal"><span className="n">{String(k + 1).padStart(2, '0')}</span><h3 className="h3">{d.title}</h3><p className="body">{d.body}</p></li>)}</ol>
          <div className="reveal" style={{ marginTop: 48 }}><p className="kicker">In a real engagement, I’d measure</p><p className="chips" style={{ marginTop: 16 }}>{p.measure.map((m) => <span className="chip" key={m}>{m}</span>)}</p></div>
        </div>
      </section>

      <section className="section tight rule">
        <div className="wrap">
          <Link href={`/work/${next.slug}`} className="nextproj" data-cursor>
            <span><span className="mono muted">Next concept project — {next.n}</span><span className="h1">{next.brand} <span aria-hidden="true">→</span></span><span className="muted">{next.title}</span></span>
            <Cover project={next} label={false} />
          </Link>
        </div>
      </section>
      <FinalCTA q="Need something like this, for real?" a="Tell me about the business and the problem. I’ll tell you honestly how I’d approach it." />
    </>
  );
}
