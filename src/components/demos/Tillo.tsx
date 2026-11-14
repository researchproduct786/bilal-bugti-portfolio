'use client';
import { useState } from 'react';
import { Bars, DemoShell, money } from './shared';

type Status = 'New' | 'Packed' | 'Shipped' | 'Done';
const flow: Status[] = ['New', 'Packed', 'Shipped', 'Done'];
const nextLabel: Record<Status, string> = { New: 'Mark packed', Packed: 'Mark shipped', Shipped: 'Mark delivered', Done: '' };
const seedOrders = [
  { id: 1042, who: 'Amara Osei', total: 172, items: 3, status: 'New' as Status }, { id: 1041, who: 'Jonas Weber', total: 85, items: 1, status: 'New' as Status },
  { id: 1040, who: 'Lina Haddad', total: 262, items: 4, status: 'Packed' as Status }, { id: 1039, who: 'Tomás Rey', total: 48, items: 1, status: 'Shipped' as Status },
  { id: 1038, who: 'Mei Tanaka', total: 134, items: 2, status: 'Done' as Status },
];
const seedStock = [
  { name: 'Ceramic pour-over', price: 68, stock: 12 }, { name: 'House blend 250 g', price: 28, stock: 3 }, { name: 'Paper filters ×100', price: 16, stock: 41 }, { name: 'Hand grinder', price: 116, stock: 2 }, { name: 'Travel tumbler', price: 52, stock: 9 },
];
const customers = [
  { name: 'Amara Osei', orders: 7, spent: 824, note: 'Prefers pickup. Usually orders on Fridays.' }, { name: 'Jonas Weber', orders: 2, spent: 142, note: 'New customer this month.' },
  { name: 'Lina Haddad', orders: 12, spent: 1936, note: 'Wholesale enquiry pending.' }, { name: 'Mei Tanaka', orders: 4, spent: 406, note: 'Asked about gift wrapping.' },
];
const NAV = ['Home', 'Orders', 'Customers', 'Products', 'Stats'] as const;
type Tab = (typeof NAV)[number] | 'Settings';
const icons: Record<string, string> = { Home: '◧', Orders: '☰', Customers: '◎', Products: '▦', Stats: '◢' };

