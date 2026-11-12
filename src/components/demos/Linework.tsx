'use client';
import { useEffect, useRef, useState } from 'react';
import { Bars, DemoShell, Kpi, money } from './shared';

const stages = ['New', 'Qualified', 'Proposal', 'Won'] as const;
const seed = [
  { id: 1, name: 'Harbour Dental', value: 4200, owner: 'RK', stage: 0, days: 1 }, { id: 2, name: 'Pine & Co. Architects', value: 9800, owner: 'SL', stage: 0, days: 3 }, { id: 3, name: 'Greenline Logistics', value: 15500, owner: 'RK', stage: 0, days: 9 },
  { id: 4, name: 'Atlas Fitness', value: 6100, owner: 'SL', stage: 1, days: 2 }, { id: 5, name: 'Maple Street Bakery', value: 2400, owner: 'RK', stage: 1, days: 5 },
  { id: 6, name: 'Northgate Legal', value: 12000, owner: 'SL', stage: 2, days: 4 }, { id: 7, name: 'Orchard Prep School', value: 7300, owner: 'RK', stage: 2, days: 11 },
  { id: 8, name: 'Tidewater Hotels', value: 21000, owner: 'SL', stage: 3, days: 0 },
];
const contacts = [
  { name: 'Dr. Ines Marlow', co: 'Harbour Dental', email: 'ines@harbourdental.example', last: 'Enquiry form — yesterday', log: ['Form submitted: “Need online booking”', 'Auto-reply sent', 'Assigned to RK'] },
  { name: 'Peter Lindqvist', co: 'Northgate Legal', email: 'peter@northgate.example', last: 'Proposal sent — 4 days ago', log: ['Discovery call held', 'Proposal v2 sent', 'Reminder scheduled for day 5'] },
  { name: 'Sara Okafor', co: 'Tidewater Hotels', email: 'sara@tidewater.example', last: 'Contract signed — today', log: ['Proposal accepted', 'Contract signed', 'Onboarding workflow started'] },
  { name: 'Dev Patel', co: 'Atlas Fitness', email: 'dev@atlasfitness.example', last: 'Call booked — Friday', log: ['Qualified by phone', 'Call booked for Friday 10:00'] },
];
const flows = [
  { name: 'New lead intake', steps: [['Trigger', 'Website form submitted'], ['Action', 'Create lead in “New”'], ['Action', 'Send acknowledgement email'], ['Action', 'Assign owner by rotation'], ['Wait', 'If no contact in 24h → remind owner']], runs: 128 },
  { name: 'Proposal follow-up', steps: [['Trigger', 'Deal enters “Proposal”'], ['Wait', '5 days without reply'], ['Action', 'Send follow-up email'], ['Action', 'Create call task for owner']], runs: 41 },
  { name: 'Won → onboarding', steps: [['Trigger', 'Deal marked “Won”'], ['Action', 'Create project record'], ['Action', 'Send welcome pack'], ['Action', 'Schedule kickoff task']], runs: 17 },
];
const TABS = ['Pipeline', 'Customers', 'Tasks', 'Automations', 'Analytics'];

