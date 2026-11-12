'use client';
import { useState } from 'react';
import { Bars, DemoShell, Kpi, Spark, money } from './shared';

const TABS = ['Concept', 'Identity', 'Creatives', 'Social', 'Landing page', 'Dashboard'];
const channels = {
  All: { spend: 6400, leads: 512, ctr: '2.4%', cpl: 12.5, trend: [12, 18, 15, 24, 30, 28, 36, 41, 39, 48, 52, 61], split: [278, 164, 70] },
  Meta: { spend: 3600, leads: 278, ctr: '2.9%', cpl: 12.95, trend: [8, 11, 9, 14, 17, 15, 20, 23, 21, 26, 28, 33], split: [278, 0, 0] },
  Google: { spend: 2500, leads: 164, ctr: '1.8%', cpl: 15.24, trend: [3, 5, 4, 7, 9, 9, 11, 12, 13, 15, 16, 19], split: [0, 164, 0] },
  Email: { spend: 300, leads: 70, ctr: '4.1%', cpl: 4.29, trend: [1, 2, 2, 3, 4, 4, 5, 6, 5, 7, 8, 9], split: [0, 0, 70] },
};
type Ch = keyof typeof channels;
const formats = { Square: '1 / 1', Story: '9 / 16', Banner: '3 / 1' };
type Fmt = keyof typeof formats;

const Can = () => <span className="s-can" aria-hidden="true"><span>Slow<br />tide</span></span>;

