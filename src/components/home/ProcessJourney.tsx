'use client';
import { useEffect, useRef, useState } from 'react';
import type { JourneyScene } from '@/three/journey';
import { processSteps } from '@/data/content';
import { useT } from '@/i18n/client';
import { i18n } from '@/i18n/core';

/** What each 3D station is showing, in one line — also the text alternative for the canvas. */
const SEEN = i18n([
  'A small shop, its counter and the people who run it.',
  'A chain of steps with one link out of place.',
  'A blueprint, with the solution drawn in outline.',
  'A website and a phone screen, their layout arriving piece by piece.',
  'The planned structure, assembled block by block.',
  'The product under a scanner, checks lighting up one by one.',
  'The finished product on a plinth, handed to its owners.',
]);
const ICONS = [
  'M3 10l9-6 9 6v10H3z M9 20v-6h6v6', 'M4 12h4 M16 12h4 M10 8l4 8 M14 8l-4 8', 'M3 5h18v14H3z M3 10h18 M9 5v14',
  'M3 4h12v10H3z M17 8h4v12h-4z M5 17h8', 'M4 20h6v-6H4z M10 20h6v-6h-6z M7 14h6V8H7z', 'M4 12l5 5L20 6 M4 20h16', 'M12 3l8 5v8l-8 5-8-5V8z M12 12l8-4 M12 12v9 M12 12L4 8',
];

/**
 * One pinned, scroll-driven section for all seven steps. Scrolling is never captured:
 * the page scrolls normally and the scene follows. Without WebGL, on small screens or with
 * reduced motion, the same content is a plain illustrated list.
 */
export function ProcessJourney({ heading = false }: { heading?: boolean }) {
  const t = useT();
  const steps = t.x(processSteps), seen = t.x(SEEN);
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const ok = window.matchMedia('(min-width: 900px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let gl = false; try { const c = document.createElement('canvas'); gl = !!(c.getContext('webgl2') || c.getContext('webgl')); } catch {}
    setLive(ok && gl);
  }, []);

  useEffect(() => {
    if (!live || !root.current || !canvas.current) return;
    const el = root.current, cv = canvas.current; let scene: JourneyScene | null = null; let dead = false; let raf = 0; let inView = false;
    const measure = () => { raf = 0;
      const r = el.getBoundingClientRect(); const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      scene?.setProgress(p); setStep(Math.min(6, Math.round(p * 6)));
      el.style.setProperty('--p', String(p));
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(measure); };
    const sync = () => scene?.setActive(inView && !document.hidden);
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.01 }); io.observe(el);
    const ro = new ResizeObserver(() => { scene?.resize(); req(); }); ro.observe(cv);
    const move = (e: PointerEvent) => scene?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    window.addEventListener('scroll', req, { passive: true }); document.addEventListener('visibilitychange', sync); window.addEventListener('pointermove', move, { passive: true });
    import('@/three/journey').then(({ JourneyScene }) => {
      if (dead) return;
      try { scene = new JourneyScene(cv, { rtl: document.documentElement.dir === 'rtl' }); } catch { setLive(false); return; }
      (window as unknown as { __journey?: JourneyScene }).__journey = scene;
      measure(); sync(); setReady(true);
    });
    return () => { dead = true; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); window.removeEventListener('scroll', req); document.removeEventListener('visibilitychange', sync); window.removeEventListener('pointermove', move); scene?.dispose(); };
  }, [live]);

  const goto = (i: number) => {
    const el = root.current; if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + (i / 6) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div ref={root} className={`jr ${live ? 'jr--live' : ''}`}>
      <div className="jr-stage">
        {live && <canvas ref={canvas} className={`jr-canvas ${ready ? 'on' : ''}`} aria-hidden="true" />}
        <div className="wrap jr-in">
          {heading && <p className="kicker jr-kicker"><b>07</b> {t('Process')}</p>}
          <ol className="jr-steps">
            {steps.map((s, i) => (
              <li key={i} className={`jr-step ${i === step ? 'on' : ''}`} aria-hidden={live && i !== step ? true : undefined}>
                <span className="jr-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <svg className="jr-icon" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d={ICONS[i]} /></svg>
                <h3 className="jr-title">{s.title}</h3>
                <p className="jr-body">{s.body}</p>
                <p className="jr-out"><span className="mono">{t('You get')}</span>{s.output}</p>
                <p className="jr-seen mono">{t('In the scene:')} {seen[i]}</p>
              </li>
            ))}
          </ol>
          {live && (
            <nav className="jr-rail" aria-label={t('Process steps')}>
              {steps.map((s, i) => <button key={i} aria-current={i === step ? 'step' : undefined} onClick={() => goto(i)}><span className="mono">{String(i + 1).padStart(2, '0')}</span><span className="jr-rail-t">{s.title}</span></button>)}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
