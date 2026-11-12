'use client';
import { useT } from '@/i18n/client';
import dynamic from 'next/dynamic';

function Loading() { const t = useT(); return <div className="demo demo-loading" role="status">{t('Loading demonstration…')}</div>; }
const loading = () => <Loading />;
// Each demonstration is its own chunk: a project page only downloads the demo it shows.
const map = {
  'halden-objects': dynamic(() => import('./Halden'), { loading }),
  tillo: dynamic(() => import('./Tillo'), { loading }),
  deskhand: dynamic(() => import('./Deskhand'), { loading }),
  'linework-crm': dynamic(() => import('./Linework'), { loading }),
  'ember-and-rye': dynamic(() => import('./Ember'), { loading }),
  slowtide: dynamic(() => import('./Slowtide'), { loading }),
} as const;

export function Demo({ slug }: { slug: string }) {
  const C = map[slug as keyof typeof map];
  return C ? <C /> : null;
}
