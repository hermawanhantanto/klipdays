import { motion } from 'framer-motion'
import {
  Compass,
  Video,
  Coins,
  FileText,
  Share2,
  BarChart3,
} from 'lucide-react'
import type { AudienceRole, HowItWorksStep } from '../types'

interface HowItWorksSectionProps {
  audience: AudienceRole
  steps: HowItWorksStep[]
}

const ICON_MAP = {
  Compass,
  Video,
  Coins,
  FileText,
  Share2,
  BarChart3,
}

/**
 * Vertical timeline workflow section with center vertical line.
 * Features alternating scroll animations where cards slide in from the left and right on scroll.
 *
 * @param props - Component props containing audience mode and step sequence.
 * @returns The rendered HowItWorksSection component.
 */
export function HowItWorksSection({ audience, steps }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="relative scroll-mt-20 py-20 lg:py-28 bg-zinc-950/70 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {audience === 'CREATOR'
              ? 'Mulai Hasilkan Cuan dalam 3 Langkah'
              : 'Jalankan Campaign Viral dalam 3 Langkah'}
          </h2>
          <p className="mt-4 text-base text-zinc-400 sm:text-lg">
            {audience === 'CREATOR'
              ? 'Proses onboarding instan tanpa birokrasi berbelit. Siapapun bisa mulai dapetin cuan.'
              : 'Dari brief sederhana hingga ratusan konten terpublikasi. Platform kami menangani alur kerja tanpa hambatan.'}
          </p>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          {/* Desktop Center Line */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-1/2 top-6 bottom-6 -translate-x-1/2 w-0.5 bg-gradient-to-b from-primary via-rose-500 to-primary/20"
          />

          {/* Mobile Left Line */}
          <div
            aria-hidden="true"
            className="block md:hidden absolute left-6 top-6 bottom-6 -translate-x-1/2 w-0.5 bg-gradient-to-b from-primary via-rose-500 to-primary/20"
          />

          {/* Timeline Steps List */}
          <div className="space-y-12 md:space-y-16">
            {steps.map((stepItem, index) => {
              const Icon = ICON_MAP[stepItem.iconName] || Compass
              const isEven = index % 2 === 0 // Even index: Left on desktop, Odd: Right on desktop

              return (
                <div
                  key={`${audience}-${stepItem.step}`}
                  className="relative flex flex-col md:flex-row items-center justify-between"
                >
                  {/* Left Side Content (Desktop: active when isEven, empty spacer when !isEven) */}
                  <div className="hidden md:flex w-full md:w-[calc(50%-2.5rem)] justify-end">
                    {isEven ? (
                      <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 p-7 backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-xl hover:shadow-primary/5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-2xl font-black text-primary/90">
                            STEP {stepItem.step}
                          </span>
                          <div className="flex size-11 items-center justify-center rounded-xl bg-zinc-800 text-primary border border-zinc-700">
                            <Icon className="size-5" />
                          </div>
                        </div>

                        <h3 className="mt-4 font-heading text-xl font-bold text-white">
                          {stepItem.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                          {stepItem.description}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="w-full" />
                    )}
                  </div>

                  {/* Center Node Indicator */}
                  <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-zinc-950 font-heading text-base font-black text-white shadow-lg shadow-primary/30 my-4 md:my-0">
                    <span className="bg-gradient-to-br from-white to-zinc-300 bg-clip-text text-transparent">
                      {stepItem.step}
                    </span>
                  </div>

                  {/* Right Side Content (Desktop: active when !isEven, empty spacer when isEven) */}
                  <div className="hidden md:flex w-full md:w-[calc(50%-2.5rem)] justify-start">
                    {!isEven ? (
                      <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 p-7 backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-xl hover:shadow-primary/5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-2xl font-black text-primary/90">
                            STEP {stepItem.step}
                          </span>
                          <div className="flex size-11 items-center justify-center rounded-xl bg-zinc-800 text-primary border border-zinc-700">
                            <Icon className="size-5" />
                          </div>
                        </div>

                        <h3 className="mt-4 font-heading text-xl font-bold text-white">
                          {stepItem.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                          {stepItem.description}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="w-full" />
                    )}
                  </div>

                  {/* Mobile Layout Card (Displays on small screens with slide-up/fade animation) */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="block md:hidden w-full pl-12 pr-2"
                  >
                    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-lg font-black text-primary/90">
                          STEP {stepItem.step}
                        </span>
                        <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-800 text-primary border border-zinc-700">
                          <Icon className="size-5" />
                        </div>
                      </div>

                      <h3 className="mt-3 font-heading text-lg font-bold text-white">
                        {stepItem.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        {stepItem.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
