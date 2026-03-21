import { motion } from 'framer-motion'
import {
  FileAudio,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download,
  RotateCcw,
  Clock,
} from 'lucide-react'
import type { ConversionFile } from '../types'
import { formatFileSize, cn } from '../lib/utils'
import { ProgressBar } from './ProgressBar'
import { useConversionStore } from '../store/conversionStore'

interface FileItemProps {
  file: ConversionFile
  disabled?: boolean
}

const statusConfig = {
  waiting: {
    icon: Clock,
    label: 'Waiting',
    color: 'text-gray-400',
    bg: 'bg-gray-50',
    border: 'border-gray-100',
  },
  converting: {
    icon: Loader2,
    label: 'Converting…',
    color: 'text-brand-600',
    bg: 'bg-brand-50',
    border: 'border-brand-100',
  },
  completed: {
    icon: CheckCircle2,
    label: 'Done',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  failed: {
    icon: AlertCircle,
    label: 'Failed',
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-100',
  },
}

export function FileItem({ file, disabled }: FileItemProps) {
  const removeFile = useConversionStore((s) => s.removeFile)
  const downloadFile = useConversionStore((s) => s.downloadFile)
  const retryFile = useConversionStore((s) => s.retryFile)
  const outputBehavior = useConversionStore((s) => s.settings.outputBehavior)

  const config = statusConfig[file.status]
  const StatusIcon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className={cn(
        'group flex items-center gap-3 rounded-xl border p-3 transition-colors',
        config.border,
        file.status === 'converting' ? config.bg : 'bg-white hover:bg-gray-50/50'
      )}
    >
      {/* File icon */}
      <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg', config.bg)}>
        <FileAudio className={cn('h-5 w-5', config.color)} />
      </div>

      {/* File info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-gray-800" title={file.name}>
            {file.name}
          </p>
          <span className="flex-shrink-0 text-xs text-gray-400">
            {formatFileSize(file.size)}
          </span>
        </div>

        {file.status === 'converting' && (
          <div className="mt-1.5">
            <ProgressBar progress={file.progress} />
          </div>
        )}

        {file.status === 'completed' && file.outputName && (
          <p className="mt-0.5 truncate text-xs text-emerald-600">
            → {file.outputName}
          </p>
        )}

        {file.status === 'failed' && file.error && (
          <p className="mt-0.5 text-xs text-red-500">{file.error}</p>
        )}
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
            config.bg,
            config.color
          )}
        >
          <StatusIcon
            className={cn('h-3 w-3', file.status === 'converting' && 'animate-spin')}
          />
          {config.label}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {file.status === 'completed' && outputBehavior === 'download' && (
          <button
            onClick={() => downloadFile(file.id)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
            title="Download MP3"
            aria-label={`Download ${file.outputName}`}
          >
            <Download className="h-4 w-4" />
          </button>
        )}

        {file.status === 'failed' && (
          <button
            onClick={() => retryFile(file.id)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
            title="Retry conversion"
            aria-label={`Retry converting ${file.name}`}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}

        {(file.status === 'waiting' || file.status === 'completed' || file.status === 'failed') && !disabled && (
          <button
            onClick={() => removeFile(file.id)}
            className="rounded-lg p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Remove file"
            aria-label={`Remove ${file.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
