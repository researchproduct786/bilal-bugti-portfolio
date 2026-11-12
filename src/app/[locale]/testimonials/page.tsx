import type { Metadata } from 'next';
import { getT, type PageProps } from '@/i18n/server';
import { pageMeta } from '@/i18n/meta';
import { i18n } from '@/i18n/core';
import { TestimonialWall, testimonials } from '@/components/site/TestimonialWall';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params; const t = getT(locale);
  return pageMeta(locale, '/testimonials', t('Testimonials — real reviews only'), t('Bilal Bugti publishes client testimonials only with the client’s own words, permission and a link to the source. Until then, this page says so.'));
}

export default async function Testimonials({ params }: PageProps) {
  const { locale } = await params; const t = getT(locale);
  return (
    <>
      <PageHero kicker={t('Testimonials')} title={<>{t('Real words from real people —')} <span className="serif muted">{t('or nothing at all.')}</span></>} lede={testimonials.length ? t('Each review below is published with permission and links to where it was originally written.') : t('There are no published testimonials yet. Rather than fill this page with invented praise, it shows exactly how genuine reviews will be presented once clients agree to share them.')} />
      <section className="section tight"><div className="wrap reveal"><TestimonialWall /></div></section>
      <section className="section tight rule alt" aria-labelledby="r-h">
        <div className="wrap split">
          <div><p className="kicker reveal">{t('The rules')}</p><h2 id="r-h" className="h2 reveal" style={{ marginTop: 20 }}>{t('How a review earns its place here.')}</h2></div>
          <ol className="notes">
            {t.x(i18n([['Written by the client', 'The words are theirs, quoted exactly — from WhatsApp, LinkedIn, Instagram, Facebook, X or email.'], ['Published with permission', 'Nothing appears without the reviewer agreeing to its publication and how they are named.'], ['Linked to its source', 'Where the original is public, the card links to it so anyone can verify it.'], ['Never fabricated', 'No invented names, no generated screenshots, no “sample” praise presented as real. Mock-ups are always labelled.']])).map(([h, b], i) => (
              <li key={h} className="reveal"><span className="mono muted">{String(i + 1).padStart(2, '0')}</span><h3 className="h3">{h}</h3><p className="body">{b}</p></li>
            ))}
          </ol>
        </div>
      </section>
      <FinalCTA q={t('Want to be the first?')} a={t('Start a project — and tell me afterwards, honestly, how it went.')} />
    </>
  );
}
