import Link from 'next/link';
import type { Dict } from '@/i18n/en';
import type { SiteContent, ContentProject } from '@/i18n/content/types';
import { Scene } from '@/components/visuals/Scene';
import { uiFor } from '@/components/visuals/Ui';
import { uiLabels } from '@/i18n/ui-labels';
import type { LocaleCode } from '@/i18n/config';
import { ProjectCard } from './ProjectCard';

export { Capabilities } from './Capabilities';

export function WorkGrid({ projects, t, L, locale }: { projects: ContentProject[]; t: Dict; L: (p: string) => string; locale: LocaleCode }) {
  const ui = uiLabels[locale];
  return (
    <ul className="workgrid2" data-stagger>
      {projects.map((p, i) => (
        <li key={p.slug} className="wg-item" data-i={i}>
          <ProjectCard project={p} t={t} L={L} ui={ui} />
        </li>
      ))}
    </ul>
  );
}

/** The portfolio reference artwork, presented inside a real monitor frame. */
export function ReferenceReel({ title, body, caption, alt }: { title: string; body: string; caption: string; alt?: string }) {
  return (
    <div className="reel reveal" data-scale-in>
      {/* The artwork is shown whole. It is a framed identity study, not a monitor
          screenshot, so it is presented in a light-catching frame instead of being
          cropped into a 16:10 screen. */}
      <figure className="artframe">
        <img src="/img/portfolio-reference.webp" alt={title} width={1254} height={800} loading="lazy" decoding="async" />
      </figure>
      <div className="reel-side">
        <div>
          <p className="kicker">{title}</p>
          <p className="body" style={{ marginTop: 12 }}>{body}</p>
        </div>
        <p className="mono muted">{caption}</p>
      </div>
    </div>
  );
}

export function IntroAndServices({ t, c }: { t: Dict; c: SiteContent }) {
  return (
    <section id="intro" className="section intro2" aria-labelledby="intro-h">
      <div className="wrap">
        <p className="kicker reveal">{t.home.introKicker}</p>
        <h2 id="intro-h" className="intro2-h reveal">{t.home.introTitle}</h2>
        <div className="intro2-grid">
          <div className="intro2-left reveal">
            <p className="lede">{t.home.introBody}</p>
            <ul className="intersect">
              <li><span className="mono">{t.home.introPoint1Title}</span><span>{t.home.introPoint1}</span></li>
              <li><span className="mono">{t.home.introPoint2Title}</span><span>{t.home.introPoint2}</span></li>
              <li><span className="mono">{t.home.introPoint3Title}</span><span>{t.home.introPoint3}</span></li>
            </ul>
          </div>
          <div className="intro2-right reveal">
            <Scene name="ecommerce" caption={c.projects[0].what} ratio="4 / 3" />
          </div>
        </div>
      </div>
    </section>
  );
}

export { uiFor };
