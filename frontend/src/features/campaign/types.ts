export interface ApiResponse<T> {
  status: string;
  data: T;
  message: string;
}

export interface InitializeCampaignResponse {
  id: string;
}

export interface WizardStepItem {
  id: string;
  slug: string;
  stepNumber: number;
  title: string;
  description: string;
}
