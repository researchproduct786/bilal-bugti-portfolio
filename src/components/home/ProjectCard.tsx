import Link from 'next/link';
import type { Dict } from '@/i18n/en';
import type { ContentProject } from '@/i18n/content/types';
import { uiFor, defaultUiLabels, CrmUi, CampaignUi, FlowStrip, type UiLabels } from '@/components/visuals/Ui';

/**
 * One project card in the gallery.
 *
 * The brief for this section was blunt: lead with the work, cut the copy. The card
 * used to run a heading, a summary, two definition rows, three skill chips and a link —
 * six blocks of text above a small interface. Now it runs a large media well, the
 * brand and concept disclosure, one line, and the link. Everything else — who it is
 * for, what it solves, the decisions, the measurements — lives on the project page,
 * where a visitor who is actually interested will go.
 */
export function ProjectCard({ project, t, L, ui = defaultUiLabels }: { project: ContentProject; t: Dict; L: (p: string) => string; ui?: UiLabels }) {
  const Ui = uiFor[project.visual];
  return (
    <article className="pcard reveal2" style={{ ['--ac' as string]: project.accent }}>
      <Link href={L(`/work/${project.slug}`)} className="pcard-media" data-cursor aria-label={`${project.brand} — ${project.what}`}>
        <span className={`pcard-ui ${project.visual === 'app' ? 'is-phone' : ''}`}>
          {project.visual === 'crm' ? (
            <span className="ui-stack">
              <CrmUi compact l={ui} />
              <FlowStrip l={ui} />
            </span>
          ) : project.visual === 'campaign' ? (
            <CampaignUi l={ui} />
          ) : (
            <Ui compact l={ui} />
          )}
        </span>
      </Link>
      <div className="pcard-body">
        <p className="pcard-k mono">
          <span>{project.n} · {project.brand}</span>
          <span className="pcard-tag">{t.ui.concept}</span>
        </p>
        <h3 className="pcard-t">{project.what}</h3>
        <p className="pcard-l">{project.summary}</p>
        <div className="pcard-foot">
          <span className="pcard-go">{t.work.openDemo} <i aria-hidden="true">→</i></span>
          <span className="chips">{[project.skills[0], project.skills[1]].filter(Boolean).map((s) => <span className="chip" key={s}>{s}</span>)}</span>
        </div>
      </div>
    </article>
  );
}
