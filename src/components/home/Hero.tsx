'use client';
import { useT } from '@/i18n/client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { StudioScene } from '@/three/studio';
import { Btn } from '@/components/site/Btn';
import { site } from '@/data/site';
import { i18n } from '@/i18n/core';

const StudioCanvas = dynamic(() => import('./StudioCanvas'), { ssr: false });

type Mode = 'pending' | 'full' | 'lite';
/** The six scenes of the opening film. `at` is where each begins on the scroll track (0–1). */
const SCENES = i18n([
  { at: 0, n: '01', title: 'The Human', line: '' },
  { at: 0.16, n: '02', title: 'The workspace comes alive', line: 'Every project starts with a person and a problem.' },
  { at: 0.33, n: '03', title: 'Human intelligence and creativity', line: 'Ideas first. Tools second.' },
  { at: 0.5, n: '04', title: 'The transformation begins', line: 'The tools change. The thinking gets sharper.' },
  { at: 0.67, n: '05', title: 'Human + machine', line: 'Human judgment. Machine leverage.' },
  { at: 0.84, n: '06', title: 'My digital world', line: 'Stores, apps and systems — built around real problems.' },
]);
const sceneAt = (p: number) => { let k = 0; SCENES.forEach((s, i) => { if (p >= s.at) k = i; }); return k; };

