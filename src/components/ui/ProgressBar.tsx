import React from 'react'
import { cn } from '../../lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  size?: 'xs' | 'sm' | 'md'
  className?: string
  showLabel?: boolean
  label?: string
  animated?: boolean
}

const heights = { xs: 'h-[3px]', sm: 'h-1.5', md: 'h-2' }

export function ProgressBar({
  value,
  max = 100,
  color = 'var(--gold)',
  size = 'sm',
  className,
  showLabel = false,
  label,
  animated = false,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {(label || showLabel) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs text-[var(--text-secondary)]">{label}</span>}
          {showLabel && (
            <span className="text-xs text-[var(--text-muted)] font-mono-data">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full rounded-full bg-[rgba(255,255,255,0.06)]', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', animated && 'animate-pulse')}
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: pct > 0 ? `0 0 6px ${color}50` : 'none',
          }}
        />
      </div>
    </div>
  )
}

interface ScoreRingProps {
  score: number
  max?: number
  color?: string
  size?: number
  label?: string
}

export function ScoreRing({ score, max = 10, color = 'var(--gold)', size = 56, label }: ScoreRingProps) {
  const pct = (score / max) * 100
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={4}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease', filter: `drop-shadow(0 0 4px ${color}80)` }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-semibold font-mono-data"
          style={{ color }}
        >
          {score}
        </span>
      </div>
      {label && (
        <span className="text-[10px] text-[var(--text-muted)] text-center leading-tight">{label}</span>
      )}
    </div>
  )
}
