import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

let ffmpeg: FFmpeg | null = null
let loadPromise: Promise<void> | null = null

/**
 * Initialize FFmpeg.wasm — loads the WASM binary once and reuses it.
 * Uses the single-threaded core for broad browser compatibility.
 */
export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg && ffmpeg.loaded) return ffmpeg

  if (loadPromise) {
    await loadPromise
    return ffmpeg!
  }

  ffmpeg = new FFmpeg()

  loadPromise = (async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    await ffmpeg!.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
  })()

  await loadPromise
  return ffmpeg!
}

/**
 * Convert an M4A file to MP3 using FFmpeg.wasm.
 * Returns a Blob of the converted MP3 data.
 */
export async function convertM4AtoMP3(
  file: File,
  bitrate: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ff = await getFFmpeg()

  const inputName = 'input.m4a'
  const outputName = 'output.mp3'

  // Write the input file to FFmpeg's virtual filesystem
  const fileData = await fetchFile(file)
  await ff.writeFile(inputName, fileData)

  // Set up progress tracking
  if (onProgress) {
    ff.on('progress', ({ progress }) => {
      // FFmpeg reports progress as 0-1, clamp to avoid overshoot
      onProgress(Math.min(Math.max(progress, 0), 1))
    })
  }

  // Run the conversion: M4A → MP3 with specified bitrate
  await ff.exec([
    '-i', inputName,
    '-codec:a', 'libmp3lame',
    '-b:a', `${bitrate}k`,
    '-map_metadata', '0',  // preserve metadata
    '-id3v2_version', '3', // broad ID3 compatibility
    '-y',                  // overwrite output
    outputName,
  ])

  // Read the output
  const data = await ff.readFile(outputName)

  // Clean up virtual filesystem
  await ff.deleteFile(inputName)
  await ff.deleteFile(outputName)

  // Remove progress listener to avoid leaks
  if (onProgress) {
    ff.off('progress', () => {})
  }

  // Cast needed: FFmpeg returns Uint8Array which may use SharedArrayBuffer internally
  return new Blob([data as BlobPart], { type: 'audio/mpeg' })
}

/**
 * Check if the File System Access API is available for directory picking.
 */
export function supportsDirectoryPicker(): boolean {
  return 'showDirectoryPicker' in window
}

/**
 * Save a blob to a chosen directory using the File System Access API.
 */
export async function saveToDirectory(
  directoryHandle: FileSystemDirectoryHandle,
  filename: string,
  blob: Blob,
  overwrite: boolean
): Promise<string> {
  let finalName = filename

  if (!overwrite) {
    // Check if file exists and rename if needed
    try {
      await directoryHandle.getFileHandle(filename)
      // File exists — generate a unique name
      const ext = filename.lastIndexOf('.')
      const base = ext > 0 ? filename.slice(0, ext) : filename
      const extension = ext > 0 ? filename.slice(ext) : ''
      let counter = 1
      while (true) {
        finalName = `${base} (${counter})${extension}`
        try {
          await directoryHandle.getFileHandle(finalName)
          counter++
        } catch {
          break // File doesn't exist, use this name
        }
      }
    } catch {
      // File doesn't exist, use original name
    }
  }

  const fileHandle = await directoryHandle.getFileHandle(finalName, { create: true })
  const writable = await fileHandle.createWritable()
  await writable.write(blob)
  await writable.close()

  return finalName
}

/**
 * Trigger a browser download for a blob.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // Revoke after a short delay to ensure download starts
  setTimeout(() => URL.revokeObjectURL(url), 3000)
}
