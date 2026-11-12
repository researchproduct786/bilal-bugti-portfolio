import Link from 'next/link';
import type { Dict } from '@/i18n/en';
import type { ContentProject } from '@/i18n/content/types';
import { uiFor } from '@/components/visuals/Ui';

/**
 * One project card.
 *
 * Every card leads with a working interface for that specific product, then answers the
 * questions a visitor actually has: what is it, who is it for, what does it solve.
 * No two cards use the same interface, so the six read as six products.
 */
export function ProjectCard({ project, t, L }: { project: ContentProject; t: Dict; L: (p: string) => string }) {
  const Ui = uiFor[project.visual];
  return (
    <article className="pcard reveal" style={{ ['--ac' as string]: project.accent }}>
      <Link href={L(`/work/${project.slug}`)} className="pcard-media" data-cursor aria-label={`${project.brand} — ${project.what}`}>
        <span className="pcard-tag">{t.ui.concept}</span>
        <span className={`pcard-ui ${project.visual === 'app' ? 'is-phone' : ''}`}>
          <Ui compact />
        </span>
      </Link>
      <div className="pcard-body">
        <p className="pcard-k mono">{project.n} · {project.brand}</p>
        <h3 className="pcard-t">{project.what}</h3>
        <p className="pcard-l">{project.summary}</p>
        <dl className="pcard-dl">
          <div><dt>{t.work.whoFor}</dt><dd>{project.who}</dd></div>
          <div><dt>{t.work.whatItSolves}</dt><dd>{project.problem}</dd></div>
        </dl>
        <div className="pcard-foot">
          <span className="chips">{project.skills.slice(0, 3).map((s) => <span className="chip" key={s}>{s}</span>)}</span>
          <Link href={L(`/work/${project.slug}`)} className="textlink">{t.work.openDemo} <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  );
}
