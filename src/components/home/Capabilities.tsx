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
 * automation is a chain, a CRM is a pipeline, growth is a rising chart.
 *
 * All seven share the same *system*: the same corner radius, the same label
 * typography, the same rule under the title, the same "where this starts" line. That
 * is what makes them a family without making them clones.
 */

type Lane = {
  key: string;
  n: string;
  accent: string;
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
  const lanes: Lane[] = [
    { key: 'shopify', n: '01', accent: '#7ec8a5', span: 4, title: c.shopify, line: c.shopifyLine, problem: p.capProblemShopify, icon: 'store' },
    { key: 'app', n: '02', accent: '#8fb4ff', span: 2, title: c.app, line: c.appLine, problem: p.capProblemApp, icon: 'device' },
    { key: 'web', n: '03', accent: '#d9c48a', span: 3, title: c.web, line: c.webLine, problem: p.capProblemWeb, icon: 'page' },
    { key: 'ai', n: '04', accent: '#b79cff', span: 3, title: c.ai, line: c.aiLine, problem: p.capProblemAi, icon: 'spark' },
    { key: 'automation', n: '05', accent: '#6fd0e0', span: 2, title: c.automation, line: c.automationLine, problem: p.capProblemAutomation, icon: 'flow' },
    { key: 'crm', n: '06', accent: '#ffab7a', span: 2, title: c.crm, line: c.crmLine, problem: p.capProblemCrm, icon: 'pipe' },
    { key: 'marketing', n: '07', accent: '#f2b3c8', span: 2, title: c.marketing, line: c.marketingLine, problem: p.capProblemMarketing, icon: 'chart' },
  ];

  return (
    <ul className="lanes" data-stagger>
      {lanes.map((l) => (
        <li
          key={l.key}
          className="lane reveal"
          data-lane={l.key}
          data-span={l.span}
          style={{ ['--ac' as string]: l.accent, ['--span' as string]: String(l.span) }}
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
 * Each lane's own picture. These are CSS and HTML rather than images: they stay crisp
 * at any width, they cost nothing to download, and — unlike a photograph — they can
 * show the *interface* the lane produces, which is the actual product.
 */
function LaneVisual({ lane }: { lane: string }) {
  switch (lane) {
    case 'shopify':
      return (
        <span className="lv lv-store">
          <span className="lv-st-bar"><span className="lv-word">HALDEN<span>Objects</span></span><span className="lv-cart">Cart · 2</span></span>
          <span className="lv-st-body">
            <span className="lv-st-photo"><img src="/img/product-tray.webp" alt="" width={420} height={420} loading="lazy" decoding="async" /></span>
            <span className="lv-st-info">
              <span className="lv-st-name">Oak desk tray</span>
              <span className="lv-st-price">$168</span>
              <span className="lv-st-buy">Add to cart</span>
            </span>
          </span>
        </span>
      );
    case 'app':
      return (
        <span className="lv lv-device">
          <span className="lv-ph">
            <span className="lv-ph-top"><span>9:41</span><span>Tillo</span></span>
            <span className="lv-ph-k">Today</span>
            <span className="lv-ph-big">$2,425</span>
            <span className="lv-ph-row"><b>4</b>open</span>
            <span className="lv-ph-row"><b>2</b>low stock</span>
          </span>
        </span>
      );
    case 'web':
      return (
        <span className="lv lv-page">
          <span className="lv-pg-h">Parts, tools and advice<br />from people who use them.</span>
          <span className="lv-pg-grid">
            <span /><span /><span />
          </span>
          <span className="lv-pg-url">westgate-retail.com</span>
        </span>
      );
    case 'ai':
      return (
        <span className="lv lv-ai">
          <span className="lv-ai-q">What is our refund window for wholesale?</span>
          <span className="lv-ai-a">30 days, from the invoice date.<span className="lv-ai-src">Source · Terms v4, §2.1</span></span>
          <span className="lv-ai-ok">Approve</span>
        </span>
      );
    case 'automation':
      return (
        <span className="lv lv-flow">
          <span className="lv-fl-n">Order paid</span>
          <span className="lv-fl-line" />
          <span className="lv-fl-n">Create task</span>
          <span className="lv-fl-line" />
          <span className="lv-fl-n">Notify</span>
          <span className="lv-fl-note">4 manual steps removed</span>
        </span>
      );
    case 'crm':
      return (
        <span className="lv lv-pipe">
          {[['New', 3], ['Qualified', 2], ['Proposal', 2]].map(([label, n]) => (
            <span className="lv-pl-col" key={String(label)}>
              <span className="lv-pl-h">{label} <b>{n}</b></span>
              <span className="lv-pl-c" /><span className="lv-pl-c" />
            </span>
          ))}
        </span>
      );
    default:
      return (
        <span className="lv lv-chart">
          <span className="lv-ch-bars">{[34, 52, 41, 68, 59, 82, 74, 96].map((h, i) => <i key={i} style={{ blockSize: `${h}%` }} />)}</span>
          <span className="lv-ch-foot"><b>$12.50</b> cost per lead</span>
        </span>
      );
  }
}
