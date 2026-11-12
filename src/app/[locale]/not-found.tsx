'use client';
import { Btn } from '@/components/site/Btn';
import { useT } from '@/i18n/client';
export default function NotFound() {
  const t = useT();
  return (
    <section className="nf"><div className="wrap">
      <p className="nf-code" aria-hidden="true">404</p>
      <h1 className="h1" style={{ marginTop: 20 }}>{t('This page doesn’t exist.')}</h1>
      <p className="lede" style={{ marginTop: 18 }}>{t('The link may be old or mistyped. The work, however, is exactly where it should be.')}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 34 }}><Btn href="/">{t('Back to home')}</Btn><Btn href="/work" variant="ghost">{t('See the work')}</Btn></div>
    </div></section>
  );
}
