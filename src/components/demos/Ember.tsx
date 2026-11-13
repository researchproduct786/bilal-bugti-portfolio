'use client';
import { useState } from 'react';
import { Bars, DemoShell, Kpi, money } from './shared';

const seedMenu = [
  { id: 'leek', cat: 'Small plates', name: 'Charred leek flatbread', desc: 'Whipped feta, burnt honey, thyme', price: 360, on: true },
  { id: 'bread', cat: 'Small plates', name: 'Rye sourdough', desc: 'Cultured butter, smoked salt', price: 200, on: true },
  { id: 'beet', cat: 'Small plates', name: 'Ember-roast beetroot', desc: 'Labneh, dill oil, hazelnut', price: 320, on: true },
  { id: 'lamb', cat: 'From the fire', name: 'Smoked lamb shoulder', desc: 'Flatbread, pickles, garlic yoghurt', price: 760, on: true },
  { id: 'trout', cat: 'From the fire', name: 'Cedar-plank trout', desc: 'Brown butter, capers, new potatoes', price: 680, on: true },
  { id: 'cauli', cat: 'From the fire', name: 'Whole roast cauliflower', desc: 'Tahini, chilli crisp, herbs', price: 560, on: false },
  { id: 'cake', cat: 'Sweet', name: 'Burnt cheesecake', desc: 'Rye crumb, sour cherry', price: 280, on: true },
];
const STEPS = ['Received', 'Preparing', 'Ready', 'Collected'];
interface Order { no: number; lines: { name: string; qty: number }[]; total: number; step: number; mine?: boolean }
const TABS = ['Customer ordering', 'Kitchen & admin'];

export default function Ember() {
  const [tab, setTab] = useState(TABS[0]);
  const [menu, setMenu] = useState(seedMenu);
  const [basket, setBasket] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<Order[]>([
    { no: 216, lines: [{ name: 'Smoked lamb shoulder', qty: 2 }, { name: 'Rye sourdough', qty: 1 }], total: 1720, step: 1 },
    { no: 217, lines: [{ name: 'Cedar-plank trout', qty: 1 }], total: 680, step: 0 },
  ]);
  const [mine, setMine] = useState<number | null>(null);
  const cats = [...new Set(menu.map((m) => m.cat))];
  const lines = Object.entries(basket).filter(([, q]) => q > 0).map(([id, qty]) => ({ ...menu.find((m) => m.id === id)!, qty }));
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const myOrder = orders.find((o) => o.no === mine);
  const chg = (id: string, d: number) => setBasket((b) => ({ ...b, [id]: Math.max(0, (b[id] || 0) + d) }));
  const place = () => {
    const no = Math.max(...orders.map((o) => o.no)) + 1;
    setOrders((os) => [...os, { no, lines: lines.map((l) => ({ name: l.name, qty: l.qty })), total, step: 0, mine: true }]); setMine(no); setBasket({});
  };
  const toggle = (id: string) => { setMenu((m) => m.map((x) => (x.id === id ? { ...x, on: !x.on } : x))); setBasket((b) => ({ ...b, [id]: 0 })); };
  const advance = (no: number) => setOrders((os) => os.map((o) => (o.no === no ? { ...o, step: Math.min(3, o.step + 1) } : o)));
  const session = orders.filter((o) => o.mine).reduce((s, o) => s + o.total, 0);

  return (
    <DemoShell title="Ember & Rye — order direct" note="fictional restaurant, no order is sent" tabs={TABS} tab={tab} onTab={setTab} className="ember">
      {tab === TABS[0] && (
        <div className="e-cust">
          <div className="e-menu">
            <header><h3>Ember &amp; Rye</h3><p>Wood-fired kitchen · Collection in about 25 minutes <em>(sample)</em></p></header>
            {cats.map((c) => (
              <section key={c}><h4>{c}</h4>
                {menu.filter((m) => m.cat === c).map((m) => (
                  <div className={`e-item ${m.on ? '' : 'off'}`} key={m.id}>
                    <div><b>{m.name}</b><small>{m.desc}</small></div><span>{money(m.price)}</span>
                    {m.on ? (basket[m.id] ? <span className="e-qty"><button onClick={() => chg(m.id, -1)} aria-label={`Remove one ${m.name}`}>−</button>{basket[m.id]}<button onClick={() => chg(m.id, 1)} aria-label={`Add one ${m.name}`}>+</button></span> : <button className="e-add" onClick={() => chg(m.id, 1)} aria-label={`Add ${m.name}`}>Add</button>) : <span className="e-sold">Sold out</span>}
                  </div>
                ))}
              </section>
            ))}
          </div>
          <aside className="e-side">
            {myOrder && (
              <div className="e-track" aria-live="polite"><p className="e-k">Your order #{myOrder.no}</p><ol>{STEPS.map((s, i) => <li key={s} className={i < myOrder.step ? 'done' : i === myOrder.step ? 'now' : ''}>{s}</li>)}</ol>
                <p className="e-hint">{myOrder.step < 3 ? 'Status is set by the kitchen. Open “Kitchen & admin” and advance this order to see it change here.' : 'Collected. Enjoy.'}</p></div>
            )}
            <div className="e-basket"><p className="e-k">Basket</p>
              {lines.length === 0 ? <p className="e-hint">Add dishes from the menu.</p> : (<>{lines.map((l) => <p key={l.id} className="e-line"><span>{l.qty} × {l.name}</span><span>{money(l.price * l.qty)}</span></p>)}<p className="e-line tot"><span>Total</span><span>{money(total)}</span></p><button className="e-place" onClick={place}>Place demo order</button></>)}
            </div>
          </aside>
        </div>
      )}
      {tab === TABS[1] && (
        <div className="e-admin">
          <div className="d-kpis"><Kpi label="Sales today" value={money(1386 + session)} sub={session ? `incl. ${money(session)} this session` : 'sample'} /><Kpi label="Orders in queue" value={orders.filter((o) => o.step < 3).length} /><Kpi label="Dishes available" value={`${menu.filter((m) => m.on).length}/${menu.length}`} /></div>
          <div className="d-cols">
            <div className="d-card"><h4>Order queue</h4>
              {orders.filter((o) => o.step < 3).length === 0 && <p className="d-mut">Queue is clear.</p>}
              {orders.filter((o) => o.step < 3).map((o) => (
                <div className="e-ticket" key={o.no}><div><b>#{o.no}{o.mine ? ' · your demo order' : ''}</b><small>{o.lines.map((l) => `${l.qty}× ${l.name}`).join(', ')}</small></div><span className={`d-pill s${o.step}`}>{STEPS[o.step]}</span><button className="d-btn" onClick={() => advance(o.no)}>→ {STEPS[o.step + 1]}</button></div>
              ))}
            </div>
            <div className="d-card"><h4>Menu availability</h4>
              {menu.map((m) => <div className="e-avail" key={m.id}><span>{m.name}</span><button role="switch" aria-checked={m.on} aria-label={`${m.name} available`} className={`t-sw ${m.on ? 'on' : ''}`} onClick={() => toggle(m.id)} /></div>)}
              <p className="d-mut">Switch a dish off and it shows as sold out on the customer menu immediately.</p>
            </div>
          </div>
          <div className="d-card"><h4>Sales by hour · sample data</h4><Bars data={[40, 95, 180, 150, 60, 45, 120, 260, 310, 126]} labels={['12', '13', '14', '15', '16', '17', '18', '19', '20', '21']} /></div>
        </div>
      )}
    </DemoShell>
  );
}
