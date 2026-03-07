import React, { useState } from 'react'
import { Plus, Compass, Trash2, Edit3, CheckCircle2, Minus } from 'lucide-react'
import { useStore } from '../store'
import { Outcome, LifeArea, LIFE_AREA_CONFIG } from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, TextArea } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Badge, LifeAreaBadge } from '../components/ui/Badge'
import { Modal, ConfirmModal } from '../components/ui/Modal'
import { ProgressBar, ScoreRing } from '../components/ui/ProgressBar'
import { formatDate, truncate } from '../lib/utils'
import { cn } from '../lib/utils'

const LIFE_AREA_OPTIONS = (Object.keys(LIFE_AREA_CONFIG) as LifeArea[]).map((k) => ({
  value: k,
  label: LIFE_AREA_CONFIG[k].label,
  color: LIFE_AREA_CONFIG[k].color,
}))

export function OutcomeEngine() {
  const outcomes = useStore((s) => s.outcomes)
  const addOutcome = useStore((s) => s.addOutcome)
  const updateOutcome = useStore((s) => s.updateOutcome)
  const deleteOutcome = useStore((s) => s.deleteOutcome)
  const rpmBlocks = useStore((s) => s.rpmBlocks)

  const [filterArea, setFilterArea] = useState<LifeArea | 'all'>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = outcomes.filter(
    (o) => filterArea === 'all' || o.lifeArea === filterArea
  )

  const grouped = (Object.keys(LIFE_AREA_CONFIG) as LifeArea[]).reduce((acc, area) => {
    acc[area] = filtered.filter((o) => o.lifeArea === area)
    return acc
  }, {} as Record<LifeArea, Outcome[]>)

  const editingOutcome = editingId ? outcomes.find((o) => o.id === editingId) : null

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 fade-up">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Compass size={22} className="text-[var(--accent)]" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                Outcome Engine
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Define compelling outcomes across all 7 life domains
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select
              value={filterArea}
              onChange={(v) => setFilterArea(v as LifeArea | 'all')}
              options={[{ value: 'all', label: 'All areas' }, ...LIFE_AREA_OPTIONS]}
              className="flex-1 sm:w-40"
            />
            <Button
              variant="primary"
              icon={<Plus size={14} />}
              onClick={() => setShowCreate(true)}
            >
              New Outcome
            </Button>
          </div>
        </div>
      </div>

      {/* Life area groups */}
      {filterArea === 'all' ? (
        <div className="space-y-6">
          {(Object.keys(LIFE_AREA_CONFIG) as LifeArea[]).map((area) => {
            const areaOutcomes = grouped[area]
            if (areaOutcomes.length === 0) return null
            return (
              <AreaGroup
                key={area}
                area={area}
                outcomes={areaOutcomes}
                onEdit={(id) => setEditingId(id)}
                onDelete={(id) => setDeleteConfirm(id)}
                onUpdateScore={(id, score) => updateOutcome(id, { currentScore: score })}
                rpmBlocks={rpmBlocks}
              />
            )
          })}

          {filtered.length === 0 && (
            <EmptyState onCreate={() => setShowCreate(true)} />
          )}
        </div>
      ) : (
        <div>
          {filtered.length === 0 ? (
            <EmptyState onCreate={() => setShowCreate(true)} area={filterArea} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((outcome) => (
                <OutcomeCard
                  key={outcome.id}
                  outcome={outcome}
                  onEdit={() => setEditingId(outcome.id)}
                  onDelete={() => setDeleteConfirm(outcome.id)}
                  onUpdateScore={(score) => updateOutcome(outcome.id, { currentScore: score })}
                  linkedBlocks={rpmBlocks.filter((b) =>
                    outcome.linkedRPMBlocks.includes(b.id)
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Area overview rings when showing all */}
      {filterArea === 'all' && outcomes.length > 0 && (
        <div className="mt-8 fade-up">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            Outcomes by Domain
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
            {(Object.keys(LIFE_AREA_CONFIG) as LifeArea[]).map((area) => {
              const areaOuts = outcomes.filter((o) => o.lifeArea === area)
              const avgScore =
                areaOuts.length > 0
                  ? areaOuts.reduce((s, o) => s + o.currentScore, 0) / areaOuts.length
                  : 0
              return (
                <div
                  key={area}
                  className="p-3 rounded-[var(--radius-lg)] border border-[var(--border)] text-center"
                  style={{ background: LIFE_AREA_CONFIG[area].bgColor }}
                >
                  <ScoreRing
                    score={Math.round(avgScore)}
                    max={10}
                    color={LIFE_AREA_CONFIG[area].color}
                    size={48}
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-2">
                    {LIFE_AREA_CONFIG[area].label.replace('Personal ', '')}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    {areaOuts.length} outcome{areaOuts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Create Modal */}
      <CreateOutcomeModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={(data) => {
          addOutcome(data)
          setShowCreate(false)
        }}
      />

      {/* Edit Modal */}
      {editingOutcome && (
        <EditOutcomeModal
          open={!!editingId}
          outcome={editingOutcome}
          onClose={() => setEditingId(null)}
          onSave={(updates) => {
            updateOutcome(editingId!, updates)
            setEditingId(null)
          }}
        />
      )}

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => { if (deleteConfirm) deleteOutcome(deleteConfirm) }}
        title="Delete Outcome"
        message="This outcome will be permanently deleted."
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}

function AreaGroup({
  area,
  outcomes,
  onEdit,
  onDelete,
  onUpdateScore,
  rpmBlocks,
}: {
  area: LifeArea
  outcomes: Outcome[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onUpdateScore: (id: string, score: number) => void
  rpmBlocks: import('../types').RPMBlock[]
}) {
  const config = LIFE_AREA_CONFIG[area]
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full" style={{ background: config.color }} />
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">{config.label}</h2>
        <span className="text-xs text-[var(--text-muted)]">{outcomes.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {outcomes.map((outcome) => (
          <OutcomeCard
            key={outcome.id}
            outcome={outcome}
            onEdit={() => onEdit(outcome.id)}
            onDelete={() => onDelete(outcome.id)}
            onUpdateScore={(score) => onUpdateScore(outcome.id, score)}
            linkedBlocks={rpmBlocks.filter((b) => outcome.linkedRPMBlocks.includes(b.id))}
          />
        ))}
      </div>
    </div>
  )
}

function OutcomeCard({
  outcome,
  onEdit,
  onDelete,
  onUpdateScore,
  linkedBlocks,
}: {
  outcome: Outcome
  onEdit: () => void
  onDelete: () => void
  onUpdateScore: (score: number) => void
  linkedBlocks: import('../types').RPMBlock[]
}) {
  const config = LIFE_AREA_CONFIG[outcome.lifeArea]
  const isAchieved = outcome.status === 'achieved'

  return (
    <Card
      className="group"
      style={{ borderLeft: `3px solid ${config.color}` }}
      hoverable
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3
          className={cn(
            'text-sm font-semibold leading-snug flex-1',
            isAchieved ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
          )}
        >
          {outcome.title}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-[rgba(255,255,255,0.06)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-all"
          >
            <Edit3 size={11} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-[var(--red-dim)] text-[var(--text-muted)] hover:text-[var(--red)] transition-all"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {outcome.purpose && (
        <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">
          {outcome.purpose}
        </p>
      )}

      {/* Score */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => onUpdateScore(Math.max(1, outcome.currentScore - 1))}
          className="w-5 h-5 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.06)] flex items-center justify-center transition-all"
        >
          <Minus size={10} />
        </button>
        <ProgressBar
          value={outcome.currentScore}
          max={10}
          color={config.color}
          size="sm"
          className="flex-1"
        />
        <button
          onClick={() => onUpdateScore(Math.min(10, outcome.currentScore + 1))}
          className="w-5 h-5 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.06)] flex items-center justify-center transition-all"
        >
          <Plus size={10} />
        </button>
        <span className="text-xs font-semibold w-6 text-right" style={{ color: config.color }}>
          {outcome.currentScore}
        </span>
      </div>

      {outcome.measurableIndicators.length > 0 && (
        <div className="mt-2">
          {outcome.measurableIndicators.slice(0, 2).map((ind, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
              <CheckCircle2 size={9} />
              {ind}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--border)]">
        {isAchieved ? (
          <Badge variant="green" dot>Achieved</Badge>
        ) : (
          <LifeAreaBadge area={outcome.lifeArea} />
        )}
        {linkedBlocks.length > 0 && (
          <span className="text-[10px] text-[var(--text-muted)] ml-auto">
            {linkedBlocks.length} RPM block{linkedBlocks.length !== 1 ? 's' : ''}
          </span>
        )}
        {outcome.targetDate && (
          <span className="text-[10px] text-[var(--text-muted)] ml-auto">
            {formatDate(outcome.targetDate)}
          </span>
        )}
      </div>
    </Card>
  )
}

function CreateOutcomeModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (data: Omit<Outcome, 'id' | 'createdAt'>) => void
}) {
  const [title, setTitle] = useState('')
  const [purpose, setPurpose] = useState('')
  const [lifeArea, setLifeArea] = useState<LifeArea>('growth')
  const [indicator, setIndicator] = useState('')
  const [indicators, setIndicators] = useState<string[]>([])
  const [targetDate, setTargetDate] = useState('')

  const addIndicator = () => {
    if (indicator.trim()) {
      setIndicators((prev) => [...prev, indicator.trim()])
      setIndicator('')
    }
  }

  const handleCreate = () => {
    if (!title.trim()) return
    onCreate({
      title: title.trim(),
      purpose: purpose.trim(),
      lifeArea,
      measurableIndicators: indicators,
      targetDate: targetDate || undefined,
      currentScore: 5,
      linkedRPMBlocks: [],
      status: 'active',
    })
    setTitle('')
    setPurpose('')
    setLifeArea('growth')
    setIndicators([])
    setIndicator('')
    setTargetDate('')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Outcome"
      subtitle="Define a compelling outcome for a life domain"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate} disabled={!title.trim()}>
            Create Outcome
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Outcome"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What specific outcome do you want to achieve?"
        />
        <TextArea
          label="Purpose (Why)"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Why does this outcome matter?"
          rows={2}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Life Area"
            value={lifeArea}
            onChange={(v) => setLifeArea(v as LifeArea)}
            options={LIFE_AREA_OPTIONS}
          />
          <Input
            label="Target Date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide block mb-1.5">
            Measurable Indicators
          </label>
          <div className="flex gap-2 mb-2">
            <input
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addIndicator()}
              placeholder="How will you know you've achieved this?"
              className="flex-1 h-9 px-3 rounded-[var(--radius)] text-sm bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-accent)] outline-none transition-all"
            />
            <Button variant="secondary" size="sm" onClick={addIndicator}>Add</Button>
          </div>
          <div className="space-y-1">
            {indicators.map((ind, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <CheckCircle2 size={11} className="text-[var(--green)]" />
                {ind}
                <button
                  onClick={() => setIndicators((prev) => prev.filter((_, j) => j !== i))}
                  className="ml-auto text-[var(--text-muted)] hover:text-[var(--red)] transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

function EditOutcomeModal({
  open,
  outcome,
  onClose,
  onSave,
}: {
  open: boolean
  outcome: Outcome
  onClose: () => void
  onSave: (updates: Partial<Outcome>) => void
}) {
  const [title, setTitle] = useState(outcome.title)
  const [purpose, setPurpose] = useState(outcome.purpose)
  const [status, setStatus] = useState(outcome.status)
  const [targetDate, setTargetDate] = useState(outcome.targetDate || '')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Outcome"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => onSave({ title, purpose, status: status as Outcome['status'], targetDate: targetDate || undefined })}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Outcome"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextArea
          label="Purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          rows={2}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Status"
            value={status}
            onChange={(v) => setStatus(v as Outcome['status'])}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'achieved', label: 'Achieved' },
              { value: 'deferred', label: 'Deferred' },
            ]}
          />
          <Input
            label="Target Date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  )
}

function EmptyState({ onCreate, area }: { onCreate: () => void; area?: LifeArea }) {
  return (
    <Card padding="lg" className="text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-[var(--accent-dim)] flex items-center justify-center mx-auto mb-4">
        <Compass size={20} className="text-[var(--accent)]" />
      </div>
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
        {area ? `No ${LIFE_AREA_CONFIG[area].label} outcomes yet` : 'No outcomes defined'}
      </h3>
      <p className="text-xs text-[var(--text-secondary)] mb-4">
        Outcomes are the compelling results you want to achieve across your 7 life domains. Each links to RPM blocks and action plans.
      </p>
      <Button variant="primary" icon={<Plus size={14} />} onClick={onCreate}>
        Create Outcome
      </Button>
    </Card>
  )
}
