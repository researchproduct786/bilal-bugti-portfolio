'use client';
import dynamic from 'next/dynamic';
import { DemoChromeProvider, type DemoChrome } from './shared';

const loading = () => <div className="demo demo-loading" role="status">Loading demonstration…</div>;
// Each demonstration is its own chunk: a project page only downloads the demo it shows.
const map = {
  'halden-objects': dynamic(() => import('./Halden'), { loading }),
  tillo: dynamic(() => import('./Tillo'), { loading }),
  deskhand: dynamic(() => import('./Deskhand'), { loading }),
  'linework-crm': dynamic(() => import('./Linework'), { loading }),
  'ember-and-rye': dynamic(() => import('./Ember'), { loading }),
  slowtide: dynamic(() => import('./Slowtide'), { loading }),
} as const;

export function Demo({ slug, chrome }: { slug: string; chrome?: Partial<DemoChrome> }) {
  const C = map[slug as keyof typeof map];
  return C ? <DemoChromeProvider value={chrome}><C /></DemoChromeProvider> : null;
}
