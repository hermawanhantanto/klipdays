import type { MaterialsFormValues, MaterialTypeOption } from '../schemas';
import type { Campaign } from '../types';

/**
 * Extracts initial active material values from campaign data,
 * falling back to a single empty field group if none exist.
 *
 * @param campaign - Optional partial campaign entity.
 * @returns Array of validated material items for form defaults.
 */
export function GetInitialMaterials(campaign?: Partial<Campaign> | null): MaterialsFormValues['materials'] {
  const activeMaterials = campaign?.materials?.filter((item) => item.status !== 'DELETED') ?? [];

  if (!activeMaterials.length) {
    return [
      {
        name: '',
        type: 'VIDEO',
        url: '',
      },
    ];
  }

  const mapped = activeMaterials.map((item) => ({
    name: item.name,
    type: (item.type as MaterialTypeOption) ?? 'VIDEO',
    url: item.url,
  }));

  return mapped;
}
