import { create } from 'zustand'
import type { ConversionFile, ConversionSettings } from '../types'
import { convertM4AtoMP3, downloadBlob, saveToDirectory, supportsDirectoryPicker } from '../lib/ffmpeg'

type AppPhase = 'empty' | 'queue' | 'converting' | 'complete'

interface ConversionState {
  files: ConversionFile[]
  phase: AppPhase
  settings: ConversionSettings
  ffmpegReady: boolean
  ffmpegLoading: boolean
  ffmpegError: string | null
  showAdvanced: boolean

  // Actions
  addFiles: (files: File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  startConversion: () => Promise<void>
  cancelConversion: () => void
  resetToEmpty: () => void
  setSettings: (settings: Partial<ConversionSettings>) => void
  setFFmpegReady: (ready: boolean) => void
  setFFmpegLoading: (loading: boolean) => void
  setFFmpegError: (error: string | null) => void
  toggleAdvanced: () => void
  pickOutputDirectory: () => Promise<void>
  retryFile: (id: string) => Promise<void>
  downloadFile: (id: string) => void
  downloadAll: () => void
}

let cancelRequested = false

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function getOutputName(inputName: string): string {
  const lastDot = inputName.lastIndexOf('.')
  const base = lastDot > 0 ? inputName.slice(0, lastDot) : inputName
  return `${base}.mp3`
}

function isM4AFile(file: File): boolean {
  return (
    file.name.toLowerCase().endsWith('.m4a') ||
    file.type === 'audio/mp4' ||
    file.type === 'audio/x-m4a' ||
    file.type === 'audio/m4a'
  )
}

function formatFileError(error: unknown): string {
  if (error instanceof DOMException && error.name === 'NotAllowedError') {
    return "Can't write to the output folder. Please check permissions."
  }
  if (error instanceof Error) {
    if (error.message.includes('memory')) return 'File is too large to process in the browser.'
    if (error.message.includes('codec')) return "This file's audio format isn't supported."
    return 'Something went wrong during conversion.'
  }
  return 'An unexpected error occurred.'
}

export const useConversionStore = create<ConversionState>((set, get) => ({
  files: [],
  phase: 'empty',
  settings: {
    bitrate: 192,
    outputBehavior: supportsDirectoryPicker() ? 'directory' : 'download',
    overwriteExisting: false,
  },
  ffmpegReady: false,
  ffmpegLoading: false,
  ffmpegError: null,
  showAdvanced: false,

  addFiles: (newFiles) => {
    const validFiles: ConversionFile[] = []
    const state = get()

    for (const file of newFiles) {
      if (!isM4AFile(file)) continue

      // Skip duplicates by name+size
      const isDuplicate = state.files.some(
        (f) => f.name === file.name && f.size === file.size
      )
      if (isDuplicate) continue

      validFiles.push({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        status: 'waiting',
        progress: 0,
        outputName: getOutputName(file.name),
      })
    }

    if (validFiles.length > 0) {
      set((s) => ({
        files: [...s.files, ...validFiles],
        phase: 'queue',
      }))
    }
  },

  removeFile: (id) => {
    set((s) => {
      const files = s.files.filter((f) => f.id !== id)
      return {
        files,
        phase: files.length === 0 ? 'empty' : s.phase,
      }
    })
  },

  clearFiles: () => {
    set({ files: [], phase: 'empty' })
  },

  startConversion: async () => {
    cancelRequested = false
    const { files, settings } = get()
    const toConvert = files.filter((f) => f.status === 'waiting' || f.status === 'failed')

    if (toConvert.length === 0) return

    set({ phase: 'converting' })

    for (const file of toConvert) {
      if (cancelRequested) break

      // Mark as converting
      set((s) => ({
        files: s.files.map((f) =>
          f.id === file.id ? { ...f, status: 'converting' as const, progress: 0, error: undefined } : f
        ),
      }))

      try {
        const blob = await convertM4AtoMP3(file.file, settings.bitrate, (progress) => {
          set((s) => ({
            files: s.files.map((f) =>
              f.id === file.id ? { ...f, progress } : f
            ),
          }))
        })

        const outputName = getOutputName(file.name)

        // Save or prepare for download
        if (settings.outputBehavior === 'directory' && settings.directoryHandle) {
          const savedName = await saveToDirectory(
            settings.directoryHandle,
            outputName,
            blob,
            settings.overwriteExisting
          )
          set((s) => ({
            files: s.files.map((f) =>
              f.id === file.id
                ? { ...f, status: 'completed' as const, progress: 1, outputBlob: blob, outputName: savedName }
                : f
            ),
          }))
        } else {
          set((s) => ({
            files: s.files.map((f) =>
              f.id === file.id
                ? { ...f, status: 'completed' as const, progress: 1, outputBlob: blob, outputName }
                : f
            ),
          }))
        }
      } catch (err) {
        set((s) => ({
          files: s.files.map((f) =>
            f.id === file.id
              ? { ...f, status: 'failed' as const, progress: 0, error: formatFileError(err) }
              : f
          ),
        }))
      }
    }

    // Mark remaining waiting files if cancelled
    if (cancelRequested) {
      set((s) => ({
        files: s.files.map((f) =>
          f.status === 'converting' ? { ...f, status: 'waiting' as const, progress: 0 } : f
        ),
      }))
    }

    set({ phase: 'complete' })
  },

  cancelConversion: () => {
    cancelRequested = true
  },

  resetToEmpty: () => {
    set({ files: [], phase: 'empty' })
  },

  setSettings: (newSettings) => {
    set((s) => ({
      settings: { ...s.settings, ...newSettings },
    }))
  },

  setFFmpegReady: (ready) => set({ ffmpegReady: ready }),
  setFFmpegLoading: (loading) => set({ ffmpegLoading: loading }),
  setFFmpegError: (error) => set({ ffmpegError: error }),
  toggleAdvanced: () => set((s) => ({ showAdvanced: !s.showAdvanced })),

  pickOutputDirectory: async () => {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' })
      set((s) => ({
        settings: { ...s.settings, directoryHandle: handle, outputBehavior: 'directory' },
      }))
    } catch {
      // User cancelled the picker — do nothing
    }
  },

  retryFile: async (id) => {
    const { settings } = get()

    set((s) => ({
      files: s.files.map((f) =>
        f.id === id ? { ...f, status: 'converting' as const, progress: 0, error: undefined } : f
      ),
      phase: 'converting',
    }))

    const file = get().files.find((f) => f.id === id)
    if (!file) return

    try {
      const blob = await convertM4AtoMP3(file.file, settings.bitrate, (progress) => {
        set((s) => ({
          files: s.files.map((f) =>
            f.id === id ? { ...f, progress } : f
          ),
        }))
      })

      const outputName = getOutputName(file.name)

      if (settings.outputBehavior === 'directory' && settings.directoryHandle) {
        const savedName = await saveToDirectory(
          settings.directoryHandle,
          outputName,
          blob,
          settings.overwriteExisting
        )
        set((s) => ({
          files: s.files.map((f) =>
            f.id === id
              ? { ...f, status: 'completed' as const, progress: 1, outputBlob: blob, outputName: savedName }
              : f
          ),
        }))
      } else {
        set((s) => ({
          files: s.files.map((f) =>
            f.id === id
              ? { ...f, status: 'completed' as const, progress: 1, outputBlob: blob, outputName }
              : f
          ),
        }))
      }
    } catch (err) {
      set((s) => ({
        files: s.files.map((f) =>
          f.id === id
            ? { ...f, status: 'failed' as const, progress: 0, error: formatFileError(err) }
            : f
        ),
      }))
    }

    // Check if all files are done
    const allDone = get().files.every((f) => f.status === 'completed' || f.status === 'failed')
    if (allDone) set({ phase: 'complete' })
  },

  downloadFile: (id) => {
    const file = get().files.find((f) => f.id === id)
    if (file?.outputBlob && file.outputName) {
      downloadBlob(file.outputBlob, file.outputName)
    }
  },

  downloadAll: () => {
    const { files } = get()
    for (const file of files) {
      if (file.outputBlob && file.outputName) {
        downloadBlob(file.outputBlob, file.outputName)
      }
    }
  },
}))
