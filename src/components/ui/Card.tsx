import React from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  accent?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export function Card({
  children,
  className,
  hoverable = false,
  accent,
  padding = 'md',
  style,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'card',
        paddings[padding],
        hoverable && 'card-hover',
        className
      )}
      style={
        accent
          ? { borderLeft: `2px solid ${accent}`, ...style }
          : style
      }
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  icon?: React.ReactNode
  iconColor?: string
}

export function CardHeader({ title, subtitle, action, icon, iconColor }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div
            className="w-9 h-9 rounded-[var(--radius)] flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: iconColor ? `${iconColor}14` : 'rgba(255,255,255,0.04)',
              boxShadow: iconColor ? `0 0 10px ${iconColor}18` : 'none',
            }}
          >
            <span style={{ color: iconColor || 'var(--text-secondary)' }}>{icon}</span>
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight">{title}</h3>
          {subtitle && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-tight">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
