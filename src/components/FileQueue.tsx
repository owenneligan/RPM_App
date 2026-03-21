import { AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { useConversionStore } from '../store/conversionStore'
import { FileItem } from './FileItem'

export function FileQueue() {
  const files = useConversionStore((s) => s.files)
  const phase = useConversionStore((s) => s.phase)
  const clearFiles = useConversionStore((s) => s.clearFiles)
  const isConverting = phase === 'converting'

  if (files.length === 0) return null

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-500">
          {files.length} {files.length === 1 ? 'file' : 'files'} queued
        </h2>
        {!isConverting && (
          <button
            onClick={clearFiles}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Clear all files"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {files.map((file) => (
            <FileItem key={file.id} file={file} disabled={isConverting} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
