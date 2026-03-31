import React, { useState } from 'react'
import { Database, Loader2, X } from 'lucide-react'
import { migrateLocalStorage, LocalStorageSnapshot } from '../store/db'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  onDone: () => void
}

/**
 * Shown once when the user first logs in and we detect existing localStorage data.
 * Offers to migrate it to their Supabase account, then clears the local key.
 */
export function MigrationPrompt({ onDone }: Props) {
  const { user } = useAuth()
  const [state, setState] = useState<'idle' | 'migrating' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  function dismiss() {
    // User declined — just clear the localStorage key so we don't prompt again
    localStorage.removeItem('rpm-life-os-v1')
    onDone()
  }

  async function migrate() {
    if (!user) return
    setState('migrating')
    setError(null)

    try {
      const raw = localStorage.getItem('rpm-life-os-v1')
      if (!raw) { onDone(); return }

      const parsed = JSON.parse(raw)
      // Zustand persist wraps data inside a `state` key
      const data: LocalStorageSnapshot = parsed?.state ?? parsed

      await migrateLocalStorage(user.id, {
        rpmBlocks: data.rpmBlocks ?? [],
        outcomes: data.outcomes ?? [],
        dailyFocuses: data.dailyFocuses ?? [],
        reviews: data.reviews ?? [],
        brainDumps: data.brainDumps ?? [],
        lifeAreaScores: data.lifeAreaScores ?? {},
      })

      localStorage.removeItem('rpm-life-os-v1')
      setState('done')

      // Give the user a moment to see the success message before reloading data
      setTimeout(() => onDone(), 1200)
    } catch (err) {
      console.error('Migration failed:', err)
      setError(err instanceof Error ? err.message : 'Migration failed')
      setState('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-md rounded-[var(--radius-xl)] p-6"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-accent)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,150,61,0.08)',
        }}
      >
        {state === 'done' ? (
          <div className="flex flex-col items-center py-4 gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--green-dim)', border: '1px solid rgba(61,184,122,0.25)' }}
            >
              <span style={{ color: 'var(--green)', fontSize: 22 }}>✓</span>
            </div>
            <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
              Data migrated successfully
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-[var(--radius)] flex items-center justify-center shrink-0"
                  style={{
                    background: 'var(--accent-dim)',
                    border: '1px solid var(--border-accent)',
                  }}
                >
                  <Database size={16} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Existing data found
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    From this device's local storage
                  </p>
                </div>
              </div>
              <button
                onClick={dismiss}
                className="p-1.5 rounded-[var(--radius-sm)] transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              We found RPM blocks, outcomes, and other data stored on this device. Would you like to
              migrate it to your account so it's available everywhere?
            </p>

            {state === 'error' && (
              <p
                className="text-xs rounded-[var(--radius-sm)] px-3 py-2 mb-4"
                style={{
                  color: 'var(--red)',
                  background: 'var(--red-dim)',
                  border: '1px solid rgba(224,92,74,0.18)',
                }}
              >
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={dismiss}
                className="flex-1 h-9 rounded-[var(--radius)] text-sm font-medium transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'var(--text-secondary)',
                }}
              >
                Skip
              </button>
              <button
                onClick={migrate}
                disabled={state === 'migrating'}
                className="flex-1 h-9 rounded-[var(--radius)] text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #C9963D 0%, #D4A84E 50%, #C9963D 100%)',
                  color: '#0A0B0E',
                  boxShadow: '0 1px 8px rgba(201,150,61,0.25)',
                }}
              >
                {state === 'migrating' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  'Migrate Data'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
