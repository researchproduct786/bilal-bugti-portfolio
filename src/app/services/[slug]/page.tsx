import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getService, services } from '@/data/services';
import { getProject } from '@/data/projects';
import { Cover } from '@/components/demos/Cover';
import { Btn } from '@/components/site/Btn';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export const dynamicParams = false;
export function generateStaticParams() { return services.map((s) => ({ slug: s.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getService((await params).slug); if (!s) return {};
  return { title: s.title, description: `${s.short} ${s.lead.join(', ')}.`, alternates: { canonical: `/services/${s.slug}` }, openGraph: { title: s.title, description: s.short, url: `/services/${s.slug}` } };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug); if (!s) notFound();
  const demos = s.demos.map((d) => getProject(d)!);
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: s.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return (
    <>
      <PageHero crumbs={[{ href: '/services', label: 'Services' }, { label: s.title }]} kicker={`Service ${s.letter}`} title={s.headline} lede={s.short}>
        {s.lead.map((c) => <span key={c} className="tag">{c}</span>)}
      </PageHero>

      <section className="section tight" aria-labelledby="prob-h">
        <div className="wrap split">
          <div><p className="kicker reveal">The problem</p><h2 id="prob-h" className="h2 reveal" style={{ marginTop: 20 }}>{s.problem.title}</h2></div>
          <div><p className="proj-lead reveal">{s.problem.body}</p>
            <p className="mono muted reveal" style={{ margin: '36px 0 14px', textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11 }}>You might recognise</p>
            <ul className="ticks reveal">{s.problem.signs.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
      </section>

      <section className="section tight rule alt" aria-labelledby="sol-h">
        <div className="wrap split">
          <div><p className="kicker reveal">The solution</p><h2 id="sol-h" className="h2 reveal" style={{ marginTop: 20 }}>{s.solution.title}</h2></div>
          <div><p className="proj-lead reveal">{s.solution.body}</p></div>
        </div>
      </section>

      <section className="section tight rule" aria-labelledby="inc-h">
        <div className="wrap">
          <p className="kicker reveal">What’s included</p>
          <h2 id="inc-h" className="sr-only">What is included</h2>
          <div className="incl">{s.included.map((g, i) => (
            <div key={g.title} className="reveal"><span className="mono muted">{String(i + 1).padStart(2, '0')}</span><h3 className="h3">{g.title}</h3><ul className="ticks">{g.items.map((x) => <li key={x}>{x}</li>)}</ul></div>
          ))}</div>
          <p className="chips reveal" style={{ marginTop: 36 }}><span className="mono muted" style={{ marginRight: 8, alignSelf: 'center' }}>Also available:</span>{s.supporting.map((c) => <span key={c} className="chip">{c}</span>)}</p>
        </div>
      </section>

      <section className="section tight rule alt" aria-labelledby="how-h">
        <div className="wrap">
          <div className="split" style={{ marginBottom: 40 }}><div><p className="kicker reveal">How it works</p></div><div><h2 id="how-h" className="h2 reveal">Four stages, each with something you can see.</h2></div></div>
          <ol className="ledger">{s.steps.map((st, i) => <li key={st.title} className="reveal"><span className="n">{String(i + 1).padStart(2, '0')}</span><h3 className="h3">{st.title}</h3><p className="body">{st.body}</p></li>)}</ol>
          <div className="reveal" style={{ marginTop: 32 }}><Link className="textlink" href="/process">The full seven-step process <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      <section className="section tight rule" aria-labelledby="demo-h">
        <div className="wrap">
          <div className="split" style={{ marginBottom: 40 }}><div><p className="kicker reveal">See it demonstrated</p></div><div><h2 id="demo-h" className="h2 reveal">Concept projects for this service.</h2><p className="body reveal" style={{ marginTop: 14 }}>Original, working demonstrations with fictional brands — not client work.</p></div></div>
          <ul className={`demos3 n${demos.length}`}>{demos.map((p) => (
            <li key={p.slug} className="reveal"><Link href={`/work/${p.slug}`} className="workcard" data-cursor><Cover project={p} /><span className="workcard-meta"><span className="mono muted">{p.n} — {p.category}</span><span className="h3">{p.brand}</span><span className="muted">{p.title}</span></span></Link></li>
          ))}</ul>
        </div>
      </section>

      <section className="section tight rule alt" aria-labelledby="faq-h">
        <div className="wrap split">
          <div><p className="kicker reveal">Questions</p><h2 id="faq-h" className="h2 reveal" style={{ marginTop: 20 }}>Asked often.</h2><div className="reveal" style={{ marginTop: 32 }}><Btn href={`/contact?service=${s.slug}`}>Start a project</Btn></div></div>
          <div className="reveal">{s.faqs.map((f) => <details className="faq" key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <FinalCTA />
    </>
  );
}
