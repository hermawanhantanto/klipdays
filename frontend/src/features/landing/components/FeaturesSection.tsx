import { motion } from 'framer-motion'
import {
  TrendingUp,
  Users2,
  Wallet,
  Target,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react'
import type { AudienceRole, FeaturePillar } from '../types'

interface FeaturesSectionProps {
  audience: AudienceRole
  features: FeaturePillar[]
}

const ICON_MAP = {
  TrendingUp,
  Users2,
  Wallet,
  Target,
  Sparkles,
  SlidersHorizontal,
}

/**
 * Core value pillars section highlighting main benefits for Creator or Brand.
 * Employs a 3-column grid with subtle gradient borders and smooth hover states.
 *
 * @param props - Component props containing audience mode and feature list.
 * @returns The rendered FeaturesSection component.
 */
export function FeaturesSection({ audience, features }: FeaturesSectionProps) {
  return (
    <section id="features" className="relative scroll-mt-20 py-20 lg:py-28">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 size-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 size-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {audience === 'CREATOR'
              ? 'Maksimalkan Potensi Cuanmu'
              : 'Solusi Paling Efisien untuk Viralitas Produk'}
          </h2>
          <p className="mt-4 text-base text-zinc-400 sm:text-lg">
            {audience === 'CREATOR'
              ? 'Ambil campaign, upload video , dan cairkan cuanmu.'
              : 'Tinggalkan cara lama beriklan yang mahal dan tidak terukur. Gandakan eksposur produk dengan ratusan kreator aktif.'}
          </p>
        </div>

        {/* 3-Column Pillars Grid */}
        <motion.div
          key={`features-${audience}`}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = ICON_MAP[feature.iconName] || TrendingUp

            return (
              <div
                key={feature.id}
                className="relative flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-8 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div>
                  {/* Icon Container with glowing background */}
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/80 shadow-md text-primary">
                    <Icon className="size-7" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-6 font-heading text-xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-primary to-rose-500" />
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

