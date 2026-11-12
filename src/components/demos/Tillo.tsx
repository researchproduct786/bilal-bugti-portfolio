'use client';
import { i18n } from '@/i18n/core';
import { useT } from '@/i18n/client';
import { useState } from 'react';
import { Bars, DemoShell, money } from './shared';

type Status = 'New' | 'Packed' | 'Shipped' | 'Done';
const flowEn: Status[] = i18n(['New', 'Packed', 'Shipped', 'Done']);
const nextLabelEn: Record<Status, string> = i18n({ New: 'Mark packed', Packed: 'Mark shipped', Shipped: 'Mark delivered', Done: '' });
const seedOrdersEn = i18n([
  { id: 1042, who: 'Amara Osei', total: 86, items: 3, status: 'New' as Status }, { id: 1041, who: 'Jonas Weber', total: 42.5, items: 1, status: 'New' as Status },
  { id: 1040, who: 'Lina Haddad', total: 131, items: 4, status: 'Packed' as Status }, { id: 1039, who: 'Tomás Rey', total: 24, items: 1, status: 'Shipped' as Status },
  { id: 1038, who: 'Mei Tanaka', total: 67, items: 2, status: 'Done' as Status },
]);
const seedStockEn = i18n([
  { name: 'Ceramic pour-over', price: 34, stock: 12 }, { name: 'House blend 250 g', price: 14, stock: 3 }, { name: 'Paper filters ×100', price: 8, stock: 41 }, { name: 'Hand grinder', price: 58, stock: 2 }, { name: 'Travel tumbler', price: 26, stock: 9 },
]);
const customersEn = i18n([
  { name: 'Amara Osei', orders: 7, spent: 412, note: 'Prefers pickup. Usually orders on Fridays.' }, { name: 'Jonas Weber', orders: 2, spent: 71, note: 'New customer this month.' },
  { name: 'Lina Haddad', orders: 12, spent: 968, note: 'Wholesale enquiry pending.' }, { name: 'Mei Tanaka', orders: 4, spent: 203, note: 'Asked about gift wrapping.' },
]);
const NAV = ['Home', 'Orders', 'Customers', 'Products', 'Stats'] as const;
i18n([...NAV, 'Settings', 'Low-stock alerts', 'Daily summary at 8pm', 'Sound on new order', 'New', 'Packed', 'Shipped', 'Done']);
type Tab = (typeof NAV)[number] | 'Settings';
const icons: Record<string, string> = { Home: '◧', Orders: '☰', Customers: '◎', Products: '▦', Stats: '◢' };

