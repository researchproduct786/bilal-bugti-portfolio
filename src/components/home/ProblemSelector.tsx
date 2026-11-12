'use client';
import { useT } from '@/i18n/client';
import Link from '@/components/site/L';
import { useState } from 'react';
import { problems as problemsEn } from '@/data/content';
import { getProject } from '@/data/projects';
import { getService } from '@/data/services';
import { Btn } from '@/components/site/Btn';
import { Cover } from '@/components/demos/Cover';

/** A guided selector — plain, pre-written guidance. It is not a chatbot and does not pretend to be one. */
export function ProblemSelector() {
  const t = useT();
  const problems = t.x(problemsEn);
  const [id, setId] = useState(problemsEn[0].id);
  const p = problems.find((x) => x.id === id)!;
  const project = t.x(getProject(p.project)!);
  const service = t.x(getService(p.service)!);
  return (
    <div className="ps">
      <div className="ps-list" role="group" aria-label={t('Choose a business problem')}>
        {problems.map((x, i) => (
          <button key={x.id} className="ps-item" aria-pressed={x.id === id} onClick={() => setId(x.id)}>
            <span className="mono">{String(i + 1).padStart(2, '0')}</span><span>{x.statement}</span>
          </button>
        ))}
      </div>
      <div className="ps-sheet" aria-live="polite" key={p.id}>
        <p className="mono muted ps-head"><span>{t('Diagnosis sheet')}</span><span>{service.title}</span></p>
        <p className="serif ps-quote">“{p.statement}”</p>
        <ol className="ps-flow">
          <li><span className="mono">01 · {t('Why it matters')}</span><p>{p.why}</p></li>
          <li><span className="mono">02 · {t('A possible solution')}</span><p>{p.solution}</p><p className="chips">{p.tech.map((x) => <span key={x} className="chip">{x}</span>)}</p></li>
          <li><span className="mono">03 · {t('A visual example')}</span>
            <Link href={`/work/${project.slug}`} className="ps-example" data-cursor><Cover project={project} label={false} /><span><b>{project.brand}</b> — {project.title} <span className="muted">({t('concept project')})</span></span></Link></li>
          <li><span className="mono">04 · {t('How I could help')}</span><p>{p.help}</p></li>
        </ol>
        <div className="ps-cta"><Btn href={`/contact?service=${p.service}&topic=${p.id}`}>{t('Start a project about this')}</Btn><Link className="textlink" href={`/services/${p.service}`}>{t('Read about the service')} <span aria-hidden="true">→</span></Link></div>
      </div>
    </div>
  );
}
