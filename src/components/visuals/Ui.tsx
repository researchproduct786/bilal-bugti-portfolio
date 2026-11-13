/**
 * Interface mockups.
 *
 * These are real markup — not AI-generated screenshots — so every number, label and status
 * is internally consistent and stays crisp at any size. All data is fictional sample data for
 * the concept projects and is labelled as such wherever it appears.
 *
 * Brand identity is kept consistent per product (wordmark, colour, layout) so the six demos
 * read as six products rather than six random pictures.
 */

const fmt = (n: number) => n.toLocaleString('en-US');

/**
 * Labels for the mock interfaces.
 *
 * The interfaces are illustrations of a *product*, so the product's own vocabulary (a
 * wordmark, a status value, a product name) stays in English — that is what the fictional
 * brand would ship. But an Arabic visitor should still be able to read what the screen is
 * showing, so the surrounding business language is translated through this map.
 */
export interface UiLabels {
  cart: string; checkout: string; subtotal: string; addToCart: string; allObjects: string;
  today: string; orders: string; todaysSales: string; products: string; pending: string;
  latestOrders: string; salesByDay: string; needsAttention: string; backOffice: string;
  assistant: string; askPlaceholder: string; openPolicy: string; source: string; createTask: string;
  pipeline: string; openPipeline: string; leads: string; newLead: string; noActivity: string; remind: string;
  menuAvailability: string; inKitchen: string; queued: string; table: string; takeaway: string;
  spend: string; costPerLead: string; campaign: string;
  ships: string; scriptedAnswers: string; kitchenMode: string; available: string; soldOut: string;
  soldOutNote: string; inventedFigures: string; menu: string; items: string; shop: string;
  guides: string; contact: string; automationLive: string; runsToday: string;
  pipelineQuarter: string; offer: string; sampleData: string; yourCart: string; demoData: string;
}

export const defaultUiLabels: UiLabels = {
  cart: 'Cart', checkout: 'Checkout', subtotal: 'Subtotal', addToCart: 'Add to cart',
  allObjects: 'All objects', today: 'Today', orders: 'Orders', todaysSales: 'Today’s sales',
  products: 'Products', pending: 'Pending', latestOrders: 'Latest orders', salesByDay: 'Sales by day',
  needsAttention: 'Needs attention', backOffice: 'Back office', assistant: 'Business assistant',
  askPlaceholder: 'Ask about policies, orders or suppliers…', openPolicy: 'Open policy',
  source: 'Source', createTask: 'Create a task', pipeline: 'Pipeline', openPipeline: 'Open pipeline',
  leads: 'Leads', newLead: 'New lead', noActivity: 'No activity 7d', remind: 'Remind in 2 days',
  menuAvailability: 'Menu · availability', inKitchen: 'In kitchen', queued: 'Queued', table: 'Table',
  takeaway: 'Takeaway', spend: 'Spend', costPerLead: 'Cost / lead', campaign: 'Campaign',
  ships: 'Ships in 2–3 days · 30-day returns',
  scriptedAnswers: 'Demo: answers are scripted. No model or document is sent anywhere.',
  kitchenMode: 'Kitchen', available: 'Available', soldOut: 'Sold out',
  soldOutNote: 'Sold out removes the dish from the customer menu instantly.',
  inventedFigures: 'Every figure here is invented for the demonstration.',
  menu: 'Menu', items: 'items', shop: 'Shop', guides: 'Guides', contact: 'Contact',
  automationLive: 'Live', runsToday: '3 runs today', pipelineQuarter: 'Pipeline · Q3',
  offer: 'Offer', sampleData: 'sample data', yourCart: 'Your cart', demoData: 'demo data',
};

/* ───────────────────────── Shared chrome ───────────────────────── */

