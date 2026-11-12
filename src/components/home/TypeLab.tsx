'use client';
import { useT } from '@/i18n/client';
import { useState } from 'react';

/** The site's display face is one variable font. This exposes its two axes. */
export function TypeLab() {
  const t = useT();
  const [w, setW] = useState(640);
  const [s, setS] = useState(125);
  return (
    <div>
      <p className="typelab-out" style={{ fontWeight: w, fontStretch: `${s}%` }} aria-hidden="true">{t('Bilal Bugti')}</p>
      <div className="labstudio-ctl">
        <label><span className="mono">{t('Weight')}</span><input type="range" min={100} max={900} value={w} onChange={(e) => setW(+e.target.value)} /><output className="mono">{w}</output></label>
        <label><span className="mono">{t('Width')}</span><input type="range" min={62} max={125} value={s} onChange={(e) => setS(+e.target.value)} /><output className="mono">{s}%</output></label>
      </div>
    </div>
  );
}
