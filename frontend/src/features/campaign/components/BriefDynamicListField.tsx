import { useState } from 'react';
import { CheckCircle2, Plus, Trash2, X, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { BriefDynamicListFieldProps } from '../types';

/**
 * Reusable dynamic list field component for managing array-based string items
 * such as hashtags, mention tags, and Do's & Don'ts content guidelines.
 *
 * @param props - Component properties for managing list items and input interactions.
 * @returns The rendered dynamic list input element.
 */
export function BriefDynamicListField({
  label,
  description,
  placeholder,
  items,
  onAddItem,
  onRemoveItem,
  disabled = false,
  prefix,
  variant = 'pills',
  tone = 'neutral',
  error,
}: BriefDynamicListFieldProps) {
  const [inputValue, setInputValue] = useState('');

  /**
   * Adds the current input value as a new item in the list.
   */
  function HandleAdd() {
    const raw = inputValue.trim();
    if (!raw) return;

    let cleanItem = raw;
    if (prefix && !cleanItem.startsWith(prefix)) {
      cleanItem = `${prefix}${cleanItem}`;
    }

    onAddItem(cleanItem);
    setInputValue('');
  }

  /**
   * Captures Enter key press in the text input to add items without submitting the parent form.
   *
   * @param event - Keyboard event from the input field.
   */
  function HandleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      HandleAdd();
    }
  }

  const hasItems = items.length > 0;

  return (
    <Field data-invalid={Boolean(error)} className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}

      {/* Input and Add Action */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={HandleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={HandleAdd}
          disabled={disabled || inputValue.trim() === ''}
          className="flex items-center gap-1.5 shrink-0"
        >
          <Plus className="size-4" />
          <span>Tambah</span>
        </Button>
      </div>

      {/* Rendered Items Display */}
      {hasItems && (
        <div className="pt-1">
          {variant === 'pills' ? (
            <div className="flex flex-wrap gap-1.5">
              {items.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground transition-colors"
                >
                  <span>{item}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="rounded-full p-0.5 text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground outline-none"
                      aria-label={`Hapus ${item}`}
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((item, index) => {
                const isPositive = tone === 'positive';
                const isNegative = tone === 'negative';

                return (
                  <li
                    key={`${item}-${index}`}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-lg border p-3 text-sm transition-colors',
                      isPositive && 'border-emerald-500/20 bg-emerald-500/5',
                      isNegative && 'border-rose-500/20 bg-rose-500/5',
                      !isPositive && !isNegative && 'bg-card'
                    )}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      {isPositive && <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />}
                      {isNegative && <XCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />}
                      <span className="text-foreground leading-relaxed break-words">{item}</span>
                    </div>

                    {!disabled && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(index)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
                        aria-label={`Hapus ${item}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {error && <FieldError errors={[{ message: error }]} />}
    </Field>
  );
}
