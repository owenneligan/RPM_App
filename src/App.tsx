import { useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { DropZone } from './components/DropZone'
import { FileQueue } from './components/FileQueue'
import { ConvertButton } from './components/ConvertButton'
import { AdvancedSettings } from './components/AdvancedSettings'
import { CompletionSummary } from './components/CompletionSummary'
import { useConversionStore } from './store/conversionStore'
import { getFFmpeg } from './lib/ffmpeg'

export default function App() {
  const phase = useConversionStore((s) => s.phase)
  const addFiles = useConversionStore((s) => s.addFiles)
  const setFFmpegReady = useConversionStore((s) => s.setFFmpegReady)
  const setFFmpegLoading = useConversionStore((s) => s.setFFmpegLoading)
  const setFFmpegError = useConversionStore((s) => s.setFFmpegError)
  const ffmpegError = useConversionStore((s) => s.ffmpegError)

  // Pre-load FFmpeg.wasm on mount
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setFFmpegLoading(true)
      try {
        await getFFmpeg()
        if (!cancelled) {
          setFFmpegReady(true)
          setFFmpegLoading(false)
        }
      } catch {
        if (!cancelled) {
          setFFmpegError(
            'Could not load the audio converter. Please try refreshing the page.'
          )
          setFFmpegLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [setFFmpegReady, setFFmpegLoading, setFFmpegError])

  // Global drag-and-drop — allow dropping files anywhere on the window
  const handleWindowDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files).filter(
          (f) =>
            f.name.toLowerCase().endsWith('.m4a') ||
            f.type === 'audio/mp4' ||
            f.type === 'audio/x-m4a'
        )
        if (files.length > 0) addFiles(files)
      }
    },
    [addFiles]
  )

  const handleWindowDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  useEffect(() => {
    window.addEventListener('drop', handleWindowDrop)
    window.addEventListener('dragover', handleWindowDragOver)
    return () => {
      window.removeEventListener('drop', handleWindowDrop)
      window.removeEventListener('dragover', handleWindowDragOver)
    }
  }, [handleWindowDrop, handleWindowDragOver])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-xl px-4 py-12 sm:py-20">
        <div className="flex flex-col items-center gap-8">
          <Header />

          {ffmpegError && (
            <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {ffmpegError}
            </div>
          )}

          {/* Drop zone is always visible */}
          <DropZone />

          {/* File queue */}
          <FileQueue />

          {/* Convert button + progress */}
          {phase !== 'empty' && <ConvertButton />}

          {/* Advanced settings */}
          {(phase === 'queue' || phase === 'empty') && <AdvancedSettings />}

          {/* Completion summary */}
          <CompletionSummary />

          {/* Footer */}
          <footer className="mt-4 text-center text-xs text-gray-300">
            Files are processed locally in your browser. Nothing is uploaded.
          </footer>
        </div>
      </div>
    </div>
  )
}
