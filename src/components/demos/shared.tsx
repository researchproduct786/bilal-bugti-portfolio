'use client';
import { useT } from '@/i18n/client';
import type { CSSProperties, ReactNode } from 'react';

export const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

interface ShellProps { title: string; note: string; tabs?: string[]; tab?: string; onTab?: (t: string) => void; theme?: CSSProperties; className?: string; children: ReactNode }

/** Common chrome for every demonstration: makes the fictional status impossible to miss. */
export function DemoShell({ title, note, tabs, tab, onTab, theme, className = '', children }: ShellProps) {
  const t = useT();
  return (
    <div className={`demo ${className}`} style={theme}>
      <div className="demo-bar">
        <span className="demo-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="demo-title">{title}</span>
        <span className="demo-flag">{t('Concept project ·')} {note}</span>
      </div>
      {tabs && (
        <div className="demo-tabs" role="tablist" aria-label={t('{title} views', { title })}>
          {tabs.map((x) => <button key={x} role="tab" aria-selected={x === tab} onClick={() => onTab?.(x)}>{t(x)}</button>)}
        </div>
      )}
      <div className="demo-body">{children}</div>
    </div>
  );
}

export function Bars({ data, labels, h = 120 }: { data: number[]; labels?: string[]; h?: number }) {
  const t = useT();
  const max = Math.max(...data, 1);
  return (
    <div className="d-bars" style={{ height: h }} role="img" aria-label={t('Bar chart, sample data: {v0}', { v0: data.join(', ') })}>
      {data.map((v, i) => <span key={i}><i style={{ height: `${(v / max) * 100}%` }} />{labels && <small>{labels[i]}</small>}</span>)}
    </div>
  );
}

export function Spark({ data, h = 90 }: { data: number[]; h?: number }) {
  const t = useT();
  const max = Math.max(...data), min = Math.min(...data), w = 300;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 6 - ((v - min) / (max - min || 1)) * (h - 12)}`).join(' ');
  return (
    <svg className="d-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={t('Trend line, sample data')} style={{ height: h }}>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill="currentColor" opacity=".1" stroke="none" />
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Kpi({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  const t = useT();
  return <div className="d-kpi"><small>{label}</small><b>{value}</b>{sub && <span>{sub}</span>}</div>;
}
