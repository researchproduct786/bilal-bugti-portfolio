'use client';
import { useT } from '@/i18n/client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  const t = useT();
  return (
    <section className="nf"><div className="wrap">
      <p className="kicker">{t('Something went wrong')}</p>
      <h1 className="h1" style={{ marginTop: 20 }}>{t('That didn’t load properly.')}</h1>
      <p className="lede" style={{ marginTop: 18 }}>{t('An unexpected error interrupted this page. Trying again usually fixes it.')}</p>
      <button className="btn" style={{ marginTop: 34 }} onClick={reset}><span>{t('Try again')}</span></button>
    </div></section>
  );
}