export function Hero() {
  const t = useT();
  const root = useRef<HTMLElement>(null);
  const scene = useRef<StudioScene | null>(null);
  const [mode, setMode] = useState<Mode>('pending');
  const [ready, setReady] = useState(false);
  const [sc, setSc] = useState(0);
  const reel = useRef<HTMLElement>(null);
  const scenes = t.x(SCENES);

  // Decide once, on the client: the full scene is for capable desktops only.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let gl = false;
    try { const c = document.createElement('canvas'); gl = !!(c.getContext('webgl2') || c.getContext('webgl')); } catch {}
    setMode(desktop && !reduce && !saveData && gl ? 'full' : 'lite');
  }, []);

  useEffect(() => {
    if (mode !== 'full') return;
    let kill = () => {};
    let dead = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (dead || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const el = root.current;
      const copy = el.querySelector<HTMLElement>('.hero-copy')!;
      const caps = Array.from(el.querySelectorAll<HTMLElement>('.cap'));
      const bar = el.querySelector<HTMLElement>('.hero-bar i')!;
      const st = ScrollTrigger.create({
        trigger: el, start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          scene.current?.setProgress(p);
          const o = 1 - Math.min(1, Math.max(0, (p - 0.04) / 0.14));
          copy.style.opacity = String(o); copy.style.transform = `translateY(${(1 - o) * -40}px)`; copy.style.pointerEvents = o < 0.3 ? 'none' : '';
          copy.toggleAttribute('inert', o < 0.3);
          caps.forEach((c, i) => {
            const from = SCENES[i + 1].at, to = SCENES[i + 2]?.at ?? 1.2;
            const a = Math.min(1, Math.max(0, (p - from) / 0.045)) * (1 - Math.min(1, Math.max(0, (p - (to - 0.045)) / 0.045)));
            c.style.opacity = String(a); c.style.transform = `translateY(${(1 - a) * 14}px)`;
          });
          setSc(sceneAt(p));
          bar.style.transform = `scaleX(${p})`;
        },
      });
      kill = () => st.kill();
    })();
    return () => { dead = true; kill(); };
  }, [mode]);

  // Lightweight version (phones, reduced data): the same six scenes as pre-rendered stills that cross-fade with scroll.
  useEffect(() => {
    if (mode !== 'lite' || !reel.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = reel.current; el.classList.add('reel--live');
    const frames = Array.from(el.querySelectorAll<HTMLElement>('.reel-frame'));
    let raf = 0;
    const on = () => { raf = 0;
      const r = el.getBoundingClientRect(); const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      const f = p * (frames.length - 1);
      frames.forEach((fr, i) => { fr.style.opacity = String(Math.max(0, 1 - Math.abs(f - i) * 1.6)); fr.classList.toggle('on', Math.round(f) === i); });
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(on); };
    on(); window.addEventListener('scroll', req, { passive: true }); window.addEventListener('resize', req);
    return () => { window.removeEventListener('scroll', req); window.removeEventListener('resize', req); cancelAnimationFrame(raf); el.classList.remove('reel--live'); };
  }, [mode]);

  return (
    <>
      <section ref={root} className={`hero ${mode === 'full' ? 'hero--full' : ''}`} aria-label={t('Introduction')}>
        <div className="hero-stage">
          <picture>
            <source media="(max-width: 899px)" srcSet="/scene/m1.webp" />
            <img className="hero-poster" src="/scene/wide.webp" alt={t('A dark technology studio: a figure seated at a three-monitor workstation, lit by a warm pendant lamp and the cool glow of the screens.')} width={1600} height={900} fetchPriority="high" decoding="async" />
          </picture>
          {mode === 'full' && <StudioCanvas className={`hero-canvas ${ready ? 'on' : ''}`} onScene={(s) => { scene.current = s; }} onReady={() => setReady(true)} />}
          <div className="hero-shade" aria-hidden="true" />

          <div className="wrap hero-copy">
            <p className="kicker bare hero-kicker"><b>{t(site.role)}</b><span>·</span><span>{t(site.discipline)}</span></p>
            <h1 className="display lines hero-title" aria-label={site.name}>
              <span aria-hidden="true"><span style={{ ['--i' as string]: 0 }}>{t('Bilal')}</span></span>
              <span aria-hidden="true"><span style={{ ['--i' as string]: 1 }}>{t('Bugti')}</span></span>
            </h1>
            <div className="hero-under">
              <p className="hero-triad">{t('Technology. Creativity. Business Solutions.')}</p>
              <p className="serif hero-tagline">{t('“I don’t just build projects. I build solutions to real-world problems.”')}</p>
              <div className="hero-ctas">
                <Btn href="/work">{t('Explore my work')}</Btn>
                <Btn href="/contact" variant="ghost">{t('Start a project')}</Btn>
              </div>
            </div>
          </div>

          {mode === 'full' && (
            <div className="wrap hero-caps">
              {scenes.slice(1).map((c, i) => (
                <p key={c.n} className={`cap cap-${i % 2 ? 'b' : 'a'} ${i === 4 ? 'cap-end' : ''}`}><span className="mono">{c.n} — {c.title}</span>{c.line}</p>
              ))}
            </div>
          )}

          <div className="wrap hero-foot">
            <span className="mono muted hero-note">{mode === 'full' ? <><b>{scenes[sc].n}</b> / 06 — {scenes[sc].title}</> : t('3D portrait built from Bilal’s own photograph')}</span>
            {mode === 'full' && (<>
              <span className="hero-bar" aria-hidden="true"><i /></span>
              <a className="mono hero-skip" href="#intro">{t('Skip intro ↓')}</a>
            </>)}
            {mode !== 'full' && <a className="mono hero-skip" href="#reel">{t('Scroll ↓')}</a>}
          </div>
        </div>
      </section>

      {mode !== 'full' && (
        <section id="reel" ref={reel} className="reel" aria-labelledby="reel-h">
          <h2 id="reel-h" className="sr-only">{t('From human to human-plus-machine, in six scenes')}</h2>
          <div className="reel-stage">
            {scenes.slice(1).map((c, i) => (
              <figure key={c.n} className={`reel-frame ${i === 0 ? 'on' : ''}`}>
                <img src={`/scene/m${i + 2}.webp`} alt="" width={720} height={1100} loading="lazy" decoding="async" />
                <figcaption className="wrap"><span className="mono">{c.n} / 06 — {c.title}</span><span className="reel-line">{c.line}</span></figcaption>
              </figure>
            ))}
          </div>
          <p className="wrap mono muted reel-note">{t('Lightweight still version. The full real-time 3D scene runs on desktop.')}</p>
        </section>
      )}
    </>
  );
}
