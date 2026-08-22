import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { HowItWorksSection } from './HowItWorksSection'
import { CommunitySection } from './CommunitySection'
import { FaqSection } from './FaqSection'
import { FinalCtaSection } from './FinalCtaSection'
import { LANDING_CONTENT } from '../data/landing-content'

/**
 * Composed landing page content view for Creators.
 * Renders all sections tailored specifically for video creators seeking monetization.
 *
 * @returns The rendered HomeCreator component.
 */
export function HomeCreator() {
  const content = LANDING_CONTENT.CREATOR

  return (
    <div className="flex flex-col">
      <HeroSection audience="CREATOR" content={content.hero} />
      <FeaturesSection audience="CREATOR" features={content.features} />
      <HowItWorksSection audience="CREATOR" steps={content.howItWorks} />
      <CommunitySection audience="CREATOR" content={content.community} />
      <FaqSection audience="CREATOR" faqs={content.faq} />
      <FinalCtaSection audience="CREATOR" content={content.finalCta} />
    </div>
  )
}

// Alias to satisfy CreatorBrand component naming
export const CreatorBrand = HomeCreator
