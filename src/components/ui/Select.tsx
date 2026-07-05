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
        <label className="text-[11px] font-semibold tracking-[0.1em] uppercase"
          style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      <RadixSelect.Root value={value} onValueChange={onChange}>
        <RadixSelect.Trigger
          className={cn(
            'inline-flex items-center justify-between gap-2 group',
            'h-9 px-3 rounded-[var(--radius)] text-sm',
            'transition-all duration-150 outline-none',
            'data-[placeholder]:text-[var(--text-muted)]',
            className
          )}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'rgba(255,255,255,0.07)'
            el.style.borderColor = 'var(--border-bright)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'rgba(255,255,255,0.04)'
            el.style.borderColor = 'var(--border)'
          }}
          onFocus={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(201,150,61,0.45)'
            el.style.boxShadow = '0 0 0 3px rgba(201,150,61,0.08)'
          }}
          onBlur={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--border)'
            el.style.boxShadow = 'none'
          }}
        >
          <RadixSelect.Value placeholder={placeholder}>
            {selected && (
              <span className="flex items-center gap-2">
                {selected.color && (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: selected.color, boxShadow: `0 0 4px ${selected.color}80` }}
                  />
                )}
                {selected.label}
              </span>
            )}
          </RadixSelect.Value>
          <RadixSelect.Icon>
            <ChevronDown
              size={13}
              className="transition-transform duration-200 group-data-[state=open]:rotate-180"
              style={{ color: 'var(--text-muted)' }}
            />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={6}
            className="z-[200] min-w-[var(--radix-select-trigger-width)] rounded-[var(--radius-lg)] overflow-hidden"
            style={{
              background: '#0D1017',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '1px solid rgba(201,150,61,0.18)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
              animation: 'selectFadeIn 0.15s ease',
            }}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="relative flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm cursor-pointer select-none outline-none transition-all duration-100"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.06)'
                    el.style.color = 'var(--text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    // will be overridden by data-[highlighted] but reset otherwise
                    el.style.background = ''
                    el.style.color = 'var(--text-primary)'
                  }}
                >
                  {opt.color && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: opt.color, boxShadow: `0 0 5px ${opt.color}60` }}
                    />
                  )}
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="ml-auto pl-2">
                    <Check size={11} style={{ color: 'var(--gold)' }} />
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
