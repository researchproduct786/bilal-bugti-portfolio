'use client';
import { useMemo, useRef, useState } from 'react';
import type { Dict } from '@/i18n/en';
import type { ContentIndustry, ContentService } from '@/i18n/content/types';
import type { LocaleCode } from '@/i18n/config';
import { site } from '@/data/site';

type Data = {
  name: string; email: string; company: string; country: string;
  industry: string; service: string; description: string;
  budget: string; timeline: string; contact: string;
};

/**
 * Three-step project inquiry.
 *
 * There is no backend: nothing is stored or transmitted by this site. On completion the visitor
 * sends the prepared message from their own email app or WhatsApp. Every label comes from the
 * selected language, and the prepared message is written in that language too.
 */
export function InquiryForm({
  locale, t, industries, services,
}: {
  locale: LocaleCode;
  t: Dict;
  industries: ContentIndustry[];
  services: ContentService[];
}) {
  const c = t.contact;
  const budgets = ['<$1,000', '$1,000 – $5,000', '$5,000 – $15,000', '$15,000+'];
  const timelines = [c.flexible, c.withinMonth, c.oneToThree, c.threePlus];
  const stepNames = [c.step1, c.step2, c.step3];
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState<'ok' | 'fail' | ''>('');
  const top = useRef<HTMLDivElement>(null);
  const [d, setD] = useState<Data>({
    name: '', email: '', company: '', country: '',
    industry: '', service: '', description: '',
    budget: '', timeline: '', contact: 'Email',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});

  const set = (k: keyof Data) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setD((prev) => ({ ...prev, [k]: e.target.value }));

  const required = (k: keyof Data, msg: string) => ({ [k]: msg });

  const validate = (n: number) => {
    const e: Partial<Record<keyof Data, string>> = {};
    if (n === 0) {
      if (d.name.trim().length < 2) Object.assign(e, required('name', c.name));
      if (!/^\S+@\S+\.\S+$/.test(d.email)) Object.assign(e, required('email', c.emailLabel));
      if (!d.country.trim()) Object.assign(e, required('country', c.country));
    } else if (n === 1) {
      if (!d.industry) Object.assign(e, required('industry', c.industry));
      if (!d.service) Object.assign(e, required('service', c.service));
      if (d.description.trim().length < 20) Object.assign(e, required('description', c.descriptionHint));
    }
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`f-${first}`)?.focus();
    return !first;
  };

  const go = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => top.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate(step)) return;
    if (step < 2) return go(step + 1);
    setDone(true);
    requestAnimationFrame(() => top.current?.focus());
  };

  const message = useMemo(() => [
    `${c.formTitle} — ${site.name}`, '',
    `${c.name}: ${d.name}`, `${c.emailLabel}: ${d.email}`,
    d.company ? `${c.company}: ${d.company}` : '', `${c.country}: ${d.country}`,
    `${c.industry}: ${d.industry}`, `${c.service}: ${d.service}`,
    d.budget ? `${c.budget}: ${d.budget}` : '', d.timeline ? `${c.timeline}: ${d.timeline}` : '',
    `${c.preferred}: ${d.contact}`, '', `${c.description}:`, d.description.trim(),
  ].filter(Boolean).join('\n'), [d, c]);

  const mailto = site.email ? `mailto:${site.email}?subject=${encodeURIComponent(`${c.formTitle} — ${d.name}`)}&body=${encodeURIComponent(message)}` : '';
  const wa = site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}` : '';
  const copy = async () => {
    try { await navigator.clipboard.writeText(message); setCopied('ok'); } catch { setCopied('fail'); }
  };

  const err = (k: keyof Data) => errors[k] && <span className="f-err" id={`e-${k}`} role="alert">{errors[k]}</span>;
  const a11y = (k: keyof Data) => ({ id: `f-${k}`, 'aria-invalid': !!errors[k] || undefined, 'aria-describedby': errors[k] ? `e-${k}` : undefined });

  if (done) {
    return (
      <div className="form done" ref={top} tabIndex={-1} aria-live="polite">
        <p className="kicker">{c.formTitle}</p>
        <h2 className="h2" style={{ marginTop: 14 }}>{c.prepareTitle}</h2>
        <p className="body" style={{ marginTop: 12 }}>{c.prepareBody}</p>
        <pre className="f-preview" tabIndex={0} aria-label={c.formTitle}>{message}</pre>
        <div className="f-send">
          {mailto ? <a className="btn" href={mailto} data-magnetic><span>{c.sendEmail}</span><span className="arr" aria-hidden="true" /></a> : <span className="btn" aria-disabled="true"><span>{c.notConfigured}</span></span>}
          {wa ? <a className="btn ghost" href={wa} target="_blank" rel="noopener noreferrer"><span>{c.sendWhatsApp}</span><span className="arr" aria-hidden="true" /></a> : null}
          <button type="button" className="btn ghost" onClick={copy}><span>{copied === 'ok' ? `${c.copied} ✓` : c.copy}</span></button>
        </div>
        {copied === 'fail' && <p className="f-err" role="alert">{c.copy}</p>}
        <button type="button" className="textlink" style={{ marginTop: 24 }} onClick={() => { setDone(false); go(0); }}>← {c.edit}</button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate aria-labelledby="form-h" data-locale={locale}>
      <div ref={top} />
      <ol className="f-steps" aria-label={c.formTitle}>
        {stepNames.map((s, i) => <li key={s} aria-current={i === step ? 'step' : undefined} className={i < step ? 'past' : ''}><span className="mono">{String(i + 1).padStart(2, '0')}</span>{s}</li>)}
      </ol>
      <h2 id="form-h" className="h3 f-title">{stepNames[step]}</h2>

      {step === 0 && (
        <div className="f-grid">
          <label className="f-field">{c.name}<input {...a11y('name')} value={d.name} onChange={set('name')} autoComplete="name" required />{err('name')}</label>
          <label className="f-field">{c.emailLabel}<input {...a11y('email')} type="email" value={d.email} onChange={set('email')} autoComplete="email" inputMode="email" required />{err('email')}</label>
          <label className="f-field">{c.company} <em>{c.optional}</em><input {...a11y('company')} value={d.company} onChange={set('company')} autoComplete="organization" /></label>
          <label className="f-field">{c.country}<input {...a11y('country')} value={d.country} onChange={set('country')} autoComplete="country-name" required />{err('country')}</label>
        </div>
      )}

      {step === 1 && (
        <div className="f-grid">
          <label className="f-field">{c.industry}<select {...a11y('industry')} value={d.industry} onChange={set('industry')} required><option value="">{c.choose}</option>{industries.map((i) => <option key={i.name}>{i.name}</option>)}<option>{c.other}</option></select>{err('industry')}</label>
          <label className="f-field">{c.service}<select {...a11y('service')} value={d.service} onChange={set('service')} required><option value="">{c.choose}</option>{services.map((s) => <option key={s.slug}>{s.title}</option>)}<option>{c.notSure}</option></select>{err('service')}</label>
          <label className="f-field wide">{c.description}<textarea {...a11y('description')} rows={5} value={d.description} onChange={set('description')} placeholder={c.descriptionHint} required />{err('description')}</label>
        </div>
      )}

      {step === 2 && (
        <div className="f-grid">
          <label className="f-field">{c.budget} <em>{c.optional}</em><select {...a11y('budget')} value={d.budget} onChange={set('budget')}><option value="">—</option>{budgets.map((b) => <option key={b}>{b}</option>)}</select></label>
          <label className="f-field">{c.timeline} <em>{c.optional}</em><select {...a11y('timeline')} value={d.timeline} onChange={set('timeline')}><option value="">—</option>{timelines.map((b) => <option key={b}>{b}</option>)}</select></label>
          <fieldset className="f-field wide f-radio">
            <legend>{c.preferred}</legend>
            {['Email', 'WhatsApp', c.other].map((x) => <label key={x}><input type="radio" name="contact" value={x} checked={d.contact === x} onChange={set('contact')} />{x}</label>)}
          </fieldset>
          <div className="wide f-review">
            <p className="mono muted">{c.review}</p>
            <p><b>{d.name}</b> · {d.email} · {d.country}{d.company && ` · ${d.company}`}</p>
            <p>{d.industry} · {d.service}</p>
          </div>
        </div>
      )}

      <div className="f-actions">
        {step > 0 ? <button type="button" className="btn ghost" onClick={() => go(step - 1)}><span>{t.ui.prev}</span></button> : <span />}
        <button type="submit" className="btn" data-magnetic><span>{step < 2 ? c.continue : c.prepare}</span><span className="arr" aria-hidden="true" /></button>
      </div>
      <p className="f-privacy">{c.privacy}</p>
    </form>
  );
}
