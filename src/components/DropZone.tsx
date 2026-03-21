import { useCallback, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileAudio, AlertCircle } from 'lucide-react'
import { useConversionStore } from '../store/conversionStore'
import { cn } from '../lib/utils'

export function DropZone() {
  const addFiles = useConversionStore((s) => s.addFiles)
  const [isDragging, setIsDragging] = useState(false)
  const [rejectedCount, setRejectedCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList)
      const m4aFiles = files.filter(
        (f) =>
          f.name.toLowerCase().endsWith('.m4a') ||
          f.type === 'audio/mp4' ||
          f.type === 'audio/x-m4a'
      )
      const rejected = files.length - m4aFiles.length

      if (m4aFiles.length > 0) addFiles(m4aFiles)

      if (rejected > 0) {
        setRejectedCount(rejected)
        setTimeout(() => setRejectedCount(0), 4000)
      }
    },
    [addFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  const handleClick = () => inputRef.current?.click()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
      e.target.value = '' // Reset so re-selecting same file works
    }
  }

  return (
    <div className="w-full">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Drop M4A files here or click to browse"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
        className={cn(
          'relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          isDragging
            ? 'border-brand-500 bg-brand-50 scale-[1.01]'
            : 'border-gray-200 bg-gray-50/50 hover:border-brand-300 hover:bg-gray-50'
        )}
        animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <motion.div
          className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl transition-colors',
            isDragging ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400'
          )}
          animate={isDragging ? { y: -4 } : { y: 0 }}
        >
          {isDragging ? (
            <FileAudio className="h-8 w-8" />
          ) : (
            <Upload className="h-8 w-8" />
          )}
        </motion.div>

        <div className="text-center">
          <p className={cn(
            'text-lg font-medium transition-colors',
            isDragging ? 'text-brand-700' : 'text-gray-700'
          )}>
            {isDragging ? 'Drop your files here' : 'Drop your M4A files here'}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            or{' '}
            <span className="text-brand-600 font-medium hover:text-brand-700">
              browse to choose files
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs text-gray-400 shadow-sm border border-gray-100">
          <FileAudio className="h-3.5 w-3.5" />
          <span>.m4a files accepted</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".m4a,audio/mp4,audio/x-m4a"
          multiple
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />
      </motion.div>

      <AnimatePresence>
        {rejectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5 text-sm text-amber-700"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>
              {rejectedCount === 1
                ? '1 file was skipped — only .m4a files are accepted.'
                : `${rejectedCount} files were skipped — only .m4a files are accepted.`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
