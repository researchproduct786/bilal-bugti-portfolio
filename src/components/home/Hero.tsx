'use client';
import Link from 'next/link';
import type { Dict } from '@/i18n/en';
import type { ContentProject } from '@/i18n/content/types';
import { useL } from '@/i18n/client';
import { Btn } from '@/components/site/Btn';
import { defaultUiLabels, type UiLabels } from '@/components/visuals/Ui';

/**
 * Hero — the broadcast composition.
 *
 * Reads like a television control surface rather than a hero banner: one stage,
 * a subject who breaks the frame, and a ring of small panels carrying real
 * information around him. The panels are not decoration; each one answers a
 * question a visitor actually has (what does he build, what has he made, how
 * does he work, what happens first).
 *
 * Planes, back to front:
 *
 *   0   environment plate — a person-free studio, lit, out of focus
 *   1   back card — a working storefront, top edge below the chin
 *   2   flanking mini-panels — capabilities, selected work, process
 *   3   the cut-out subject, leaving the card
 *   4   near card — a live-looking dashboard over the chest
 *
 * Layering is real z-index and real shadows, not a flattened image, so it
 * survives resizing, RTL and reduced motion. On a phone the same planes stack
 * into a composed portrait stage rather than being dropped.
 */
export function Hero({
  t,
  projects,
  portraitAlt,
  ui = defaultUiLabels,
}: {
  t: Dict;
  projects: ContentProject[];
  portraitAlt: string;
  ui?: UiLabels;
}) {
  const L = useL();

  return (
    <section id="hero2" className="hero2 depth-section" aria-labelledby="hero-h">
      <div className="field field-key" aria-hidden="true" />
      <div className="field field-fill" aria-hidden="true" />

      <div className="wrap hero2-in">
        <div className="hero2-copy">
          <p className="kicker rise"><b>{t.meta.role}</b><span aria-hidden="true">·</span>{t.meta.discipline}</p>
          <h1 id="hero-h" className="hero2-title rise" style={{ ['--d' as string]: '0.06s' }}>{t.home.heroTitle}</h1>
          <p className="hero2-line rise" style={{ ['--d' as string]: '0.12s' }}>{t.home.heroLine}</p>
          <p className="hero2-tag serif rise" style={{ ['--d' as string]: '0.18s' }}>“{t.home.heroTagline}”</p>
          <div className="hero2-cta rise" style={{ ['--d' as string]: '0.24s' }}>
            <Btn href={L('/work')}>{t.home.heroCta1}</Btn>
            <Btn href={L('/contact')} variant="ghost">{t.home.heroCta2}</Btn>
          </div>
          {/* One quiet line of context where the statistic row used to be. The
              numbers it carried are elsewhere on the page, doing real work. */}
          <p className="hero2-cap rise" style={{ ['--d' as string]: '0.3s' }}>{t.home.heroProof}</p>
        </div>

        {/* ── The spatial stage ── */}
        <div className="hero-stage">
          {/* Deepest plane: an empty cinematic studio — cool key light from the upper
              left, a warm floor glow on the right, three glass planes out of focus.
              It is deliberately person-free. The previous plate was a blurred copy of
              the same portrait, which put a second version of the subject's own face
              behind his shoulder — a doppelgänger, and the first thing the eye found. */}
          <div className="hero-plate" data-depth="0.05" aria-hidden="true">
            <img src="/img/hero-environment.webp" alt="" width={1600} height={900} decoding="async" />
          </div>

          {/* Flanking panel, far left, behind the copy: what he actually builds.
              Four named capabilities, no invented numbers. */}
          <div className="hero-mini hm-build glass glass-far" data-depth="0.12" aria-hidden="true">
            <span className="hm-k">{t.home.heroPanelBuilt}</span>
            <ul className="hm-list">
              <li><i style={{ ['--c' as string]: '#7ec8a5' }} />{t.home.heroPanelStores}</li>
              <li><i style={{ ['--c' as string]: '#8fb4ff' }} />{t.home.heroPanelApps}</li>
              <li><i style={{ ['--c' as string]: '#d9c48a' }} />{t.home.heroPanelSystems}</li>
              <li><i style={{ ['--c' as string]: '#b79cff' }} />{t.home.heroPanelAi}</li>
            </ul>
          </div>

          {/* Process panel, far right: the honest shape of the engagement. */}
          <div className="hero-mini hm-process glass glass-far" data-depth="0.1" aria-hidden="true">
            <span className="hm-k">{t.home.heroPanelProcess}</span>
            <ol className="hm-steps">
              <li><b>01</b>{t.home.heroPanelTalk}</li>
              <li><b>02</b>{t.home.heroPanelBuildLabel}</li>
            </ol>
            <span className="hm-bar" />
          </div>

          {/* The back card is deliberately wider than the shoulders and filled with a
              product grid, so whatever the body occludes still reads as a shop. */}
          <div className="hero-panel-back glass glass-far" data-hero-back data-depth="0.07">
            <div className="hpb-bar">
              <span className="ui-word">HALDEN<span>Objects</span></span>
              <span className="hpb-cart">{ui.cart} · 2</span>
            </div>
            <div className="hpb-grid">
              {[
                ['product-dripper', 'Ceramic pour-over', '$68'],
                ['product-tray', 'Oak desk tray', '$168'],
                ['product-grinder', 'Hand grinder', '$116'],
                ['product-lamp', 'Linen table lamp', '$296'],
                ['product-bowls', 'Stoneware bowls', '$88'],
                ['product-candle', 'Amber & smoke', '$52'],
              ].map(([src, name, price]) => (
                <span className="hpb-tile" key={src}>
                  <img src={`/img/${src}.webp`} alt="" width={420} height={420} loading="lazy" decoding="async" />
                  <span className="hpb-meta"><span>{name}</span><b>{price}</b></span>
                </span>
              ))}
            </div>
          </div>

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

          {/* Brings the first piece of work forward as a real, clickable entry point.
              The avatar is a monogram, not a fabricated photograph of a client. */}
          <Link
            href={L(`/work/${projects[1]?.slug ?? ''}`)}
            className="hero-mini hm-work glass"
            data-hero-work
            data-depth="-0.06"
          >
            <span className="hm-work-top">
              <span className="hm-avatar" aria-hidden="true">{projects[1]?.brand?.[0] ?? 'T'}</span>
              <span className="hm-work-t">
                <span className="hm-k">{t.home.heroPanelNow}</span>
                <b>{projects[1]?.brand ?? 'Tillo'}</b>
              </span>
            </span>
            <span className="hm-work-what">{projects[1]?.what}</span>
            <span className="hm-work-cta">{t.home.heroPanelOpen} <i aria-hidden="true">→</i></span>
          </Link>

          <Link
            href={L(`/work/${projects[1]?.slug ?? ''}`)}
            className="hero-panel-front glass"
            data-hero-front
            data-depth="-0.1"
            aria-label={`${projects[1]?.brand}: ${projects[1]?.what}`}
          >
            <span className="h2s-top"><span>9:41</span><span>{projects[1]?.brand ?? 'Tillo'} app</span></span>
            <span className="h2s-k">{t.home.today} · {ui.demoData}</span>
            <span className="h2s-big">$2,425</span>
            <span className="h2s-two"><span><b>4</b>{ui.orders}</span><span><b>12</b>{ui.pending}</span></span>
            <span className="h2s-row"><span>#1042 Amara O.</span><em>Pack</em></span>
            <span className="h2s-row"><span>#1041 Jonas W.</span><em>Pack</em></span>
          </Link>
        </div>
      </div>

      <a className="hero2-scroll mono" href="#intro" aria-hidden="true">{t.ui.scroll} ↓</a>
    </section>
  );
}
