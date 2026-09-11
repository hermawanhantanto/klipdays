import type { BriefFormValues } from '../schemas';
import type { Campaign } from '../types';

export const DEFAULT_EMPTY_BRIEF: BriefFormValues = {
  purpose: '',
  keyMessage: '',
  callToAction: '',
  impression: '',
  narration: '',
  requiredCaption: '',
  hashtags: [],
  mentionTags: [],
  dos: [],
  donts: [],
  guidelines: '',
};

/**
 * Extracts and maps campaign brief data into initial form values,
 * defaulting to clean empty structures if no brief exists yet.
 *
 * @param campaign - Optional partial campaign entity.
 * @returns Initialized BriefFormValues object.
 */
export function GetInitialBrief(campaign?: Partial<Campaign> | null): BriefFormValues {
  const brief = campaign?.brief;

  if (!brief) {
    return { ...DEFAULT_EMPTY_BRIEF };
  }

  const initialValues: BriefFormValues = {
    purpose: brief.purpose ?? '',
    keyMessage: brief.keyMessage ?? '',
    callToAction: brief.callToAction ?? '',
    impression: brief.impression ?? '',
    narration: brief.narration ?? '',
    requiredCaption: brief.requiredCaption ?? '',
    hashtags: brief.hashtags ?? [],
    mentionTags: brief.mentionTags ?? [],
    dos: brief.dos ?? [],
    donts: brief.donts ?? [],
    guidelines: brief.guidelines ?? '',
  };

  return initialValues;
}
