'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { StudioScene } from '@/three/studio';
import { Btn } from '@/components/site/Btn';
import { site } from '@/data/site';

const StudioCanvas = dynamic(() => import('./StudioCanvas'), { ssr: false });

type Mode = 'pending' | 'full' | 'lite';
const CAPS = [
  { from: 0.25, to: 0.46 },
  { from: 0.5, to: 0.72 },
  { from: 0.78, to: 1.01 },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<StudioScene | null>(null);
  const [mode, setMode] = useState<Mode>('pending');
  const [ready, setReady] = useState(false);
  const [mix, setMix] = useState(35);

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
            const { from, to } = CAPS[i];
            const a = Math.min(1, Math.max(0, (p - from) / 0.06)) * (1 - Math.min(1, Math.max(0, (p - (to - 0.06)) / 0.06)));
            c.style.opacity = String(i === 2 ? Math.min(1, Math.max(0, (p - from) / 0.06)) : a);
            c.style.transform = `translateY(${(1 - a) * 14}px)`;
          });
          bar.style.transform = `scaleX(${p})`;
        },
      });
      kill = () => st.kill();
    })();
    return () => { dead = true; kill(); };
  }, [mode]);

  return (
    <>
      <section ref={root} className={`hero ${mode === 'full' ? 'hero--full' : ''}`} aria-label="Introduction">
        <div className="hero-stage">
          <picture>
            <source media="(max-width: 899px)" srcSet="/scene/portrait-human.webp" />
            <img className="hero-poster" src="/scene/wide.webp" alt="A dark technology studio: a figure seated at a three-monitor workstation, lit by a warm pendant lamp and the cool glow of the screens." width={1600} height={900} fetchPriority="high" decoding="async" />
          </picture>
          {mode === 'full' && <StudioCanvas className={`hero-canvas ${ready ? 'on' : ''}`} onScene={(s) => { scene.current = s; }} onReady={() => setReady(true)} />}
          <div className="hero-shade" aria-hidden="true" />

          <div className="wrap hero-copy">
            <p className="kicker bare hero-kicker"><b>{site.role}</b><span>·</span><span>{site.discipline}</span></p>
            <h1 className="display lines hero-title" aria-label={site.name}>
              <span aria-hidden="true"><span style={{ ['--i' as string]: 0 }}>Bilal</span></span>
              <span aria-hidden="true"><span style={{ ['--i' as string]: 1 }}>Bugti</span></span>
            </h1>
            <div className="hero-under">
              <p className="hero-triad">Technology. Creativity. Business Solutions.</p>
              <p className="serif hero-tagline">“{site.tagline}”</p>
              <div className="hero-ctas">
                <Btn href="/work">Explore my work</Btn>
                <Btn href="/contact" variant="ghost">Start a project</Btn>
              </div>
            </div>
          </div>

          {mode === 'full' && (
            <div className="wrap hero-caps" aria-hidden={false}>
              <p className="cap cap-a"><span className="mono">01 — Origin</span>Every project starts with a person and a problem.</p>
              <p className="cap cap-b"><span className="mono">02 — Method</span>The tools change. The thinking gets sharper.</p>
              <p className="cap cap-c"><span className="mono">03 — Result</span>Human judgment.<br />Machine leverage.</p>
            </div>
          )}

          <div className="wrap hero-foot">
            <span className="mono muted hero-note">Placeholder figure — not a likeness</span>
            {mode === 'full' && (<>
              <span className="hero-bar" aria-hidden="true"><i /></span>
              <a className="mono hero-skip" href="#intro">Skip intro ↓</a>
            </>)}
            {mode !== 'full' && <a className="mono hero-skip" href="#intro">Scroll ↓</a>}
          </div>
        </div>
      </section>

      {mode === 'lite' && (
        <section className="morph-lite" aria-labelledby="morph-h">
          <div className="wrap">
            <p className="kicker">Human ⇄ machine</p>
            <h2 id="morph-h" className="h3" style={{ marginTop: 14, maxWidth: '18em' }}>Human judgment, machine leverage. Drag to see the same desk both ways.</h2>
            <div className="compare" style={{ ['--mix' as string]: `${mix}%` }}>
              <img src="/scene/portrait-human.webp" alt="The seated placeholder figure in a dark hoodie at the workstation." width={900} height={1200} loading="lazy" decoding="async" />
              <img className="top" src="/scene/portrait-machine.webp" alt="The same figure transformed: metal plating with thin blue light seams." width={900} height={1200} loading="lazy" decoding="async" />
              <span className="compare-line" aria-hidden="true" />
              <input type="range" min={0} max={100} value={mix} onChange={(e) => setMix(Number(e.target.value))} aria-label="Transformation amount" />
            </div>
            <p className="mono muted" style={{ marginTop: 12 }}>Lightweight still version. The full 3D scene runs on desktop.</p>
          </div>
        </section>
      )}
    </>
  );
}
