'use client';
import Link from 'next/link';
import { useState } from 'react';
import { problems } from '@/data/content';
import { getProject } from '@/data/projects';
import { getService } from '@/data/services';
import { Btn } from '@/components/site/Btn';

/** A guided selector — plain, pre-written guidance. It is not a chatbot and does not pretend to be one. */
export function ProblemSelector() {
  const [id, setId] = useState(problems[0].id);
  const p = problems.find((x) => x.id === id)!;
  const project = getProject(p.project)!;
  const service = getService(p.service)!;
  return (
    <div className="ps">
      <div className="ps-list" role="group" aria-label="Choose a business problem">
        {problems.map((x, i) => (
          <button key={x.id} className="ps-item" aria-pressed={x.id === id} onClick={() => setId(x.id)}>
            <span className="mono">{String(i + 1).padStart(2, '0')}</span><span>{x.statement}</span>
          </button>
        ))}
      </div>
      <div className="ps-sheet" aria-live="polite" key={p.id}>
        <p className="mono muted ps-head"><span>Diagnosis sheet</span><span>{service.title}</span></p>
        <p className="serif ps-quote">“{p.statement}”</p>
        <dl className="spec">
          <dt>Why it matters</dt><dd>{p.why}</dd>
          <dt>A possible solution</dt><dd>{p.solution}</dd>
          <dt>Relevant technology</dt><dd><span className="chips">{p.tech.map((t) => <span key={t} className="chip">{t}</span>)}</span></dd>
          <dt>How I could help</dt><dd>{p.help}</dd>
          <dt>See it demonstrated</dt><dd><Link className="link" href={`/work/${project.slug}`}>{project.brand} — {project.title}</Link> <span className="muted">(concept project)</span></dd>
        </dl>
        <div className="ps-cta"><Btn href={`/contact?service=${p.service}&topic=${p.id}`}>Start a project about this</Btn><Link className="textlink" href={`/services/${p.service}`}>Read about the service <span aria-hidden="true">→</span></Link></div>
      </div>
    </div>
  );
}
