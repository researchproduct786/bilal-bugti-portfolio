import type { Metadata } from 'next';
import { processSteps } from '@/data/content';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export const metadata: Metadata = { title: 'Process — seven steps from problem to delivered product', description: 'How a project with Bilal Bugti runs: understand the business, identify the real problem, plan, design, build, test, deliver and support.', alternates: { canonical: '/process' } };

const principles = [
  { t: 'Plain language', b: 'Scope, cost and trade-offs are explained without jargon. If something cannot be explained simply, it is not understood well enough yet.' },
  { t: 'Visible progress', b: 'You see working software at each milestone — not a percentage in a status email.' },
  { t: 'No surprise costs', b: 'Any paid tool, API or subscription is raised before it is used, with free alternatives where they exist.' },
  { t: 'Built to hand over', b: 'The aim is a product you can run without me. Documentation and a walkthrough are part of delivery.' },
];

export default function Process() {
  return (
    <>
      <PageHero kicker="Process" title={<>Seven steps. <span className="serif muted">The first two matter most.</span></>} lede="Most failed projects were built well and aimed badly. So the work starts with understanding — and only then moves to design and code." />
      <section className="section tight">
        <div className="wrap">
          <ol className="steps">
            {processSteps.map((s, i) => (
              <li key={s.title} className="reveal">
                <span className="steps-n">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="h2">{s.title}</h2>
                <div><p className="proj-lead">{s.body}</p><p className="steps-out"><span className="mono">You get</span>{s.output}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section tight rule alt" aria-labelledby="pr-h">
        <div className="wrap split">
          <div><p className="kicker reveal">Working principles</p><h2 id="pr-h" className="h2 reveal" style={{ marginTop: 20 }}>What you can expect from me.</h2></div>
          <ol className="notes">{principles.map((p, i) => <li key={p.t} className="reveal"><span className="mono muted">{String(i + 1).padStart(2, '0')}</span><h3 className="h3">{p.t}</h3><p className="body">{p.b}</p></li>)}</ol>
        </div>
      </section>
      <FinalCTA q="Ready for step one?" a="It’s a conversation about your business. Nothing more." />
    </>
  );
}
