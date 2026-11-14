'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Dict } from '@/i18n/en';
import type { SiteContent } from '@/i18n/content/types';
import { Btn } from '@/components/site/Btn';
import { useL } from '@/i18n/client';

/**
 * Eight business problems as a spatial composition.
 *
 * The old version was a vertical list of buttons beside one sheet of text — legible,
 * but flat, and it read as a form. This one is arranged in depth: the cards sit on
 * different planes and enter from different directions, they compress toward the
 * reader on hover, and the one you choose lifts out of the stack while the others
 * recede and lose focus. Selecting still does one plain thing — replace the answer —
 * because a clever selector that hides the answer is worse than a boring one.
 *
 * Eight cards, eight starting points, one of them is usually the visitor's.
 */

const PLANES = [
  { z: 0, dir: 'far' },
  { z: 26, dir: 'up' },
  { z: 10, dir: 'end' },
  { z: 34, dir: 'far' },
  { z: 6, dir: 'up' },
  { z: 22, dir: 'end' },
  { z: 14, dir: 'up' },
  { z: 30, dir: 'far' },
];

export function ProblemSelector({ t, c }: { t: Dict; c: SiteContent }) {
  const L = useL();
  const [id, setId] = useState(c.problems[0].id);
  const p = c.problems.find((x) => x.id === id) ?? c.problems[0];
  const project = c.projects.find((x) => x.slug === p.project) ?? c.projects[0];
  const service = c.services.find((x) => x.slug === p.service) ?? c.services[0];

  return (
    <div className="px">
      <div className="px-stage" role="group" aria-label={t.problems.choose}>
        {c.problems.map((x, i) => (
          <button
            key={x.id}
            type="button"
            className="px-card"
            aria-pressed={x.id === id}
            onClick={() => setId(x.id)}
            data-plane={PLANES[i].dir}
            style={{
              ['--z' as string]: `${PLANES[i].z}px`,
              ['--i' as string]: String(i),
            }}
          >
            <span className="px-n mono">{String(i + 1).padStart(2, '0')}</span>
            <span className="px-t">{x.statement}</span>
            <span className="px-dot" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="px-sheet" aria-live="polite" key={p.id}>
        <p className="px-head mono">
          <span>{t.problems.sheet}</span>
          <span className="px-svc">{service.title}</span>
        </p>
        <p className="px-q serif">“{p.statement}”</p>

        <dl className="px-spec">
          <div>
            <dt>{t.problems.why}</dt>
            <dd>{p.why}</dd>
          </div>
          <div>
            <dt>{t.problems.solution}</dt>
            <dd>{p.solution}</dd>
          </div>
          <div>
            <dt>{t.problems.help}</dt>
            <dd>{p.help}</dd>
          </div>
          <div>
            <dt>{t.problems.tech}</dt>
            <dd><span className="chips">{p.tech.map((x) => <span key={x} className="chip">{x}</span>)}</span></dd>
          </div>
        </dl>

        <p className="px-cap">
          <span className="mono">{t.ui.matches}</span>
          <Link className="px-cap-link" href={L(`/services/${p.service}`)}>
            {service.title} <span aria-hidden="true">→</span>
          </Link>
        </p>

        <p className="px-demo">
          <span className="mono">{t.problems.seeDemo}</span>
          <Link className="link" href={L(`/work/${project.slug}`)}>{project.brand} — {project.what}</Link>
          <span className="muted">({t.ui.concept})</span>
        </p>

        <div className="px-cta">
          <Btn href={L(`/contact?service=${p.service}&topic=${p.id}`)}>{t.problems.cta}</Btn>
          <Link className="textlink" href={L(`/services/${p.service}`)}>{t.services.viewService} <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </div>
  );
}
