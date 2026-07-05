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
  default: 'bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)]',
  accent:  'bg-[rgba(201,150,61,0.10)] text-[#D4A84E]',
  gold:    'bg-[rgba(201,150,61,0.10)] text-[#C9963D]',
  green:   'bg-[rgba(61,184,122,0.10)] text-[#3DB87A]',
  red:     'bg-[rgba(224,92,74,0.10)] text-[#E05C4A]',
  amber:   'bg-[rgba(212,146,74,0.10)] text-[#D4924A]',
  blue:    'bg-[rgba(90,154,224,0.10)] text-[#5A9AE0]',
  purple:  'bg-[rgba(139,123,200,0.10)] text-[#8B7BC8]',
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
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      )}
      {children}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = {
    must:   { label: 'Must', variant: 'red' as BadgeVariant },
    should: { label: 'Should', variant: 'amber' as BadgeVariant },
    could:  { label: 'Could', variant: 'default' as BadgeVariant },
  }
  const { label, variant } = config[priority]
  return <Badge variant={variant}>{label}</Badge>
}

export function StatusBadge({ status }: { status: ActionStatus | BlockStatus }) {
  const config: Record<string, { label: string; variant: BadgeVariant }> = {
    todo:         { label: 'To Do', variant: 'default' },
    'in-progress':{ label: 'In Progress', variant: 'blue' },
    done:         { label: 'Done', variant: 'green' },
    blocked:      { label: 'Blocked', variant: 'red' },
    active:       { label: 'Active', variant: 'gold' },
    completed:    { label: 'Completed', variant: 'green' },
    paused:       { label: 'Paused', variant: 'amber' },
    archived:     { label: 'Archived', variant: 'default' },
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
    low:    '▁ Low',
    medium: '▃ Medium',
    high:   '▆ High',
  }
  return (
    <Badge variant="default">{config[effort as keyof typeof config] || effort}</Badge>
  )
}
