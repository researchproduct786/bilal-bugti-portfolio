import { AppUi, AssistantUi, BrowserUi, CrmUi, StoreUi, defaultUiLabels, type UiLabels } from './Ui';
import { Scene } from './Scene';

type Id = 'store' | 'app' | 'web' | 'automation' | 'crm' | 'ai' | 'marketing';

/** English fallbacks; every page passes its own translated captions. */
const defaultCaptions: Record<Id, string> = {
  store: 'A small brand packing an online order — the work the storefront has to make easier.',
  app: 'A shop owner checking the day’s orders on the device already in her hand.',
  web: 'Layout decisions on paper first, then built for phone and desktop.',
  automation: 'The manual step that automation removes: re-typing the same order twice.',
  crm: 'A back office still running on paper — the pipeline replaces the lost note.',
  ai: 'Building an assistant interface that cites the document it answered from.',
  marketing: 'Campaign planning: one message carried across every format.',
};

/**
 * Each service is explained with a photograph of the real-world situation AND the interface
 * that solves it — the pairing the brief asks for. The caption ties them together.
 */
export function ServiceVisual({ id, ui = defaultUiLabels, captions = defaultCaptions }: { id: Id; ui?: UiLabels; captions?: Record<Id, string> }) {
  const scene = id === 'store' ? 'ecommerce' : id === 'app' ? 'delivery' : id === 'web' ? 'design' : id === 'automation' ? 'operations' : id === 'crm' ? 'operations' : id === 'ai' ? 'build' : 'planning';
  const caption = captions[id] ?? '';

  return (
    <div className="duo">
      <Scene
        name={scene as Parameters<typeof Scene>[0]['name']}
        caption={caption}
        ratio="16 / 11"
        priority
      />
      <div className="ui-frame">
        {id === 'store' && <BrowserUi url="haldenobjects.example"><StoreUi l={ui} /></BrowserUi>}
        {id === 'app' && <AppUi l={ui} />}
        {id === 'web' && (
          <div className="ui ui-webmini big">
            <div className="ui-bar"><span className="ui-word">WESTGATE<span>Retail</span></span><span className="ui-cart">{ui.menu}</span></div>
            <div className="ui-body">
              <p className="wm-h">Parts, tools and advice from people who use them.</p>
              <div className="wm-row"><span>{ui.shop}</span><span>{ui.guides}</span><span>{ui.contact}</span></div>
              <div className="wm-cards"><span /><span /><span /></div>
            </div>
          </div>
        )}
        {id === 'automation' && (
          <div className="ui">
            <div className="ui-bar"><span className="ui-word">AUTOMATION<span>Live</span></span><span className="ui-cart">3 runs today</span></div>
            <div className="ui-body">
              <div className="auto-flow"><span className="au-n">Order paid</span><i>→</i><span className="au-n">Create task</span><i>→</i><span className="au-n">Notify WhatsApp</span></div>
              <div className="auto-flow"><span className="au-n">New enquiry</span><i>→</i><span className="au-n">Assign owner</span><i>→</i><span className="au-n">Remind in 2 days</span></div>
              <p className="ui-fine" style={{ marginTop: 10 }}>4 manual steps removed · failures alert the owner</p>
            </div>
          </div>
        )}
        {id === 'crm' && <CrmUi l={ui} />}
        {id === 'ai' && <AssistantUi l={ui} />}
        {id === 'marketing' && (
          <div className="ui ui-webmini big">
            <div className="ui-bar"><span className="ui-word">SLOWTIDE<span>Campaign</span></span><span className="ui-cart">Sample data</span></div>
            <div className="ui-body">
              <p className="wm-h"><em>Take the long afternoon.</em></p>
              <div className="ui-kpis two" style={{ marginTop: 10 }}><div><small>Spend</small><b>$3,100</b></div><div><small>Leads</small><b>248</b></div><div><small>Cost / lead</small><b>$12.50</b></div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

