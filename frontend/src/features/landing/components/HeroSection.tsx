import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { DiscordIcon } from './DiscordIcon'
import type { AudienceData, AudienceRole } from '../types'

interface HeroSectionProps {
  audience: AudienceRole
  content: AudienceData['hero']
}

/**
 * Hero section for Klipday landing page.
 * Features a modern, focused, centered layout with dynamic headline, subheadline, dual action buttons,
 * and trust indicators.
 *
 * @param props - HeroSection props with audience role and content data.
 * @returns The rendered HeroSection component.
 */
export function HeroSection({ audience, content }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-28 md:pb-32 lg:pt-36 lg:pb-40">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_at_top,oklch(0.514_0.222_16.935/0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-40 right-10 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-48 left-10 size-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
          {/* Centered Copy & Actions */}
          <motion.div
            key={`hero-text-${audience}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col items-center w-full"
          >
            {/* Main Headline */}
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08] max-w-3xl">
              <span>{content.headline} </span>
              <span className="bg-gradient-to-r from-primary via-rose-500 to-amber-400 bg-clip-text text-transparent">
                {content.headlineHighlight}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-2xl text-base text-zinc-300 sm:text-lg lg:text-xl sm:leading-relaxed">
              {content.subheadline}
            </p>

            {/* Call to Actions */}
            <div className="mt-10 flex w-full flex-col sm:flex-row items-center justify-center gap-4 max-w-md">
              <Button
                asChild
                size="lg"
                className="h-13 w-full sm:w-auto bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link to={content.primaryCtaLink} className="flex items-center justify-center gap-2">
                  <span>{content.primaryCtaText}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-13 w-full sm:w-auto border-zinc-700 bg-zinc-900/80 px-7 text-base font-medium text-zinc-200 backdrop-blur-md transition-all hover:bg-zinc-800 hover:text-white"
              >
                <a
                  href={content.secondaryCtaLink}
                  target={content.secondaryCtaLink.startsWith('http') ? '_blank' : undefined}
                  rel={content.secondaryCtaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-center gap-2"
                >
                  <DiscordIcon className="size-4.5 text-[#5865F2]" />
                  <span>{content.secondaryCtaText}</span>
                </a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-zinc-400">
              {content.trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
