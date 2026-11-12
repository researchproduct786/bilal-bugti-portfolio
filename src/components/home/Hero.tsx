'use client';
import Link from 'next/link';
import type { Dict } from '@/i18n/en';
import type { ContentProject } from '@/i18n/content/types';
import { useL } from '@/i18n/client';
import { Btn } from '@/components/site/Btn';

/**
 * Hero — built for a phone first.
 *
 * Within the first screen the visitor gets: who Bilal is, what he does, the kind of problems
 * he solves, where to go next and how to make contact. Nothing blocks on an animation or a
 * WebGL download: the portrait is a single optimised image and the interface cards are HTML.
 */
export function Hero({ t, projects, portraitAlt }: { t: Dict; projects: ContentProject[]; portraitAlt: string }) {
  const L = useL();
  return (
    <section className="hero2" aria-labelledby="hero-h">
      <div className="wrap hero2-in">
        <div className="hero2-copy">
          <p className="kicker reveal"><b>{t.meta.role}</b><span aria-hidden="true">·</span>{t.meta.discipline}</p>
          <h1 id="hero-h" className="hero2-title reveal">{t.home.heroTitle}</h1>
          <p className="hero2-line reveal">{t.home.heroLine}</p>
          <p className="hero2-tag serif reveal">“{t.home.heroTagline}”</p>
          <div className="hero2-cta reveal">
            <Btn href={L('/work')}>{t.home.heroCta1}</Btn>
            <Btn href={L('/contact')} variant="ghost">{t.home.heroCta2}</Btn>
          </div>
          <ul className="hero2-stats reveal">
            <li><b>{projects.length}</b><span>{t.home.heroStat1}</span></li>
            <li><b>6</b><span>{t.home.heroStat2}</span></li>
            <li><b>7</b><span>{t.home.heroStat3}</span></li>
          </ul>
        </div>

        <div className="hero2-visual">
          <div className="hero2-portrait reveal">
            <img src="/img/portrait-bilal.webp" alt={portraitAlt} width={1024} height={1024} fetchPriority="high" decoding="async" />
          </div>
          <Link href={L(`/work/${projects[1]?.slug ?? ''}`)} className="hero2-phone reveal" aria-label={`${projects[1]?.brand}: ${projects[1]?.what}`}>
            <span className="hero2-phone-notch" aria-hidden="true" />
            <span className="hero2-screen">
              <span className="h2s-top"><span>9:41</span><span>Tillo</span></span>
              <span className="h2s-k">Today</span>
              <span className="h2s-big">₨ 48,500</span>
              <span className="h2s-two"><span><b>4</b>open</span><span><b>2</b>low</span></span>
              <span className="h2s-row"><span>#1042 Amara O.</span><em>Pack</em></span>
              <span className="h2s-row"><span>#1041 Jonas W.</span><em>Pack</em></span>
            </span>
          </Link>
          <p className="hero2-cap reveal">{t.home.heroProof}</p>
        </div>
      </div>
      <a className="hero2-scroll mono" href="#intro" aria-hidden="true">{t.ui.scroll} ↓</a>
    </section>
  );
}
