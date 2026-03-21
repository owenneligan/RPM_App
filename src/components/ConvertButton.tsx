import { motion } from 'framer-motion'
import { ArrowRight, Loader2, Square } from 'lucide-react'
import { useConversionStore } from '../store/conversionStore'
import { cn } from '../lib/utils'

export function ConvertButton() {
  const phase = useConversionStore((s) => s.phase)
  const files = useConversionStore((s) => s.files)
  const startConversion = useConversionStore((s) => s.startConversion)
  const cancelConversion = useConversionStore((s) => s.cancelConversion)
  const ffmpegReady = useConversionStore((s) => s.ffmpegReady)
  const ffmpegLoading = useConversionStore((s) => s.ffmpegLoading)

  const waitingCount = files.filter((f) => f.status === 'waiting').length
  const isConverting = phase === 'converting'
  const hasFiles = files.length > 0
  const canConvert = hasFiles && waitingCount > 0 && ffmpegReady && !isConverting

  if (isConverting) {
    const total = files.length
    const done = files.filter((f) => f.status === 'completed' || f.status === 'failed').length
    const progress = total > 0 ? done / total : 0

    return (
      <div className="w-full space-y-3">
        {/* Overall progress bar */}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-brand-500"
            animate={{ width: `${Math.round(progress * 100)}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Converting {done} of {total}…
          </p>
          <button
            onClick={cancelConversion}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Square className="h-3 w-3" />
            Stop
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.button
      onClick={startConversion}
      disabled={!canConvert}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all',
        canConvert
          ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-700 hover:shadow-brand-500/30 active:scale-[0.98]'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      )}
      whileTap={canConvert ? { scale: 0.98 } : undefined}
    >
      {ffmpegLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading converter…
        </>
      ) : !ffmpegReady ? (
        'Initializing…'
      ) : waitingCount === 0 && hasFiles ? (
        'All files converted'
      ) : (
        <>
          Convert {waitingCount > 1 ? `${waitingCount} files` : 'to MP3'}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </motion.button>
  )
}
