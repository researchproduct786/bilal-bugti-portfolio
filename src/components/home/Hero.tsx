'use client';
import Link from 'next/link';
import type { Dict } from '@/i18n/en';
import { useL } from '@/i18n/client';
import { Btn } from '@/components/site/Btn';

/**
 * Hero — a cinematic portrait stage, not a storefront.
 *
 * The previous version put a working shop behind the subject and a sales dashboard
 * over his chest. Both were well-built interfaces and both were the wrong idea: a
 * personal portfolio hero that says "$2,425 · 4 orders" reads as someone selling
 * candles, not as someone who builds systems. They are gone from here and they live
 * only in the capability and Work sections, where they are labelled as examples.
 *
 * What is here now:
 *
 *   0   a cinematic, person-free studio plate — cyan desk light, violet wall wash,
 *       warm practical lamp — so the composition sits in a room, not in a void
 *   1   the subject, cut out, with real separation, a rim light and a contact shadow
 *   2-5 four floating glass panels, one per capability, each with its accent, its
 *       own miniature working interface, its own depth and its own drift
 *
 * No invented numbers, no client counts, no revenue, no ratings. The only figures
 * anywhere near the panels are the ones inside a labelled sample interface.
 *
 * Planes are real DOM layers with real z-index, so the relationship survives every
 * width, RTL and reduced motion. Panels never overlap the face: their boxes are
 * placed in the gutters on either side of the head, top and bottom.
 */
