import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import type { AudienceRole, FinalCtaContent } from '../types'

interface FinalCtaSectionProps {
  audience: AudienceRole
  content: FinalCtaContent
}

/**
 * Final high-converting call to action banner.
 * Uses high-contrast gradient accents and direct register links.
 *
 * @param props - Component props containing audience mode and final CTA data.
 * @returns The rendered FinalCtaSection component.
 */
export function FinalCtaSection({ audience, content }: FinalCtaSectionProps) {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-primary/20 via-rose-500/20 to-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          key={`final-cta-${audience}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 p-8 sm:p-14 text-center backdrop-blur-2xl shadow-2xl"
        >
          {/* Subtle Top Light Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-3/4 bg-gradient-to-r from-transparent via-primary to-transparent" />

          <h2 className="mx-auto max-w-3xl font-heading text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {content.headline}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-300 sm:text-lg">
            {content.subheadline}
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-13 bg-primary px-8 text-base font-bold text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
            >
              <Link to={content.ctaLink} className="flex items-center gap-2">
                <span>{content.ctaText}</span>
                <ArrowRight className="size-5" />
              </Link>
            </Button>

            {content.secondaryText && content.secondaryLink && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-13 border-zinc-700 bg-zinc-900 px-7 text-base font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white"
              >
                {content.secondaryLink.startsWith('#') ? (
                  <a href={content.secondaryLink}>{content.secondaryText}</a>
                ) : (
                  <a
                    href={content.secondaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content.secondaryText}
                  </a>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

