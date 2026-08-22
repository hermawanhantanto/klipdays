import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/features/landing/components/Navbar'
import { CreatorBrand } from '@/features/landing/components/HomeCreator'
import { HomeBrand } from '@/features/landing/components/HomeBrand'
import { Footer } from '@/features/landing/components/Footer'
import type { AudienceRole } from '@/features/landing/types'

/**
 * Main Landing HomePage orchestrator component.
 * Manages the active audience state (default: 'CREATOR'), coordinates the navbar,
 * and renders either CreatorBrand (HomeCreator) or HomeBrand view with smooth transitions.
 *
 * @returns The rendered HomePage component.
 */
function HomePage() {
  const [audience, setAudience] = useState<AudienceRole>('CREATOR')

  return (
    <div className="dark min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-primary selection:text-white">
      {/* Sticky Navigation Bar with Audience Switcher */}
      <Navbar audience={audience} onAudienceChange={setAudience} />

      {/* Main Landing View Orchestration */}
      <main>
        <AnimatePresence mode="wait">
          {audience === 'CREATOR' ? (
            <motion.div
              key="creator-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <CreatorBrand />
            </motion.div>
          ) : (
            <motion.div
              key="brand-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <HomeBrand />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Shared Landing Page Footer */}
      <Footer />
    </div>
  )
}

export default HomePage
