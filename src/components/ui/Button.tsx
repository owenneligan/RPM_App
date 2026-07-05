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
    'text-[#0A0B0E] font-semibold shadow-sm',
  secondary:
    'text-[var(--text-primary)] border border-[rgba(255,255,255,0.09)] shadow-sm',
  ghost:
    'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)]',
  danger:
    'bg-[rgba(224,92,74,0.10)] hover:bg-[rgba(224,92,74,0.16)] text-[#E05C4A] border border-[rgba(224,92,74,0.22)]',
  gold:
    'text-[#0A0B0E] font-semibold shadow-sm',
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
  style,
  ...props
}: ButtonProps) {
  const isGoldVariant = variant === 'primary' || variant === 'gold'

  const goldStyle = isGoldVariant
    ? {
        background: 'linear-gradient(135deg, #C9963D 0%, #D4A84E 50%, #C9963D 100%)',
        backgroundSize: '200% auto',
        transition: 'background-position 300ms ease, opacity 150ms ease, transform 150ms ease',
        boxShadow: '0 1px 8px rgba(201, 150, 61, 0.25)',
        ...style,
      }
    : variant === 'secondary'
    ? {
        background: 'rgba(255,255,255,0.04)',
        ...style,
      }
    : style

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-[var(--radius)] transition-all duration-150 select-none whitespace-nowrap',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        isGoldVariant && 'hover:brightness-110 active:brightness-95 active:scale-[0.98]',
        !isGoldVariant && 'active:scale-[0.98]',
        variant === 'secondary' && 'hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      style={goldStyle}
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
