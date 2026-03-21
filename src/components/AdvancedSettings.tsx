import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Folder } from 'lucide-react'
import { useConversionStore } from '../store/conversionStore'
import { supportsDirectoryPicker } from '../lib/ffmpeg'
import { cn } from '../lib/utils'

const BITRATE_OPTIONS = [
  { value: 128, label: '128 kbps', description: 'Smaller file size' },
  { value: 192, label: '192 kbps', description: 'Recommended' },
  { value: 256, label: '256 kbps', description: 'High quality' },
  { value: 320, label: '320 kbps', description: 'Maximum quality' },
]

export function AdvancedSettings() {
  const showAdvanced = useConversionStore((s) => s.showAdvanced)
  const toggleAdvanced = useConversionStore((s) => s.toggleAdvanced)
  const settings = useConversionStore((s) => s.settings)
  const setSettings = useConversionStore((s) => s.setSettings)
  const pickOutputDirectory = useConversionStore((s) => s.pickOutputDirectory)
  const phase = useConversionStore((s) => s.phase)
  const disabled = phase === 'converting'

  return (
    <div className="w-full">
      <button
        onClick={toggleAdvanced}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        aria-expanded={showAdvanced}
      >
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform',
            showAdvanced && 'rotate-180'
          )}
        />
        Advanced settings
      </button>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              {/* Bitrate */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-500">
                  Audio quality
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BITRATE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSettings({ bitrate: opt.value })}
                      disabled={disabled}
                      className={cn(
                        'flex flex-col items-center rounded-lg border px-3 py-2 text-center transition-all',
                        settings.bitrate === opt.value
                          ? 'border-brand-300 bg-brand-50 text-brand-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
                        disabled && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <span className="text-sm font-medium">{opt.label}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">{opt.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Output folder */}
              {supportsDirectoryPicker() && (
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-500">
                    Save to folder
                  </label>
                  <button
                    onClick={pickOutputDirectory}
                    disabled={disabled}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-left transition-colors hover:border-gray-300',
                      disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <Folder className="h-4 w-4 text-gray-400" />
                    <span className="flex-1 truncate text-gray-600">
                      {settings.directoryHandle
                        ? settings.directoryHandle.name
                        : 'Choose folder…'}
                    </span>
                  </button>
                  {!settings.directoryHandle && (
                    <p className="mt-1 text-[11px] text-gray-400">
                      Files will be downloaded to your browser's download folder.
                    </p>
                  )}
                </div>
              )}

              {/* Overwrite toggle */}
              {supportsDirectoryPicker() && settings.directoryHandle && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.overwriteExisting}
                    onChange={(e) =>
                      setSettings({ overwriteExisting: e.target.checked })
                    }
                    disabled={disabled}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs text-gray-500">
                    Overwrite existing files
                  </span>
                </label>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
