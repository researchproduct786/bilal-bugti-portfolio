'use client';
import { useT } from '@/i18n/client';
import { i18n } from '@/i18n/core';
import { useState } from 'react';
import { Bars, DemoShell, Kpi, Spark, money } from './shared';

const TABS = i18n(['Concept', 'Identity', 'Creatives', 'Social', 'Landing page', 'Dashboard']);
i18n(['All', 'Square', 'Story', 'Banner']);
const channels = {
  All: { spend: 6400, leads: 512, ctr: '2.4%', cpl: 12.5, trend: [12, 18, 15, 24, 30, 28, 36, 41, 39, 48, 52, 61], split: [278, 164, 70] },
  Meta: { spend: 3600, leads: 278, ctr: '2.9%', cpl: 12.95, trend: [8, 11, 9, 14, 17, 15, 20, 23, 21, 26, 28, 33], split: [278, 0, 0] },
  Google: { spend: 2500, leads: 164, ctr: '1.8%', cpl: 15.24, trend: [3, 5, 4, 7, 9, 9, 11, 12, 13, 15, 16, 19], split: [0, 164, 0] },
  Email: { spend: 300, leads: 70, ctr: '4.1%', cpl: 4.29, trend: [1, 2, 2, 3, 4, 4, 5, 6, 5, 7, 8, 9], split: [0, 0, 70] },
};
type Ch = keyof typeof channels;
const formats = { Square: '1 / 1', Story: '9 / 16', Banner: '3 / 1' };
type Fmt = keyof typeof formats;

function Can() { const t = useT(); return <span className="s-can" aria-hidden="true"><span>{t('Slow')}<br />{t('tide')}</span></span>; }

