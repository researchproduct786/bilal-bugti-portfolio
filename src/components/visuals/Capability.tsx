import { AppUi, AssistantUi, CampaignUi, CrmUi, DashboardUi, KitchenUi, StoreUi, BrowserUi, defaultUiLabels, type UiLabels } from './Ui';

/**
 * A small, real interface preview for each capability.
 * The point is that a business owner can see the thing, not read about it.
 */
export function CapabilityVisual({ id, todayLabel = 'Today', ui = defaultUiLabels }: { id: string; todayLabel?: string; ui?: UiLabels }) {
  switch (id) {
    case 'shopify':
      return <div className="ui-frame"><BrowserUi url="haldenstore.example"><StoreUi compact l={ui} /></BrowserUi></div>;
    case 'app':
      return <div className="phone scale-sm"><div className="phone-notch" /><div className="phone-screen"><div className="ap-top"><span>9:41</span><span>Tillo</span></div><p className="ap-k">{todayLabel}</p><p className="ap-big">₨ 48,500</p><div className="ap-two"><div className="warn"><b>4</b>open orders</div><div><b>2</b>low stock</div></div><div className="ap-row"><span><b>#1042</b> Amara O.</span><em>Pack</em></div><div className="ap-row"><span><b>#1041</b> Jonas W.</span><em>Pack</em></div><nav className="ap-nav" aria-hidden="true"><i className="on">◧</i><i>☰</i><i>◎</i><i>▦</i><i>◢</i></nav></div></div>;
    case 'web':
      return <div className="ui-frame"><BrowserUi url="westgate-retail.example"><div className="ui ui-webmini"><div className="ui-word">WESTGATE<span>Retail</span></div><p className="wm-h">Parts, tools and advice<br />from people who use them.</p><div className="wm-row"><span>{ui.shop}</span><span>{ui.guides}</span><span>{ui.contact}</span></div></div></BrowserUi></div>;
    case 'automation':
      return (
        <div className="ui ui-auto">
          <div className="ui-bar"><span className="ui-word">AUTOMATION<span>{ui.automationLive}</span></span><span className="ui-cart">{ui.runsToday}</span></div>
          <div className="ui-body">
            <div className="auto-flow">
              <span className="au-n">Order paid</span><i>→</i><span className="au-n">Create task</span><i>→</i><span className="au-n">Notify WhatsApp</span>
            </div>
            <p className="ui-fine" style={{ marginTop: 8 }}>Manual steps removed: 4 · Failures alert the owner</p>
          </div>
        </div>
      );
    case 'crm':
      return <div className="ui-frame"><CrmUi compact l={ui} /></div>;
    case 'ai':
      return <div className="ui-frame"><AssistantUi compact l={ui} /></div>;
    case 'marketing':
      return <div className="ui-frame"><CampaignUi compact l={ui} /></div>;
    case 'branding':
      return (
        <div className="ui ui-brand">
          <div className="br-mark">Ember<br />&amp; Rye</div>
          <div className="br-row"><i style={{ background: '#ff9d6b' }} /><i style={{ background: '#d9b382' }} /><i style={{ background: '#efece6' }} /><i style={{ background: '#232221' }} /></div>
          <p className="ui-fine">Wordmark · palette · menu card · signage</p>
        </div>
      );
    default:
      return <div className="ui-frame"><DashboardUi compact /></div>;
  }
}

export { KitchenUi, StoreUi, AppUi, AssistantUi, CrmUi, CampaignUi, DashboardUi };
