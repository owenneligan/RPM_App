import React from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  rightElement?: React.ReactNode
}

export function Input({
  label,
  error,
  hint,
  icon,
  rightElement,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-semibold text-[var(--text-secondary)] tracking-wide uppercase"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full h-9 rounded-[var(--radius)] bg-[var(--bg-input)] border border-[var(--border)]',
            'text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
            'px-3 transition-all duration-150 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]',
            'focus:border-[var(--border-accent)] focus:ring-2 focus:ring-[var(--accent-dim)] focus:bg-white',
            icon && 'pl-9',
            rightElement && 'pr-10',
            error && 'border-[var(--red)] focus:border-[var(--red)]',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <p className="text-xs text-[var(--red)]">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function TextArea({ label, error, hint, className, id, ...props }: TextAreaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-semibold text-[var(--text-secondary)] tracking-wide uppercase"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full rounded-[var(--radius)] bg-[var(--bg-input)] border border-[var(--border)]',
          'text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
          'px-3 py-2.5 resize-none transition-all duration-150',
          'shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]',
          'focus:border-[var(--border-accent)] focus:ring-2 focus:ring-[var(--accent-dim)] focus:bg-white',
          error && 'border-[var(--red)]',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[var(--red)]">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  )
}
