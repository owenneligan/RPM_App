import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface ProgressBarProps {
  progress: number // 0 to 1
  className?: string
  variant?: 'default' | 'success' | 'error'
}

export function ProgressBar({ progress, className, variant = 'default' }: ProgressBarProps) {
  const percentage = Math.round(progress * 100)

  return (
    <div
      className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100', className)}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${percentage}% complete`}
    >
      <motion.div
        className={cn(
          'absolute inset-y-0 left-0 rounded-full',
          variant === 'success' && 'bg-emerald-500',
          variant === 'error' && 'bg-red-400',
          variant === 'default' && 'bg-brand-500'
        )}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  )
}
