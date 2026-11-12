'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Dict } from '@/i18n/en';
import type { SiteContent } from '@/i18n/content/types';
import { Btn } from '@/components/site/Btn';
import { useL } from '@/i18n/client';

/**
 * A guided selector — plain, pre-written guidance. It is not a chatbot and does not pretend
 * to be one. Every answer is short, and each one links to a working demonstration.
 */
export function ProblemSelector({ t, c }: { t: Dict; c: SiteContent }) {
  const L = useL();
  const [id, setId] = useState(c.problems[0].id);
  const p = c.problems.find((x) => x.id === id) ?? c.problems[0];
  const project = c.projects.find((x) => x.slug === p.project) ?? c.projects[0];
  const service = c.services.find((x) => x.slug === p.service) ?? c.services[0];

  return (
    <div className="ps">
      <div className="ps-list" role="group" aria-label={t.problems.choose}>
        {c.problems.map((x, i) => (
          <button key={x.id} className="ps-item" aria-pressed={x.id === id} onClick={() => setId(x.id)}>
            <span className="mono">{String(i + 1).padStart(2, '0')}</span><span>{x.statement}</span>
          </button>
        ))}
      </div>
      <div className="ps-sheet" aria-live="polite" key={p.id}>
        <p className="mono muted ps-head"><span>{t.problems.sheet}</span><span>{service.title}</span></p>
        <p className="serif ps-quote">“{p.statement}”</p>
        <dl className="spec">
          <dt>{t.problems.why}</dt><dd>{p.why}</dd>
          <dt>{t.problems.solution}</dt><dd>{p.solution}</dd>
          <dt>{t.problems.tech}</dt><dd><span className="chips">{p.tech.map((x) => <span key={x} className="chip">{x}</span>)}</span></dd>
          <dt>{t.problems.help}</dt><dd>{p.help}</dd>
          <dt>{t.problems.seeDemo}</dt><dd><Link className="link" href={L(`/work/${project.slug}`)}>{project.brand} — {project.what}</Link> <span className="muted">({t.ui.concept})</span></dd>
        </dl>
        <div className="ps-cta">
          <Btn href={L(`/contact?service=${p.service}&topic=${p.id}`)}>{t.problems.cta}</Btn>
          <Link className="textlink" href={L(`/services/${p.service}`)}>{t.services.viewService} <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </div>
  );
}
