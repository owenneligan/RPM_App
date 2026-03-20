import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Plus,
  Target,
  Trash2,
  X,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Edit3,
  ArrowLeft,
} from 'lucide-react'
import { useStore } from '../store'
import {
  RPMBlock,
  Action,
  LifeArea,
  Priority,
  Effort,
  ActionStatus,
  LIFE_AREA_CONFIG,
  EMOTIONAL_DRIVERS,
  BlockStatus,
} from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, TextArea } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Badge, PriorityBadge, LifeAreaBadge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Modal, ConfirmModal } from '../components/ui/Modal'
import { truncate, formatDate } from '../lib/utils'
import { refineResult, deepenPurpose, suggestNextActions } from '../services/ai'
import { cn } from '../lib/utils'

const LIFE_AREA_OPTIONS = (Object.keys(LIFE_AREA_CONFIG) as LifeArea[]).map((k) => ({
  value: k,
  label: LIFE_AREA_CONFIG[k].label,
  color: LIFE_AREA_CONFIG[k].color,
}))

const PRIORITY_OPTIONS = [
  { value: '1', label: 'P1 — Critical' },
  { value: '2', label: 'P2 — Important' },
  { value: '3', label: 'P3 — Nice to have' },
]

const STATUS_OPTIONS: { value: BlockStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

const ACTION_PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'must', label: 'Must Do' },
  { value: 'should', label: 'Should Do' },
  { value: 'could', label: 'Could Do' },
]

const ACTION_EFFORT_OPTIONS: { value: Effort; label: string }[] = [
  { value: 'low', label: '▁ Low' },
  { value: 'medium', label: '▃ Medium' },
  { value: 'high', label: '▆ High' },
]

