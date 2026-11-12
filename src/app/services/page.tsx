import type { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/data/services';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export const metadata: Metadata = { title: 'Services — digital products, AI & business systems, growth', description: 'What Bilal Bugti does: Shopify and e-commerce, mobile and web development, business automation and CRM systems, applied AI, digital marketing and creative.', alternates: { canonical: '/services' } };

export default function Services() {
  return (
    <>
      <PageHero kicker="Services" title={<>Three areas of practice, <span className="serif muted">one question first:</span> what is the real problem?</>} lede="I work across product development, business systems and digital growth. The strongest part of my practice is building things people buy from and work in: online stores, mobile apps and websites." />
      <section className="section tight">
        <div className="wrap">
          {services.map((s) => (
            <article key={s.slug} className="svc reveal">
              <span className="svc-l serif" aria-hidden="true">{s.letter}</span>
              <div>
                <h2 className="h2"><Link href={`/services/${s.slug}`}>{s.title}</Link></h2>
                <p className="lede" style={{ marginTop: 16 }}>{s.short}</p>
                <Link className="textlink" style={{ marginTop: 28 }} href={`/services/${s.slug}`}>How it works, what’s included, FAQs <span aria-hidden="true">→</span></Link>
              </div>
              <div>
                <p className="mono muted" style={{ textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11 }}>Core</p>
                <ul className="svc-lead">{s.lead.map((c) => <li key={c}>{c}</li>)}</ul>
                <p className="mono muted" style={{ textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11, marginTop: 22 }}>Also</p>
                <p className="chips" style={{ marginTop: 10 }}>{s.supporting.map((c) => <span key={c} className="chip">{c}</span>)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <FinalCTA q="Not sure which one you need?" a="Describe the problem. Choosing the right service is my job, not yours." />
    </>
  );
}
