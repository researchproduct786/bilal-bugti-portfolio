import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { ProblemSelector } from '@/components/home/ProblemSelector';
import { IndustryGlobe } from '@/components/home/IndustryGlobe';
import { Cover } from '@/components/demos/Cover';
import { TestimonialWall } from '@/components/site/TestimonialWall';
import { FinalCTA } from '@/components/site/Blocks';
import { Btn } from '@/components/site/Btn';
import { services } from '@/data/services';
import { projects } from '@/data/projects';
import { lessons, processSteps, story } from '@/data/content';
import { site } from '@/data/site';

export default function Home() {
  return (
    <>
      <Hero />

      {/* 02 — Introduction */}
      <section id="intro" className="section intro" aria-labelledby="intro-h">
        <div className="wrap">
          <p className="kicker reveal"><b>01</b> Introduction</p>
          <h2 id="intro-h" className="intro-statement reveal">
            I’m Bilal — a digital entrepreneur working where <em>technology</em>, <em>creativity</em> and <em>business</em> meet. I look for the real problem first, then build the thing that solves it.
          </h2>
          <div className="intro-grid">
            <p className="lede reveal">{site.statement}</p>
            <ul className="intersect reveal">
              <li><span className="mono">Technology</span><span>How it gets built — stores, apps, systems, automation.</span></li>
              <li><span className="mono">Creativity</span><span>How it looks, reads and feels to the person using it.</span></li>
              <li><span className="mono">Business</span><span>Why it is worth building, and what it should change.</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* 03 — Capabilities */}
      <section className="section rule" aria-labelledby="cap-h">
        <div className="wrap">
          <div className="cap-head">
            <p className="kicker reveal"><b>02</b> What I do</p>
            <h2 id="cap-h" className="h2 reveal">Three areas of practice.<br /><span className="muted">One way of working.</span></h2>
          </div>
          <div className="strong reveal" aria-label="Strongest capabilities">
            <span className="mono muted">Strongest in</span>
            <ol>
              <li><Link href="/services/digital-product-development">Shopify <span className="serif">&amp;</span> E-commerce</Link></li>
              <li><Link href="/services/digital-product-development">Mobile Apps</Link></li>
              <li><Link href="/services/digital-product-development">Web Development</Link></li>
            </ol>
          </div>
          <ul className="pillars">
            {services.map((s) => (
              <li key={s.slug} className="reveal">
                <Link href={`/services/${s.slug}`} className="pillar">
                  <span className="pillar-l">{s.letter}</span>
                  <span className="pillar-t"><span className="h3">{s.title}</span><span className="pillar-s">{s.short}</span></span>
                  <span className="pillar-c">{[...s.lead, ...s.supporting].map((c, i) => <span key={c} className={i < s.lead.length ? 'lead' : ''}>{c}</span>)}</span>
                  <span className="pillar-a" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 — Selected work */}
      <section className="section rule" aria-labelledby="work-h">
        <div className="wrap">
          <div className="split" style={{ marginBottom: 'clamp(40px, 6vw, 84px)' }}>
            <div><p className="kicker reveal"><b>03</b> Selected work</p></div>
            <div>
              <h2 id="work-h" className="h2 reveal">Six products, built to show how I think.</h2>
              <p className="lede reveal" style={{ marginTop: 22 }}>Each is an original concept project made for this portfolio — fictional brands, sample data, working screens. No client work is reused or disclosed.</p>
            </div>
          </div>
          <ul className="workgrid">
            {projects.map((p) => (
              <li key={p.slug} className="reveal">
                <Link href={`/work/${p.slug}`} className="workcard" data-cursor>
                  <Cover project={p} />
                  <span className="workcard-meta"><span className="mono muted">{p.n} — {p.category}</span><span className="h3">{p.brand}</span><span className="muted">{p.title}</span></span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="reveal" style={{ marginTop: 56 }}><Btn href="/work" variant="ghost">All work</Btn></div>
        </div>
      </section>

      {/* 05 — Problem selector */}
      <section className="section rule alt" aria-labelledby="ps-h">
        <div className="wrap">
          <div className="split" style={{ marginBottom: 'clamp(36px, 5vw, 64px)' }}>
            <div><p className="kicker reveal"><b>04</b> Start from the problem</p></div>
            <div><h2 id="ps-h" className="h2 reveal">What is getting in the way of your business?</h2>
              <p className="lede reveal" style={{ marginTop: 22 }}>Pick the statement closest to yours. You’ll get a plain outline of why it matters and how it could be solved.</p></div>
          </div>
          <div className="reveal"><ProblemSelector /></div>
        </div>
      </section>

      {/* 06 — Industries */}
      <section className="section rule" aria-labelledby="ind-h">
        <div className="wrap">
          <div className="split" style={{ marginBottom: 'clamp(28px, 4vw, 56px)' }}>
            <div><p className="kicker reveal"><b>05</b> Industries</p></div>
            <div><h2 id="ind-h" className="h2 reveal">Different businesses. Familiar problems.</h2>
              <p className="lede reveal" style={{ marginTop: 22 }}>These are the business environments I’m interested in working with and the problems I’d want to help solve there — not a list of claimed specialisms.</p></div>
          </div>
          <div className="reveal"><IndustryGlobe /></div>
          <div className="reveal" style={{ marginTop: 40 }}><Link className="textlink" href="/industries">Industries in detail <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      {/* 07 — Story */}
      <section className="section rule story" aria-labelledby="story-h">
        <div className="wrap">
          <p className="kicker reveal"><b>06</b> The journey</p>
          <h2 id="story-h" className="h1 reveal" style={{ marginTop: 22, maxWidth: '13em' }}>Curiosity first. <span className="serif">Everything else followed.</span></h2>
          <ol className="chapters">
            {story.map((c) => (
              <li key={c.n} className="reveal"><span className="mono muted">{c.n}</span><h3 className="serif">{c.title}</h3><p className="body">{c.body}</p></li>
            ))}
          </ol>
          <div className="reveal" style={{ marginTop: 48 }}><Link className="textlink" href="/about">Read the full story <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      {/* 08 — Process */}
      <section className="section rule alt" aria-labelledby="proc-h">
        <div className="wrap">
          <div className="split" style={{ marginBottom: 'clamp(36px, 5vw, 72px)' }}>
            <div><p className="kicker reveal"><b>07</b> Process</p></div>
            <div><h2 id="proc-h" className="h2 reveal">Seven steps. The first two matter most.</h2></div>
          </div>
          <ol className="stairs">
            {processSteps.map((s, i) => (
              <li key={s.title} className="reveal" style={{ ['--i' as string]: i }}><span className="mono">{String(i + 1).padStart(2, '0')}</span><h3>{s.title}</h3></li>
            ))}
          </ol>
          <div className="reveal" style={{ marginTop: 56 }}><Link className="textlink" href="/process">The process in detail <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      {/* 09 — Testimonials */}
      <section className="section rule" aria-labelledby="t-h">
        <div className="wrap">
          <div className="split" style={{ marginBottom: 'clamp(36px, 5vw, 64px)' }}>
            <div><p className="kicker reveal"><b>08</b> Testimonials</p></div>
            <div><h2 id="t-h" className="h2 reveal">Nothing here is invented — so for now, it’s mostly empty.</h2>
              <p className="lede reveal" style={{ marginTop: 22 }}>Real reviews will be published only with the client’s words, permission and a link to the source.</p></div>
          </div>
          <div className="reveal"><TestimonialWall compact /></div>
        </div>
      </section>

      {/* 10 — Insights */}
      <section className="section rule" aria-labelledby="in-h">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="kicker reveal"><b>09</b> Insights</p>
              <h2 id="in-h" className="h2 reveal" style={{ marginTop: 22 }}>Working notes.</h2>
              <p className="body reveal" style={{ marginTop: 20 }}>A few principles learned the slow way. Longer articles are in draft and will be published here when they are ready — not before.</p>
              <div className="reveal" style={{ marginTop: 28 }}><Link className="textlink" href="/insights">Open the notebook <span aria-hidden="true">→</span></Link></div>
            </div>
            <ol className="notes">
              {lessons.map((l, i) => (<li key={l.title} className="reveal"><span className="mono muted">Note {String(i + 1).padStart(2, '0')}</span><h3 className="h3">{l.title}</h3><p className="body">{l.body}</p></li>))}
            </ol>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
