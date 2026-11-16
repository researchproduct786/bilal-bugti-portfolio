import Link from 'next/link';
import type { Dict } from '@/i18n/en';

/**
 * Seven capabilities, seven compositions.
 *
 * The failure mode this replaces: seven identical cards with seven different labels,
 * in a three-column grid, which tells a visitor nothing except that there are seven
 * of something. Here each lane has its own accent, its own internal geometry, its own
 * representation of what the work actually is, and its own hover motion — a storefront
 * is wide and photographic, an app is narrow and device-shaped, AI is a conversation,
 * automation is a chain, a CRM is a pipeline, growth is a campaign with numbers beside
 * it.
 *
 * What changed in this pass: the art is no longer a caption-sized thumbnail above a
 * block of text. The interface *is* the panel — it fills the lane's media column, and
 * the copy sits beside it on wide lanes and beneath it on narrow ones. Each lane also
 * carries a photography layer where the work is physical (a shop, a counter, a
 * campaign) so the section reads as a portfolio, not a spec sheet.
 *
 * All seven share the same *system*: same corner radius, same label typography, same
 * rule under the title, same one-line problem statement. That is what makes them a
 * family without making them clones.
 */

type Lane = {
  key: string;
  n: string;
  accent: string;
  accent2: string;
  /** grid span on the wide board */
  span: number;
  title: string;
  line: string;
  problem: string;
  icon: 'store' | 'device' | 'page' | 'spark' | 'flow' | 'pipe' | 'chart';
};

