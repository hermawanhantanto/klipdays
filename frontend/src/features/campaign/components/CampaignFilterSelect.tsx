import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { CampaignFilterSelectProps } from '../types';

/**
 * Reusable filter dropdown select for campaign catalog filters.
 * Renders a styled Select primitive with consistent dark styling and accessible options.
 *
 * @param props - Dropdown configuration options and change handler.
 * @returns The rendered select component.
 */
export function CampaignFilterSelect({
  value,
  placeholder,
  options,
  onValueChange,
  className,
  contentClassName,
}: CampaignFilterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          'h-9 w-auto rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-border/40 hover:border-border/60 text-zinc-200 hover:text-white text-xs font-medium shadow-none transition-colors focus-visible:border-zinc-500 focus-visible:ring-0',
          className
        )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        align="end"
        className={cn('rounded-xl border-zinc-700 bg-zinc-900 text-zinc-200 shadow-xl', contentClassName)}>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-xs text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
