'use client';
import { useT } from '@/i18n/client';
import type { Project } from '@/data/projects';

/** Project covers are drawn in HTML/CSS — original compositions, crisp at any size, no image requests. */
export function Cover({ project, label = true }: { project: Project; label?: boolean }) {
  const t = useT();
  const s = project.slug;
  return (
    <div className={`cv cv-${s}`} style={{ ['--ac' as string]: project.accent }} role="img" aria-label={t('{brand} — {title}. Concept project cover.', { brand: project.brand, title: project.title })}>
      {label && <span className="tag concept cv-tag">{t('Concept Project')}</span>}
      <span className="cv-n mono">{project.n}</span>
      {s === 'halden-objects' && (<>
        <div className="cv-h-word">{t('Halden')}</div>
        <div className="cv-h-obj"><i /><i /><i /></div>
        <div className="cv-h-card"><b>{t('Oak desk tray')}</b><span>{t('Natural · Large')}</span><em>$84</em></div>
      </>)}
      {s === 'tillo' && (<>
        <div className="cv-phone"><small>{t('Today')}</small><b>$1,284</b><div className="cv-bars">{[38, 62, 45, 80, 56, 92, 70].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div><p><span />{t('4 orders to pack')}</p><p><span />{t('2 items low')}</p></div>
        <div className="cv-phone back"><small>{t('Orders')}</small>{[0, 1, 2, 3].map((i) => <p key={i}><span />#{1042 - i}</p>)}</div>
      </>)}
      {s === 'deskhand' && (<div className="cv-chat">
        <p className="me">{t('Which orders are running late this week?')}</p>
        <p>{t('Three orders are past their promised date. Two are waiting on the same supplier.')}<small>{t('Source · Orders sheet')}</small></p>
        <div><span>{t('Draft supplier email')}</span><span>{t('Create task')}</span></div>
      </div>)}
      {s === 'linework-crm' && (<div className="cv-kan">
        {[t('New'), t('Qualified'), t('Proposal'), t('Won')].map((c, i) => <div key={c}><small>{c}</small>{Array.from({ length: [3, 2, 2, 1][i] }).map((_, k) => <i key={k} className={i === 3 ? 'won' : ''} />)}</div>)}
      </div>)}
      {s === 'ember-and-rye' && (<>
        <div className="cv-e-word">{t('Ember')}<br />{t('& Rye')}</div>
        <div className="cv-ticket"><small>{t('Order #218 · Table 6')}</small><p><b>1×</b> {t('Charred leek flatbread')}</p><p><b>2×</b> {t('Rye sourdough, cultured butter')}</p><p><b>1×</b> {t('Smoked lamb shoulder')}</p><em>{t('In the kitchen')}</em></div>
      </>)}
      {s === 'slowtide' && (<>
        <div className="cv-s-line">{t('Take the')}<br />{t('long afternoon.')}</div>
        <div className="cv-can"><span>{t('Slow')}<br />{t('tide')}</span></div>
      </>)}
    </div>
  );
}
