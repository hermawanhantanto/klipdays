import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { HowItWorksSection } from './HowItWorksSection'
import { CommunitySection } from './CommunitySection'
import { FaqSection } from './FaqSection'
import { FinalCtaSection } from './FinalCtaSection'
import { LANDING_CONTENT } from '../data/landing-content'

/**
 * Composed landing page content view for Brands / UMKM product owners.
 * Renders all sections tailored specifically for marketing managers and business owners.
 *
 * @returns The rendered HomeBrand component.
 */
export function HomeBrand() {
  const content = LANDING_CONTENT.BRAND

  return (
    <div className="flex flex-col">
      <HeroSection audience="BRAND" content={content.hero} />
      <FeaturesSection audience="BRAND" features={content.features} />
      <HowItWorksSection audience="BRAND" steps={content.howItWorks} />
      <CommunitySection audience="BRAND" content={content.community} />
      <FaqSection audience="BRAND" faqs={content.faq} />
      <FinalCtaSection audience="BRAND" content={content.finalCta} />
    </div>
  )
}
