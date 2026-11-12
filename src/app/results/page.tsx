import type { Metadata } from 'next';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export const metadata: Metadata = { title: 'Results — what gets measured, and what is not claimed', description: 'No invented numbers. How Bilal Bugti defines and reports results for stores, apps, business systems and campaigns — and what can be verified on this site today.', alternates: { canonical: '/results' } };

const groups = [
  { t: 'Stores & e-commerce', items: ['Conversion rate by device', 'Checkout completion by step', 'Average order value', 'Repeat purchase rate'] },
  { t: 'Apps & websites', items: ['Task completion time', 'Load speed on a slow connection', 'Active use after launch', 'Support requests avoided'] },
  { t: 'Business systems & automation', items: ['Lead response time', 'Hours of manual work removed', 'Errors and re-entry avoided', 'Deals or orders with no owner'] },
  { t: 'Marketing & campaigns', items: ['Cost per qualified lead', 'Landing page conversion', 'Return on ad spend', 'What was learned, win or lose'] },
];

export default function Results() {
  return (
    <>
      <PageHero kicker="Results" title={<>No invented numbers. <span className="serif muted">Here is what gets measured instead.</span></>} lede="Portfolios often open with impressive statistics that cannot be checked. This one does not. Client results will appear here when they exist, are real, and the client has agreed to share them." />
      <section className="section tight">
        <div className="wrap split">
          <div><p className="kicker reveal">Current status</p><h2 className="h2 reveal" style={{ marginTop: 20 }}>Published client results: none yet.</h2></div>
          <div>
            <p className="proj-lead reveal">That is a deliberate choice, not an omission. Earlier work is confidential, and I will not publish figures, client names or screenshots without permission — or make any up.</p>
            <p className="notice reveal" style={{ marginTop: 28 }}><b>About the numbers elsewhere on this site</b>Every figure inside the demonstration projects — revenue, orders, leads, campaign performance — is fictional sample data, labelled as such where it appears.</p>
          </div>
        </div>
      </section>
      <section className="section tight rule alt" aria-labelledby="m-h">
        <div className="wrap">
          <p className="kicker reveal">How results are defined</p><h2 id="m-h" className="h2 reveal" style={{ margin: '20px 0 40px', maxWidth: '18em' }}>Agreed before the work starts, reported plainly after.</h2>
          <div className="incl four">{groups.map((g, i) => <div key={g.t} className="reveal"><span className="mono muted">{String(i + 1).padStart(2, '0')}</span><h3 className="h3">{g.t}</h3><ul className="ticks">{g.items.map((x) => <li key={x}>{x}</li>)}</ul></div>)}</div>
        </div>
      </section>
      <section className="section tight rule" aria-labelledby="v-h">
        <div className="wrap split">
          <div><p className="kicker reveal">Verifiable today</p><h2 id="v-h" className="h2 reveal" style={{ marginTop: 20 }}>What you can check for yourself.</h2></div>
          <ol className="notes">
            <li className="reveal"><span className="mono muted">01</span><h3 className="h3">Six working demonstrations</h3><p className="body">Add to a cart, move a deal, place a restaurant order and watch the kitchen view change. <Link className="link" href="/work">Open the work</Link>.</p></li>
            <li className="reveal"><span className="mono muted">02</span><h3 className="h3">This website</h3><p className="body">Designed and built as a product in its own right: a real-time 3D scene on desktop, a lighter experience on phones, and no paid services behind it.</p></li>
            <li className="reveal"><span className="mono muted">03</span><h3 className="h3">The reasoning</h3><p className="body">Each project has a written explanation of the decisions behind it. <Link className="link" href="/case-studies">Read the case studies</Link>.</p></li>
          </ol>
        </div>
      </section>
      <section className="section tight rule alt"><div className="wrap"><p className="kicker reveal">What would be measured, per project</p>
        <ul className="ledger" style={{ marginTop: 28 }}>{projects.map((p) => <li key={p.slug} className="reveal"><span className="n">{p.n}</span><h3 className="h3"><Link href={`/work/${p.slug}`}>{p.brand}</Link></h3><p className="chips">{p.measure.map((m) => <span key={m} className="chip">{m}</span>)}</p></li>)}</ul></div></section>
      <FinalCTA />
    </>
  );
}