export function StoreUi({ compact = false, l = defaultUiLabels }: { compact?: boolean; l?: UiLabels }) {
  return (
    <div className="ui ui-store">
      <div className="ui-bar">
        <span className="ui-word">HALDEN<span>Objects</span></span>
        <span className="ui-navmini"><i />{l.allObjects}<i />Lighting<i />Table</span>
        <span className="ui-cart">{l.cart} · 2</span>
      </div>
      <div className="ui-body">
        <div className="ui-pdp">
          <div className="ui-shot">
            <img src="/img/product-tray.webp" alt="" width={420} height={420} loading="lazy" decoding="async" />
          </div>
          <div className="ui-pdp-info">
            <p className="ui-eyebrow">Organise</p>
            <p className="ui-h">Oak desk tray</p>
            <p className="ui-price">₨3,360 <small>Large · Smoked</small></p>
            <div className="ui-swatches"><i className="on" /><i /><i /></div>
            <div className="ui-btn">{l.addToCart} — ₨3,360</div>
            <p className="ui-fine">{l.ships}</p>
          </div>
        </div>
        {!compact && (
          <div className="ui-grid3" aria-hidden="true">
            {[
              ['product-dripper', 'Ceramic pour-over', '₨1,360'],
              ['product-grinder', 'Hand grinder', '₨2,320'],
              ['product-candle', 'Amber & smoke', '₨1,040'],
            ].map(([src, name, price]) => (
              <span className="ui-tile" key={src}>
                <img src={`/img/${src}.webp`} alt="" width={420} height={420} loading="lazy" decoding="async" />
                <span className="ui-tile-meta"><span>{name}</span><b>{price}</b></span>
              </span>
            ))}
          </div>
        )}
        {!compact && (
          <div className="ui-cartpanel">
            <p className="ui-eyebrow">{l.yourCart}</p>
            <p className="ui-line"><span>1 × Oak desk tray<small>Large · Smoked</small></span><b>₨3,360</b></p>
            <p className="ui-line"><span>2 × Stoneware cup<small>Sand</small></span><b>₨1,760</b></p>
            <p className="ui-line tot"><span>{l.subtotal}</span><b>₨5,120</b></p>
            <div className="ui-btn">{l.checkout}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AppUi({ compact = false, l = defaultUiLabels }: { compact?: boolean; l?: UiLabels }) {
  const bars = [38, 62, 45, 80, 56, 92, 70];
  return (
    <div className="phone">
      <div className="phone-notch" aria-hidden="true" />
      <div className="phone-screen">
        <div className="ap-top"><span>9:41</span><span>Tillo</span></div>
        <p className="ap-k">{l.today} · {l.demoData}</p>
        <p className="ap-big">₨ 48,500</p>
        <div className="ap-two">
          <div className="warn"><b>4</b>open orders</div>
          <div><b>2</b>low stock</div>
        </div>
        <p className="ap-k">{l.needsAttention}</p>
        <div className="ap-row"><span><b>#1042</b> Amara O.</span><em>Pack</em></div>
        <div className="ap-row"><span><b>#1041</b> Jonas W.</span><em>Pack</em></div>
        {!compact && (
          <>
            <p className="ap-k">This week</p>
            <div className="ap-bars">{bars.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
          </>
        )}
        <nav className="ap-nav" aria-hidden="true"><i className="on">◧</i><i>☰</i><i>◎</i><i>▦</i><i>◢</i></nav>
      </div>
    </div>
  );
}

export function DashboardUi({ compact = false, l = defaultUiLabels }: { compact?: boolean; l?: UiLabels }) {
  return (
    <div className="ui ui-dash">
      <div className="ui-bar"><span className="ui-word">TILLO<span>{l.backOffice}</span></span><span className="ui-cart">Corner Roast</span></div>
      <div className="ui-body col">
        <div className="ui-kpis">
          <div><small>{l.orders}</small><b>124</b><span>+8 today</span></div>
          <div><small>{l.todaysSales}</small><b>₨48,500</b><span>avg ₨1,145</span></div>
          <div><small>{l.products}</small><b>86</b><span>2 low</span></div>
          <div><small>{l.pending}</small><b className="warnc">12</b><span>4 over 2 days</span></div>
        </div>
        {!compact && (
          <div className="ui-split">
            <div className="ui-card">
              <p className="ui-eyebrow">{l.salesByDay}</p>
              <div className="ui-chart">{[52, 61, 48, 73, 69, 94, 84].map((h, i) => <span key={i}><i style={{ height: `${h}%` }} /><small>{'MTWTFSS'[i]}</small></span>)}</div>
            </div>
            <div className="ui-card">
              <p className="ui-eyebrow">{l.latestOrders}</p>
              <table className="ui-table">
                <tbody>
                  <tr><td>#1042</td><td>Ceramic pour-over</td><td><span className="st new">New</span></td><td>₨3,400</td></tr>
                  <tr><td>#1041</td><td>House blend 250 g</td><td><span className="st pack">Packed</span></td><td>₨1,400</td></tr>
                  <tr><td>#1040</td><td>Hand grinder</td><td><span className="st ship">Shipped</span></td><td>₨5,800</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AssistantUi({ compact = false, l = defaultUiLabels }: { compact?: boolean; l?: UiLabels }) {
  return (
    <div className="ui ui-ai">
      <div className="ui-bar"><span className="ui-word">DESKHAND<span>{l.assistant}</span></span><span className="ui-cart">Northline Supply</span></div>
      <div className="ui-body col">
        <div className="ai-thread">
          <p className="ai-q">What is our return window for online orders?</p>
          <div className="ai-a">
            <p>14 days from delivery for unused items in original packaging. Damaged goods are replaced within 30 days.</p>
            <p className="ai-src"><span>{l.source}</span>Returns policy · p.2, §4</p>
            <div className="ai-acts"><span>{l.openPolicy}</span><span>{l.createTask}</span></div>
          </div>
          {!compact && (
            <>
              <p className="ai-q">Which orders are late this week?</p>
              <div className="ai-a">
                <p>Three orders are past their promised date. Two are waiting on the same supplier.</p>
                <p className="ai-src"><span>{l.source}</span>Orders sheet · rows 118–120</p>
              </div>
            </>
          )}
        </div>
        <div className="ai-input">{l.askPlaceholder}<b>→</b></div>
        <p className="ui-fine">{l.scriptedAnswers}</p>
      </div>
    </div>
  );
}

export function CrmUi({ compact = false, l = defaultUiLabels }: { compact?: boolean; l?: UiLabels }) {
  const cols = [
    { t: 'New', n: 6, deals: ['Al Noor Traders · ₨240k', 'Brightline Studio · ₨95k', 'Hana Foods · ₨180k'] },
    { t: 'Qualified', n: 4, deals: ['Westgate Retail · ₨320k', 'Orbit Print · ₨60k'] },
    { t: 'Proposal', n: 3, deals: ['Sunrise Clinic · ₨410k', 'Delta Freight · ₨150k'] },
    { t: 'Won', n: 2, deals: ['Corner Roast · ₨88k'] },
  ];
  return (
    <div className="ui ui-crm">
      <div className="ui-bar"><span className="ui-word">LINEWORK<span>CRM</span></span><span className="ui-cart">{l.pipelineQuarter}</span></div>
      <div className="ui-body col">
        <div className="ui-kpis">
          <div><small>{l.openPipeline}</small><b>₨1.24m</b><span>15 deals</span></div>
          <div><small>Won this month</small><b>₨334k</b><span>6 deals</span></div>
          <div><small>{l.noActivity}</small><b className="warnc">3</b><span>needs a nudge</span></div>
        </div>
        <div className="crm-board">
          {cols.map((c) => (
            <div key={c.t} className="crm-col">
              <p className="crm-h">{c.t}<b>{c.n}</b></p>
              {c.deals.slice(0, compact ? 2 : 3).map((d) => (
                <div key={d} className={`crm-card ${c.t === 'Won' ? 'won' : ''}`}>{d}</div>
              ))}
            </div>
          ))}
        </div>
        {!compact && (
          <div className="crm-flow">
            <span className="crm-node">{l.newLead}</span><i>→</i><span className="crm-node">Assign owner</span><i>→</i><span className="crm-node">{l.remind}</span><i>→</i><span className="crm-node on">On</span>
          </div>
        )}
      </div>
    </div>
  );
}

/** The follow-up automation strip that sits inside the CRM. Exported separately so a
 *  project card can show the pipeline and the automation as one product. */
export function FlowStrip({ l = defaultUiLabels }: { l?: UiLabels }) {
  return (
    <div className="ui ui-flowstrip">
      <p className="ui-eyebrow">{l.automationLive}</p>
      <div className="crm-flow">
        <span className="crm-node">{l.newLead}</span><i>→</i><span className="crm-node">Assign owner</span><i>→</i>
        <span className="crm-node">{l.remind}</span><i>→</i><span className="crm-node on">On</span>
      </div>
    </div>
  );
}

export function KitchenUi({ compact = false, l = defaultUiLabels }: { compact?: boolean; l?: UiLabels }) {
  return (
    <div className="ui ui-kitchen">
      <div className="ui-bar"><span className="ui-word">EMBER<span>&amp; RYE</span></span><span className="ui-cart">{l.kitchenMode} · 19:24</span></div>
      <div className="ui-body">
        <div className="kt-orders">
          <div className="kt-ticket">
            <p className="kt-h">#218 <span>Table 6</span><em>{l.inKitchen}</em></p>
            <p><b>1×</b> Charred leek flatbread</p>
            <p><b>2×</b> Rye sourdough, cultured butter</p>
            <p><b>1×</b> Smoked lamb shoulder</p>
            <p className="kt-foot"><span>18:42</span><span>₨ 4,180</span></p>
          </div>
          <div className="kt-ticket kt-ticket--next">
            <p className="kt-h">#217 <span>Table 2</span><em className="ok">{l.queued}</em></p>
            <p><b>2×</b> Roast cauliflower, tahini</p>
            <p><b>1×</b> Burnt honey pudding</p>
            <p className="kt-foot"><span>18:31</span><span>₨ 2,940</span></p>
          </div>
          {!compact && (
            <div className="kt-ticket">
              <p className="kt-h">#219 <span>Takeaway</span><em>{l.queued}</em></p>
              <p><b>2×</b> Roast cauliflower</p>
              <p><b>1×</b> Burnt honey pudding</p>
            </div>
          )}
        </div>
        <div className="kt-menu">
          <p className="ui-eyebrow">{l.menuAvailability}</p>
          {[['Smoked lamb shoulder', true], ['Charred leek flatbread', true], ['Burnt honey pudding', false]].map(([n, on]) => (
            <p className="kt-row" key={String(n)}><span>{n as string}</span><i className={on ? 'on' : ''}>{on ? l.available : l.soldOut}</i></p>
          ))}
          <p className="ui-fine">{l.soldOutNote}</p>
        </div>
      </div>
    </div>
  );
}

export function CampaignUi({ compact = false, l = defaultUiLabels }: { compact?: boolean; l?: UiLabels }) {
  return (
    <div className="ui ui-camp">
      <div className="ui-body camp-body">
        <div className="camp-left">
          <p className="camp-line">Take the<br />long afternoon.</p>
          <p className="camp-sub">Slowtide · cold-brew tea</p>
          <div className="camp-ads">
            <div className="camp-ad a1">Take the long<br />afternoon.</div>
            <div className="camp-ad a2"><span className="camp-can">Slow<br />tide</span></div>
          </div>
          {/* Only the compact card needs this result strip; the full panel already
              shows the same figures in its dashboard column. */}
          {compact && (
            <div className="camp-metrics">
              <span><small>{l.spend}</small><b>₨62,000</b></span>
              <span><small>{l.leads}</small><b>248</b></span>
              <span><small>{l.costPerLead}</small><b>₨250</b></span>
            </div>
          )}
        </div>
        {!compact && (
          <div className="camp-dash">
            <p className="ui-eyebrow">{l.campaign} · {l.sampleData}</p>
            <div className="ui-kpis two">
              <div><small>{l.spend}</small><b>₨62,000</b></div>
              <div><small>{l.leads}</small><b>248</b></div>
              <div><small>{l.costPerLead}</small><b>₨250</b></div>
            </div>
            <div className="ui-chart small">{[30, 44, 39, 58, 52, 71, 66].map((h, i) => <span key={i}><i style={{ height: `${h}%` }} /><small>{'MTWTFSS'[i]}</small></span>)}</div>
            <p className="ui-fine">{l.inventedFigures}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function BrowserUi({ children, url = 'haldenstore.example' }: { children: React.ReactNode; url?: string }) {
  return (
    <div className="browser">
      <div className="browser-bar"><span className="dots" aria-hidden="true"><i /><i /><i /></span><span className="browser-url">{url}</span></div>
      <div className="browser-body">{children}</div>
    </div>
  );
}

export const uiFor = { store: StoreUi, app: AppUi, assistant: AssistantUi, crm: CrmUi, restaurant: KitchenUi, campaign: CampaignUi } as const;

export type UiKind = keyof typeof uiFor;
export { fmt };