export default function Slowtide() {
  const [tab, setTab] = useState(TABS[0]);
  const [ch, setCh] = useState<Ch>('All');
  const [fmt, setFmt] = useState<Fmt>('Square');
  const [variant, setVariant] = useState(0);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'err' | 'ok'>('idle');
  const d = channels[ch];
  const lines = ['Take the long afternoon.', 'Brewed for eighteen hours. Drunk in no hurry.', 'Nothing added. Nothing rushed.'];

  return (
    <DemoShell title="Slowtide — launch campaign" note="fictional brand and sample performance data" tabs={TABS} tab={tab} onTab={setTab} className="slowtide">
      {tab === 'Concept' && (
        <div className="s-pad s-concept">
          <div><p className="s-k">The idea</p><h3 className="s-line">Take the long afternoon.</h3>
            <p>Slowtide is a fictional cold-brew tea, steeped for eighteen hours. Every other drink on the shelf promises energy. This one promises the opposite: an unhurried hour.</p>
            <dl><dt>Audience</dt><dd>People 25–40 who work on screens and are tired of being told to hustle.</dd><dt>Single message</dt><dd>A drink that takes its time, for people who would like to.</dd><dt>Desired action</dt><dd>Join the launch list for a first-batch discount.</dd><dt>Channels</dt><dd>Paid social, search, email. One landing page.</dd></dl></div>
          <div className="s-poster"><Can /><p>Take the<br />long afternoon.</p></div>
        </div>
      )}
      {tab === 'Identity' && (
        <div className="s-pad">
          <div className="s-id">
            <div className="s-logo"><b>Slowtide</b><small>Cold-brew tea</small></div>
            <div className="s-logo inv"><b>Slowtide</b><small>Cold-brew tea</small></div>
            <div className="s-pal">{[['Tide', '#9fd8c4'], ['Deep', '#0d2a23'], ['Foam', '#eef7f2'], ['Kelp', '#3f7f6c'], ['Sun', '#f2c46d']].map(([n, c]) => <span key={n} style={{ background: c, color: ['#0d2a23', '#3f7f6c'].includes(c) ? '#eef7f2' : '#0d2a23' }}>{n}<small>{c}</small></span>)}</div>
            <div className="s-type"><p className="s-line">Aa — Headlines in a slow italic serif.</p><p className="s-wide">LABELS IN WIDE CAPITALS</p><p>Body copy in a plain, readable grotesque. Short sentences. No exclamation marks.</p></div>
          </div>
          <p className="d-mut" style={{ marginTop: 14 }}>Voice: calm, dry, specific. The graphic device is a single horizon line that every layout sits on.</p>
        </div>
      )}
      {tab === 'Creatives' && (
        <div className="s-pad">
          <div className="s-ctl"><div role="group" aria-label="Format">{(Object.keys(formats) as Fmt[]).map((f) => <button key={f} aria-pressed={f === fmt} onClick={() => setFmt(f)}>{f}</button>)}</div>
            <div role="group" aria-label="Headline variant">{lines.map((_, i) => <button key={i} aria-pressed={i === variant} onClick={() => setVariant(i)}>Line {i + 1}</button>)}</div></div>
          <div className="s-adwrap"><div className={`s-ad f-${fmt}`} style={{ aspectRatio: formats[fmt] }}><Can /><p className="s-line">{lines[variant]}</p><span className="s-cta">Join the first batch</span></div></div>
          <p className="d-mut">One system, three formats, three headline tests. Switch them to see the layout adapt.</p>
        </div>
      )}
      {tab === 'Social' && (
        <div className="s-pad s-social">
          {[0, 1, 2].map((i) => (
            <article key={i} className="s-post"><header><i aria-hidden="true" /><span><b>slowtide.tea</b><small>Sponsored · design mock-up</small></span></header>
              <div className={`s-ad f-Square v${i}`} style={{ aspectRatio: '1 / 1' }}>{i !== 1 && <Can />}<p className="s-line">{lines[i]}</p></div>
              <p>{['First batch lands next month. The list is open.', 'Eighteen hours in cold water. That’s the whole recipe.', 'No sugar. No rush. Link in bio.'][i]}</p></article>
          ))}
          <p className="d-mut" style={{ gridColumn: '1 / -1' }}>Generic post frames drawn for this mock-up — not screenshots of any platform, and not real posts.</p>
        </div>
      )}
      {tab === 'Landing page' && (
        <div className="s-landing">
          <nav><b>Slowtide</b><span>First batch · sample page</span></nav>
          <div className="s-lhero"><div><h3 className="s-line">Take the long afternoon.</h3><p>Cold-brew tea, steeped for eighteen hours. Join the list for 20% off the first batch.</p>
            {state === 'ok' ? <p className="s-ok" role="status">You’re on the (demo) list. Nothing was actually sent or stored.</p> : (
              <form noValidate onSubmit={(e) => { e.preventDefault(); setState(/^\S+@\S+\.\S+$/.test(email) ? 'ok' : 'err'); }}>
                <label className="sr-only" htmlFor="s-email">Email address</label>
                <input id="s-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setState('idle'); }} aria-invalid={state === 'err'} autoComplete="off" /><button type="submit">Join the list</button>
                {state === 'err' && <small role="alert">Please enter a valid email address.</small>}
              </form>)}
          </div><Can /></div>
          <ul className="s-points"><li><b>18 hours</b>cold steeped</li><li><b>0 g</b>added sugar</li><li><b>3</b>teas at launch</li></ul>
        </div>
      )}
      {tab === 'Dashboard' && (
        <div className="s-pad s-dash">
          <p className="d-sample">Fictional sample data — illustrates the report format, not real campaign results</p>
          <div className="s-ctl"><div role="group" aria-label="Channel">{(Object.keys(channels) as Ch[]).map((c) => <button key={c} aria-pressed={c === ch} onClick={() => setCh(c)}>{c}</button>)}</div></div>
          <div className="d-kpis"><Kpi label="Spend" value={money(d.spend)} /><Kpi label="Cost per lead" value={money(d.cpl)} /><Kpi label="Leads" value={d.leads} /><Kpi label="Click-through" value={d.ctr} /></div>
          <div className="d-cols"><div className="d-card"><h4>Leads per day</h4><Spark data={d.trend} h={120} /></div><div className="d-card"><h4>Leads by channel</h4><Bars data={d.split} labels={['Meta', 'Google', 'Email']} /></div></div>
        </div>
      )}
    </DemoShell>
  );
}
