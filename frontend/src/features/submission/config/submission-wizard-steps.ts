import type { SubmissionWizardStepConfig } from '../types';

export const SUBMISSION_WIZARD_STEPS: readonly SubmissionWizardStepConfig[] = [
  {
    stepNumber: 1,
    slug: 'step-1',
    label: 'Brief & Ketentuan',
    description: 'Pahami panduan kreatif, hashtag wajib, dan larangan konten.',
  },
  {
    stepNumber: 2,
    slug: 'step-2',
    label: 'Tautkan Akun',
    description: 'Tautkan akun media sosial yang digunakan untuk memublikasikan video.',
  },
  {
    stepNumber: 3,
    slug: 'step-3',
    label: 'Pilih Video',
    description: 'Pilih video dari galeri akun atau masukkan tautan video secara langsung.',
  },
  {
    stepNumber: 4,
    slug: 'step-4',
    label: 'Pratinjau & Kirim',
    description: 'Periksa kembali video sebelum dikirimkan ke brand untuk ditinjau.',
  },
] as const;

/**
 * Builds the canonical URL path for a specific submission wizard step.
 *
 * @param slug - Step URL slug (e.g. 'step-1', 'step-2').
 * @param campaignId - Target campaign UUID.
 * @returns Absolute frontend route path string.
 */
export function GetSubmissionWizardStepPath(slug: string, campaignId: string): string {
  const path = `/campaigns/${campaignId}/submit/${slug}`;
  return path;
}
