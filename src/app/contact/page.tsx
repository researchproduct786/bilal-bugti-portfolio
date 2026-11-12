import type { Metadata } from 'next';
import { Suspense } from 'react';
import { InquiryForm } from '@/components/contact/InquiryForm';
import { PageHero } from '@/components/site/Blocks';
import { site } from '@/data/site';

export const metadata: Metadata = { title: 'Contact — start a project', description: 'Tell Bilal Bugti about your business and the problem you want solved. A short three-step project inquiry, sent from your own email or WhatsApp.', alternates: { canonical: '/contact' } };

export default function Contact() {
  return (
    <>
      <PageHero kicker="Contact" title={<>Have a problem worth solving? <span className="serif muted">Start here.</span></>} lede="Three short steps. Describe the business and what is getting in the way — you do not need to know which service you need or what it should be built with." />
      <section className="section tight">
        <div className="wrap contact">
          <Suspense fallback={<div className="form" role="status">Loading form…</div>}><InquiryForm /></Suspense>
          <aside className="contact-side">
            <div><h2 className="mono muted">Direct</h2>
              <dl className="spec">
                <dt>Email</dt><dd>{site.email ? <a className="link" href={`mailto:${site.email}`}>{site.email}</a> : <span className="ph">Placeholder — email address to be added</span>}</dd>
                <dt>WhatsApp</dt><dd>{site.whatsapp ? <a className="link" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">Message on WhatsApp</a> : <span className="ph">Placeholder — number to be added</span>}</dd>
              </dl>
            </div>
            <div><h2 className="mono muted">What happens next</h2>
              <ol className="ticks" style={{ marginTop: 14 }}><li>I read your message and reply with any questions.</li><li>We have a short conversation about the business.</li><li>You receive a plain-language scope, timeline and cost.</li></ol>
            </div>
            <p className="notice"><b>How this form works</b>There is no server collecting inquiries. The form prepares a message and hands it to your own email app or WhatsApp, so you can see exactly what is sent.</p>
          </aside>
        </div>
      </section>
    </>
  );
}