export default function Tillo() {
  const t = useT();
  const seedOrders = t.x(seedOrdersEn);
  const seedStock = t.x(seedStockEn);
  const flow = flowEn;
  const nextLabel = t.x(nextLabelEn);
  const customers = t.x(customersEn);
  const [tab, setTab] = useState<Tab>('Home');
  const [orders, setOrders] = useState(seedOrders);
  const [stock, setStock] = useState(seedStock);
  const [cust, setCust] = useState<number | null>(null);
  const [prefs, setPrefs] = useState({ 'Low-stock alerts': true, 'Daily summary at 8pm': true, 'Sound on new order': false });
  const open = orders.filter((o) => o.status !== 'Done');
  const low = stock.filter((s) => s.stock <= 3);
  const today = orders.reduce((s, o) => s + o.total, 0) + 933.5;
  const advance = (id: number) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: flow[Math.min(3, flow.indexOf(o.status) + 1)] } : o)));

  return (
    <DemoShell title={t('Tillo — shop back-office')} note={t('fictional shop and sample data')} className="tillo">
      <div className="t-stage">
        <div className="t-phone">
          <div className="t-status"><span>9:41</span><span>{t('Tillo')}</span><button onClick={() => setTab('Settings')} aria-label={t('Settings')} aria-pressed={tab === 'Settings'}>⚙</button></div>
          <div className="t-screen" key={tab}>
            {tab === 'Home' && (<>
              <p className="t-k">{t('Today · sample data')}</p><p className="t-big">{money(today)}</p>
              <div className="t-two"><button onClick={() => setTab('Orders')}><b>{open.length}</b>{t('open orders')}</button><button onClick={() => setTab('Products')} className={low.length ? 'warn' : ''}><b>{low.length}</b>{t('low stock')}</button></div>
              <p className="t-k" style={{ marginTop: 18 }}>{t('Needs attention')}</p>
              {open.slice(0, 3).map((o) => <div className="t-row" key={o.id}><span><b>#{o.id}</b> {o.who}</span><button className="t-act" onClick={() => advance(o.id)}>{nextLabel[o.status]}</button></div>)}
              {open.length === 0 && <p className="t-none">{t('Everything is done. Nice.')}</p>}
            </>)}
            {tab === 'Orders' && (<>
              <p className="t-h">{t('Orders')}</p>
              {orders.map((o) => (
                <div className="t-card" key={o.id}><div><b>#{o.id} · {o.who}</b><small>{o.items} {t('items ·')} {money(o.total)}</small></div>
                  <span className={`t-pill s-${o.status}`}>{t(o.status)}</span>
                  {o.status !== 'Done' && <button className="t-act wide" onClick={() => advance(o.id)}>{nextLabel[o.status]}</button>}</div>
              ))}
            </>)}
            {tab === 'Customers' && cust === null && (<>
              <p className="t-h">{t('Customers')}</p>
              {customers.map((c, i) => <button className="t-row link" key={c.name} onClick={() => setCust(i)}><span><b>{c.name}</b><small>{c.orders} {t('orders')}</small></span><span>{money(c.spent)} ›</span></button>)}
            </>)}
            {tab === 'Customers' && cust !== null && (<>
              <button className="t-back" onClick={() => setCust(null)}>{t('‹ Customers')}</button>
              <p className="t-h">{customers[cust].name}</p>
              <div className="t-two"><div><b>{customers[cust].orders}</b>{t('orders')}</div><div><b>{money(customers[cust].spent)}</b>{t('lifetime')}</div></div>
              <p className="t-k" style={{ marginTop: 18 }}>{t('Note')}</p><p className="t-note">{customers[cust].note}</p>
            </>)}
            {tab === 'Products' && (<>
              <p className="t-h">{t('Products')}</p>
              {stock.map((s, i) => (
                <div className="t-row" key={s.name}><span><b>{s.name}</b><small className={s.stock <= 3 ? 'low' : ''}>{money(s.price)} · {s.stock <= 3 ? t('Low — {stock} left', { stock: s.stock }) : t('{stock} in stock', { stock: s.stock })}</small></span>
                  <span className="t-step"><button aria-label={t('Remove one {name}', { name: s.name })} onClick={() => setStock((st) => st.map((x, k) => (k === i ? { ...x, stock: Math.max(0, x.stock - 1) } : x)))}>−</button><button aria-label={t('Add one {name}', { name: s.name })} onClick={() => setStock((st) => st.map((x, k) => (k === i ? { ...x, stock: x.stock + 1 } : x)))}>+</button></span></div>
              ))}
            </>)}
            {tab === 'Stats' && (<>
              <p className="t-h">{t('This week')}</p><p className="t-k">{t('Revenue by day · sample data')}</p>
              <Bars data={[640, 720, 590, 810, 1120, 1380, 1284]} labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']} h={130} />
              <div className="t-two" style={{ marginTop: 16 }}><div><b>{money(6544)}</b>{t('week total')}</div><div><b>94</b>{t('orders')}</div></div>
              <p className="t-note" style={{ marginTop: 14 }}>{t('Best seller: House blend 250 g. Saturday is the busiest day.')}</p>
            </>)}
            {tab === 'Settings' && (<>
              <p className="t-h">{t('Settings')}</p>
              {(Object.keys(prefs) as (keyof typeof prefs)[]).map((k) => <button key={k} className="t-row link" role="switch" aria-checked={prefs[k]} onClick={() => setPrefs({ ...prefs, [k]: !prefs[k] })}><span><b>{t(k)}</b></span><span className={`t-sw ${prefs[k] ? 'on' : ''}`} /></button>)}
              <p className="t-note" style={{ marginTop: 14 }}>{t('Shop: Corner Roast (fictional). Demo build — changes reset on reload.')}</p>
            </>)}
          </div>
          <nav className="t-nav" aria-label={t('App sections')}>{NAV.map((n) => <button key={n} aria-current={tab === n ? 'page' : undefined} onClick={() => { setTab(n); setCust(null); }}><i aria-hidden="true">{icons[n]}</i>{t(n)}</button>)}</nav>
        </div>
        <div className="t-aside">
          <p className="mono muted">{t('Try it')}</p>
          <ul className="ticks"><li>{t('Advance an order from the Home screen — the open count updates.')}</li><li>{t('Reduce stock in Products until an item turns “Low”.')}</li><li>{t('Open a customer, then the settings gear.')}</li></ul>
        </div>
      </div>
    </DemoShell>
  );
}
