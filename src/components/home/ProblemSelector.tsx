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
            {/* Each card carries the shape of its own answer: a pipeline for leads, a flow
                for manual work, a chart for spend. Twelve pixels tall, drawn in the card's
                own SVG — enough to make the eight statements visually distinct without
                turning the selector into a gallery of thumbnails. */}
            <span className="px-v" aria-hidden="true"><ProblemGlyph id={x.id} /></span>
            <span className="px-t">{x.statement}</span>
            <span className="px-dot" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="px-sheet" aria-live="polite" key={p.id}>
        {/* The solution shown as a surface, not described in a paragraph. This is the
            same interface family the capability lanes use, so the answer the visitor
            reads and the product they would get look like one thing. */}
        <div className="px-visual" aria-hidden="true"><SolutionVisual id={p.id} /></div>
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

/**
 * The eight tiny diagrams. Each one is the *shape* of the problem's answer — a broken
 * funnel, a scattered record, a pipeline, a chain, a dashboard. Drawn rather than
 * imported so they cost nothing and stay crisp at 20px.
 */
function ProblemGlyph({ id }: { id: string }) {
  const c = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (id) {
    case 'presence':
      return <svg {...c}><rect x="3" y="4.5" width="18" height="13" rx="1.6" /><path d="M3 8h18" /><path d="M8 21h8" /><path d="M12 17.5V21" /></svg>;
    case 'store':
      return <svg {...c}><path d="M3.5 8.5h17l-1.4-3.5H4.9z" /><path d="M5 8.5V20h14V8.5" /><path d="M10 20v-6h4v6" /></svg>;
    case 'manual':
      return <svg {...c}><rect x="4" y="3.5" width="12" height="15" rx="1.4" /><path d="M8 7h6M8 10.5h6M8 14h4" /><path d="M18 15l2.5 2.5M20.5 15L18 17.5" /></svg>;
    case 'crm':
      return <svg {...c}><circle cx="9" cy="8" r="3" /><path d="M3.5 20c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2" /><circle cx="18" cy="9" r="2.2" /><path d="M15.5 20c0-2.2 1.1-3.8 2.5-3.8s2.5 1.6 2.5 3.8" /></svg>;
    case 'leads':
      return <svg {...c}><path d="M4 5h16l-6 7.5V20l-4-2v-5.5z" /></svg>;
    case 'automate':
      return <svg {...c}><rect x="3" y="4" width="6" height="5" rx="1.2" /><rect x="15" y="15" width="6" height="5" rx="1.2" /><path d="M9 6.5h4a2 2 0 0 1 2 2v9" /></svg>;
    case 'app':
      return <svg {...c}><rect x="6.5" y="3" width="11" height="18" rx="2.2" /><path d="M10.5 17.5h3" /></svg>;
    default:
      return <svg {...c}><path d="M3.5 20V6M20.5 20H3.5" /><path d="M7 16l4-4 3 2.5 5-6" /><circle cx="19" cy="8.5" r="1.3" /></svg>;
  }
}

/** The chosen problem's solution, as a small working surface. */
function SolutionVisual({ id }: { id: string }) {
  switch (id) {
    case 'presence':
      return (
        <span className="pv2 pv2-page">
          <span className="pv2-bar"><i /><i /><i /><em>yourbusiness.com</em></span>
          <span className="pv2-h">What we do, in one clear line.</span>
          <span className="pv2-cta">Get a quote</span>
          <span className="pv2-row"><i>Services</i><i>Work</i><i>Contact</i></span>
        </span>
      );
    case 'store':
      return (
        <span className="pv2 pv2-store">
          <span className="pv2-thumb"><img src="/img/product-tray.webp" alt="" width={100} height={100} loading="lazy" decoding="async" /></span>
          <span className="pv2-info">
            <span className="pv2-k">Step 2 of 3 · Payment</span>
            <span className="pv2-b">$168.00</span>
            <span className="pv2-line"><em>Oak desk tray</em><b>$168</b></span>
            <span className="pv2-line"><em>Shipping</em><b>$12</b></span>
            <span className="pv2-cta wide">Pay securely</span>
          </span>
        </span>
      );
    case 'manual':
    case 'automate':
      return (
        <span className="pv2 pv2-flow">
          <span className="pv2-node trig">Order paid</span>
          <span className="pv2-conn" />
          <span className="pv2-node">Create task</span>
          <span className="pv2-conn" />
          <span className="pv2-node">Notify team</span>
          <span className="pv2-foot">Runs automatically · failures alert the owner</span>
        </span>
      );
    case 'crm':
    case 'leads':
      return (
        <span className="pv2 pv2-pipe">
          <span className="pv2-col"><b>New</b><em>Al Noor · $12.0k</em><em>Orbit · $3.0k</em></span>
          <span className="pv2-col"><b>Qualified</b><em>Westgate · $16.0k</em></span>
          <span className="pv2-col"><b>Follow-up</b><em>Reminder · 2 days</em></span>
          <span className="pv2-foot">Owner assigned · next step dated</span>
        </span>
      );
    case 'app':
      return (
        <span className="pv2 pv2-app">
          <span className="pv2-phone">
            <span className="pv2-k">Today</span>
            <span className="pv2-b">$2,425</span>
            <span className="pv2-line"><em>#1042</em><b>Pack</b></span>
            <span className="pv2-line"><em>#1041</em><b>Ship</b></span>
          </span>
          <span className="pv2-side">
            <span className="pv2-k">On the floor</span>
            <span className="pv2-b small">One screen, one thumb</span>
            <span className="pv2-line"><em>Open orders</em><b>4</b></span>
            <span className="pv2-line"><em>Low stock</em><b>2</b></span>
          </span>
        </span>
      );
    default:
      return (
        <span className="pv2 pv2-chart">
          <span className="pv2-k">Campaign · sample data</span>
          <span className="pv2-kpis">
            <span><em>Spend</em><b>$3,100</b></span>
            <span><em>Leads</em><b>248</b></span>
            <span><em>Cost / lead</em><b>$12.50</b></span>
          </span>
          <span className="pv2-bars">{[30, 44, 39, 58, 52, 71, 66].map((h, i) => <i key={i} style={{ blockSize: `${h}%` }} />)}</span>
        </span>
      );
  }
}
