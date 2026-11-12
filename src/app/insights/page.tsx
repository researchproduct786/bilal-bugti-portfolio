import type { Metadata } from 'next';
import { lessons } from '@/data/content';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export const metadata: Metadata = { title: 'Insights — working notes on technology and business', description: 'Short working notes from Bilal Bugti, and the topics being drafted for future articles on e-commerce, apps, automation and building under constraints.', alternates: { canonical: '/insights' } };

const drafts = [
  ['E-commerce', 'What a small store should fix before spending on ads'], ['Mobile', 'Designing an app for someone who is busy doing something else'], ['Automation', 'Automate the boring step, not the important decision'],
  ['AI', 'Where a language model actually helps a small business — and where it does not'], ['Craft', 'Building fast websites for slow connections'], ['Business', 'Finding the real problem behind the first request'],
];

export default function Insights() {
  return (
    <>
      <PageHero kicker="Insights" title={<>Working notes. <span className="serif muted">Articles when they’re ready.</span></>} lede="This is where thoughts on technology, business and learning will be published. Nothing below is presented as a finished article: the notes are short principles, and the topics are honestly marked as drafts." />
      <section className="section tight" aria-labelledby="n-h">
        <div className="wrap split">
          <div><p className="kicker reveal">Notebook</p><h2 id="n-h" className="h2 reveal" style={{ marginTop: 20 }}>Four things learned the slow way.</h2></div>
          <ol className="notes">{lessons.map((l, i) => <li key={l.title} className="reveal"><span className="mono muted">Note {String(i + 1).padStart(2, '0')}</span><h3 className="h3">{l.title}</h3><p className="body">{l.body}</p></li>)}</ol>
        </div>
      </section>
      <section className="section tight rule alt" aria-labelledby="d-h">
        <div className="wrap">
          <p className="kicker reveal">In draft</p><h2 id="d-h" className="h2 reveal" style={{ margin: '20px 0 40px' }}>Topics being written.</h2>
          <ul className="ledger">{drafts.map(([c, t]) => <li key={t} className="reveal"><span className="n">—</span><h3 className="h3">{t}</h3><p><span className="tag">{c}</span> <span className="tag concept">Draft — not yet published</span></p></li>)}</ul>
        </div>
      </section>
      <FinalCTA q="Have a question worth an article?" a="Send it. The best topics come from real problems." />
    </>
  );
}
