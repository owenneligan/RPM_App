import { motion } from 'framer-motion'
import { CheckCircle2, Download, FolderOpen, Plus, AlertTriangle } from 'lucide-react'
import { useConversionStore } from '../store/conversionStore'

export function CompletionSummary() {
  const files = useConversionStore((s) => s.files)
  const phase = useConversionStore((s) => s.phase)
  const resetToEmpty = useConversionStore((s) => s.resetToEmpty)
  const downloadAll = useConversionStore((s) => s.downloadAll)
  const settings = useConversionStore((s) => s.settings)

  if (phase !== 'complete') return null

  const completed = files.filter((f) => f.status === 'completed')
  const failed = files.filter((f) => f.status === 'failed')
  const allSuccess = failed.length === 0
  const allFailed = completed.length === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border border-gray-100 bg-white p-6 text-center"
    >
      {allFailed ? (
        <>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="mt-3 text-lg font-semibold text-gray-800">
            Conversion failed
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {failed.length === 1
              ? "Couldn't convert the file. You can try again."
              : `Couldn't convert any of the ${failed.length} files. You can try again.`}
          </p>
        </>
      ) : (
        <>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <h3 className="mt-3 text-lg font-semibold text-gray-800">
            {allSuccess ? 'All done!' : 'Conversion complete'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {completed.length === 1
              ? '1 file converted successfully.'
              : `${completed.length} files converted successfully.`}
            {failed.length > 0 && (
              <span className="text-amber-600">
                {' '}
                {failed.length} {failed.length === 1 ? 'file' : 'files'} failed.
              </span>
            )}
          </p>
          {settings.directoryHandle && (
            <p className="mt-1 text-xs text-gray-400">
              Saved to: {settings.directoryHandle.name}
            </p>
          )}
        </>
      )}

      <div className="mt-5 flex items-center justify-center gap-3">
        {completed.length > 0 && settings.outputBehavior === 'download' && (
          <button
            onClick={downloadAll}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download {completed.length > 1 ? 'all' : 'MP3'}
          </button>
        )}

        <button
          onClick={resetToEmpty}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Convert more files
        </button>
      </div>
    </motion.div>
  )
}
