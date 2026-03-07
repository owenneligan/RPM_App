import React from 'react'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-[#2B4C7E] hover:bg-[#1F3A6B] text-white shadow-sm',
  secondary:
    'bg-white hover:bg-[#F2F2F0] text-[#111111] border border-[#E3E4E6] shadow-sm',
  ghost:
    'text-[#6B6E73] hover:text-[#111111] hover:bg-[rgba(0,0,0,0.04)]',
  danger:
    'bg-[rgba(179,92,68,0.08)] hover:bg-[rgba(179,92,68,0.14)] text-[#B35C44] border border-[rgba(179,92,68,0.2)]',
  gold:
    'bg-[rgba(199,164,108,0.10)] hover:bg-[rgba(199,164,108,0.16)] text-[#B8893A] border border-[rgba(199,164,108,0.25)]',
}

const sizes: Record<Size, string> = {
  sm: 'h-7 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-sm gap-2',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-[var(--radius)] transition-all duration-150 select-none whitespace-nowrap',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={14} />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </button>
  )
}