export function Hero({ t, portraitAlt }: { t: Dict; portraitAlt: string }) {
  const L = useL();
  const h = t.home;

  /* Four panels, four capability identities. `accent` drives the panel's tint, its
     rule, its label colour and the miniature inside it — one value, four uses, so a
     panel is a coherent object rather than a coloured border. */
  const panels = [
    { key: 'products', n: '01', accent: '#58d2f0', kicker: h.heroPanelProductsK, copy: h.heroPanelProducts, depth: 0.16, place: 'a' },
    { key: 'apps', n: '02', accent: '#8fb4ff', kicker: h.heroPanelAppsK, copy: h.heroPanelApps, depth: 0.1, place: 'b' },
    { key: 'ai', n: '03', accent: '#b79cff', kicker: h.heroPanelAiK, copy: h.heroPanelAi, depth: 0.2, place: 'c' },
    { key: 'growth', n: '04', accent: '#ffab7a', kicker: h.heroPanelGrowthK, copy: h.heroPanelGrowth, depth: 0.12, place: 'd' },
  ] as const;

  return (
    <section id="hero2" className="hero2 depth-section" aria-labelledby="hero-h">
      {/* The environment is one photograph, full-bleed, blurred at the edges by a
          radial mask rather than a runtime filter. */}
      <div className="hero-env" aria-hidden="true">
        <img src="/img/hero-studio.webp" alt="" width={1920} height={1080} fetchPriority="high" decoding="async" />
      </div>
      <div className="hero-env-glow" aria-hidden="true" />

      <div className="wrap hero2-in">
        <div className="hero2-copy">
          <p className="kicker rise"><b>{t.meta.role}</b><span aria-hidden="true">·</span>{t.meta.discipline}</p>
          <h1 id="hero-h" className="hero2-title rise" style={{ ['--d' as string]: '0.06s' }}>{t.home.heroTitle}</h1>
          <p className="hero2-line rise" style={{ ['--d' as string]: '0.12s' }}>{h.heroLine}</p>
          <p className="hero2-tag serif rise" style={{ ['--d' as string]: '0.18s' }}>“{h.heroTagline}”</p>
          <div className="hero2-cta rise" style={{ ['--d' as string]: '0.24s' }}>
            <Btn href={L('/work')}>{h.heroCta1}</Btn>
            <Btn href={L('/contact')} variant="ghost">{h.heroCta2}</Btn>
          </div>
          <p className="hero2-cap rise" style={{ ['--d' as string]: '0.3s' }}>{h.heroProof}</p>
        </div>

        {/* ── The stage ── */}
        <div className="hero-stage">
          <div className="hero-plate" data-depth="0.04" aria-hidden="true">
            <img src="/img/hero-studio.webp" alt="" width={1920} height={1080} decoding="async" />
          </div>

          {/* Contact shadow + rim light behind the figure: the two cheap cues that make
              a cut-out sit in a lit room instead of being pasted onto one. */}
          <div className="hero-ground" aria-hidden="true" />

          <div className="hero-subject-wrap" data-depth="0.09">
            <div className="hero-subject" data-hero-subject>
              <img
                src="/img/portrait-hero.webp"
                alt={portraitAlt}
                width={900}
                height={1016}
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>

          {panels.map((p) => (
            <div
              key={p.key}
              className="hpanel"
              data-place={p.place}
              data-panel={p.key}
              data-depth={p.depth}
              style={{ ['--ac' as string]: p.accent }}
            >
              <span className="hpanel-head">
                <span className="hpanel-k">{p.kicker}</span>
                <span className="hpanel-n mono">{p.n}</span>
              </span>
              <span className="hpanel-art" aria-hidden="true"><PanelVisual kind={p.key} /></span>
              <span className="hpanel-copy">{p.copy}</span>
            </div>
          ))}
        </div>

        {/* Phones: the same four, in a designed sequence rather than a squeezed stage.
            This is the mobile presentation of the panels, not a fallback — each one
            keeps its accent, its miniature and its copy. */}
        <ul className="hpanels-m" aria-label={h.heroPanelsLabel}>
          {panels.map((p) => (
            <li key={p.key} className="hpm" data-panel={p.key} style={{ ['--ac' as string]: p.accent }}>
              <span className="hpanel-head">
                <span className="hpanel-k">{p.kicker}</span>
                <span className="hpanel-n mono">{p.n}</span>
              </span>
              <span className="hpm-art" aria-hidden="true"><PanelVisual kind={p.key} /></span>
              <span className="hpm-copy">{p.copy}</span>
              <Link className="hpm-link" href={L('/services')} aria-label={`${p.kicker} — ${t.nav.services}`}>
                {t.ui.open} <i aria-hidden="true">→</i>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <a className="hero2-scroll mono" href="#intro" aria-hidden="true">{t.ui.scroll} ↓</a>
    </section>
  );
}

/**
 * Four miniature interfaces, one per panel. Small enough to read at 200px wide, but
 * every one of them is a real interface with coherent content — no lorem, no blank
 * screens, no invented performance claims. Values are the same fictional sample data
 * used by the concept projects, and the panel copy above them never asserts a result.
 */
function PanelVisual({ kind }: { kind: string }) {
  switch (kind) {
    /* A page being built: a browser frame with real sections. */
    case 'products':
      return (
        <span className="hp hp-browser">
          <span className="hp-bar"><i /><i /><i /><em>northline.studio</em></span>
          <span className="hp-page">
            <span className="hp-page-h">Built for<br /><b>day one.</b></span>
            <span className="hp-page-nav"><i>Work</i><i>Services</i><i>Contact</i></span>
            {/* Copy belonging to the fictional page in the artwork, not this site's
                own button: "Start a project" here would read as untranslated chrome. */}
            <span className="hp-page-cta">Browse the range</span>
          </span>
        </span>
      );
    /* A phone with a real screen and real rows. */
    case 'apps':
      return (
        <span className="hp hp-phone">
          <span className="hp-ph-top"><i>9:41</i><em>Tillo</em></span>
          <span className="hp-ph-big">$2,425</span>
          <span className="hp-ph-k">Today · sample data</span>
          <span className="hp-ph-row"><b>#1042</b>Amara O.<i>Pack</i></span>
          <span className="hp-ph-row"><b>#1041</b>Jonas W.<i>Pack</i></span>
          <span className="hp-ph-nav"><i className="on" /><i /><i /><i /></span>
        </span>
      );
    /* An assistant answering from a document, with the source shown. */
    case 'ai':
      return (
        <span className="hp hp-ai">
          <span className="hp-ai-q">Refund window for wholesale?</span>
          <span className="hp-ai-a">
            30 days from invoice date.
            <span className="hp-ai-src">Source · Terms v4, §2.1</span>
          </span>
          <span className="hp-ai-acts"><i>Approve</i><i>Edit</i></span>
        </span>
      );
    /* A flow, drawn as a chain: trigger → step → outcome. */
    default:
      return (
        <span className="hp hp-flow">
          <span className="hp-fl-n"><b />Order paid</span>
          <span className="hp-fl-l" />
          <span className="hp-fl-n"><b />Create task</span>
          <span className="hp-fl-l" />
          <span className="hp-fl-n"><b />Notify team</span>
          <span className="hp-fl-foot">3 steps · no copy-paste</span>
        </span>
      );
  }
}
