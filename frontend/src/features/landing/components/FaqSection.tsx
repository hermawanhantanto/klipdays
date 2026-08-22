import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { AudienceRole, FaqItem } from '../types'

interface FaqSectionProps {
  audience: AudienceRole
  faqs: FaqItem[]
}

/**
 * FAQ accordion section using shadcn Accordion component.
 * Displays expandable questions and answers tailored to Creator or Brand persona.
 *
 * @param props - Component props containing audience mode and FAQ array.
 * @returns The rendered FaqSection component.
 */
export function FaqSection({ audience, faqs }: FaqSectionProps) {
  return (
    <section id="faq" className="relative scroll-mt-20 py-20 bg-zinc-950/80">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            {audience === 'CREATOR'
              ? 'Segala hal yang perlu kamu ketahui seputar sistem CPM, submission link, dan pencairan dana.'
              : 'Informasi lengkap mengenai pengelolaan campaign, proteksi rekber, dan monitoring views.'}
          </p>
        </div>

        {/* Accordion Component */}
        <motion.div
          key={`faq-${audience}`}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-12"
        >
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 divide-y divide-zinc-800 backdrop-blur-md"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={`faq-${index}`}
                value={`item-${index}`}
                className="border-zinc-800 px-2"
              >
                <AccordionTrigger className="text-left font-heading text-base font-semibold text-zinc-100 hover:text-primary transition-colors py-5 px-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-zinc-400 px-4 pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

