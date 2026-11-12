import Link from 'next/link';
import type { Dict } from '@/i18n/en';
import type { SiteContent, ContentProject } from '@/i18n/content/types';
import { CapabilityVisual } from '@/components/visuals/Capability';
import { Scene } from '@/components/visuals/Scene';
import { uiFor } from '@/components/visuals/Ui';
import { ProcessJourney } from './ProcessJourney';
import { ProjectCard } from './ProjectCard';

/** Which capability keys exist, in the order the owner wants them presented. */
export const CAP_ORDER = ['shopify', 'app', 'web', 'automation', 'crm', 'ai', 'marketing', 'branding'] as const;

export function Capabilities({ t, L }: { t: Dict; L: (p: string) => string }) {
  const c = t.capabilities;
  const label: Record<string, [string, string]> = {
    shopify: [c.shopify, c.shopifyLine],
    app: [c.app, c.appLine],
    web: [c.web, c.webLine],
    automation: [c.automation, c.automationLine],
    crm: [c.crm, c.crmLine],
    ai: [c.ai, c.aiLine],
    marketing: [c.marketing, c.marketingLine],
    branding: [c.branding, c.brandingLine],
  };
  return (
    <div className="capgrid">
      {CAP_ORDER.map((k) => (
        <Link key={k} href={L('/services')} className="capcard reveal" data-cursor>
          <span className="capcard-media"><CapabilityVisual id={k} /></span>
          <span className="capcard-body">
            <span className="capcard-t">{label[k][0]}</span>
            <span className="capcard-l">{label[k][1]}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export function WorkGrid({ projects, t, L }: { projects: ContentProject[]; t: Dict; L: (p: string) => string }) {
  return (
    <ul className="workgrid2">
      {projects.map((p) => <li key={p.slug}><ProjectCard project={p} t={t} L={L} /></li>)}
    </ul>
  );
}

/** The portfolio reference artwork, presented inside a real monitor frame. */
export function ReferenceReel({ title, body }: { title: string; body: string }) {
  return (
    <div className="reel reveal">
      <div className="monitor">
        <div className="monitor-screen" style={{ aspectRatio: '16 / 10' }}>
          <img src="/img/portfolio-reference.webp" alt={title} width={1536} height={960} loading="lazy" decoding="async" />
        </div>
        <div className="monitor-stand" aria-hidden="true" />
        <div className="monitor-base" aria-hidden="true" />
      </div>
      <div className="reel-side">
        <div>
          <p className="kicker">{title}</p>
          <p className="body" style={{ marginTop: 12 }}>{body}</p>
        </div>
        <p className="mono muted">Concept artwork · identity study</p>
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

export { ProcessJourney, uiFor };
