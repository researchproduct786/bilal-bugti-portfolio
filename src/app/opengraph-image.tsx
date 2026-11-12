import { ImageResponse } from 'next/og';
import { site } from '@/data/site';

export const alt = `${site.name} — ${site.discipline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: 'linear-gradient(135deg, #060709 55%, #10203f 100%)', color: '#efece6' }}>
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 5, textTransform: 'uppercase', color: '#b9bcc2' }}>{site.role} · {site.discipline}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 168, fontWeight: 800, lineHeight: 0.92, letterSpacing: -4, textTransform: 'uppercase' }}>Bilal</div>
          <div style={{ display: 'flex', fontSize: 168, fontWeight: 800, lineHeight: 0.92, letterSpacing: -4, textTransform: 'uppercase' }}>Bugti</div>
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#b9bcc2', borderTop: '1px solid rgba(236,232,224,.25)', paddingTop: 24 }}>I don’t just build projects. I build solutions to real-world problems.</div>
      </div>
    ),
    size,
  );
}
