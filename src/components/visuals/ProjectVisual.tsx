import type { ContentProject } from '@/i18n/content/types';
import { AppUi, AssistantUi, BrowserUi, CampaignUi, CrmUi, KitchenUi, StoreUi, defaultUiLabels, type UiLabels } from './Ui';

/**
 * A large, product-specific interface for a project page or a next-project link.
 * These are the same components used in the cards and the process journey, so the brand
 * identity stays identical everywhere it appears.
 */
export function ProjectVisual({ project, compact = false, ui = defaultUiLabels }: { project: ContentProject; compact?: boolean; ui?: UiLabels }) {
  switch (project.visual) {
    case 'store':
      return <div className={`pv pv-store ${compact ? 'compact' : ''}`}><div className="ui-frame"><BrowserUi url="haldenobjects.example"><StoreUi compact={compact} l={ui} /></BrowserUi></div></div>;
    case 'app':
      return <div className={`pv pv-app ${compact ? 'compact' : ''}`}><AppUi compact={compact} l={ui} /></div>;
    case 'assistant':
      return <div className={`pv pv-assistant ${compact ? 'compact' : ''}`}><div className="ui-frame"><AssistantUi compact={compact} l={ui} /></div></div>;
    case 'crm':
      return <div className={`pv pv-crm ${compact ? 'compact' : ''}`}><div className="ui-frame"><CrmUi compact={compact} l={ui} /></div></div>;
    case 'restaurant':
      return <div className={`pv pv-restaurant ${compact ? 'compact' : ''}`}><div className="ui-frame"><KitchenUi compact={compact} l={ui} /></div></div>;
    case 'campaign':
      return <div className={`pv pv-campaign ${compact ? 'compact' : ''}`}><div className="ui-frame"><CampaignUi compact={compact} l={ui} /></div></div>;
    default:
      return null;
  }
}
