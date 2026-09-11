import type { BriefFormValues } from '../schemas';
import type { Campaign } from '../types';

/**
 * Extracts and maps campaign brief data into initial form values,
 * defaulting to clean empty structures if no brief exists yet.
 *
 * @param campaign - Optional partial campaign entity.
 * @returns Initialized BriefFormValues object.
 */
export function GetInitialBrief(campaign?: Partial<Campaign> | null): BriefFormValues {
  const brief = campaign?.brief;

  const initialValues: BriefFormValues = {
    purpose: brief?.purpose ?? '',
    keyMessage: brief?.keyMessage ?? '',
    callToAction: brief?.callToAction ?? '',
    impression: brief?.impression ?? '',
    narration: brief?.narration ?? '',
    requiredCaption: brief?.requiredCaption ?? '',
    hashtags: brief?.hashtags ?? [],
    mentionTags: brief?.mentionTags ?? [],
    dos: brief?.dos ?? [],
    donts: brief?.donts ?? [],
    guidelines: brief?.guidelines ?? '',
  };

  return initialValues;
}

/**
 * Pure helper to append a new item to an existing string list and trigger the field onChange callback.
 *
 * @param field - The react-hook-form Controller field object containing value and onChange.
 * @param newItem - The new item string to append.
 */
export function HandleAddItem(field: { value?: string[]; onChange: (...event: unknown[]) => void }, newItem: string) {
  const currentItems = field.value ?? [];

  field.onChange([...currentItems, newItem]);
}

/**
 * Pure helper to remove an item by index from an existing string list and trigger the field onChange callback.
 *
 * @param field - The react-hook-form Controller field object containing value and onChange.
 * @param indexToRemove - The zero-based index of the item to remove.
 */
export function HandleRemoveItem(field: { value?: string[]; onChange: (...event: unknown[]) => void }, indexToRemove: number) {
  const currentItems = field.value ?? [];

  const updatedItems = currentItems.filter((_, index) => index !== indexToRemove);

  field.onChange(updatedItems);
}
