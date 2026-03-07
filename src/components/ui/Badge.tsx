import React from 'react'
import { cn } from '../../lib/utils'
import { Priority, ActionStatus, BlockStatus, LifeArea } from '../../types'
import { LIFE_AREA_CONFIG } from '../../types'

type BadgeVariant = 'default' | 'accent' | 'gold' | 'green' | 'red' | 'amber' | 'blue' | 'purple'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[rgba(0,0,0,0.05)] text-[var(--text-secondary)]',
  accent: 'bg-[rgba(43,76,126,0.09)] text-[#2B4C7E]',
  gold: 'bg-[rgba(199,164,108,0.12)] text-[#B8893A]',
  green: 'bg-[rgba(63,125,106,0.10)] text-[#3F7D6A]',
  red: 'bg-[rgba(179,92,68,0.09)] text-[#B35C44]',
  amber: 'bg-[rgba(184,137,58,0.10)] text-[#B8893A]',
  blue: 'bg-[rgba(59,110,168,0.09)] text-[#3B6EA8]',
  purple: 'bg-[rgba(107,90,142,0.09)] text-[#6B5A8E]',
}

export function Badge({ children, variant = 'default', className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      )}
      {children}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = {
    must: { label: 'Must', variant: 'red' as BadgeVariant },
    should: { label: 'Should', variant: 'amber' as BadgeVariant },
    could: { label: 'Could', variant: 'default' as BadgeVariant },
  }
  const { label, variant } = config[priority]
  return <Badge variant={variant}>{label}</Badge>
}

export function StatusBadge({ status }: { status: ActionStatus | BlockStatus }) {
  const config: Record<string, { label: string; variant: BadgeVariant }> = {
    todo: { label: 'To Do', variant: 'default' },
    'in-progress': { label: 'In Progress', variant: 'blue' },
    done: { label: 'Done', variant: 'green' },
    blocked: { label: 'Blocked', variant: 'red' },
    active: { label: 'Active', variant: 'accent' },
    completed: { label: 'Completed', variant: 'green' },
    paused: { label: 'Paused', variant: 'amber' },
    archived: { label: 'Archived', variant: 'default' },
  }
  const c = config[status] || config.todo
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}

export function LifeAreaBadge({ area }: { area: LifeArea }) {
  const config = LIFE_AREA_CONFIG[area]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: config.bgColor, color: config.color }}
    >
      {config.label}
    </span>
  )
}

export function EffortBadge({ effort }: { effort: string }) {
  const config = {
    low: '▁ Low',
    medium: '▃ Medium',
    high: '▆ High',
  }
  return (
    <Badge variant="default">{config[effort as keyof typeof config] || effort}</Badge>
  )
}
