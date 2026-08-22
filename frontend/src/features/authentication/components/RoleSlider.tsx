import { cn } from '@/lib/utils'

interface RoleSliderProps {
  value: 'CREATOR' | 'BRAND'
  onChange: (value: 'CREATOR' | 'BRAND') => void
  disabled?: boolean
}

/**
 * Animated slider toggle for switching between Creator and Brand account types.
 *
 * @param props - Component props containing the current value, change handler, and disabled state.
 * @returns The rendered role slider component.
 */
export function RoleSlider({ value, onChange, disabled = false }: RoleSliderProps) {
  return (
    <div
      role="tablist"
      aria-label="Pilih tipe akun"
      className="relative grid w-full grid-cols-2 rounded-xl bg-muted p-1 text-muted-foreground border border-border/50 select-none"
    >
      {/* Sliding background pill */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg bg-background shadow-xs transition-transform duration-300 ease-in-out',
          value === 'BRAND' ? 'translate-x-full' : 'translate-x-0',
        )}
      />

      <button
        type="button"
        role="tab"
        id="tab-creator"
        aria-selected={value === 'CREATOR'}
        aria-controls="panel-creator"
        disabled={disabled}
        onClick={() => onChange('CREATOR')}
        className={cn(
          'relative z-10 flex items-center justify-center rounded-lg py-2 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
          value === 'CREATOR' ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        Creator
      </button>

      <button
        type="button"
        role="tab"
        id="tab-brand"
        aria-selected={value === 'BRAND'}
        aria-controls="panel-brand"
        disabled={disabled}
        onClick={() => onChange('BRAND')}
        className={cn(
          'relative z-10 flex items-center justify-center rounded-lg py-2 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
          value === 'BRAND' ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        Brand
      </button>
    </div>
  )
}

