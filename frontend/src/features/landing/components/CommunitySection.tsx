import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DiscordIcon } from './DiscordIcon'
import type { AudienceRole, CommunityContent } from '../types'

interface CommunitySectionProps {
  audience: AudienceRole
  content: CommunityContent
}

/**
 * Discord community social proof and early access section.
 * Drives users to join the official Klipday Discord server for tips, campaign leaks, and support.
 *
 * @param props - Component props containing audience mode and community data.
 * @returns The rendered CommunitySection component.
 */
export function CommunitySection({ audience, content }: CommunitySectionProps) {
  return (
    <section id="community" className="relative scroll-mt-20 py-20 lg:py-28 overflow-hidden">
      {/* Background Discord Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-[#5865F2]/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          key={`community-${audience}`}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-8 sm:p-12 lg:p-16 backdrop-blur-xl shadow-2xl shadow-black/80"
        >
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#5865F2_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Copy & Discord CTA */}
            <div className="lg:col-span-7">
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {content.headline}
              </h2>

              <p className="mt-4 text-base text-zinc-300 sm:text-lg">
                {content.subheadline}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold px-7 shadow-lg shadow-[#5865F2]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <a
                    href={content.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <DiscordIcon className="size-5" />
                    <span>{content.ctaText}</span>
                    <ArrowUpRight className="size-4" />
                  </a>
                </Button>

                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <div className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Komunitas aktif & responsive</span>
                </div>
              </div>
            </div>

            {/* Right Column: Key Community Perks */}
            <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <Sparkles className="size-3.5 text-amber-400" />
                <span>Keuntungan Join Discord Klipday</span>
              </div>

              <ul className="mt-4 space-y-3.5">
                {content.perks.map((perk, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

