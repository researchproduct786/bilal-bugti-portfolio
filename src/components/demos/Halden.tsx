'use client';
import { i18n } from '@/i18n/core';
import { useT } from '@/i18n/client';
import { useMemo, useState } from 'react';
import { Bars, DemoShell, Kpi, money } from './shared';

interface Product { id: string; name: string; cat: string; price: number; blurb: string; colors: { name: string; hex: string }[]; sizes: { name: string; add: number }[]; shape: string }
const productsEn: Product[] = i18n([
  { id: 'tray', name: 'Oak desk tray', cat: 'Organise', price: 64, blurb: 'A solid oak tray for the small things that otherwise wander. Oiled, not lacquered, so it ages with use.', colors: [{ name: 'Natural', hex: '#c9a274' }, { name: 'Smoked', hex: '#5a4634' }, { name: 'Black', hex: '#232221' }], sizes: [{ name: 'Small', add: 0 }, { name: 'Large', add: 20 }], shape: 'tray' },
  { id: 'lamp', name: 'Task lamp No. 2', cat: 'Light', price: 148, blurb: 'A weighted base, one joint, and a warm 2700K beam. Nothing to adjust that does not need adjusting.', colors: [{ name: 'Graphite', hex: '#3a3a3c' }, { name: 'Bone', hex: '#d9d0c0' }, { name: 'Rust', hex: '#9a4f33' }], sizes: [{ name: 'Standard', add: 0 }], shape: 'lamp' },
  { id: 'pen', name: 'Brass pen rest', cat: 'Organise', price: 28, blurb: 'Turned from a single brass bar. Holds one pen, deliberately.', colors: [{ name: 'Brass', hex: '#b8975a' }, { name: 'Steel', hex: '#9aa0a6' }], sizes: [{ name: 'One size', add: 0 }], shape: 'bar' },
  { id: 'mat', name: 'Wool desk mat', cat: 'Surface', price: 72, blurb: 'Pressed merino felt, 4 mm thick. Quiet under a keyboard and kind to wrists.', colors: [{ name: 'Charcoal', hex: '#3b3d40' }, { name: 'Oat', hex: '#cfc4ae' }, { name: 'Moss', hex: '#5d6b4f' }], sizes: [{ name: '60 cm', add: 0 }, { name: '90 cm', add: 24 }], shape: 'mat' },
  { id: 'cup', name: 'Stoneware cup', cat: 'Table', price: 22, blurb: 'Wheel-thrown, unglazed outside, holds 240 ml. No handle; it stays warm in the hand.', colors: [{ name: 'Sand', hex: '#cdbb9f' }, { name: 'Slate', hex: '#4b5157' }], sizes: [{ name: 'Single', add: 0 }, { name: 'Set of 2', add: 18 }], shape: 'cup' },
  { id: 'clock', name: 'Desk clock', cat: 'Light', price: 96, blurb: 'A silent sweep movement in a milled aluminium ring. Tells the time and nothing else.', colors: [{ name: 'Silver', hex: '#b9bcc2' }, { name: 'Black', hex: '#232221' }], sizes: [{ name: 'One size', add: 0 }], shape: 'ring' },
]);
interface Line { key: string; id: string; name: string; variant: string; price: number; qty: number; hex: string; shape: string }
const catsEn = (['All', 'Organise', 'Light', 'Surface', 'Table']);
i18n(['All', 'Organise', 'Light', 'Surface', 'Table']);
const TABS = i18n(['Storefront', 'Owner analytics']);

const Obj = ({ shape, hex }: { shape: string; hex: string }) => <span className={`h-obj h-${shape}`} style={{ ['--c' as string]: hex }} aria-hidden="true"><i /></span>;

