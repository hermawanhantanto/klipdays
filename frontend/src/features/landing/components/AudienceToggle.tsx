import { Sparkles, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AudienceRole } from '../types'

interface AudienceToggleProps {
  value: AudienceRole
  onChange: (value: AudienceRole) => void
  className?: string
}

/**
 * Segmented pill toggle allowing users to switch between Creator and Brand views.
 * Applies a vibrant primary background with glow effect on the active role.
 *
 * @param props - Component properties containing value, onChange handler, and optional className.
 * @returns The rendered AudienceToggle component.
 */
export function AudienceToggle({ value, onChange, className }: AudienceToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Pilih audiens target"
      className={cn(
        'inline-flex items-center rounded-full bg-zinc-900/90 p-1 border border-zinc-800 backdrop-blur-md shadow-inner',
        className,
      )}
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === 'CREATOR'}
        onClick={() => onChange('CREATOR')}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 outline-none select-none cursor-pointer',
          value === 'CREATOR'
            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/35'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40',
        )}
      >
        <Video className="size-3.5" />
        <span>Creator</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={value === 'BRAND'}
        onClick={() => onChange('BRAND')}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 outline-none select-none cursor-pointer',
          value === 'BRAND'
            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/35'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40',
        )}
      >
        <Sparkles className="size-3.5" />
        <span>Brand</span>
      </button>
    </div>
  )
}
