import type { Dict } from '@/i18n/en';
import { Scene } from '@/components/visuals/Scene';
import { StoreUi, DashboardUi } from '@/components/visuals/Ui';

type SceneName = 'discover' | 'operations' | 'planning' | 'design' | 'build' | 'testing' | 'delivery';

/**
 * The seven-step process as a visual journey.
 *
 * Each step pairs exactly one photograph (or a real interface) with a title, one short
 * explanation and an outcome label. On a phone the picture and its text stay adjacent, so
 * nobody scrolls past a large image to find out what it meant.
 */
export function ProcessJourney({ t }: { t: Dict }) {
  const p = t.process;
  const steps: { n: string; title: string; vis: string; body: string; out: string; scene?: SceneName; ui?: 'store' | 'dashboard' }[] = [
    { n: '01', title: p.step1Title, vis: p.step1Vis, body: p.step1Body, out: p.step1Out, scene: 'discover' },
    { n: '02', title: p.step2Title, vis: p.step2Vis, body: p.step2Body, out: p.step2Out, scene: 'operations' },
    { n: '03', title: p.step3Title, vis: p.step3Vis, body: p.step3Body, out: p.step3Out, scene: 'planning' },
    { n: '04', title: p.step4Title, vis: p.step4Vis, body: p.step4Body, out: p.step4Out, scene: 'design' },
    { n: '05', title: p.step5Title, vis: p.step5Vis, body: p.step5Body, out: p.step5Out, scene: 'build' },
    { n: '06', title: p.step6Title, vis: p.step6Vis, body: p.step6Body, out: p.step6Out, scene: 'testing' },
    { n: '07', title: p.step7Title, vis: p.step7Vis, body: p.step7Body, out: p.step7Out, scene: 'delivery' },
  ];

  return (
    <ol className="journey">
      {steps.map((s) => (
        <li key={s.n} className="jstep">
          <div className="jstep-media reveal">
            <span className="jstep-n" aria-hidden="true">{s.n}</span>
            {s.scene && (
              <Scene
                name={s.scene}
                caption={s.vis}
                ratio="4 / 3"
                className={s.n === '05' ? 'has-ui' : ''}
              >
                {s.n === '05' && (
                  <span className="scene-ui">
                    <span className="ui-frame"><StoreUi compact /></span>
                  </span>
                )}
                {s.n === '07' && (
                  <span className="scene-ui right">
                    <span className="ui-frame"><DashboardUi compact /></span>
                  </span>
                )}
              </Scene>
            )}
          </div>
          <div className="jstep-body reveal">
            <h3 className="jstep-t">{s.title}</h3>
            <p className="jstep-p">{s.body}</p>
            <span className="jstep-out">{p.outcome}: {s.out}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
