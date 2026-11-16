import Link from 'next/link';
import type { Dict } from '@/i18n/en';
import type { SiteContent, ContentProject } from '@/i18n/content/types';
import { uiFor } from '@/components/visuals/Ui';
import { ProjectCard } from './ProjectCard';

export { Capabilities } from './Capabilities';

export function WorkGrid({ projects, t, L }: { projects: ContentProject[]; t: Dict; L: (p: string) => string }) {
  return (
    <ul className="workgrid2" data-stagger>
      {projects.map((p, i) => (
        <li key={p.slug} className="wg-item" data-i={i}>
          <ProjectCard project={p} t={t} L={L} />
        </li>
      ))}
    </ul>
  );
}

export function IntroAndServices({ t, c }: { t: Dict; c: SiteContent }) {
  /* Five surfaces, five kinds of work. Each one is taken from a real concept
     interface already on this site, so the composition shows the actual range
     rather than describing it — and no single photograph stands in for the whole
     practice, which is what a lone packaging shot did before. */
  const Store = uiFor.store;
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

          {/* ── The composition ──
              A storefront on a monitor, a phone running the app, an automation chain,
              a sales pipeline and a campaign creative — layered in depth. Each surface
              carries real content from the concept projects; none of them is a blank
              device or a random screenshot. Decorative here, so it is hidden from
              assistive technology and described by the caption beneath it. */}
          <div className="intro2-right reveal" aria-hidden="true">
            <div className="mix">
              <span className="mix-glow" />

              {/* 1 — the website, on a monitor */}
              <span className="mix-screen">
                <span className="mix-chrome"><i /><i /><i /><em>westgate-retail.com</em></span>
                <span className="mix-nav">
                  <em>WESTGATE</em>
                  <span><i>Shop</i><i>Guides</i><i>Service</i></span>
                  <b>Cart 2</b>
                </span>
                <span className="mix-hero">
                  <span className="mix-hero-h">Parts, tools and<br />advice from people<br />who use them.</span>
                  <span className="mix-hero-cta">Browse the range</span>
                </span>
                <span className="mix-grid">
                  <span><img src="/img/product-grinder.webp" alt="" width={120} height={120} loading="lazy" decoding="async" /><b>Hand grinder</b><em>$116</em></span>
                  <span><img src="/img/product-tray.webp" alt="" width={120} height={120} loading="lazy" decoding="async" /><b>Oak desk tray</b><em>$168</em></span>
                  <span><img src="/img/product-bowls.webp" alt="" width={120} height={120} loading="lazy" decoding="async" /><b>Stoneware bowls</b><em>$88</em></span>
                </span>
              </span>

              {/* 2 — the app, in front of the monitor's lower corner */}
              <span className="mix-phone">
                <span className="mix-ph-top"><i>9:41</i><em>Tillo</em></span>
                <span className="mix-ph-k">Today · sample data</span>
                <span className="mix-ph-big">$2,425</span>
                <span className="mix-ph-row"><b>#1042</b>Amara O.<em>Pack</em></span>
                <span className="mix-ph-row"><b>#1041</b>Jonas W.<em>Pack</em></span>
                <span className="mix-ph-chart">{[38, 62, 45, 80, 56, 92, 70].map((h, i) => <i key={i} style={{ blockSize: `${h}%` }} />)}</span>
                <span className="mix-ph-nav"><i className="on" /><i /><i /><i /></span>
              </span>

              {/* 3 — the pipeline */}
              <span className="mix-pipe">
                <span className="mix-k">Pipeline · Q3</span>
                <span className="mix-pipe-row"><i>New</i><b>6</b></span>
                <span className="mix-pipe-row"><i>Qualified</i><b>4</b></span>
                <span className="mix-pipe-row"><i>Proposal</i><b>3</b></span>
              </span>

              {/* 4 — the automation */}
              <span className="mix-flow">
                <span className="mix-k">Automation · live</span>
                <span className="mix-node"><b />Order paid</span>
                <span className="mix-line" />
                <span className="mix-node"><b />Create task</span>
                <span className="mix-line" />
                <span className="mix-node"><b />Notify team</span>
              </span>

              {/* 5 — the campaign */}
              <span className="mix-camp">
                <span className="mix-camp-h">Take the<br />long afternoon.</span>
                <span className="mix-camp-can">Slow<br />tide</span>
                <span className="mix-camp-foot">Slowtide · campaign</span>
              </span>
            </div>
            <p className="mix-cap mono">
              <span>{t.home.introMixCap}</span>
              <span className="mix-cap-note">{t.ui.concept}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The concept-artwork frame used by the Creative Lab page. Kept here so the lab keeps
 *  working without importing the homepage composition. */
export function ReferenceReel({ title, body, caption, alt }: { title: string; body: string; caption: string; alt?: string }) {
  return (
    <div className="reel reveal" data-scale-in>
      <figure className="artframe">
        <img src="/img/portfolio-reference.webp" alt={alt ?? title} width={1254} height={800} loading="lazy" decoding="async" />
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
