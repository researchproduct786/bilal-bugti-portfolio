import type { Metadata } from 'next';
import { getT, type PageProps } from '@/i18n/server';
import { pageMeta } from '@/i18n/meta';
import { i18n } from '@/i18n/core';
import Link from '@/components/site/L';
import { services as servicesEn } from '@/data/services';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params; const t = getT(locale);
  return pageMeta(locale, '/services', t('Services — digital products, AI & business systems, growth'), t('What Bilal Bugti does: Shopify and e-commerce, mobile and web development, business automation and CRM systems, applied AI, digital marketing and creative.'));
}

export default async function Services({ params }: PageProps) {
  const { locale } = await params; const t = getT(locale); const services = t.x(servicesEn);
  return (
    <>
      <PageHero kicker={t('Services')} title={<>{t('Three areas of practice,')} <span className="serif muted">{t('one question first:')}</span> {t('what is the real problem?')}</>} lede={t('I work across product development, business systems and digital growth. The strongest part of my practice is building things people buy from and work in: online stores, mobile apps and websites.')} />
      <section className="section tight">
        <div className="wrap">
          {services.map((s) => (
            <article key={s.slug} className="svc reveal">
              <span className="svc-l serif" aria-hidden="true">{s.letter}</span>
              <div>
                <h2 className="h2"><Link href={`/services/${s.slug}`}>{s.title}</Link></h2>
                <p className="lede" style={{ marginTop: 16 }}>{s.short}</p>
                <Link className="textlink" style={{ marginTop: 28 }} href={`/services/${s.slug}`}>{t('How it works, what’s included, FAQs')} <span aria-hidden="true">→</span></Link>
              </div>
              <div>
                <p className="mono muted" style={{ textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11 }}>{t('Core')}</p>
                <ul className="svc-lead">{s.lead.map((c) => <li key={c}>{c}</li>)}</ul>
                <p className="mono muted" style={{ textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11, marginTop: 22 }}>{t('Also')}</p>
                <p className="chips" style={{ marginTop: 10 }}>{s.supporting.map((c) => <span key={c} className="chip">{c}</span>)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <FinalCTA q={t('Not sure which one you need?')} a={t('Describe the problem. Choosing the right service is my job, not yours.')} />
    </>
  );
}
