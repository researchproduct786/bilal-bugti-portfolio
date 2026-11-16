'use client';
import { createContext, useContext, type CSSProperties, type ReactNode } from 'react';

/** Chrome strings for the demonstration frame. Provided per locale from the page. */
export interface DemoChrome {
  concept: string;
  loading: string;
  views: string;
  /** Translated demonstration notes, keyed by the English note the demo passes in. */
  notes?: Record<string, Record<string, string>>;
  locale?: string;
}
const fallback: DemoChrome = { concept: 'Concept project', loading: 'Loading demonstration…', views: 'views' };
export const ChromeContext = createContext<DemoChrome>(fallback);
/**
 * A provider passed as a *prop* rather than rendered as `<Context.Provider>`.
 * React 19 + next/dynamic cannot treat a lazy-loaded Context export as an element
 * type, so the context object itself is handed down and consumed here.
 */
export function DemoChromeProvider({ ctx, value, children }: { ctx?: typeof ChromeContext; value?: Partial<DemoChrome>; children: ReactNode }) {
  const C = ctx ?? ChromeContext;
  return <C.Provider value={{ ...fallback, ...value }}>{children}</C.Provider>;
}
export type { ChromeContext as ChromeContextType };
export const useDemoChrome = () => useContext(ChromeContext);

/**
 * Money formatting for every demonstration.
 *
 * The portfolio is presented to an international audience, so every figure in the
 * fictional demo data is in US dollars. One currency everywhere keeps the marketing
 * pages, the product cards and the working demos consistent with each other.
 */
export const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

interface ShellProps { title: string; note: string; tabs?: string[]; tab?: string; onTab?: (t: string) => void; theme?: CSSProperties; className?: string; children: ReactNode }

/** Common chrome for every demonstration: makes the fictional status impossible to miss. */
export function DemoShell({ title, note, tabs, tab, onTab, theme, className = '', children }: ShellProps) {
  const c = useDemoChrome();
  return (
    <div className={`demo ${className}`} style={theme}>
      <div className="demo-bar">
        <span className="demo-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="demo-title">{title}</span>
        <span className="demo-flag">{c.concept} · {(c.locale && c.notes?.[note]?.[c.locale]) || note}</span>
      </div>
      {tabs && (
        <div className="demo-tabs" role="tablist" aria-label={`${title} ${c.views}`}>
          {tabs.map((t) => <button key={t} role="tab" aria-selected={t === tab} onClick={() => onTab?.(t)}>{t}</button>)}
        </div>
      )}
      <div className="demo-body">{children}</div>
    </div>
  );
}

export function Bars({ data, labels, h = 120 }: { data: number[]; labels?: string[]; h?: number }) {
  const max = Math.max(...data, 1);
  return (
    <div className="d-bars" style={{ height: h }} role="img" aria-label={`Bar chart, sample data: ${data.join(', ')}`}>
      {data.map((v, i) => <span key={i}><i style={{ height: `${(v / max) * 100}%` }} />{labels && <small>{labels[i]}</small>}</span>)}
    </div>
  );
}

export function Spark({ data, h = 90 }: { data: number[]; h?: number }) {
  const max = Math.max(...data), min = Math.min(...data), w = 300;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 6 - ((v - min) / (max - min || 1)) * (h - 12)}`).join(' ');
  return (
    <svg className="d-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label="Trend line, sample data" style={{ height: h }}>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill="currentColor" opacity=".1" stroke="none" />
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Kpi({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return <div className="d-kpi"><small>{label}</small><b>{value}</b>{sub && <span>{sub}</span>}</div>;
}
