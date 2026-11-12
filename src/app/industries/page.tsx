import type { Metadata } from 'next';
import { industries } from '@/data/content';
import { IndustryGlobe } from '@/components/home/IndustryGlobe';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export const metadata: Metadata = { title: 'Industries — business environments and the problems in them', description: 'The range of business environments Bilal Bugti is interested in helping: e-commerce, retail, healthcare, education, real estate, hospitality, restaurants, services, logistics and more.', alternates: { canonical: '/industries' } };

export default function Industries() {
  return (
    <>
      <PageHero kicker="Industries" title={<>Different businesses. <span className="serif muted">Familiar problems.</span></>} lede="An honest note first: this is not a list of sectors I claim to be an expert in. It is the range of business environments I am interested in working with, and the kinds of problems I would want to help solve in each." />
      <section className="section tight"><div className="wrap reveal"><IndustryGlobe /></div></section>
      <section className="section tight rule alt" aria-labelledby="all-h">
        <div className="wrap">
          <p className="kicker reveal">All fourteen</p><h2 id="all-h" className="h2 reveal" style={{ margin: '20px 0 40px' }}>Where the problems live.</h2>
          <ul className="indgrid">{industries.map((ind, i) => <li key={ind.name} className="reveal"><span className="mono muted">{String(i + 1).padStart(2, '0')}</span><h3 className="h3">{ind.name}</h3><p className="body">{ind.note}</p></li>)}</ul>
          <p className="notice reveal" style={{ marginTop: 40, maxWidth: 760 }}><b>Why the caution</b>The underlying problems — manual work, lost enquiries, unclear numbers, a weak online presence — repeat across industries. The details do not. Every project begins by learning how your particular business works before proposing anything.</p>
        </div>
      </section>
      <FinalCTA q="Is your industry not listed?" a="It probably has the same problems under different names. Tell me about it." />
    </>
  );
}