export function Capabilities({ t, L }: { t: Dict; L: (p: string) => string }) {
  const c = t.capabilities;
  const p = t.home;
  /* The seven capabilities in the order they are presented, with spans that tile the
     six-column board exactly: 3+3 / 4+2 / 2+2+2+2. */
  const lanes: Lane[] = [
    { key: 'web', n: '01', accent: '#d9c48a', accent2: '#58d2f0', span: 3, title: c.web, line: c.webLine, problem: p.capProblemWeb, icon: 'page' },
    { key: 'app', n: '02', accent: '#8fb4ff', accent2: '#b79cff', span: 3, title: c.app, line: c.appLine, problem: p.capProblemApp, icon: 'device' },
    { key: 'shopify', n: '03', accent: '#7ec8a5', accent2: '#d9c48a', span: 4, title: c.shopify, line: c.shopifyLine, problem: p.capProblemShopify, icon: 'store' },
    { key: 'ai', n: '04', accent: '#b79cff', accent2: '#8fb4ff', span: 2, title: c.ai, line: c.aiLine, problem: p.capProblemAi, icon: 'spark' },
    { key: 'automation', n: '05', accent: '#6fd0e0', accent2: '#7ec8a5', span: 2, title: c.automation, line: c.automationLine, problem: p.capProblemAutomation, icon: 'flow' },
    { key: 'crm', n: '06', accent: '#ffab7a', accent2: '#f2b3c8', span: 2, title: c.crm, line: c.crmLine, problem: p.capProblemCrm, icon: 'pipe' },
    { key: 'marketing', n: '07', accent: '#f2b3c8', accent2: '#ffab7a', span: 2, title: c.marketing, line: c.marketingLine, problem: p.capProblemMarketing, icon: 'chart' },
  ];

  return (
    <ul className="lanes" data-stagger>
      {lanes.map((l) => (
        <li
          key={l.key}
          className="lane reveal"
          data-lane={l.key}
          data-span={l.span}
          style={{ ['--ac' as string]: l.accent, ['--ac2' as string]: l.accent2, ['--span' as string]: String(l.span) }}
        >
          <Link href={L('/services')} className="lane-link" aria-label={`${l.title} — ${l.line}`}>
            <span className="lane-art" aria-hidden="true">
              <LaneVisual lane={l.key} />
            </span>
            <span className="lane-copy">
              <span className="lane-top">
                <Icon name={l.icon} />
                <span className="lane-n mono">{l.n}</span>
              </span>
              <span className="lane-t">{l.title}</span>
              <span className="lane-l">{l.line}</span>
              <span className="lane-p"><b>{p.capProblemLabel}</b>{l.problem}</span>
              <span className="lane-cta">{t.services.viewService} <i aria-hidden="true">→</i></span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Icon({ name }: { name: Lane['icon'] }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'store':
      return <svg {...common}><path d="M3 9.5 4.6 5h14.8L21 9.5" /><path d="M4 9.5v10h16v-10" /><path d="M9 19.5v-5h6v5" /></svg>;
    case 'device':
      return <svg {...common}><rect x="7" y="3" width="10" height="18" rx="2.2" /><path d="M11 18h2" /></svg>;
    case 'page':
      return <svg {...common}><rect x="3.5" y="4" width="17" height="16" rx="2" /><path d="M3.5 8.5h17" /><path d="M7 12h7M7 15.5h10" /></svg>;
    case 'spark':
      return <svg {...common}><path d="M12 3.5v4M12 16.5v4M4.5 12h4M15.5 12h4" /><circle cx="12" cy="12" r="3.2" /></svg>;
    case 'flow':
      return <svg {...common}><rect x="3" y="4" width="6" height="5" rx="1.2" /><rect x="15" y="15" width="6" height="5" rx="1.2" /><path d="M9 6.5h4a2 2 0 0 1 2 2v9" /></svg>;
    case 'pipe':
      return <svg {...common}><path d="M4 6h16M4 12h11M4 18h6" /><circle cx="19" cy="12" r="1.4" /><circle cx="13" cy="18" r="1.4" /></svg>;
    default:
      return <svg {...common}><path d="M4 19V9M10 19V5M16 19v-6M22 19H2" /></svg>;
  }
}

/**
 * Each lane's own picture, sized to fill its media column.
 *
 * These are real interfaces built in HTML and CSS rather than screenshots: they stay
 * crisp at any width, they cost nothing to download, and they can show the *interface*
 * the lane produces, which is the actual product. Where the work is physical — a shop,
 * a counter, a campaign — a photograph sits behind or beside the interface so the lane
 * has both the thing being used and the thing being built.
 */
function LaneVisual({ lane }: { lane: string }) {
  switch (lane) {
    /* 01 — a website, in a browser, on a desk */
    case 'web':
      return (
        <span className="lv lv-web2">
          <span className="lv-photo"><img src="/img/scene-build.webp" alt="" width={1600} height={1200} loading="lazy" decoding="async" /></span>
          <span className="lv-browser">
            <span className="lv-br-bar"><i /><i /><i /><em>westgate-retail.com</em></span>
            <span className="lv-br-nav"><b>WESTGATE</b><span><i>Shop</i><i>Guides</i><i>Service</i></span><u>Cart 2</u></span>
            <span className="lv-br-hero">
              <span className="lv-br-h">Parts, tools and advice from people who use them.</span>
              <span className="lv-br-cta">Browse the range</span>
            </span>
            <span className="lv-br-grid">
              <span><img src="/img/product-grinder.webp" alt="" width={90} height={90} loading="lazy" decoding="async" /><b>Hand grinder</b><em>$116</em></span>
              <span><img src="/img/product-tray.webp" alt="" width={90} height={90} loading="lazy" decoding="async" /><b>Oak tray</b><em>$168</em></span>
              <span><img src="/img/product-lamp.webp" alt="" width={90} height={90} loading="lazy" decoding="async" /><b>Table lamp</b><em>$296</em></span>
            </span>
          </span>
        </span>
      );

    /* 02 — an app in the hand, at a counter */
    case 'app':
      return (
        <span className="lv lv-app2">
          <span className="lv-photo"><img src="/img/scene-operations.webp" alt="" width={1600} height={1200} loading="lazy" decoding="async" /></span>
          <span className="lv-hands">
            <span className="lv-phone2">
              <span className="lv-ph2-top"><i>9:41</i><em>Tillo</em></span>
              <span className="lv-ph2-k">Today · sample data</span>
              <span className="lv-ph2-big">$2,425</span>
              <span className="lv-ph2-two"><span><b>4</b>open</span><span><b>2</b>low stock</span></span>
              <span className="lv-ph2-row"><b>#1042</b>Amara O.<i>Pack</i></span>
              <span className="lv-ph2-row"><b>#1041</b>Jonas W.<i>Pack</i></span>
              <span className="lv-ph2-nav"><i className="on" /><i /><i /><i /><i /></span>
            </span>
          </span>
        </span>
      );

    /* 03 — a storefront, photographic, with the product page inside it */
    case 'shopify':
      return (
        <span className="lv lv-store">
          <span className="lv-st-photo"><img src="/img/scene-ecommerce.webp" alt="" width={1600} height={1200} loading="lazy" decoding="async" />
            <span className="lv-st-float">
              <span className="lv-st-bar"><span className="lv-word">HALDEN<span>Objects</span></span><span className="lv-cart">Cart · 2</span></span>
              <span className="lv-st-body">
                <span className="lv-st-thumb"><img src="/img/product-tray.webp" alt="" width={120} height={120} loading="lazy" decoding="async" /></span>
                <span className="lv-st-info">
                  <span className="lv-st-name">Oak desk tray</span>
                  <span className="lv-st-price">$168</span>
                  <span className="lv-st-buy">Add to cart — $168</span>
                </span>
              </span>
              <span className="lv-st-more">
                <span><i />Ceramic pour-over<b>$68</b></span>
                <span><i />Hand grinder<b>$116</b></span>
                <span><i />Amber &amp; smoke<b>$52</b></span>
              </span>
            </span>
          </span>
        </span>
      );

    /* 04 — an assistant answering from a document */
    case 'ai':
      return (
        <span className="lv lv-ai">
          <span className="lv-ai-q">What is our refund window for wholesale?</span>
          <span className="lv-ai-a">
            30 days, from the invoice date.
            <span className="lv-ai-src">Source · Terms v4, §2.1</span>
          </span>
          <span className="lv-ai-acts"><i>Approve</i><i>Open document</i></span>
          <span className="lv-ai-doc"><b>Wholesale terms</b><span>§2.1 · Returns</span></span>
        </span>
      );

    /* 05 — an automation chain with its trigger and its outcome */
    case 'automation':
      return (
        <span className="lv lv-flow">
          <span className="lv-fl-trigger"><i />Order paid</span>
          <span className="lv-fl-line" />
          <span className="lv-fl-n">Create task</span>
          <span className="lv-fl-line" />
          <span className="lv-fl-n">Notify team</span>
          <span className="lv-fl-note">3 steps · no copy-paste</span>
        </span>
      );

    /* 06 — a pipeline with real deals and real values */
    case 'crm':
      return (
        <span className="lv lv-pipe">
          {[
            [['New', 6], ['Al Noor Traders', '$12.0k'], ['Brightline Studio', '$4.8k']],
            [['Qualified', 4], ['Westgate Retail', '$16.0k'], ['Orbit Print', '$3.0k']],
            [['Proposal', 3], ['Sunrise Clinic', '$20.5k'], ['Delta Freight', '$7.5k']],
          ].map(([head, ...cards]) => (
            <span className="lv-pl-col" key={String((head as (string | number)[])[0])}>
              <span className="lv-pl-h">{(head as (string | number)[])[0]} <b>{(head as (string | number)[])[1]}</b></span>
              {(cards as string[][]).map(([name, value]) => (
                <span className="lv-pl-c" key={name}><b>{name}</b><em>{value}</em></span>
              ))}
            </span>
          ))}
        </span>
      );

    /* 07 — a campaign: the creative, the audience, the readable numbers */
    default:
      return (
        <span className="lv lv-camp2">
          <span className="lv-cp-art">
            <span className="lv-cp-h">Take the<br />long afternoon.</span>
            <span className="lv-cp-can">Slow<br />tide</span>
          </span>
          <span className="lv-cp-meta">
            <span className="lv-cp-row"><i>Audience</i><b>Retail · tea</b></span>
            <span className="lv-cp-row"><i>Spend</i><b>$3,100</b></span>
            <span className="lv-cp-row"><i>Leads</i><b>248</b></span>
            <span className="lv-cp-row"><i>Cost / lead</i><b className="ac">$12.50</b></span>
            <span className="lv-cp-bars">{[30, 44, 39, 58, 52, 71, 66].map((h, i) => <i key={i} style={{ blockSize: `${h}%` }} />)}</span>
          </span>
        </span>
      );
  }
}
