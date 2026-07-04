import React, { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon,
  Key,
  Database,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Shield,
  User,
} from 'lucide-react'
import { useStore } from '../store'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ConfirmModal } from '../components/ui/Modal'
import { checkApiKey, saveApiKey, deleteApiKey } from '../services/ai'

export function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [hasKey, setHasKey] = useState(false)
  const [keyLoading, setKeyLoading] = useState(false)
  const [keySaved, setKeySaved] = useState(false)
  const [keyError, setKeyError] = useState('')
  const [clearConfirm, setClearConfirm] = useState(false)
  const [deleteKeyConfirm, setDeleteKeyConfirm] = useState(false)
  const [importConfirm, setImportConfirm] = useState(false)
  const [pendingImport, setPendingImport] = useState<Record<string, unknown> | null>(null)
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState(false)

  const userName = useStore((s) => s.userName)
  const updateUserName = useStore((s) => s.updateUserName)
  const importData = useStore((s) => s.importData)
  const rpmBlocks = useStore((s) => s.rpmBlocks)
  const outcomes = useStore((s) => s.outcomes)
  const reviews = useStore((s) => s.reviews)
  const brainDumps = useStore((s) => s.brainDumps)

  useEffect(() => {
    checkApiKey().then(setHasKey).catch(() => setHasKey(false))
  }, [])

  const handleSaveKey = async () => {
    if (!apiKey.trim()) return
    setKeyLoading(true)
    setKeyError('')
    try {
      await saveApiKey(apiKey.trim())
      setHasKey(true)
      setKeySaved(true)
      setApiKey('')
      setTimeout(() => setKeySaved(false), 3000)
    } catch (e: any) {
      setKeyError(e.message)
    }
    setKeyLoading(false)
  }

  const handleDeleteKey = async () => {
    await deleteApiKey()
    setHasKey(false)
    setDeleteKeyConfirm(false)
  }

  const handleExport = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      rpmBlocks,
      outcomes,
      reviews,
      brainDumps,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rpm-life-os-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    setImportError('')
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string)
          if (data.rpmBlocks && Array.isArray(data.rpmBlocks)) {
            setPendingImport(data)
            setImportConfirm(true)
          } else {
            setImportError('Invalid export file — missing rpmBlocks data')
          }
        } catch {
          setImportError('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const confirmImport = () => {
    if (!pendingImport) return
    importData({
      rpmBlocks: pendingImport.rpmBlocks as any,
      outcomes: pendingImport.outcomes as any,
      reviews: pendingImport.reviews as any,
      brainDumps: pendingImport.brainDumps as any,
      dailyFocuses: pendingImport.dailyFocuses as any,
    })
    setPendingImport(null)
    setImportConfirm(false)
    setImportSuccess(true)
    setTimeout(() => setImportSuccess(false), 3000)
  }

  const handleClearData = () => {
    localStorage.clear()
    window.location.reload()
  }

  const totalActions = rpmBlocks.flatMap((b) => b.actions).length
  const doneActions = rpmBlocks.flatMap((b) => b.actions).filter((a) => a.status === 'done').length

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8 fade-up">
        <div className="flex items-center gap-3">
          <SettingsIcon size={22} className="text-[var(--accent)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Settings
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Configure your RPM Life OS
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Profile */}
        <Card className="fade-up">
          <div className="flex items-center gap-2 mb-4">
            <User size={15} className="text-[var(--accent)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Profile</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <div className="flex-1">
              <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                Your Name
              </label>
              <Input
                value={userName}
                onChange={(e) => updateUserName(e.target.value)}
                placeholder="Enter your name…"
              />
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            Your name personalises the dashboard greeting.
          </p>
        </Card>

        {/* AI Configuration */}
        <Card className="fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Key size={15} className="text-[var(--accent)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              AI Configuration
            </h2>
          </div>

          <div className="p-3 rounded-[var(--radius)] bg-[var(--accent-dim)] border border-[var(--border-accent)] mb-4">
            <div className="flex items-start gap-2">
              <Shield size={13} className="text-[var(--accent)] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-[var(--accent)] mb-1">Privacy-first AI</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Your API key is stored locally on your machine only. No data is sent to any third party except Anthropic's API when you use AI features.
                </p>
              </div>
            </div>
          </div>

          {hasKey ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-[var(--radius)] bg-[var(--green-dim)] border border-[rgba(52,211,153,0.2)]">
                <CheckCircle2 size={14} className="text-[var(--green)]" />
                <p className="text-xs text-[var(--green)] font-medium">
                  Anthropic API key configured. AI features are enabled.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 size={13} />}
                onClick={() => setDeleteKeyConfirm(true)}
              >
                Remove API Key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-[var(--radius)] bg-[var(--amber-dim)] border border-[rgba(251,191,36,0.2)]">
                <AlertTriangle size={14} className="text-[var(--amber)]" />
                <p className="text-xs text-[var(--amber)]">
                  No API key set. AI features (Brain Dump, Goal Refinement) require an Anthropic API key.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-api03-…"
                  type="password"
                  className="flex-1"
                  error={keyError}
                />
                <Button
                  variant="primary"
                  onClick={handleSaveKey}
                  loading={keyLoading}
                  disabled={!apiKey.trim()}
                  className="sm:shrink-0"
                >
                  {keySaved ? '✓ Saved' : 'Save Key'}
                </Button>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Get your API key from{' '}
                <span className="text-[var(--accent)]">console.anthropic.com</span>
              </p>
            </div>
          )}
        </Card>

        {/* Data Overview */}
        <Card className="fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Database size={15} className="text-[var(--green)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Data Overview</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <DataStat label="RPM Blocks" value={rpmBlocks.length} color="var(--accent)" />
            <DataStat label="Outcomes" value={outcomes.length} color="var(--gold)" />
            <DataStat label="Total Actions" value={totalActions} color="var(--blue)" />
            <DataStat label="Actions Done" value={doneActions} color="var(--green)" />
            <DataStat label="Reviews" value={reviews.length} color="var(--purple)" />
            <DataStat label="Brain Dumps" value={brainDumps.length} color="var(--amber)" />
          </div>

          <p className="text-xs text-[var(--text-muted)] p-3 rounded-[var(--radius)] bg-[rgba(255,255,255,0.02)] border border-[var(--border)]">
            All data is stored locally in your browser's localStorage. It persists across sessions but is specific to this browser and device.
          </p>
        </Card>

        {/* Data Management */}
        <Card className="fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Download size={15} className="text-[var(--blue)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Data Management</h2>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-[var(--radius)] border border-[var(--border)]">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Export Data</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Download all your data as JSON for backup
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={<Download size={13} />}
                onClick={handleExport}
              >
                Export
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-[var(--radius)] border border-[var(--border)]">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Import Data</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Restore from a previous export
                </p>
                {importError && (
                  <p className="text-xs text-[var(--red)] mt-1">{importError}</p>
                )}
                {importSuccess && (
                  <p className="text-xs text-[var(--green)] mt-1">✓ Data imported successfully</p>
                )}
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={<Upload size={13} />}
                onClick={handleImport}
              >
                Import
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-[var(--radius)] border border-[rgba(248,113,113,0.2)] bg-[var(--red-dim)]">
              <div>
                <p className="text-sm font-medium text-[var(--red)]">Clear All Data</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Permanently delete all local data. Export first.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 size={13} />}
                onClick={() => setClearConfirm(true)}
              >
                Clear
              </Button>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="fade-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">About RPM Life OS</h2>
          <div className="space-y-2 text-xs text-[var(--text-secondary)]">
            <p><span className="text-[var(--text-muted)]">Version</span> 1.0.0</p>
            <p><span className="text-[var(--text-muted)]">Framework</span> Tony Robbins RPM Method</p>
            <p><span className="text-[var(--text-muted)]">Storage</span> Local-first (localStorage)</p>
            <p><span className="text-[var(--text-muted)]">AI</span> Anthropic Claude (claude-opus-4-6)</p>
            <p><span className="text-[var(--text-muted)]">Stack</span> React · TypeScript · Vite · Tailwind</p>
          </div>
          <div className="mt-4 p-3 rounded-[var(--radius)] bg-[var(--accent-dim)] border border-[var(--border-accent)]">
            <p className="text-xs text-[var(--accent)] font-medium mb-1">RPM Framework</p>
            <p className="text-xs text-[var(--text-secondary)]">
              RPM stands for Result → Purpose → Massive Action Plan. This system is built on Tony Robbins' methodology for high-performance goal achievement.
            </p>
          </div>
        </Card>
      </div>

      <ConfirmModal
        open={clearConfirm}
        onClose={() => setClearConfirm(false)}
        onConfirm={handleClearData}
        title="Clear All Data"
        message="This will permanently delete ALL your RPM blocks, outcomes, reviews, and daily focus sessions. This cannot be undone. Export your data first."
        confirmLabel="Clear Everything"
        danger
      />

      <ConfirmModal
        open={deleteKeyConfirm}
        onClose={() => setDeleteKeyConfirm(false)}
        onConfirm={handleDeleteKey}
        title="Remove API Key"
        message="Your Anthropic API key will be removed. AI features will no longer work."
        confirmLabel="Remove Key"
        danger
      />

      <ConfirmModal
        open={importConfirm}
        onClose={() => { setImportConfirm(false); setPendingImport(null) }}
        onConfirm={confirmImport}
        title="Confirm Import"
        message="This will replace your current data with the imported data. This cannot be undone. Make sure you have exported a backup first."
        confirmLabel="Import & Replace"
        danger
      />
    </div>
  )
}

function DataStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-[var(--radius)] bg-[rgba(255,255,255,0.02)]">
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      <span className="text-sm font-bold" style={{ color }}>{value}</span>
    </div>
  )
}
