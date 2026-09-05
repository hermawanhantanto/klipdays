import { GetWizardStepPath } from '../config/wizard-steps';
import type { Campaign, WizardStepSlug } from '../types';

/**
 * Determines the appropriate wizard step slug for a campaign based on its completion state:
 * - Step 1 (`step-1`): If title is empty.
 * - Step 2 (`step-2`): If materials list is empty.
 * - Step 3 (`step-3`): If brief does not exist (and title + materials exist).
 * - Step 4 (`step-4`): If steps 1, 2, and 3 exist, but reward details (budget, CPM) are not configured.
 * - Step 5 (`step-5`): If all steps 1 to 4 are completed, ready for review or overview.
 *
 * @param campaign - The campaign entity to evaluate.
 * @returns The resolved wizard step slug ('step-1' | 'step-2' | 'step-3' | 'step-4' | 'step-5').
 */
export function ResolveCampaignWizardStepSlug(campaign?: Partial<Campaign> | null): WizardStepSlug {
  if (!campaign || !campaign.title || campaign.title.trim() === '') {
    return 'step-1';
  }

  const activeMaterials = campaign.materials?.filter((material) => material.status !== 'DELETED') ?? [];
  if (activeMaterials.length === 0) {
    return 'step-2';
  }

  if (!campaign.brief) {
    return 'step-3';
  }

  const hasReward = campaign.cpm != null && campaign.budget != null;
  if (!hasReward) {
    return 'step-4';
  }

  return 'step-5';
}

/**
 * Resolves the full URL path for the appropriate wizard step of a campaign.
 *
 * @param campaign - The campaign entity to inspect.
 * @returns The resolved URL path string.
 */
export function ResolveCampaignWizardStepPath(campaign?: Partial<Campaign> | null): string {
  const stepSlug = ResolveCampaignWizardStepSlug(campaign);
  const path = GetWizardStepPath(stepSlug, campaign?.id);
  return path;
}
