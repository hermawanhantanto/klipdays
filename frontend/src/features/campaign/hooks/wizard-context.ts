import { useOutletContext } from 'react-router';
import type { CampaignWizardContext } from '../types';

/**
 * Accesses the campaign wizard outlet context provided by CampaignWizardLayout.
 *
 * @returns The active campaign wizard context containing the loaded campaign entity.
 */
export function UseCampaignWizardContext(): CampaignWizardContext {
  const context = useOutletContext<CampaignWizardContext>();
  return context;
}