export default function Tillo() {
  const [tab, setTab] = useState<Tab>('Home');
  const [orders, setOrders] = useState(seedOrders);
  const [stock, setStock] = useState(seedStock);
  const [cust, setCust] = useState<number | null>(null);
  const [prefs, setPrefs] = useState({ 'Low-stock alerts': true, 'Daily summary at 8pm': true, 'Sound on new order': false });
  const open = orders.filter((o) => o.status !== 'Done');
  const low = stock.filter((s) => s.stock <= 3);
  // Fixed so the demo's headline figure matches the site's pinned figure exactly.
  const today = 2425;
  const advance = (id: number) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: flow[Math.min(3, flow.indexOf(o.status) + 1)] } : o)));

  return (
    <DemoShell title="Tillo — shop back-office" note="fictional shop and sample data" className="tillo">
      <div className="t-stage">
        <div className="t-phone">
          <div className="t-status"><span>9:41</span><span>Tillo</span><button onClick={() => setTab('Settings')} aria-label="Settings" aria-pressed={tab === 'Settings'}>⚙</button></div>
          <div className="t-screen" key={tab}>
            {tab === 'Home' && (<>
              <p className="t-k">Today · sample data</p><p className="t-big">{money(today)}</p>
              <div className="t-two"><button onClick={() => setTab('Orders')}><b>{open.length}</b>open orders</button><button onClick={() => setTab('Products')} className={low.length ? 'warn' : ''}><b>{low.length}</b>low stock</button></div>
              <p className="t-k" style={{ marginTop: 18 }}>Needs attention</p>
              {open.slice(0, 3).map((o) => <div className="t-row" key={o.id}><span><b>#{o.id}</b> {o.who}</span><button className="t-act" onClick={() => advance(o.id)}>{nextLabel[o.status]}</button></div>)}
              {open.length === 0 && <p className="t-none">Everything is done. Nice.</p>}
            </>)}
            {tab === 'Orders' && (<>
              <p className="t-h">Orders</p>
              {orders.map((o) => (
                <div className="t-card" key={o.id}><div><b>#{o.id} · {o.who}</b><small>{o.items} items · {money(o.total)}</small></div>
                  <span className={`t-pill s-${o.status}`}>{o.status}</span>
                  {o.status !== 'Done' && <button className="t-act wide" onClick={() => advance(o.id)}>{nextLabel[o.status]}</button>}</div>
              ))}
            </>)}
            {tab === 'Customers' && cust === null && (<>
              <p className="t-h">Customers</p>
              {customers.map((c, i) => <button className="t-row link" key={c.name} onClick={() => setCust(i)}><span><b>{c.name}</b><small>{c.orders} orders</small></span><span>{money(c.spent)} ›</span></button>)}
            </>)}
            {tab === 'Customers' && cust !== null && (<>
              <button className="t-back" onClick={() => setCust(null)}>‹ Customers</button>
              <p className="t-h">{customers[cust].name}</p>
              <div className="t-two"><div><b>{customers[cust].orders}</b>orders</div><div><b>{money(customers[cust].spent)}</b>lifetime</div></div>
              <p className="t-k" style={{ marginTop: 18 }}>Note</p><p className="t-note">{customers[cust].note}</p>
            </>)}
            {tab === 'Products' && (<>
              <p className="t-h">Products</p>
              {stock.map((s, i) => (
                <div className="t-row" key={s.name}><span><b>{s.name}</b><small className={s.stock <= 3 ? 'low' : ''}>{money(s.price)} · {s.stock <= 3 ? `Low — ${s.stock} left` : `${s.stock} in stock`}</small></span>
                  <span className="t-step"><button aria-label={`Remove one ${s.name}`} onClick={() => setStock((st) => st.map((x, k) => (k === i ? { ...x, stock: Math.max(0, x.stock - 1) } : x)))}>−</button><button aria-label={`Add one ${s.name}`} onClick={() => setStock((st) => st.map((x, k) => (k === i ? { ...x, stock: x.stock + 1 } : x)))}>+</button></span></div>
              ))}
            </>)}
            {tab === 'Stats' && (<>
              <p className="t-h">This week</p><p className="t-k">Revenue by day · sample data</p>
              <Bars data={[22, 26, 19, 31, 42, 58, 48]} labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']} h={130} />
              <div className="t-two" style={{ marginTop: 16 }}><div><b>{money(11200)}</b>week total</div><div><b>94</b>orders</div></div>
              <p className="t-note" style={{ marginTop: 14 }}>Best seller: House blend 250 g. Saturday is the busiest day.</p>
            </>)}
            {tab === 'Settings' && (<>
              <p className="t-h">Settings</p>
              {(Object.keys(prefs) as (keyof typeof prefs)[]).map((k) => <button key={k} className="t-row link" role="switch" aria-checked={prefs[k]} onClick={() => setPrefs({ ...prefs, [k]: !prefs[k] })}><span><b>{k}</b></span><span className={`t-sw ${prefs[k] ? 'on' : ''}`} /></button>)}
              <p className="t-note" style={{ marginTop: 14 }}>Shop: Corner Roast (fictional). Demo build — changes reset on reload.</p>
            </>)}
          </div>
          <nav className="t-nav" aria-label="App sections">{NAV.map((n) => <button key={n} aria-current={tab === n ? 'page' : undefined} onClick={() => { setTab(n); setCust(null); }}><i aria-hidden="true">{icons[n]}</i>{n}</button>)}</nav>
        </div>
        <div className="t-aside">
          <p className="mono muted">Try it</p>
          <ul className="ticks"><li>Advance an order from the Home screen — the open count updates.</li><li>Reduce stock in Products until an item turns “Low”.</li><li>Open a customer, then the settings gear.</li></ul>
        </div>
      </div>
    </DemoShell>
  );
}
