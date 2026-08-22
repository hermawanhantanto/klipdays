export type AudienceRole = 'CREATOR' | 'BRAND'

export interface TrustBadge {
  label: string
}

export interface HeroContent {
  headline: string
  headlineHighlight: string
  subheadline: string
  primaryCtaText: string
  primaryCtaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  trustBadges: TrustBadge[]
}

export interface FeaturePillar {
  id: string
  title: string
  description: string
  iconName: 'TrendingUp' | 'Users2' | 'Wallet' | 'Target' | 'Sparkles' | 'SlidersHorizontal'
}

export interface HowItWorksStep {
  step: string
  title: string
  description: string
  iconName: 'Compass' | 'Video' | 'Coins' | 'FileText' | 'Share2' | 'BarChart3'
}

export interface FaqItem {
  question: string
  answer: string
}

export interface CommunityContent {
  tagline: string
  headline: string
  subheadline: string
  ctaText: string
  ctaLink: string
  perks: string[]
}

export interface FinalCtaContent {
  tagline: string
  headline: string
  subheadline: string
  ctaText: string
  ctaLink: string
  secondaryText?: string
  secondaryLink?: string
}

export interface AudienceData {
  hero: HeroContent
  features: FeaturePillar[]
  howItWorks: HowItWorksStep[]
  community: CommunityContent
  faq: FaqItem[]
  finalCta: FinalCtaContent
}