export default function Halden() {
  const t = useT();
  const products = t.x(productsEn);
  const cats = catsEn;
  const [tab, setTab] = useState(TABS[0]);
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState<Product | null>(null);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState(0);
  const [cart, setCart] = useState<Line[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [step, setStep] = useState(0); // 0 = shopping, 1..3 checkout, 4 done
  const [form, setForm] = useState({ email: '', name: '', address: '', city: '' });
  const [err, setErr] = useState('');
  const [orders, setOrders] = useState<{ no: string; total: number; items: number }[]>([]);

  const total = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const count = cart.reduce((s, l) => s + l.qty, 0);
  const list = useMemo(() => products.filter((p) => cat === 'All' || p.cat === cat), [cat]);
  const price = open ? open.price + open.sizes[size].add : 0;

  const view = (p: Product) => { setOpen(p); setColor(0); setSize(0); };
  const add = () => {
    if (!open) return;
    const variant = `${open.colors[color].name} · ${open.sizes[size].name}`, key = `${open.id}-${variant}`;
    setCart((c) => (c.some((l) => l.key === key) ? c.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) : [...c, { key, id: open.id, name: open.name, variant, price, qty: 1, hex: open.colors[color].hex, shape: open.shape }]));
    setDrawer(true);
  };
  const qty = (key: string, d: number) => setCart((c) => c.map((l) => (l.key === key ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0));
  const next = () => {
    if (step === 1 && !/^\S+@\S+\.\S+$/.test(form.email)) return setErr(t('Enter a valid email address.'));
    if (step === 2 && (!form.name.trim() || !form.address.trim() || !form.city.trim())) return setErr(t('Name, address and city are needed for delivery.'));
    setErr('');
    if (step === 3) { setOrders((o) => [...o, { no: `HO-${1040 + o.length + 1}`, total, items: count }]); setCart([]); }
    setStep(step + 1);
  };

  return (
    <DemoShell title={t('haldenobjects.example')} note={t('fictional brand, no payment is processed')} tabs={TABS} tab={tab} onTab={setTab} className="halden">
      {tab === 'Storefront' && (
        <div className="h-store">
          <header className="h-nav">
            <button className="h-logo" onClick={() => { setOpen(null); setStep(0); }}>{t('Halden')} <span>{t('Objects')}</span></button>
            <button className="h-cartbtn" onClick={() => setDrawer(true)} aria-label={t('Open cart, {count} items', { count })}>{t('Cart')} <b>{count}</b></button>
          </header>

          {step === 0 && !open && (<>
            <div className="h-hero"><p>{t('Objects for the working desk')}</p><h3>{t('Fewer things, made properly.')}</h3></div>
            <div className="h-cats" role="group" aria-label={t('Filter by category')}>{cats.map((c) => <button key={c} aria-pressed={c === cat} onClick={() => setCat(c)}>{t(c)}</button>)}</div>
            <ul className="h-grid">
              {list.map((p) => (
                <li key={p.id}><button onClick={() => view(p)} aria-label={t('{name}, from {v0}', { name: p.name, v0: money(p.price) })}>
                  <span className="h-tile"><Obj shape={p.shape} hex={p.colors[0].hex} /></span>
                  <span className="h-pn">{p.name}</span><span className="h-pp">{t('From')} {money(p.price)}</span>
                </button></li>
              ))}
            </ul>
          </>)}

          {step === 0 && open && (
            <div className="h-pdp">
              <div className="h-tile big"><Obj shape={open.shape} hex={open.colors[color].hex} /></div>
              <div>
                <button className="h-back" onClick={() => setOpen(null)}>{t('← All objects')}</button>
                <p className="h-cat">{t(open.cat)}</p>
                <h3>{open.name}</h3>
                <p className="h-price" aria-live="polite">{money(price)}</p>
                <p className="h-blurb">{open.blurb}</p>
                <fieldset><legend>{t('Colour —')} {open.colors[color].name}</legend>
                  <div className="h-sw">{open.colors.map((c, i) => <button key={c.name} aria-pressed={i === color} aria-label={c.name} onClick={() => setColor(i)} style={{ background: c.hex }} />)}</div>
                </fieldset>
                {open.sizes.length > 1 && (<fieldset><legend>{t('Size')}</legend>
                  <div className="h-sz">{open.sizes.map((s, i) => <button key={s.name} aria-pressed={i === size} onClick={() => setSize(i)}>{s.name}{s.add > 0 && <small> +{money(s.add)}</small>}</button>)}</div>
                </fieldset>)}
                <button className="h-buy" onClick={add}>{t('Add to cart —')} {money(price)}</button>
                <p className="h-fine">{t('Ships in 2–3 days · 30-day returns')} <em>{t('(sample policy)')}</em></p>
              </div>
            </div>
          )}

          {step >= 1 && step <= 3 && (
            <div className="h-co">
              <ol className="h-steps">{[t('Contact'), t('Delivery'), t('Payment')].map((s, i) => <li key={s} aria-current={step === i + 1 ? 'step' : undefined} className={step > i + 1 ? 'done' : ''}>{i + 1}. {s}</li>)}</ol>
              <div className="h-co-grid">
                <form onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
                  {step === 1 && <label>{t('Email for the receipt')}<input type="email" autoComplete="off" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t('you@example.com')} /></label>}
                  {step === 2 && (<>
                    <label>{t('Full name')}<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="off" /></label>
                    <label>{t('Address')}<input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} autoComplete="off" /></label>
                    <label>{t('City')}<input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} autoComplete="off" /></label>
                  </>)}
                  {step === 3 && <div className="h-pay"><b>{t('Demonstration payment')}</b><p>{t('No card is requested and nothing is charged. In a live store this step is handled by the payment provider.')}</p></div>}
                  {err && <p className="h-err" role="alert">{err}</p>}
                  <div className="h-co-act"><button type="button" className="h-back" onClick={() => { setErr(''); setStep(step - 1); }}>{t('← Back')}</button><button className="h-buy" type="submit">{step === 3 ? t('Place demo order — {v0}', { v0: money(total) }) : t('Continue')}</button></div>
                </form>
                <aside><p className="h-cat">{t('Order summary')}</p>{cart.map((l) => <p key={l.key} className="h-sum"><span>{l.qty} × {l.name}<small>{l.variant}</small></span><span>{money(l.price * l.qty)}</span></p>)}<p className="h-sum tot"><span>{t('Total')}</span><span>{money(total)}</span></p></aside>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="h-done"><p className="h-cat">{t('Order')} {orders[orders.length - 1]?.no}</p><h3>{t('Thank you. This was a demonstration.')}</h3><p>{t('No order was created and no email was sent. The owner analytics tab now includes this session’s order.')}</p>
              <div className="h-co-act" style={{ justifyContent: 'center' }}><button className="h-buy" onClick={() => { setStep(0); setOpen(null); }}>{t('Back to the shop')}</button><button className="h-back" onClick={() => setTab(TABS[1])}>{t('See owner view →')}</button></div></div>
          )}

          {drawer && (
            <div className="h-drawer" role="dialog" aria-label={t('Cart')}>
              <div className="h-drawer-in">
                <header><b>{t('Cart (')}{count})</b><button onClick={() => setDrawer(false)} aria-label={t('Close cart')}>{t('Close ✕')}</button></header>
                {cart.length === 0 && <p className="h-empty">{t('Your cart is empty.')}</p>}
                <ul>{cart.map((l) => (
                  <li key={l.key}><span className="h-tile mini"><Obj shape={l.shape} hex={l.hex} /></span>
                    <span className="h-li"><b>{l.name}</b><small>{l.variant}</small><span className="h-qty"><button onClick={() => qty(l.key, -1)} aria-label={t('Decrease {name}', { name: l.name })}>−</button>{l.qty}<button onClick={() => qty(l.key, 1)} aria-label={t('Increase {name}', { name: l.name })}>+</button></span></span>
                    <span>{money(l.price * l.qty)}</span></li>
                ))}</ul>
                {cart.length > 0 && <footer><p className="h-sum tot"><span>{t('Subtotal')}</span><span>{money(total)}</span></p><button className="h-buy" onClick={() => { setDrawer(false); setOpen(null); setStep(1); }}>{t('Checkout')}</button></footer>}
              </div>
              <button className="h-scrim" aria-label={t('Close cart')} onClick={() => setDrawer(false)} />
            </div>
          )}
        </div>
      )}

      {tab === 'Owner analytics' && (
        <div className="h-admin">
          <p className="d-sample">{t('Fictional sample data · session orders are added live')}</p>
          <div className="d-kpis">
            <Kpi label={t('Revenue · 7 days')} value={money(4812 + orders.reduce((s, o) => s + o.total, 0))} sub={t('sample')} />
            <Kpi label={t('Orders')} value={57 + orders.length} sub={t('{length} from this session', { length: orders.length })} />
            <Kpi label={t('Avg. order value')} value={money(84.4)} sub={t('sample')} />
            <Kpi label={t('Checkout completion')} value="68%" sub={t('sample')} />
          </div>
          <div className="d-cols">
            <div className="d-card"><h4>{t('Sales by day')}</h4><Bars data={[520, 610, 480, 730, 690, 940, 842]} labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']} /></div>
            <div className="d-card"><h4>{t('Top products')}</h4><table className="d-table"><tbody>{([[t('Task lamp No. 2'), 14, 2072], [t('Oak desk tray'), 19, 1356], [t('Wool desk mat'), 11, 864], [t('Desk clock'), 5, 480]] as [string, number, number][]).map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]} {t('sold')}</td><td>{money(r[2] as number)}</td></tr>)}</tbody></table></div>
          </div>
          <div className="d-card"><h4>{t('Orders placed in this session')}</h4>{orders.length === 0 ? <p className="d-mut">{t('None yet — place a demo order in the storefront and it appears here.')}</p> : <table className="d-table"><tbody>{orders.map((o) => <tr key={o.no}><td>{o.no}</td><td>{o.items} {t('items')}</td><td>{money(o.total)}</td><td><span className="d-pill ok">{t('Paid (demo)')}</span></td></tr>)}</tbody></table>}</div>
        </div>
      )}
    </DemoShell>
  );
}
