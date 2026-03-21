export type FileStatus = 'waiting' | 'converting' | 'completed' | 'failed'

export interface ConversionFile {
  id: string
  file: File
  name: string
  size: number
  status: FileStatus
  progress: number
  error?: string
  outputBlob?: Blob
  outputName?: string
}

export interface ConversionSettings {
  bitrate: number // kbps
  outputBehavior: 'download' | 'directory'
  directoryHandle?: FileSystemDirectoryHandle
  overwriteExisting: boolean
}
