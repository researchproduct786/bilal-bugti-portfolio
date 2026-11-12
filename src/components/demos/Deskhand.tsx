'use client';
import { useEffect, useRef, useState } from 'react';
import { DemoShell } from './shared';

/**
 * IMPORTANT: there is no AI model behind this. Answers are chosen by simple keyword
 * matching against a small scripted knowledge base, entirely in the browser.
 */
interface Intent { keys: string[]; answer: string; source: string; actions: string[] }
const intents: Intent[] = [
  { keys: ['late', 'delay', 'overdue', 'behind'], answer: 'Three orders are past their promised date: #2214, #2219 and #2223. Two of them are waiting on walnut panels from the same supplier, Corbel Timber.', source: 'Orders sheet · updated today', actions: ['Create task: call Corbel Timber about walnut panels', 'Create task: email customers on #2214 and #2219'] },
  { keys: ['return', 'refund', 'policy'], answer: 'Standard items can be returned within 30 days in original condition. Made-to-order furniture is not returnable, but faults are repaired or replaced within 12 months.', source: 'Returns policy.pdf · section 2', actions: ['Create task: add returns summary to order confirmation email'] },
  { keys: ['sell', 'best', 'top', 'popular', 'product'], answer: 'This month the best sellers are the Arlo side table (38 units), the Fen bookshelf (21) and the Arlo bench (17). The side table accounts for roughly a third of revenue.', source: 'Sales report · this month', actions: ['Create task: check Arlo side table stock for next month'] },
  { keys: ['supplier', 'corbel', 'timber', 'lead time'], answer: 'Corbel Timber’s agreed lead time is 10 working days. The last two deliveries took 16 and 19 days. The contract allows a 5% credit for deliveries more than 5 days late.', source: 'Supplier agreement · Corbel Timber', actions: ['Create task: request late-delivery credit from Corbel Timber'] },
  { keys: ['hour', 'open', 'showroom', 'visit'], answer: 'The showroom is open Tuesday to Saturday, 10:00–18:00. Workshop visits are by appointment on Thursdays.', source: 'Team handbook · Showroom', actions: [] },
  { keys: ['summary', 'week', 'overview', 'how are we'], answer: 'This week: 46 orders (up 6 on last week), 3 running late, 2 open customer complaints, and stock of walnut panels is below the reorder level.', source: 'Weekly dashboard', actions: ['Create task: reorder walnut panels', 'Create task: review the 2 open complaints'] },
];
const docs = [['Orders sheet', '312 rows'], ['Returns policy.pdf', '4 pages'], ['Supplier agreement · Corbel Timber', '9 pages'], ['Sales report', 'Monthly'], ['Team handbook', '27 pages'], ['Weekly dashboard', 'Live']];
const prompts = ['Which orders are running late?', 'What is our return policy?', 'What sold best this month?', 'Give me a summary of the week'];
interface Msg { from: 'me' | 'bot'; text: string; source?: string; actions?: string[] }

export default function Deskhand() {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: 'Hello. I answer questions from Northfold Furniture’s documents (a fictional company). Ask about late orders, returns, best sellers, the supplier, showroom hours or the week’s summary.' }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [tasks, setTasks] = useState<{ t: string; done: boolean }[]>([{ t: 'Send Thursday workshop schedule', done: true }]);
  const end = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const el = end.current?.parentElement; if (el) el.scrollTop = el.scrollHeight; }, [msgs, busy]);

  const ask = (q: string) => {
    const text = q.trim(); if (!text || busy) return;
    setMsgs((m) => [...m, { from: 'me', text }]); setInput(''); setBusy(true);
    const low = text.toLowerCase();
    const hit = intents.find((i) => i.keys.some((k) => low.includes(k)));
    timer.current = setTimeout(() => {
      setMsgs((m) => [...m, hit ? { from: 'bot', text: hit.answer, source: hit.source, actions: hit.actions } : { from: 'bot', text: 'That is outside what this scripted demo knows. I can answer about: late orders, the return policy, best sellers, the supplier, showroom hours, or a weekly summary.' }]);
      setBusy(false);
    }, 650);
  };
  const addTask = (a: string) => { const t = a.replace(/^Create task: /, ''); setTasks((ts) => (ts.some((x) => x.t === t) ? ts : [{ t: t.charAt(0).toUpperCase() + t.slice(1), done: false }, ...ts])); };

  return (
    <DemoShell title="Deskhand — business assistant" note="scripted responses, no AI model connected" className="deskhand">
      <div className="k-grid">
        <aside className="k-side">
          <h4>Business knowledge</h4>
          <ul className="k-docs">{docs.map(([n, d]) => <li key={n}><span aria-hidden="true">▤</span><span>{n}<small>{d}</small></span></li>)}</ul>
          <p className="d-mut k-fine">Sample documents for a fictional company. Answers cite the document they came from.</p>
        </aside>
        <section className="k-chat" aria-label="Conversation">
          <div className="k-log" role="log" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`k-msg ${m.from}`}>
                <p>{m.text}</p>
                {m.source && <small>Source · {m.source}</small>}
                {m.actions && m.actions.length > 0 && <div className="k-actions">{m.actions.map((a) => <button key={a} onClick={() => addTask(a)}>+ {a.replace('Create task: ', 'Task: ')}</button>)}</div>}
              </div>
            ))}
            {busy && <div className="k-msg bot typing" aria-label="Looking that up"><i /><i /><i /></div>}
            <div ref={end} />
          </div>
          <div className="k-prompts">{prompts.map((p) => <button key={p} onClick={() => ask(p)} disabled={busy}>{p}</button>)}</div>
          <form className="k-input" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
            <label className="sr-only" htmlFor="k-q">Ask a question</label>
            <input id="k-q" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about orders, returns, suppliers…" autoComplete="off" />
            <button type="submit" disabled={busy || !input.trim()}>Send</button>
          </form>
        </section>
        <aside className="k-side right">
          <h4>Tasks <span className="d-mut">{tasks.filter((t) => !t.done).length} open</span></h4>
          <ul className="k-tasks">{tasks.map((t, i) => <li key={t.t}><label><input type="checkbox" checked={t.done} onChange={() => setTasks((ts) => ts.map((x, k) => (k === i ? { ...x, done: !x.done } : x)))} /><span className={t.done ? 'done' : ''}>{t.t}</span></label></li>)}</ul>
          <h4 style={{ marginTop: 22 }}>Insights <span className="d-mut">sample</span></h4>
          <ul className="k-ins"><li><b>3</b> orders late — same supplier on 2</li><li><b>+15%</b> orders vs. last week</li><li><b>Walnut panels</b> below reorder level</li></ul>
        </aside>
      </div>
    </DemoShell>
  );
}
