import type { ContentProject } from '@/i18n/content/types';
import { AppUi, AssistantUi, BrowserUi, CampaignUi, CrmUi, KitchenUi, StoreUi } from './Ui';

/**
 * A large, product-specific interface for a project page or a next-project link.
 * These are the same components used in the cards and the process journey, so the brand
 * identity stays identical everywhere it appears.
 */
export function ProjectVisual({ project, compact = false }: { project: ContentProject; compact?: boolean }) {
  switch (project.visual) {
    case 'store':
      return <div className={`pv pv-store ${compact ? 'compact' : ''}`}><div className="ui-frame"><BrowserUi url="haldenobjects.example"><StoreUi compact={compact} /></BrowserUi></div></div>;
    case 'app':
      return <div className={`pv pv-app ${compact ? 'compact' : ''}`}><AppUi compact={compact} /></div>;
    case 'assistant':
      return <div className={`pv pv-assistant ${compact ? 'compact' : ''}`}><div className="ui-frame"><AssistantUi compact={compact} /></div></div>;
    case 'crm':
      return <div className={`pv pv-crm ${compact ? 'compact' : ''}`}><div className="ui-frame"><CrmUi compact={compact} /></div></div>;
    case 'restaurant':
      return <div className={`pv pv-restaurant ${compact ? 'compact' : ''}`}><div className="ui-frame"><KitchenUi compact={compact} /></div></div>;
    case 'campaign':
      return <div className={`pv pv-campaign ${compact ? 'compact' : ''}`}><div className="ui-frame"><CampaignUi compact={compact} /></div></div>;
    default:
      return null;
  }
}
