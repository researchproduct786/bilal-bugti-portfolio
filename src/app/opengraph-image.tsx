import { ImageResponse } from 'next/og';
import { site } from '@/data/site';
import { en } from '@/i18n/en';

export const alt = `${site.name} — ${en.meta.discipline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: 'linear-gradient(135deg, #060709 55%, #10203f 100%)', color: '#efece6' }}>
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 5, textTransform: 'uppercase', color: '#b9bcc2' }}>{en.meta.role} · {en.meta.discipline}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 156, fontWeight: 800, lineHeight: 0.92, letterSpacing: -4, textTransform: 'uppercase' }}>Bilal</div>
          <div style={{ display: 'flex', fontSize: 156, fontWeight: 800, lineHeight: 0.92, letterSpacing: -4, textTransform: 'uppercase' }}>Bugti</div>
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#b9bcc2', borderTop: '1px solid rgba(236,232,224,.25)', paddingTop: 24 }}>{en.home.heroTagline}</div>
      </div>
    ),
    size,
  );
}