export function RPMPlanner() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get('id')

  const rpmBlocks = useStore((s) => s.rpmBlocks)
  const addRPMBlock = useStore((s) => s.addRPMBlock)
  const updateRPMBlock = useStore((s) => s.updateRPMBlock)
  const deleteRPMBlock = useStore((s) => s.deleteRPMBlock)
  const addAction = useStore((s) => s.addAction)
  const updateAction = useStore((s) => s.updateAction)
  const deleteAction = useStore((s) => s.deleteAction)
  const setActionStatus = useStore((s) => s.setActionStatus)

  const [filterArea, setFilterArea] = useState<LifeArea | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<BlockStatus | 'all'>('active')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [mobileShowDetail, setMobileShowDetail] = useState(false)

  const selectedBlock = rpmBlocks.find((b) => b.id === selectedId)

  const filtered = rpmBlocks.filter((b) => {
    if (filterArea !== 'all' && b.lifeArea !== filterArea) return false
    if (filterStatus !== 'all' && b.status !== filterStatus) return false
    return true
  })

  const selectBlock = (id: string) => setSearchParams({ id })

  useEffect(() => {
    if (!selectedId && filtered.length > 0) selectBlock(filtered[0].id)
  }, [filtered.length])

  return (
    <div className="flex h-full">
      {/* Left panel — hidden on mobile when detail is open */}
      <div
        className={cn(
          'shrink-0 flex flex-col h-full overflow-hidden',
          mobileShowDetail ? 'hidden md:flex' : 'flex',
          'w-full md:w-72'
        )}
        style={{ borderRight: '1px solid var(--border)', background: 'var(--bg-base)' }}
      >
        <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-sm font-bold text-[var(--text-primary)]">RPM Planner</h1>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={13} />}
              onClick={() => setShowCreateModal(true)}
            >
              New
            </Button>
          </div>
          <div className="space-y-2">
            <Select
              value={filterStatus}
              onChange={(v) => setFilterStatus(v as BlockStatus | 'all')}
              options={[{ value: 'all', label: 'All statuses' }, ...STATUS_OPTIONS]}
            />
            <Select
              value={filterArea}
              onChange={(v) => setFilterArea(v as LifeArea | 'all')}
              options={[{ value: 'all', label: 'All areas' }, ...LIFE_AREA_OPTIONS]}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="text-center py-8 px-4">
              <Target size={22} className="text-[var(--text-muted)] mx-auto mb-2" />
              <p className="text-xs text-[var(--text-muted)]">No blocks match filters</p>
            </div>
          ) : (
            filtered.map((block) => (
              <BlockListItem
                key={block.id}
                block={block}
                isSelected={block.id === selectedId}
                onClick={() => { selectBlock(block.id); setMobileShowDetail(true) }}
                onDelete={() => setDeleteConfirm(block.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right panel — hidden on mobile when list is shown */}
      <div className={cn('flex-1 overflow-y-auto bg-[var(--bg-base)]', !mobileShowDetail && 'hidden md:block')}>
        {selectedBlock ? (
          <BlockDetail
            block={selectedBlock}
            onUpdate={(updates) => updateRPMBlock(selectedBlock.id, updates)}
            onDelete={() => setDeleteConfirm(selectedBlock.id)}
            onAddAction={(action) => addAction({ ...action, rpmBlockId: selectedBlock.id })}
            onUpdateAction={(actionId, updates) => updateAction(selectedBlock.id, actionId, updates)}
            onDeleteAction={(actionId) => deleteAction(selectedBlock.id, actionId)}
            onSetActionStatus={(actionId, status) => setActionStatus(selectedBlock.id, actionId, status)}
            onBack={() => setMobileShowDetail(false)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-center p-8">
            <div>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(43,76,126,0.07)' }}
              >
                <Target size={24} style={{ color: '#2B4C7E' }} />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                Select or create an RPM block
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mb-4 max-w-xs">
                Each block defines a compelling Result, your Purpose, and a Massive Action Plan.
              </p>
              <Button variant="primary" icon={<Plus size={14} />} onClick={() => setShowCreateModal(true)}>
                Create RPM Block
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateBlockModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(data) => {
          const block = addRPMBlock(data)
          selectBlock(block.id)
          setShowCreateModal(false)
        }}
      />

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            deleteRPMBlock(deleteConfirm)
            if (selectedId === deleteConfirm) setSearchParams({})
            setDeleteConfirm(null)
          }
        }}
        title="Delete RPM Block"
        message="This will permanently delete this block and all its actions. This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}

function BlockListItem({
  block,
  isSelected,
  onClick,
  onDelete,
}: {
  block: RPMBlock
  isSelected: boolean
  onClick: () => void
  onDelete: () => void
}) {
  const config = LIFE_AREA_CONFIG[block.lifeArea]
  const done = block.actions.filter((a) => a.status === 'done').length
  const total = block.actions.length

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 rounded-[var(--radius)] cursor-pointer transition-all group relative',
        isSelected
          ? 'border border-[rgba(43,76,126,0.2)]'
          : 'border border-transparent hover:border-[var(--border)] hover:bg-[var(--bg-card-hover)]'
      )}
      style={isSelected ? { background: 'rgba(43,76,126,0.05)' } : {}}
    >
      <div className="flex items-start gap-2 mb-1.5">
        <div
          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
          style={{ background: config.color }}
        />
        <p className={cn(
          'text-xs font-medium leading-snug flex-1',
          isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
        )}>
          {truncate(block.result, 55)}
        </p>
      </div>
      <div className="flex items-center gap-1.5 pl-3.5">
        <span className="text-[10px] font-medium" style={{ color: config.color }}>
          {config.label}
        </span>
        <span className="text-[var(--text-muted)] text-[10px]">·</span>
        <span className="text-[10px] text-[var(--text-muted)]">P{block.priority}</span>
        {total > 0 && (
          <>
            <span className="text-[var(--text-muted)] text-[10px]">·</span>
            <span className="text-[10px] text-[var(--text-muted)]">{done}/{total}</span>
          </>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[rgba(179,92,68,0.08)] text-[var(--text-muted)] hover:text-[var(--red)] transition-all"
      >
        <Trash2 size={11} />
      </button>
    </div>
  )
}

function BlockDetail({
  block, onUpdate, onDelete, onAddAction, onUpdateAction, onDeleteAction, onSetActionStatus, onBack,
}: {
  block: RPMBlock
  onUpdate: (u: Partial<RPMBlock>) => void
  onDelete: () => void
  onAddAction: (a: Omit<Action, 'id' | 'rpmBlockId'>) => void
  onUpdateAction: (id: string, u: Partial<Action>) => void
  onDeleteAction: (id: string) => void
  onSetActionStatus: (id: string, s: ActionStatus) => void
  onBack?: () => void
}) {
  const config = LIFE_AREA_CONFIG[block.lifeArea]
  const [aiLoading, setAiLoading] = useState<string | null>(null)

  const handleRefineResult = async () => {
    if (!block.result) return
    setAiLoading('result')
    try {
      const refined = await refineResult(block.result)
      onUpdate({ result: refined.trim() })
    } catch {}
    setAiLoading(null)
  }

  const handleDeepenPurpose = async () => {
    setAiLoading('purpose')
    try {
      const deepened = await deepenPurpose(block.result, block.purpose)
      onUpdate({ purpose: deepened.trim() })
    } catch {}
    setAiLoading(null)
  }

  const handleSuggestActions = async () => {
    setAiLoading('actions')
    try {
      const suggestions = await suggestNextActions(block.result, block.actions.map((a) => a.title))
      suggestions.forEach((title, i) => {
        onAddAction({ title, priority: 'should', effort: 'medium', sequence: block.actions.length + i, status: 'todo' })
      })
    } catch {}
    setAiLoading(null)
  }

  const done = block.actions.filter((a) => a.status === 'done').length
  const total = block.actions.length

  return (
    <div className="p-4 md:p-6 max-w-3xl">
      {/* Mobile back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-4 hover:text-[var(--accent)] transition-colors"
        >
          <ArrowLeft size={13} /> Back to list
        </button>
      )}
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[var(--radius-lg)] flex items-center justify-center"
            style={{ background: config.bgColor }}
          >
            <Target size={16} style={{ color: config.color }} />
          </div>
          <div>
            <LifeAreaBadge area={block.lifeArea} />
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              Created {formatDate(block.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={block.status}
            onChange={(v) => onUpdate({ status: v as BlockStatus })}
            options={STATUS_OPTIONS}
          />
          <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <Select
          value={String(block.priority)}
          onChange={(v) => onUpdate({ priority: Number(v) as 1 | 2 | 3 })}
          options={PRIORITY_OPTIONS}
        />
        <Select
          value={block.lifeArea}
          onChange={(v) => onUpdate({ lifeArea: v as LifeArea })}
          options={LIFE_AREA_OPTIONS}
        />
        <Input
          type="date"
          value={block.targetDate || ''}
          onChange={(e) => onUpdate({ targetDate: e.target.value })}
          className="w-40"
        />
        {total > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <ProgressBar value={done} max={total} color={config.color} size="sm" className="w-24" />
            <span className="text-xs text-[var(--text-muted)]">{done}/{total}</span>
          </div>
        )}
      </div>

      {/* R — Result */}
      <Section label="R — Result" color={config.color} hint="The specific, compelling outcome you are committed to achieving">
        <div className="relative">
          <TextArea
            value={block.result}
            onChange={(e) => onUpdate({ result: e.target.value })}
            placeholder="What is the specific, compelling result you are committed to achieving?"
            rows={3}
            className="text-[15px] font-medium pr-28"
          />
          <button
            onClick={handleRefineResult}
            disabled={aiLoading === 'result' || !block.result}
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all disabled:opacity-40"
            style={{ color: '#C9963D', background: 'rgba(201,150,61,0.12)' }}
          >
            <Sparkles size={10} />
            {aiLoading === 'result' ? 'Refining…' : 'AI Refine'}
          </button>
        </div>
      </Section>

      {/* P — Purpose */}
      <Section label="P — Purpose" color="#B8893A" hint="The deep emotional WHY — what achieving this truly means to you">
        <div className="relative">
          <TextArea
            value={block.purpose}
            onChange={(e) => onUpdate({ purpose: e.target.value })}
            placeholder="Why does this result matter deeply? What does it mean for your life, your identity, your future?"
            rows={3}
            className="pr-28"
          />
          <button
            onClick={handleDeepenPurpose}
            disabled={aiLoading === 'purpose' || !block.result}
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all disabled:opacity-40"
            style={{ color: '#C9963D', background: 'rgba(201,150,61,0.12)' }}
          >
            <Sparkles size={10} />
            {aiLoading === 'purpose' ? 'Deepening…' : 'AI Deepen'}
          </button>
        </div>
      </Section>

      {/* Emotional Drivers */}
      <Section label="Emotional Drivers" color="#B35C44" hint="The core human needs this result fulfils">
        <EmotionalDriverSelector
          selected={block.emotionalDrivers}
          onChange={(drivers) => onUpdate({ emotionalDrivers: drivers })}
        />
      </Section>

      {/* Identity */}
      <Section label="Identity Alignment" color="#3F7D6A" hint="Who must you become to achieve this result?">
        <Input
          value={block.identityAlignment}
          onChange={(e) => onUpdate({ identityAlignment: e.target.value })}
          placeholder="I am becoming someone who…"
        />
      </Section>

      {/* M — Massive Action Plan */}
      <Section
        label="M — Massive Action Plan"
        color="#3B6EA8"
        hint="The specific, prioritised actions that will make this result inevitable"
        action={
          <button
            onClick={handleSuggestActions}
            disabled={aiLoading === 'actions' || !block.result}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all disabled:opacity-40"
            style={{ color: '#C9963D', background: 'rgba(201,150,61,0.12)' }}
          >
            <Sparkles size={10} />
            {aiLoading === 'actions' ? 'Suggesting…' : 'AI Suggest'}
          </button>
        }
      >
        <ActionList
          actions={block.actions}
          onAdd={onAddAction}
          onUpdate={onUpdateAction}
          onDelete={onDeleteAction}
          onSetStatus={onSetActionStatus}
        />
      </Section>

      {/* Progress Notes */}
      <Section label="Progress Notes" color="var(--text-muted)" hint="Ongoing notes, observations, reflections">
        <TextArea
          value={block.progressNotes}
          onChange={(e) => onUpdate({ progressNotes: e.target.value })}
          placeholder="Capture wins, blockers, insights and adjustments as you progress…"
          rows={4}
        />
      </Section>
    </div>
  )
}

function Section({
  label, color, hint, children, action,
}: {
  label: string; color: string; hint?: string; children: React.ReactNode; action?: React.ReactNode
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color }}
          >
            {label}
          </h3>
          {hint && <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function EmotionalDriverSelector({ selected, onChange }: { selected: string[]; onChange: (d: string[]) => void }) {
  const toggle = (driver: string) => {
    onChange(selected.includes(driver) ? selected.filter((d) => d !== driver) : [...selected, driver])
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {EMOTIONAL_DRIVERS.map((driver) => (
        <button
          key={driver}
          onClick={() => toggle(driver)}
          className={cn(
            'px-2.5 py-1 rounded-full text-xs font-medium transition-all border',
            selected.includes(driver)
              ? 'border-[rgba(179,92,68,0.25)] text-[#B35C44]'
              : 'text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-bright)] hover:text-[var(--text-secondary)]'
          )}
          style={selected.includes(driver) ? { background: 'rgba(179,92,68,0.07)' } : {}}
        >
          {driver}
        </button>
      ))}
    </div>
  )
}

function ActionList({
  actions, onAdd, onUpdate, onDelete, onSetStatus,
}: {
  actions: Action[]
  onAdd: (a: Omit<Action, 'id' | 'rpmBlockId'>) => void
  onUpdate: (id: string, u: Partial<Action>) => void
  onDelete: (id: string) => void
  onSetStatus: (id: string, s: ActionStatus) => void
}) {
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState<Priority>('should')
  const [newEffort, setNewEffort] = useState<Effort>('medium')
  const [editingId, setEditingId] = useState<string | null>(null)

  const sorted = [...actions].sort((a, b) => {
    const order = { must: 0, should: 1, could: 2 }
    return order[a.priority] - order[b.priority]
  })

  const handleAdd = () => {
    if (!newTitle.trim()) return
    onAdd({ title: newTitle.trim(), priority: newPriority, effort: newEffort, sequence: actions.length, status: 'todo' })
    setNewTitle('')
  }

  const statusIcon = (status: ActionStatus) => ({
    todo: <Circle size={15} className="text-[var(--text-muted)]" />,
    'in-progress': <Clock size={15} style={{ color: '#3B6EA8' }} />,
    done: <CheckCircle2 size={15} style={{ color: '#3F7D6A' }} />,
    blocked: <AlertCircle size={15} style={{ color: '#B35C44' }} />,
  }[status])

  const cycleStatus = (action: Action) => {
    const cycle: ActionStatus[] = ['todo', 'in-progress', 'done', 'blocked']
    onSetStatus(action.id, cycle[(cycle.indexOf(action.status) + 1) % cycle.length])
  }

  return (
    <div className="space-y-1.5">
      {sorted.map((action) => (
        <div
          key={action.id}
          className={cn(
            'flex items-start gap-2.5 p-2.5 rounded-[var(--radius)] border transition-all group',
            action.status === 'done'
              ? 'border-[rgba(63,125,106,0.2)]'
              : action.status === 'blocked'
              ? 'border-[rgba(179,92,68,0.2)]'
              : 'border-[var(--border)] hover:border-[var(--border-bright)]'
          )}
          style={
            action.status === 'done'
              ? { background: 'rgba(63,125,106,0.06)' }
              : action.status === 'blocked'
              ? { background: 'rgba(179,92,68,0.05)' }
              : {}
          }
        >
          <button onClick={() => cycleStatus(action)} className="mt-0.5 shrink-0">
            {statusIcon(action.status)}
          </button>
          <div className="flex-1 min-w-0">
            {editingId === action.id ? (
              <input
                autoFocus
                value={action.title}
                onChange={(e) => onUpdate(action.id, { title: e.target.value })}
                onBlur={() => setEditingId(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none border-b border-[rgba(43,76,126,0.3)] pb-0.5"
              />
            ) : (
              <p className={cn('text-sm leading-snug', action.status === 'done' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]')}>
                {action.title}
              </p>
            )}
            <div className="flex items-center gap-1.5 mt-1">
              <PriorityBadge priority={action.priority} />
              <Badge variant="default" className="text-[9px] py-0">
                {action.effort === 'low' ? '▁' : action.effort === 'medium' ? '▃' : '▆'} {action.effort}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setEditingId(action.id)} className="p-1 rounded hover:bg-[rgba(0,0,0,0.05)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-all">
              <Edit3 size={11} />
            </button>
            <button onClick={() => onDelete(action.id)} className="p-1 rounded hover:bg-[rgba(179,92,68,0.08)] text-[var(--text-muted)] hover:text-[var(--red)] transition-all">
              <Trash2 size={11} />
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2 pt-1">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add action step…"
          className={cn(
            'flex-1 h-9 px-3 rounded-[var(--radius)] text-sm',
            'bg-[var(--bg-input)] border border-dashed border-[var(--border)]',
            'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
            'focus:border-[var(--border-accent)] focus:ring-2 focus:ring-[var(--accent-dim)] focus:bg-[var(--bg-input)] outline-none transition-all'
          )}
        />
        <Select value={newPriority} onChange={(v) => setNewPriority(v as Priority)} options={ACTION_PRIORITY_OPTIONS} className="w-28" />
        <Select value={newEffort} onChange={(v) => setNewEffort(v as Effort)} options={ACTION_EFFORT_OPTIONS} className="w-28" />
        <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={handleAdd} disabled={!newTitle.trim()}>
          Add
        </Button>
      </div>
    </div>
  )
}

function CreateBlockModal({ open, onClose, onCreate }: {
  open: boolean
  onClose: () => void
  onCreate: (data: Omit<RPMBlock, 'id' | 'createdAt' | 'updatedAt' | 'actions'>) => void
}) {
  const [result, setResult] = useState('')
  const [purpose, setPurpose] = useState('')
  const [lifeArea, setLifeArea] = useState<LifeArea>('growth')
  const [priority, setPriority] = useState<'1' | '2' | '3'>('2')

  const handleCreate = () => {
    if (!result.trim()) return
    onCreate({ result: result.trim(), purpose: purpose.trim(), emotionalDrivers: [], identityAlignment: '', lifeArea, status: 'active', priority: Number(priority) as 1 | 2 | 3, progressNotes: '' })
    setResult(''); setPurpose(''); setLifeArea('growth'); setPriority('2')
  }

  return (
    <Modal open={open} onClose={onClose} title="New RPM Block" subtitle="Define a compelling result and its purpose" size="md"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" onClick={handleCreate} disabled={!result.trim()}>Create Block</Button></>}
    >
      <div className="space-y-4">
        <TextArea label="Result" value={result} onChange={(e) => setResult(e.target.value)} placeholder="What is the specific, compelling outcome you are committed to achieving?" rows={3} hint="Be specific. Use active language. Make it measurable." />
        <TextArea label="Purpose (Why)" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Why does this matter deeply to you?" rows={2} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Life Area" value={lifeArea} onChange={(v) => setLifeArea(v as LifeArea)} options={LIFE_AREA_OPTIONS} />
          <Select label="Priority" value={priority} onChange={(v) => setPriority(v as '1' | '2' | '3')} options={PRIORITY_OPTIONS} />
        </div>
      </div>
    </Modal>
  )
}
