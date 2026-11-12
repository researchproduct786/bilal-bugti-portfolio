import type { Project } from '@/data/projects';

/** Project covers are drawn in HTML/CSS — original compositions, crisp at any size, no image requests. */
export function Cover({ project, label = true }: { project: Project; label?: boolean }) {
  const s = project.slug;
  return (
    <div className={`cv cv-${s}`} style={{ ['--ac' as string]: project.accent }} role="img" aria-label={`${project.brand} — ${project.title}. Concept project cover.`}>
      {label && <span className="tag concept cv-tag">Concept Project</span>}
      <span className="cv-n mono">{project.n}</span>
      {s === 'halden-objects' && (<>
        <div className="cv-h-word">Halden</div>
        <div className="cv-h-obj"><i /><i /><i /></div>
        <div className="cv-h-card"><b>Oak desk tray</b><span>Natural · Large</span><em>$84</em></div>
      </>)}
      {s === 'tillo' && (<>
        <div className="cv-phone"><small>Today</small><b>$1,284</b><div className="cv-bars">{[38, 62, 45, 80, 56, 92, 70].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div><p><span />4 orders to pack</p><p><span />2 items low</p></div>
        <div className="cv-phone back"><small>Orders</small>{[0, 1, 2, 3].map((i) => <p key={i}><span />#{1042 - i}</p>)}</div>
      </>)}
      {s === 'deskhand' && (<div className="cv-chat">
        <p className="me">Which orders are running late this week?</p>
        <p>Three orders are past their promised date. Two are waiting on the same supplier.<small>Source · Orders sheet</small></p>
        <div><span>Draft supplier email</span><span>Create task</span></div>
      </div>)}
      {s === 'linework-crm' && (<div className="cv-kan">
        {['New', 'Qualified', 'Proposal', 'Won'].map((c, i) => <div key={c}><small>{c}</small>{Array.from({ length: [3, 2, 2, 1][i] }).map((_, k) => <i key={k} className={i === 3 ? 'won' : ''} />)}</div>)}
      </div>)}
      {s === 'ember-and-rye' && (<>
        <div className="cv-e-word">Ember<br />&amp; Rye</div>
        <div className="cv-ticket"><small>Order #218 · Table 6</small><p><b>1×</b> Charred leek flatbread</p><p><b>2×</b> Rye sourdough, cultured butter</p><p><b>1×</b> Smoked lamb shoulder</p><em>In the kitchen</em></div>
      </>)}
      {s === 'slowtide' && (<>
        <div className="cv-s-line">Take the<br />long afternoon.</div>
        <div className="cv-can"><span>Slow<br />tide</span></div>
      </>)}
    </div>
  );
}
