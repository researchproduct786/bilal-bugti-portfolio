'use client';
import { useSearchParams } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { services } from '@/data/services';
import { industries, problems } from '@/data/content';
import { site } from '@/data/site';

type Data = { name: string; email: string; company: string; country: string; industry: string; service: string; description: string; budget: string; timeline: string; contact: string };
const budgets = ['Not sure yet', 'Under $1,000', '$1,000 – $5,000', '$5,000 – $15,000', '$15,000+'];
const timelines = ['Flexible', 'Within a month', '1–3 months', '3+ months'];
const steps = ['About you', 'The project', 'Details'];

/**
 * Three-step project inquiry.
 * There is no backend: nothing is stored or transmitted by this site. On completion the visitor
 * sends the prepared message from their own email app or WhatsApp — and the UI says so plainly.
 */
export function InquiryForm() {
  const q = useSearchParams();
  const topic = problems.find((p) => p.id === q.get('topic'));
  const preset = services.find((s) => s.slug === q.get('service'))?.title ?? '';
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});
  const [d, setD] = useState<Data>({ name: '', email: '', company: '', country: '', industry: '', service: preset, description: topic ? `${topic.statement} ` : '', budget: '', timeline: '', contact: 'Email' });
  const top = useRef<HTMLDivElement>(null);
  const set = (k: keyof Data) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setD({ ...d, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }); };

  const validate = (s: number) => {
    const e: Partial<Record<keyof Data, string>> = {};
    if (s === 0) {
      if (d.name.trim().length < 2) e.name = 'Please enter your full name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'Please enter a valid email address.';
      if (!d.country.trim()) e.country = 'Please enter your country.';
    }
    if (s === 1) {
      if (!d.industry) e.industry = 'Please choose the closest industry.';
      if (!d.service) e.service = 'Please choose a service (or “Not sure”).';
      if (d.description.trim().length < 20) e.description = 'A sentence or two about the problem helps — at least 20 characters.';
    }
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`f-${first}`)?.focus();
    return !first;
  };
  const go = (n: number) => { setStep(n); requestAnimationFrame(() => top.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(step)) return;
    if (step < 2) return go(step + 1);
    setDone(true); requestAnimationFrame(() => top.current?.focus());
  };

  const message = useMemo(() => [
    `Project inquiry for ${site.name}`, '',
    `Name: ${d.name}`, `Email: ${d.email}`, d.company && `Company: ${d.company}`, `Country: ${d.country}`,
    `Industry: ${d.industry}`, `Service: ${d.service}`, d.budget && `Estimated budget: ${d.budget}`, d.timeline && `Timeline: ${d.timeline}`, `Preferred contact: ${d.contact}`,
    '', 'Project description:', d.description.trim(),
  ].filter((l) => l !== '' ? Boolean(l) : true).join('\n'), [d]);
  const mailto = site.email ? `mailto:${site.email}?subject=${encodeURIComponent(`Project inquiry — ${d.name}`)}&body=${encodeURIComponent(message)}` : '';
  const wa = site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}` : '';
  const copy = async () => { try { await navigator.clipboard.writeText(message); setCopied('ok'); } catch { setCopied('fail'); } };

  const err = (k: keyof Data) => errors[k] && <span className="f-err" id={`e-${k}`} role="alert">{errors[k]}</span>;
  const a11y = (k: keyof Data) => ({ id: `f-${k}`, 'aria-invalid': !!errors[k] || undefined, 'aria-describedby': errors[k] ? `e-${k}` : undefined });

  if (done) {
    return (
      <div className="form done" ref={top} tabIndex={-1} aria-live="polite">
        <p className="kicker">Inquiry prepared</p>
        <h2 className="h2" style={{ marginTop: 16 }}>Thank you, {d.name.split(' ')[0]}. One last step: send it.</h2>
        <p className="body" style={{ marginTop: 14 }}>This website does not store or transmit your details. Your message is ready below — send it from your own email app or WhatsApp so you keep a copy.</p>
        <pre className="f-preview" tabIndex={0} aria-label="Your prepared inquiry">{message}</pre>
        <div className="f-send">
          {mailto ? <a className="btn" href={mailto} data-magnetic><span>Send by email</span><span className="arr" aria-hidden="true" /></a> : <span className="btn" aria-disabled="true"><span>Email — not configured yet</span></span>}
          {wa ? <a className="btn ghost" href={wa} target="_blank" rel="noopener noreferrer"><span>Send on WhatsApp</span><span className="arr" aria-hidden="true" /></a> : <span className="btn ghost" aria-disabled="true"><span>WhatsApp — not configured yet</span></span>}
          <button type="button" className="btn ghost" onClick={copy}><span>{copied === 'ok' ? 'Copied ✓' : 'Copy message'}</span></button>
        </div>
        {copied === 'fail' && <p className="f-err" role="alert">Copy was blocked by the browser — select the text above and copy it manually.</p>}
        {!mailto && !wa && <p className="notice" style={{ marginTop: 20 }}><b>Placeholder</b>Bilal’s contact email and WhatsApp number have not been added to this site yet, so the send buttons are disabled. Use “Copy message” for now.</p>}
        <button type="button" className="textlink" style={{ marginTop: 26 }} onClick={() => { setDone(false); go(0); }}>← Edit my answers</button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate aria-labelledby="form-h">
      <div ref={top} />
      <ol className="f-steps" aria-label="Progress">{steps.map((s, i) => <li key={s} aria-current={i === step ? 'step' : undefined} className={i < step ? 'past' : ''}><span className="mono">{String(i + 1).padStart(2, '0')}</span>{s}</li>)}</ol>
      <h2 id="form-h" className="h3 f-title">{['Who should I reply to?', 'What do you need solved?', 'A few optional details'][step]}</h2>

      {step === 0 && (<div className="f-grid">
        <label className="f-field">Full name<input {...a11y('name')} value={d.name} onChange={set('name')} autoComplete="name" required />{err('name')}</label>
        <label className="f-field">Email address<input {...a11y('email')} type="email" value={d.email} onChange={set('email')} autoComplete="email" inputMode="email" required />{err('email')}</label>
        <label className="f-field">Company or business <em>optional</em><input {...a11y('company')} value={d.company} onChange={set('company')} autoComplete="organization" /></label>
        <label className="f-field">Country<input {...a11y('country')} value={d.country} onChange={set('country')} autoComplete="country-name" required />{err('country')}</label>
      </div>)}

      {step === 1 && (<div className="f-grid">
        <label className="f-field">Industry<select {...a11y('industry')} value={d.industry} onChange={set('industry')} required><option value="">Choose…</option>{industries.map((i) => <option key={i.name}>{i.name}</option>)}<option>Other</option></select>{err('industry')}</label>
        <label className="f-field">Service required<select {...a11y('service')} value={d.service} onChange={set('service')} required><option value="">Choose…</option>{services.map((s) => <option key={s.slug}>{s.title}</option>)}<option>Not sure — help me decide</option></select>{err('service')}</label>
        <label className="f-field wide">Project description<textarea {...a11y('description')} rows={6} value={d.description} onChange={set('description')} placeholder="What is the business, what is the problem, and what would a good outcome look like?" required />{err('description')}<span className="f-hint">{d.description.trim().length} characters</span></label>
      </div>)}

      {step === 2 && (<div className="f-grid">
        <label className="f-field">Estimated budget <em>optional</em><select {...a11y('budget')} value={d.budget} onChange={set('budget')}><option value="">Prefer not to say</option>{budgets.map((b) => <option key={b}>{b}</option>)}</select></label>
        <label className="f-field">Timeline <em>optional</em><select {...a11y('timeline')} value={d.timeline} onChange={set('timeline')}><option value="">Prefer not to say</option>{timelines.map((b) => <option key={b}>{b}</option>)}</select></label>
        <fieldset className="f-field wide f-radio"><legend>Preferred contact method</legend>{['Email', 'WhatsApp', 'Either'].map((c) => <label key={c}><input type="radio" name="contact" value={c} checked={d.contact === c} onChange={set('contact')} />{c}</label>)}</fieldset>
        <div className="wide f-review"><p className="mono muted">Review</p><p><b>{d.name}</b> · {d.email} · {d.country}{d.company && ` · ${d.company}`}</p><p>{d.industry} · {d.service}</p><p className="muted">{d.description.trim().slice(0, 180)}{d.description.trim().length > 180 ? '…' : ''}</p></div>
      </div>)}

      <div className="f-actions">
        {step > 0 ? <button type="button" className="btn ghost" onClick={() => go(step - 1)}><span>Back</span></button> : <span />}
        <button type="submit" className="btn" data-magnetic><span>{step < 2 ? 'Continue' : 'Prepare my inquiry'}</span><span className="arr" aria-hidden="true" /></button>
      </div>
      <p className="f-privacy">Nothing you type is saved or sent by this site. You send the final message yourself.</p>
    </form>
  );
}
