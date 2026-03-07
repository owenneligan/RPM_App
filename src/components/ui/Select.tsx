import React from 'react'
import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SelectOption {
  value: string
  label: string
  color?: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  className?: string
}

export function Select({ value, onChange, options, placeholder = 'Select…', label, className }: SelectProps) {
  const selected = options.find((o) => o.value === value)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-semibold text-[var(--text-secondary)] tracking-wide uppercase">
          {label}
        </label>
      )}
      <RadixSelect.Root value={value} onValueChange={onChange}>
        <RadixSelect.Trigger
          className={cn(
            'inline-flex items-center justify-between gap-2',
            'h-9 px-3 rounded-[var(--radius)] text-sm',
            'bg-[var(--bg-input)] border border-[var(--border)]',
            'text-[var(--text-primary)] transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]',
            'hover:border-[var(--border-bright)] hover:bg-white',
            'focus:border-[var(--border-accent)] focus:ring-2 focus:ring-[var(--accent-dim)] focus:bg-white',
            'data-[placeholder]:text-[var(--text-muted)]',
            className
          )}
        >
          <RadixSelect.Value placeholder={placeholder}>
            {selected && (
              <span className="flex items-center gap-2">
                {selected.color && (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: selected.color }}
                  />
                )}
                {selected.label}
              </span>
            )}
          </RadixSelect.Value>
          <RadixSelect.Icon>
            <ChevronDown size={13} className="text-[var(--text-muted)]" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-[200] min-w-[8rem] rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border)] bg-white shadow-modal"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)]',
                    'text-sm text-[var(--text-primary)] cursor-pointer select-none',
                    'focus:bg-[rgba(0,0,0,0.04)] focus:outline-none',
                    'data-[highlighted]:bg-[rgba(0,0,0,0.04)]'
                  )}
                >
                  {opt.color && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: opt.color }}
                    />
                  )}
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="ml-auto">
                    <Check size={12} className="text-[#2B4C7E]" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  )
}
