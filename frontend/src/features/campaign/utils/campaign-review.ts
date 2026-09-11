import type { Campaign, WizardStepSlug } from '../types';
import {
  IsStep1Complete,
  IsStep2Complete,
  IsStep3Complete,
  IsStep4Complete,
} from './wizard-navigation';

export interface MissingStepItem {
  stepNumber: number;
  slug: WizardStepSlug;
  title: string;
  reason: string;
}

export interface CampaignCompletenessResult {
  isComplete: boolean;
  missingSteps: MissingStepItem[];
}

/**
 * Checks whether a campaign has completed all required fields across the 4 wizard steps:
 * - Step 1: title, description, category, platform, mainMediaUrl, and thumbnailUrl
 * - Step 2: at least one active material with valid name, type, and url
 * - Step 3: brief with purpose, keyMessage, and callToAction
 * - Step 4: cpm, budget, minViews, maxViews, and valid dates
 *
 * @param campaign - The campaign entity to inspect.
 * @returns Object with isComplete boolean and list of incomplete steps.
 */
export function ValidateCampaignCompleteness(campaign?: Partial<Campaign> | null): CampaignCompletenessResult {
  const missingSteps: MissingStepItem[] = [];

  if (!campaign) {
    return {
      isComplete: false,
      missingSteps: [
        {
          stepNumber: 1,
          slug: 'step-1',
          title: 'Informasi Dasar',
          reason: 'Data kampanye belum tersedia.',
        },
      ],
    };
  }

  // Check Step 1 (Basic Info)
  if (!IsStep1Complete(campaign)) {
    missingSteps.push({
      stepNumber: 1,
      slug: 'step-1',
      title: 'Informasi Dasar',
      reason: 'Judul, deskripsi, kategori, platform, tautan media utama, atau URL thumbnail belum lengkap.',
    });
  }

  // Check Step 2 (Materials)
  if (!IsStep2Complete(campaign)) {
    missingSteps.push({
      stepNumber: 2,
      slug: 'step-2',
      title: 'Materi & Aset',
      reason: 'Minimal satu materi atau aset kampanye wajib diisi lengkap.',
    });
  }

  // Check Step 3 (Brief)
  if (!IsStep3Complete(campaign)) {
    missingSteps.push({
      stepNumber: 3,
      slug: 'step-3',
      title: 'Brief & Panduan',
      reason: 'Tujuan, pesan utama, atau call-to-action belum diisi.',
    });
  }

  // Check Step 4 (Reward & Budget)
  if (!IsStep4Complete(campaign)) {
    missingSteps.push({
      stepNumber: 4,
      slug: 'step-4',
      title: 'Hadiah & Anggaran',
      reason: 'Tarif CPM, batas tayangan, total anggaran, atau jadwal tanggal kampanye belum valid.',
    });
  }

  const isComplete = missingSteps.length === 0;

  const result: CampaignCompletenessResult = {
    isComplete,
    missingSteps,
  };

  return result;
}

/**
 * Formats a start and end date string into an Indonesian localized date range display.
 *
 * @param startDate - The campaign starting date ISO string.
 * @param endDate - The campaign ending date ISO string.
 * @returns Formatted human-readable date range.
 */
export function FormatDateRange(startDate?: string | null, endDate?: string | null): string {
  if (!startDate || !endDate) return '-';

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';

  const formatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedStart = formatter.format(start);
  const formattedEnd = formatter.format(end);

  const range = `${formattedStart} – ${formattedEnd}`;
  return range;
}