export default function Linework() {
  const [tab, setTab] = useState(TABS[0]);
  const [deals, setDeals] = useState(seed);
  const [sel, setSel] = useState(0);
  const [tasks, setTasks] = useState([{ t: 'Call Greenline Logistics — no activity for 9 days', done: false }, { t: 'Send revised proposal to Orchard Prep School', done: false }, { t: 'Confirm Friday call with Atlas Fitness', done: true }]);
  const [newTask, setNewTask] = useState('');
  const [on, setOn] = useState([true, true, false]);
  const [flow, setFlow] = useState(0);
  const [run, setRun] = useState(-1);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  useEffect(() => () => clearInterval(timer.current), []);

  const move = (id: number, d: number) => setDeals((ds) => ds.map((x) => (x.id === id ? { ...x, stage: Math.max(0, Math.min(3, x.stage + d)), days: 0 } : x)));
  const test = () => {
    clearInterval(timer.current); setRun(0);
    timer.current = setInterval(() => setRun((r) => { if (r >= flows[flow].steps.length) { clearInterval(timer.current); return r; } return r + 1; }), 600);
  };
  const byStage = stages.map((_, i) => deals.filter((d) => d.stage === i));
  const stuck = deals.filter((d) => d.stage < 3 && d.days >= 7).length;

  return (
    <DemoShell title="Linework CRM" note="fictional firm and sample data" tabs={TABS} tab={tab} onTab={(t) => { setTab(t); setRun(-1); }} className="linework">
      {tab === 'Pipeline' && (
        <div className="l-pad">
          <div className="d-kpis"><Kpi label="Open pipeline" value={money(deals.filter((d) => d.stage < 3).reduce((s, d) => s + d.value, 0))} /><Kpi label="Won" value={money(byStage[3].reduce((s, d) => s + d.value, 0))} /><Kpi label="Stalled 7+ days" value={stuck} sub={stuck ? 'needs a follow-up' : 'all moving'} /></div>
          <div className="l-board">
            {stages.map((s, i) => (
              <section key={s} aria-label={`${s} stage`}><header><b>{s}</b><span>{byStage[i].length} · {money(byStage[i].reduce((a, d) => a + d.value, 0))}</span></header>
                {byStage[i].map((d) => (
                  <article key={d.id} className={`${d.days >= 7 && i < 3 ? 'stuck' : ''} ${i === 3 ? 'won' : ''}`}>
                    <b>{d.name}</b><small>{money(d.value)} · {d.owner}{i < 3 && ` · ${d.days}d idle`}</small>
                    <div><button disabled={i === 0} onClick={() => move(d.id, -1)} aria-label={`Move ${d.name} back`}>←</button><button disabled={i === 3} onClick={() => move(d.id, 1)} aria-label={`Move ${d.name} to ${stages[Math.min(3, i + 1)]}`}>{i === 2 ? 'Mark won' : 'Advance'} →</button></div>
                  </article>
                ))}
                {byStage[i].length === 0 && <p className="d-mut">Empty</p>}
              </section>
            ))}
          </div>
        </div>
      )}
      {tab === 'Customers' && (
        <div className="l-pad l-two">
          <ul className="l-list">{contacts.map((c, i) => <li key={c.name}><button aria-pressed={i === sel} onClick={() => setSel(i)}><b>{c.name}</b><small>{c.co}</small></button></li>)}</ul>
          <div className="d-card" aria-live="polite"><h4>{contacts[sel].name}</h4><p className="d-mut">{contacts[sel].co} · {contacts[sel].email}</p><p style={{ margin: '14px 0 8px' }}><b>Last activity:</b> {contacts[sel].last}</p><ol className="l-log">{contacts[sel].log.map((l) => <li key={l}>{l}</li>)}</ol></div>
        </div>
      )}
      {tab === 'Tasks' && (
        <div className="l-pad">
          <form className="l-add" onSubmit={(e) => { e.preventDefault(); if (newTask.trim()) { setTasks([{ t: newTask.trim(), done: false }, ...tasks]); setNewTask(''); } }}>
            <label className="sr-only" htmlFor="l-new">New task</label><input id="l-new" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add a task…" autoComplete="off" /><button type="submit">Add</button>
          </form>
          <ul className="k-tasks big">{tasks.map((t, i) => <li key={t.t + i}><label><input type="checkbox" checked={t.done} onChange={() => setTasks((ts) => ts.map((x, k) => (k === i ? { ...x, done: !x.done } : x)))} /><span className={t.done ? 'done' : ''}>{t.t}</span></label></li>)}</ul>
        </div>
      )}
      {tab === 'Automations' && (
        <div className="l-pad l-two">
          <ul className="l-list">{flows.map((f, i) => (
            <li key={f.name} className="l-auto"><button aria-pressed={i === flow} onClick={() => { setFlow(i); setRun(-1); }}><b>{f.name}</b><small>{on[i] ? `Active · ${f.runs} runs (sample)` : 'Paused'}</small></button>
              <button role="switch" aria-checked={on[i]} aria-label={`${f.name} ${on[i] ? 'on' : 'off'}`} className={`t-sw ${on[i] ? 'on' : ''}`} onClick={() => setOn(on.map((v, k) => (k === i ? !v : v)))} /></li>
          ))}</ul>
          <div className="d-card">
            <div className="l-flowhead"><h4>{flows[flow].name}</h4><button className="d-btn" onClick={test} disabled={!on[flow]}>{on[flow] ? 'Run test' : 'Paused'}</button></div>
            <ol className="l-flow">{flows[flow].steps.map(([k, v], i) => <li key={v} className={`${run > i ? 'ran' : ''} ${run === i ? 'running' : ''}`}><small>{k}</small><span>{v}</span></li>)}</ol>
            <p className="d-mut" aria-live="polite">{run < 0 ? 'A test run walks through each step without sending anything.' : run >= flows[flow].steps.length ? 'Test run complete — nothing was sent.' : 'Running…'}</p>
          </div>
        </div>
      )}
      {tab === 'Analytics' && (
        <div className="l-pad">
          <p className="d-sample">Funnel reflects the pipeline tab live · other figures are fictional sample data</p>
          <div className="d-cols">
            <div className="d-card"><h4>Deals by stage</h4><Bars data={byStage.map((b) => b.length)} labels={[...stages]} /></div>
            <div className="d-card"><h4>Lead response time (hours)</h4><Bars data={[9.5, 7.2, 5.1, 3.4, 2.2, 1.6]} labels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6']} /><p className="d-mut">Falling after intake automation was switched on (illustrative).</p></div>
          </div>
        </div>
      )}
    </DemoShell>
  );
}