export default function Slowtide() {
  const t = useT();
  const [tab, setTab] = useState(TABS[0]);
  const [ch, setCh] = useState<Ch>('All');
  const [fmt, setFmt] = useState<Fmt>('Square');
  const [variant, setVariant] = useState(0);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'err' | 'ok'>('idle');
  const d = channels[ch];
  const lines = [t('Take the long afternoon.'), t('Brewed for eighteen hours. Drunk in no hurry.'), t('Nothing added. Nothing rushed.')];

  return (
    <DemoShell title={t('Slowtide — launch campaign')} note={t('fictional brand and sample performance data')} tabs={TABS} tab={tab} onTab={setTab} className="slowtide">
      {tab === 'Concept' && (
        <div className="s-pad s-concept">
          <div><p className="s-k">{t('The idea')}</p><h3 className="s-line">{t('Take the long afternoon.')}</h3>
            <p>{t('Slowtide is a fictional cold-brew tea, steeped for eighteen hours. Every other drink on the shelf promises energy. This one promises the opposite: an unhurried hour.')}</p>
            <dl><dt>{t('Audience')}</dt><dd>{t('People 25–40 who work on screens and are tired of being told to hustle.')}</dd><dt>{t('Single message')}</dt><dd>{t('A drink that takes its time, for people who would like to.')}</dd><dt>{t('Desired action')}</dt><dd>{t('Join the launch list for a first-batch discount.')}</dd><dt>{t('Channels')}</dt><dd>{t('Paid social, search, email. One landing page.')}</dd></dl></div>
          <div className="s-poster"><Can /><p>{t('Take the')}<br />{t('long afternoon.')}</p></div>
        </div>
      )}
      {tab === 'Identity' && (
        <div className="s-pad">
          <div className="s-id">
            <div className="s-logo"><b>{t('Slowtide')}</b><small>{t('Cold-brew tea')}</small></div>
            <div className="s-logo inv"><b>{t('Slowtide')}</b><small>{t('Cold-brew tea')}</small></div>
            <div className="s-pal">{[[t('Tide'), '#9fd8c4'], [t('Deep'), '#0d2a23'], [t('Foam'), '#eef7f2'], [t('Kelp'), '#3f7f6c'], [t('Sun'), '#f2c46d']].map(([n, c]) => <span key={n} style={{ background: c, color: ['#0d2a23', '#3f7f6c'].includes(c) ? '#eef7f2' : '#0d2a23' }}>{n}<small>{c}</small></span>)}</div>
            <div className="s-type"><p className="s-line">{t('Aa — Headlines in a slow italic serif.')}</p><p className="s-wide">{t('LABELS IN WIDE CAPITALS')}</p><p>{t('Body copy in a plain, readable grotesque. Short sentences. No exclamation marks.')}</p></div>
          </div>
          <p className="d-mut" style={{ marginTop: 14 }}>{t('Voice: calm, dry, specific. The graphic device is a single horizon line that every layout sits on.')}</p>
        </div>
      )}
      {tab === 'Creatives' && (
        <div className="s-pad">
          <div className="s-ctl"><div role="group" aria-label={t('Format')}>{(Object.keys(formats) as Fmt[]).map((f) => <button key={f} aria-pressed={f === fmt} onClick={() => setFmt(f)}>{t(f)}</button>)}</div>
            <div role="group" aria-label={t('Headline variant')}>{lines.map((_, i) => <button key={i} aria-pressed={i === variant} onClick={() => setVariant(i)}>{t('Line')} {i + 1}</button>)}</div></div>
          <div className="s-adwrap"><div className={`s-ad f-${fmt}`} style={{ aspectRatio: formats[fmt] }}><Can /><p className="s-line">{lines[variant]}</p><span className="s-cta">{t('Join the first batch')}</span></div></div>
          <p className="d-mut">{t('One system, three formats, three headline tests. Switch them to see the layout adapt.')}</p>
        </div>
      )}
      {tab === 'Social' && (
        <div className="s-pad s-social">
          {[0, 1, 2].map((i) => (
            <article key={i} className="s-post"><header><i aria-hidden="true" /><span><b>{t('slowtide.tea')}</b><small>{t('Sponsored · design mock-up')}</small></span></header>
              <div className={`s-ad f-Square v${i}`} style={{ aspectRatio: '1 / 1' }}>{i !== 1 && <Can />}<p className="s-line">{lines[i]}</p></div>
              <p>{['First batch lands next month. The list is open.', 'Eighteen hours in cold water. That’s the whole recipe.', 'No sugar. No rush. Link in bio.'][i]}</p></article>
          ))}
          <p className="d-mut" style={{ gridColumn: '1 / -1' }}>{t('Generic post frames drawn for this mock-up — not screenshots of any platform, and not real posts.')}</p>
        </div>
      )}
      {tab === 'Landing page' && (
        <div className="s-landing">
          <nav><b>{t('Slowtide')}</b><span>{t('First batch · sample page')}</span></nav>
          <div className="s-lhero"><div><h3 className="s-line">{t('Take the long afternoon.')}</h3><p>{t('Cold-brew tea, steeped for eighteen hours. Join the list for 20% off the first batch.')}</p>
            {state === 'ok' ? <p className="s-ok" role="status">{t('You’re on the (demo) list. Nothing was actually sent or stored.')}</p> : (
              <form noValidate onSubmit={(e) => { e.preventDefault(); setState(/^\S+@\S+\.\S+$/.test(email) ? 'ok' : 'err'); }}>
                <label className="sr-only" htmlFor="s-email">{t('Email address')}</label>
                <input id="s-email" type="email" placeholder={t('you@example.com')} value={email} onChange={(e) => { setEmail(e.target.value); setState('idle'); }} aria-invalid={state === 'err'} autoComplete="off" /><button type="submit">{t('Join the list')}</button>
                {state === 'err' && <small role="alert">{t('Please enter a valid email address.')}</small>}
              </form>)}
          </div><Can /></div>
          <ul className="s-points"><li><b>{t('18 hours')}</b>{t('cold steeped')}</li><li><b>{t('0 g')}</b>{t('added sugar')}</li><li><b>3</b>{t('teas at launch')}</li></ul>
        </div>
      )}
      {tab === 'Dashboard' && (
        <div className="s-pad s-dash">
          <p className="d-sample">{t('Fictional sample data — illustrates the report format, not real campaign results')}</p>
          <div className="s-ctl"><div role="group" aria-label={t('Channel')}>{(Object.keys(channels) as Ch[]).map((c) => <button key={c} aria-pressed={c === ch} onClick={() => setCh(c)}>{t(c)}</button>)}</div></div>
          <div className="d-kpis"><Kpi label={t('Spend')} value={money(d.spend)} /><Kpi label={t('Cost per lead')} value={money(d.cpl)} /><Kpi label={t('Leads')} value={d.leads} /><Kpi label={t('Click-through')} value={d.ctr} /></div>
          <div className="d-cols"><div className="d-card"><h4>{t('Leads per day')}</h4><Spark data={d.trend} h={120} /></div><div className="d-card"><h4>{t('Leads by channel')}</h4><Bars data={d.split} labels={['Meta', 'Google', t('Email')]} /></div></div>
        </div>
      )}
    </DemoShell>
  );
}
