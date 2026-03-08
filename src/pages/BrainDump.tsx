import React, { useState } from 'react'
import {
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Target,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { useStore } from '../store'
import { BrainDump as BrainDumpType, LIFE_AREA_CONFIG, LifeArea } from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge, LifeAreaBadge, PriorityBadge } from '../components/ui/Badge'
import { ConfirmModal } from '../components/ui/Modal'
import { convertBrainDump } from '../services/ai'
import { formatDate, truncate } from '../lib/utils'
import { cn } from '../lib/utils'

export function BrainDump() {
  const brainDumps = useStore((s) => s.brainDumps)
  const addBrainDump = useStore((s) => s.addBrainDump)
  const updateBrainDump = useStore((s) => s.updateBrainDump)
  const deleteBrainDump = useStore((s) => s.deleteBrainDump)
  const applyBrainDump = useStore((s) => s.applyBrainDump)

  const [rawText, setRawText] = useState('')
  const [converting, setConverting] = useState<string | null>(null)
  const [selectedDump, setSelectedDump] = useState<BrainDumpType | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [applied, setApplied] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!rawText.trim()) return

    const dump = addBrainDump(rawText.trim())
    setRawText('')
    setError(null)
    setConverting(dump.id)

    try {
      updateBrainDump(dump.id, { status: 'converting' })
      const converted = await convertBrainDump(dump.rawText)
      updateBrainDump(dump.id, { convertedBlock: converted as any, status: 'converted' })
      setSelectedDump({ ...dump, convertedBlock: converted as any, status: 'converted' })
    } catch (e: any) {
      setError(e.message || 'AI conversion failed. Check your API key in Settings.')
      updateBrainDump(dump.id, { status: 'raw' })
      setSelectedDump(null)
    } finally {
      setConverting(null)
    }
  }

  const handleApply = (dumpId: string) => {
    const block = applyBrainDump(dumpId)
    if (block) {
      setApplied(dumpId)
      setTimeout(() => setApplied(null), 3000)
    }
  }

  const currentDump = selectedDump
    ? brainDumps.find((d) => d.id === selectedDump.id) || selectedDump
    : null

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 fade-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--accent-dim)] flex items-center justify-center">
            <Zap size={18} className="text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Brain Dump → RPM
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Dump your raw thoughts. AI converts them into a structured RPM block.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left — input */}
        <div className="space-y-4 fade-up" style={{ animationDelay: '0.05s' }}>
          <Card>
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              Brain Dump Zone
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Write anything — a goal, a worry, a project idea, a problem you're facing. Don't filter. Just dump it all.
            </p>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`Example:\n\nI need to build out my financial services consulting practice. There's so much to do — I'm not sure where to start. Need to build a website, get some initial clients, develop a signature offer maybe around Lean Six Sigma for financial firms. Been thinking about this for months. Revenue target is £200k in year one. Main blocker is not knowing which niche to focus on first...`}
              rows={12}
              className={cn(
                'w-full rounded-[var(--radius)] bg-[var(--bg-input)] border border-[var(--border)]',
                'text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
                'px-4 py-3 resize-none transition-all',
                'focus:border-[var(--border-accent)] focus:ring-2 focus:ring-[var(--accent-dim)] outline-none',
                'leading-relaxed'
              )}
            />

            {error && (
              <div className="flex items-start gap-2 mt-3 p-3 rounded-[var(--radius)] bg-[var(--red-dim)] border border-[rgba(248,113,113,0.2)]">
                <AlertTriangle size={14} className="text-[var(--red)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--red)]">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-[var(--text-muted)]">
                {rawText.length} characters
              </p>
              <Button
                variant="primary"
                icon={<Sparkles size={14} />}
                onClick={handleSubmit}
                loading={!!converting}
                disabled={!rawText.trim() || !!converting}
              >
                {converting ? 'Converting to RPM…' : 'Convert to RPM Block'}
              </Button>
            </div>
          </Card>

          {/* How it works */}
          <Card padding="sm" className="border-dashed" style={{ borderColor: 'var(--border-bright)' }}>
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
              How it works
            </p>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Dump your raw thoughts, ideas, or problems' },
                { step: '2', text: 'AI extracts a compelling Result and deep Purpose' },
                { step: '3', text: 'A prioritised Massive Action Plan is generated' },
                { step: '4', text: 'Review, adjust, and apply to your RPM system' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-[10px] font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <p className="text-xs text-[var(--text-secondary)]">{item.text}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Previous dumps */}
          {brainDumps.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                Previous Dumps
              </h3>
              <div className="space-y-1.5">
                {brainDumps.slice(0, 5).map((dump) => (
                  <div
                    key={dump.id}
                    onClick={() => setSelectedDump(dump)}
                    className={cn(
                      'flex items-center gap-2.5 p-2.5 rounded-[var(--radius)] border cursor-pointer transition-all group',
                      currentDump?.id === dump.id
                        ? 'border-[var(--border-accent)] bg-[var(--accent-dim)]'
                        : 'border-[var(--border)] hover:border-[var(--border-bright)]'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--text-secondary)] truncate">
                        {truncate(dump.rawText, 50)}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <DumpStatusBadge status={dump.status} />
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {formatDate(dump.createdAt)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(dump.id) }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-[var(--text-muted)] hover:text-[var(--red)] transition-all"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — converted result */}
        <div className="fade-up" style={{ animationDelay: '0.1s' }}>
          {converting ? (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center py-12">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-[var(--accent-dim)] animate-ping" />
                  <div className="w-16 h-16 rounded-full bg-[var(--accent-dim)] flex items-center justify-center">
                    <Sparkles size={24} className="text-[var(--accent)]" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Converting to RPM…
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  AI is analysing your thoughts and extracting Result, Purpose, and Actions
                </p>
              </div>
            </Card>
          ) : currentDump?.convertedBlock ? (
            <ConvertedResult
              dump={currentDump}
              onApply={() => handleApply(currentDump.id)}
              applied={applied === currentDump.id}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center py-12 px-6">
                <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.03)] flex items-center justify-center mx-auto mb-4">
                  <ArrowRight size={24} className="text-[var(--text-muted)]" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Your RPM block will appear here
                </h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-xs">
                  Write your thoughts on the left, then click "Convert to RPM Block" to have AI structure them for you.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => { if (deleteConfirm) deleteBrainDump(deleteConfirm) }}
        title="Delete Brain Dump"
        message="This dump and its converted block will be permanently deleted."
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}

function ConvertedResult({
  dump,
  onApply,
  applied,
}: {
  dump: BrainDumpType
  onApply: () => void
  applied: boolean
}) {
  const block = dump.convertedBlock!
  const config = block.lifeArea ? LIFE_AREA_CONFIG[block.lifeArea as LifeArea] : null
  const actions = (block.actions || []) as any[]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[var(--accent)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">RPM Block Generated</span>
        </div>
        {dump.status !== 'applied' ? (
          <Button
            variant="primary"
            size="sm"
            icon={applied ? <CheckCircle2 size={13} /> : <Target size={13} />}
            onClick={onApply}
          >
            {applied ? 'Applied!' : 'Add to RPM Planner'}
          </Button>
        ) : (
          <Badge variant="green" dot>Applied to RPM Planner</Badge>
        )}
      </div>

      {/* R — Result */}
      <Card style={{ borderLeft: '3px solid var(--accent)' }}>
        <p className="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wider mb-2">
          R — Result
        </p>
        <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
          {block.result}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {config && <LifeAreaBadge area={block.lifeArea as LifeArea} />}
          {block.targetDate && (
            <Badge variant="default">
              <Clock size={10} /> {block.targetDate}
            </Badge>
          )}
        </div>
      </Card>

      {/* P — Purpose */}
      <Card style={{ borderLeft: '3px solid var(--gold)' }}>
        <p className="text-[10px] font-semibold text-[var(--gold)] uppercase tracking-wider mb-2">
          P — Purpose
        </p>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{block.purpose}</p>

        {block.emotionalDrivers && block.emotionalDrivers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(block.emotionalDrivers as string[]).map((d) => (
              <span
                key={d}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--gold-dim)] text-[var(--gold)]"
              >
                {d}
              </span>
            ))}
          </div>
        )}

        {block.identityAlignment && (
          <div className="mt-3 pt-3 border-t border-[var(--border)]">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide mb-1">Identity</p>
            <p className="text-xs text-[var(--text-secondary)] italic">"{block.identityAlignment}"</p>
          </div>
        )}
      </Card>

      {/* M — Actions */}
      <Card style={{ borderLeft: '3px solid var(--blue)' }}>
        <p className="text-[10px] font-semibold text-[var(--blue)] uppercase tracking-wider mb-3">
          M — Massive Action Plan
        </p>
        <div className="space-y-2">
          {actions.map((action: any, i: number) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-2 rounded-[var(--radius-sm)] bg-[rgba(255,255,255,0.03)]"
            >
              <span className="text-[10px] font-bold text-[var(--text-muted)] w-4 shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--text-primary)]">{action.title}</p>
                {action.notes && (
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{action.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <PriorityBadge priority={action.priority} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function DumpStatusBadge({ status }: { status: BrainDumpType['status'] }) {
  const config = {
    raw: { label: 'Raw', variant: 'default' as const },
    converting: { label: 'Converting…', variant: 'blue' as const },
    converted: { label: 'Converted', variant: 'green' as const },
    applied: { label: 'Applied', variant: 'accent' as const },
  }
  const c = config[status]
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}
