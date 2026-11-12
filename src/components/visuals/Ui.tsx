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

/* ───────────────────────── Shared chrome ───────────────────────── */

export function StoreUi({ compact = false }: { compact?: boolean }) {
  return (
    <div className="ui ui-store">
      <div className="ui-bar">
        <span className="ui-word">HALDEN<span>Objects</span></span>
        <span className="ui-navmini"><i />All objects<i />Lighting<i />Table</span>
        <span className="ui-cart">Cart · 2</span>
      </div>
      <div className="ui-body">
        <div className="ui-pdp">
          <div className="ui-shot"><span className="ui-obj ui-obj--tray" /></div>
          <div className="ui-pdp-info">
            <p className="ui-eyebrow">Organise</p>
            <p className="ui-h">Oak desk tray</p>
            <p className="ui-price">$84.00 <small>Large · Smoked</small></p>
            <div className="ui-swatches"><i className="on" /><i /><i /></div>
            <div className="ui-btn">Add to cart — $84.00</div>
            <p className="ui-fine">Ships in 2–3 days · 30-day returns</p>
          </div>
        </div>
        {!compact && (
          <div className="ui-cartpanel">
            <p className="ui-eyebrow">Your cart</p>
            <p className="ui-line"><span>1 × Oak desk tray<small>Large · Smoked</small></span><b>$84</b></p>
            <p className="ui-line"><span>2 × Stoneware cup<small>Sand</small></span><b>$44</b></p>
            <p className="ui-line tot"><span>Subtotal</span><b>$128</b></p>
            <div className="ui-btn">Checkout</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AppUi({ compact = false }: { compact?: boolean }) {
  const bars = [38, 62, 45, 80, 56, 92, 70];
  return (
    <div className="phone">
      <div className="phone-notch" aria-hidden="true" />
      <div className="phone-screen">
        <div className="ap-top"><span>9:41</span><span>Tillo</span></div>
        <p className="ap-k">Today · demo data</p>
        <p className="ap-big">₨ 48,500</p>
        <div className="ap-two">
          <div className="warn"><b>4</b>open orders</div>
          <div><b>2</b>low stock</div>
        </div>
        <p className="ap-k">Needs attention</p>
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

export function DashboardUi({ compact = false }: { compact?: boolean }) {
  return (
    <div className="ui ui-dash">
      <div className="ui-bar"><span className="ui-word">TILLO<span>Back office</span></span><span className="ui-cart">Corner Roast</span></div>
      <div className="ui-body col">
        <div className="ui-kpis">
          <div><small>Orders</small><b>124</b><span>+8 today</span></div>
          <div><small>Today’s sales</small><b>₨48,500</b><span>avg ₨1,145</span></div>
          <div><small>Products</small><b>86</b><span>2 low</span></div>
          <div><small>Pending</small><b className="warnc">12</b><span>4 over 2 days</span></div>
        </div>
        {!compact && (
          <div className="ui-split">
            <div className="ui-card">
              <p className="ui-eyebrow">Sales by day</p>
              <div className="ui-chart">{[52, 61, 48, 73, 69, 94, 84].map((h, i) => <span key={i}><i style={{ height: `${h}%` }} /><small>{'MTWTFSS'[i]}</small></span>)}</div>
            </div>
            <div className="ui-card">
              <p className="ui-eyebrow">Latest orders</p>
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

export function AssistantUi({ compact = false }: { compact?: boolean }) {
  return (
    <div className="ui ui-ai">
      <div className="ui-bar"><span className="ui-word">DESKHAND<span>Business assistant</span></span><span className="ui-cart">Northline Supply</span></div>
      <div className="ui-body col">
        <div className="ai-thread">
          <p className="ai-q">What is our return window for online orders?</p>
          <div className="ai-a">
            <p>14 days from delivery for unused items in original packaging. Damaged goods are replaced within 30 days.</p>
            <p className="ai-src"><span>Source</span>Returns policy · p.2, §4</p>
            <div className="ai-acts"><span>Open policy</span><span>Create a task</span></div>
          </div>
          {!compact && (
            <>
              <p className="ai-q">Which orders are late this week?</p>
              <div className="ai-a">
                <p>Three orders are past their promised date. Two are waiting on the same supplier.</p>
                <p className="ai-src"><span>Source</span>Orders sheet · rows 118–120</p>
              </div>
            </>
          )}
        </div>
        <div className="ai-input">Ask about policies, orders or suppliers…<b>→</b></div>
        <p className="ui-fine">Demo: answers are scripted. No model or document is sent anywhere.</p>
      </div>
    </div>
  );
}

export function CrmUi({ compact = false }: { compact?: boolean }) {
  const cols = [
    { t: 'New', n: 6, deals: ['Al Noor Traders · ₨240k', 'Brightline Studio · ₨95k', 'Hana Foods · ₨180k'] },
    { t: 'Qualified', n: 4, deals: ['Westgate Retail · ₨320k', 'Orbit Print · ₨60k'] },
    { t: 'Proposal', n: 3, deals: ['Sunrise Clinic · ₨410k', 'Delta Freight · ₨150k'] },
    { t: 'Won', n: 2, deals: ['Corner Roast · ₨88k'] },
  ];
  return (
    <div className="ui ui-crm">
      <div className="ui-bar"><span className="ui-word">LINEWORK<span>CRM</span></span><span className="ui-cart">Pipeline · Q3</span></div>
      <div className="ui-body col">
        <div className="ui-kpis">
          <div><small>Open pipeline</small><b>₨1.24m</b><span>15 deals</span></div>
          <div><small>Won this month</small><b>₨334k</b><span>6 deals</span></div>
          <div><small>No activity 7d</small><b className="warnc">3</b><span>needs a nudge</span></div>
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
            <span className="crm-node">New lead</span><i>→</i><span className="crm-node">Assign owner</span><i>→</i><span className="crm-node">Remind in 2 days</span><i>→</i><span className="crm-node on">On</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function KitchenUi({ compact = false }: { compact?: boolean }) {
  return (
    <div className="ui ui-kitchen">
      <div className="ui-bar"><span className="ui-word">EMBER<span>&amp; RYE</span></span><span className="ui-cart">Kitchen · 19:24</span></div>
      <div className="ui-body">
        <div className="kt-orders">
          <div className="kt-ticket">
            <p className="kt-h">#218 <span>Table 6</span><em>In kitchen</em></p>
            <p><b>1×</b> Charred leek flatbread</p>
            <p><b>2×</b> Rye sourdough, cultured butter</p>
            <p><b>1×</b> Smoked lamb shoulder</p>
          </div>
          {!compact && (
            <div className="kt-ticket">
              <p className="kt-h">#219 <span>Takeaway</span><em>Queued</em></p>
              <p><b>2×</b> Roast cauliflower</p>
              <p><b>1×</b> Burnt honey pudding</p>
            </div>
          )}
        </div>
        <div className="kt-menu">
          <p className="ui-eyebrow">Menu · availability</p>
          {[['Smoked lamb shoulder', true], ['Charred leek flatbread', true], ['Burnt honey pudding', false]].map(([n, on]) => (
            <p className="kt-row" key={String(n)}><span>{n as string}</span><i className={on ? 'on' : ''}>{on ? 'Available' : 'Sold out'}</i></p>
          ))}
          <p className="ui-fine">Sold out removes the dish from the customer menu instantly.</p>
        </div>
      </div>
    </div>
  );
}

export function CampaignUi({ compact = false }: { compact?: boolean }) {
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
        </div>
        {!compact && (
          <div className="camp-dash">
            <p className="ui-eyebrow">Campaign · sample data</p>
            <div className="ui-kpis two">
              <div><small>Spend</small><b>₨62,000</b></div>
              <div><small>Leads</small><b>248</b></div>
              <div><small>Cost / lead</small><b>₨250</b></div>
            </div>
            <div className="ui-chart small">{[30, 44, 39, 58, 52, 71, 66].map((h, i) => <span key={i}><i style={{ height: `${h}%` }} /><small>{'MTWTFSS'[i]}</small></span>)}</div>
            <p className="ui-fine">Every figure here is invented for the demonstration.</p>
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
export { fmt };
