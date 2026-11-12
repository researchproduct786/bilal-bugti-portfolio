import type { Metadata } from 'next';
import { getT, type PageProps } from '@/i18n/server';
import { pageMeta } from '@/i18n/meta';
import { i18n } from '@/i18n/core';
import { Suspense } from 'react';
import { InquiryForm } from '@/components/contact/InquiryForm';
import { PageHero } from '@/components/site/Blocks';
import { site } from '@/data/site';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params; const t = getT(locale);
  return pageMeta(locale, '/contact', t('Contact — start a project'), t('Tell Bilal Bugti about your business and the problem you want solved. A short three-step project inquiry, sent from your own email or WhatsApp.'));
}

export default async function Contact({ params }: PageProps) {
  const { locale } = await params; const t = getT(locale);
  return (
    <>
      <PageHero kicker={t('Contact')} title={<>{t('Have a problem worth solving?')} <span className="serif muted">{t('Start here.')}</span></>} lede={t('Three short steps. Describe the business and what is getting in the way — you do not need to know which service you need or what it should be built with.')} />
      <section className="section tight">
        <div className="wrap contact">
          <Suspense fallback={<div className="form" role="status">{t('Loading form…')}</div>}><InquiryForm /></Suspense>
          <aside className="contact-side">
            <div><h2 className="mono muted">{t('Direct')}</h2>
              <dl className="spec">
                <dt>{t('Email')}</dt><dd>{site.email ? <a className="link" href={`mailto:${site.email}`}>{site.email}</a> : <span className="ph">{t('Placeholder — email address to be added')}</span>}</dd>
                <dt>{t('WhatsApp')}</dt><dd>{site.whatsapp ? <a className="link" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">{t('Message on WhatsApp')}</a> : <span className="ph">{t('Placeholder — number to be added')}</span>}</dd>
              </dl>
            </div>
            <div><h2 className="mono muted">{t('What happens next')}</h2>
              <ol className="ticks" style={{ marginTop: 14 }}><li>{t('I read your message and reply with any questions.')}</li><li>{t('We have a short conversation about the business.')}</li><li>{t('You receive a plain-language scope, timeline and cost.')}</li></ol>
            </div>
            <p className="notice"><b>{t('How this form works')}</b>{t('There is no server collecting inquiries. The form prepares a message and hands it to your own email app or WhatsApp, so you can see exactly what is sent.')}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
