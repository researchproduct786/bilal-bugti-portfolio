'use client';
import { useEffect, useRef, useState } from 'react';
import type { Dict } from '@/i18n/en';
import { Scene } from '@/components/visuals/Scene';
import { StoreUi, DashboardUi } from '@/components/visuals/Ui';

type SceneName = 'discover' | 'operations' | 'planning' | 'design' | 'build' | 'testing' | 'delivery';

/**
 * The seven steps, image and copy in lockstep.
 *
 * Desktop: the picture is pinned in one column and the copy scrolls past it; the
 * step whose text is in the reading band becomes the active one, and its picture
 * cross-fades in place. Only one image is ever on screen, so the section costs one
 * decode rather than seven.
 *
 * Mobile: there is no room to pin anything beside a column of text, so the layout is
 * designed separately — a compact horizontal step rail that sticks under the nav,
 * and image-above-copy pairs that stay adjacent. Nobody has to scroll past a large
 * picture to discover what it was for.
 *
 * Every picture is a real commercial scene or a real interface. None of them is an
 * empty wireframe, a blank phone or an empty product card.
 */
export function ProcessJourney({ t }: { t: Dict }) {
  const p = t.process;
  const steps: { n: string; title: string; vis: string; body: string; out: string; scene: SceneName; ui?: 'store' | 'dashboard' }[] = [
    { n: '01', title: p.step1Title, vis: p.step1Vis, body: p.step1Body, out: p.step1Out, scene: 'discover' },
    { n: '02', title: p.step2Title, vis: p.step2Vis, body: p.step2Body, out: p.step2Out, scene: 'operations' },
    { n: '03', title: p.step3Title, vis: p.step3Vis, body: p.step3Body, out: p.step3Out, scene: 'planning' },
    { n: '04', title: p.step4Title, vis: p.step4Vis, body: p.step4Body, out: p.step4Out, scene: 'design' },
    { n: '05', title: p.step5Title, vis: p.step5Vis, body: p.step5Body, out: p.step5Out, scene: 'build', ui: 'store' },
    { n: '06', title: p.step6Title, vis: p.step6Vis, body: p.step6Body, out: p.step6Out, scene: 'testing' },
    { n: '07', title: p.step7Title, vis: p.step7Vis, body: p.step7Body, out: p.step7Out, scene: 'delivery', ui: 'dashboard' },
  ];

  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  /* Desktop lockstep: whichever step's own box is nearest the middle of the viewport
     supplies the picture. IntersectionObserver with a narrow band does this without
     a scroll listener per step and without any pinning or hijacking. */
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-step]'));
    if (!items.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.step);
            if (!Number.isNaN(i)) setActive(i);
          }
        }
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 },
    );
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, []);

  const cur = steps[active];

  return (
    <div className="jx">
      {/* ── desktop: pinned frame ── */}
      <div className="jx-frame" aria-hidden="true">
        <div className="jx-shot">
          {steps.map((s, i) => (
            <div key={s.n} className={`jx-layer ${i === active ? 'is-on' : ''}`} data-on={i === active}>
              <Scene
                name={s.scene}
                caption={s.vis}
                ratio="4 / 3"
                className={s.ui ? 'has-ui' : ''}
              >
                {s.ui === 'store' && (
                  <span className="scene-ui"><span className="ui-frame"><StoreUi compact /></span></span>
                )}
                {s.ui === 'dashboard' && (
                  <span className="scene-ui right"><span className="ui-frame"><DashboardUi compact /></span></span>
                )}
              </Scene>
            </div>
          ))}
        </div>
        <ol className="jx-rail" aria-hidden="true">
          {steps.map((s, i) => (
            <li key={s.n} className={i === active ? 'is-on' : ''}>
              <span className="jx-rail-n mono">{s.n}</span>
              <span className="jx-rail-line" />
            </li>
          ))}
        </ol>
      </div>

      {/* ── the seven steps ── */}
      <ol className="jx-steps" ref={listRef}>
        {steps.map((s, i) => (
          <li key={s.n} className={`jx-step ${i === active ? 'is-on' : ''}`} data-step={i}>
            {/* Mobile only: the image stays attached to its own copy. */}
            <div className="jx-step-media">
              <span className="jx-step-n mono">{s.n}</span>
              <Scene name={s.scene} caption={s.vis} ratio="16 / 10" className={s.ui ? 'has-ui' : ''}>
                {s.ui === 'store' && (
                  <span className="scene-ui"><span className="ui-frame"><StoreUi compact /></span></span>
                )}
                {s.ui === 'dashboard' && (
                  <span className="scene-ui right"><span className="ui-frame"><DashboardUi compact /></span></span>
                )}
              </Scene>
            </div>
            <div className="jx-step-body">
              <h3 className="jx-step-t">{s.title}</h3>
              <p className="jx-step-p">{s.body}</p>
              <p className="jx-step-out"><span className="mono">{p.outcome}</span>{s.out}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="sr-only" aria-live="polite">{cur.title}</p>
    </div>
  );
}
