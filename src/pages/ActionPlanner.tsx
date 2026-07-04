import React, { useState } from 'react'
import {
  CheckSquare,
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Target,
  Plus,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { ActionStatus, Priority, Effort, LifeArea, LIFE_AREA_CONFIG } from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, TextArea } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Badge, PriorityBadge, StatusBadge, LifeAreaBadge, EffortBadge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Modal } from '../components/ui/Modal'
import { truncate } from '../lib/utils'
import { cn } from '../lib/utils'

type StatusFilter = ActionStatus | 'all'
type AreaFilter = LifeArea | 'all'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'blocked', label: 'Blocked' },
]

const AREA_OPTIONS = [
  { value: 'all', label: 'All areas' },
  ...(Object.keys(LIFE_AREA_CONFIG) as LifeArea[]).map((k) => ({
    value: k,
    label: LIFE_AREA_CONFIG[k].label,
    color: LIFE_AREA_CONFIG[k].color,
  })),
]

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All priorities' },
  { value: 'must', label: 'Must Do' },
  { value: 'should', label: 'Should Do' },
  { value: 'could', label: 'Could Do' },
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

export function ActionPlanner() {
  const rpmBlocks = useStore((s) => s.rpmBlocks)
  const setActionStatus = useStore((s) => s.setActionStatus)
  const addAction = useStore((s) => s.addAction)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [view, setView] = useState<'list' | 'board'>('list')

  const [showAddModal, setShowAddModal] = useState(false)
  const [newBlockId, setNewBlockId] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState<Priority>('should')
  const [newEffort, setNewEffort] = useState<Effort>('medium')
  const [newNotes, setNewNotes] = useState('')

  const activeBlocks = rpmBlocks.filter((b) => b.status !== 'archived')

  const openAddModal = () => {
    setNewBlockId(activeBlocks[0]?.id ?? '')
    setNewTitle('')
    setNewPriority('should')
    setNewEffort('medium')
    setNewNotes('')
    setShowAddModal(true)
  }

  const handleAddAction = () => {
    if (!newTitle.trim() || !newBlockId) return
    const block = rpmBlocks.find((b) => b.id === newBlockId)
    addAction({
      rpmBlockId: newBlockId,
      title: newTitle.trim(),
      priority: newPriority,
      effort: newEffort,
      sequence: block ? block.actions.length : 0,
      status: 'todo',
      notes: newNotes.trim() || undefined,
    })
    setShowAddModal(false)
  }

  // Flatten all actions with their parent block context
  const allActions = rpmBlocks
    .filter((b) => b.status !== 'archived')
    .flatMap((b) =>
      b.actions.map((a) => ({
        ...a,
        blockId: b.id,
        blockResult: b.result,
        blockArea: b.lifeArea,
        blockPriority: b.priority,
        blockStatus: b.status,
      }))
    )
    .filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false
      if (areaFilter !== 'all' && a.blockArea !== areaFilter) return false
      if (priorityFilter !== 'all' && a.priority !== priorityFilter) return false
      return true
    })
    .sort((a, b) => {
      const priorityOrder = { must: 0, should: 1, could: 2 }
      const statusOrder = { 'in-progress': 0, todo: 1, blocked: 2, done: 3 }
      if (a.status !== b.status) return statusOrder[a.status] - statusOrder[b.status]
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })

  // Stats
  const todo = allActions.filter((a) => a.status === 'todo').length
  const inProgress = allActions.filter((a) => a.status === 'in-progress').length
  const done = allActions.filter((a) => a.status === 'done').length
  const blocked = allActions.filter((a) => a.status === 'blocked').length

  const handleStatusChange = (blockId: string, actionId: string, status: ActionStatus) => {
    setActionStatus(blockId, actionId, status)
  }

  if (view === 'board') {
    return (
      <BoardView
        allActions={allActions}
        filters={{ statusFilter, areaFilter, priorityFilter }}
        setFilters={{ setStatusFilter, setAreaFilter, setPriorityFilter }}
        view={view}
        setView={setView}
        stats={{ todo, inProgress, done, blocked }}
        onStatusChange={handleStatusChange}
      />
    )
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 fade-up">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <CheckSquare size={22} className="text-[var(--accent)]" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                Action Planner
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                All actions across your RPM system in one view
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={13} />}
              onClick={openAddModal}
              disabled={activeBlocks.length === 0}
            >
              Add Action
            </Button>
            <button
              onClick={() => setView('board')}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              Board →
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 fade-up" style={{ animationDelay: '0.05s' }}>
        <StatChip label="To Do" value={todo} color="var(--text-secondary)" icon={<Circle size={13} />} />
        <StatChip label="In Progress" value={inProgress} color="var(--blue)" icon={<Clock size={13} />} />
        <StatChip label="Done" value={done} color="var(--green)" icon={<CheckCircle2 size={13} />} />
        <StatChip label="Blocked" value={blocked} color="var(--red)" icon={<AlertCircle size={13} />} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 fade-up" style={{ animationDelay: '0.1s' }}>
        <Filter size={13} className="text-[var(--text-muted)] shrink-0" />
        <Select
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as StatusFilter)}
          options={STATUS_OPTIONS}
          className="flex-1 sm:w-36"
        />
        <Select
          value={areaFilter}
          onChange={(v) => setAreaFilter(v as AreaFilter)}
          options={AREA_OPTIONS}
          className="flex-1 sm:w-40"
        />
        <Select
          value={priorityFilter}
          onChange={(v) => setPriorityFilter(v as Priority | 'all')}
          options={PRIORITY_OPTIONS}
          className="flex-1 sm:w-36"
        />
        <span className="text-xs text-[var(--text-muted)] w-full sm:w-auto sm:ml-auto">
          {allActions.length} action{allActions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Action list */}
      <div className="space-y-1.5 fade-up" style={{ animationDelay: '0.15s' }}>
        {allActions.length === 0 ? (
          <Card padding="lg" className="text-center">
            <CheckSquare size={32} className="text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-secondary)] mb-1">No actions match filters</p>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              Add actions here or inside an RPM block in the RPM Planner.
            </p>
            {activeBlocks.length > 0 && (
              <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={openAddModal}>
                Add Action
              </Button>
            )}
          </Card>
        ) : (
          allActions.map((action) => (
            <div
              key={action.id}
              className={cn(
                'flex items-start gap-3 p-3.5 rounded-[var(--radius)] border transition-all group',
                action.status === 'done'
                  ? 'bg-[var(--green-dim)] border-[rgba(52,211,153,0.12)]'
                  : action.status === 'blocked'
                  ? 'bg-[var(--red-dim)] border-[rgba(248,113,113,0.12)]'
                  : action.status === 'in-progress'
                  ? 'bg-[var(--blue-dim)] border-[rgba(96,165,250,0.12)]'
                  : 'border-[var(--border)] hover:border-[var(--border-bright)]'
              )}
            >
              {/* Status toggle */}
              <StatusToggle
                status={action.status}
                onChange={(s) => handleStatusChange(action.blockId, action.id, s)}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-sm font-medium',
                    action.status === 'done'
                      ? 'line-through text-[var(--text-muted)]'
                      : 'text-[var(--text-primary)]'
                  )}
                >
                  {action.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <LifeAreaBadge area={action.blockArea} />
                  <PriorityBadge priority={action.priority} />
                  <EffortBadge effort={action.effort} />
                </div>
              </div>

              {/* Block link */}
              <Link
                to={`/rpm?id=${action.blockId}`}
                className="shrink-0 flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors opacity-0 group-hover:opacity-100"
              >
                <Target size={10} />
                {truncate(action.blockResult, 30)}
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Add Action Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Action"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddAction}
              disabled={!newTitle.trim() || !newBlockId}
            >
              Add Action
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Block selector */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
              RPM Block
            </label>
            <select
              value={newBlockId}
              onChange={(e) => setNewBlockId(e.target.value)}
              className="w-full h-9 px-3 rounded-[var(--radius)] text-sm bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] focus:border-[rgba(43,76,126,0.4)] outline-none transition-colors"
            >
              {activeBlocks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.result.length > 50 ? b.result.slice(0, 50) + '…' : b.result}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
              Action Title
            </label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What needs to be done?"
              onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
              autoFocus
            />
          </div>

          {/* Priority + Effort row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                Priority
              </label>
              <Select
                value={newPriority}
                onChange={(v) => setNewPriority(v as Priority)}
                options={ACTION_PRIORITY_OPTIONS}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                Effort
              </label>
              <Select
                value={newEffort}
                onChange={(v) => setNewEffort(v as Effort)}
                options={ACTION_EFFORT_OPTIONS}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
              Notes <span className="text-[var(--text-muted)] font-normal">(optional)</span>
            </label>
            <TextArea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Any context or details…"
              rows={2}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

function StatusToggle({
  status,
  onChange,
}: {
  status: ActionStatus
  onChange: (s: ActionStatus) => void
}) {
  const cycle: ActionStatus[] = ['todo', 'in-progress', 'done', 'blocked']
  const next = cycle[(cycle.indexOf(status) + 1) % cycle.length]

  const icons = {
    todo: <Circle size={18} className="text-[var(--text-muted)]" />,
    'in-progress': <Clock size={18} className="text-[var(--blue)]" />,
    done: <CheckCircle2 size={18} className="text-[var(--green)]" />,
    blocked: <AlertCircle size={18} className="text-[var(--red)]" />,
  }

  return (
    <button
      onClick={() => onChange(next)}
      className="shrink-0 mt-0.5 hover:scale-110 transition-transform"
      title={`Click to mark as ${next}`}
    >
      {icons[status]}
    </button>
  )
}

function StatChip({
  label,
  value,
  color,
  icon,
}: {
  label: string
  value: number
  color: string
  icon: React.ReactNode
}) {
  return (
    <div className="card p-3">
      <div className="flex items-center gap-1.5 mb-1" style={{ color }}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  )
}

// ── Board View ────────────────────────────────────────────────────────────────

const COLUMNS: { status: ActionStatus; label: string; color: string }[] = [
  { status: 'todo', label: 'To Do', color: 'var(--text-secondary)' },
  { status: 'in-progress', label: 'In Progress', color: 'var(--blue)' },
  { status: 'done', label: 'Done', color: 'var(--green)' },
  { status: 'blocked', label: 'Blocked', color: 'var(--red)' },
]

function BoardView({ allActions, filters, setFilters, view, setView, stats, onStatusChange }: any) {
  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Action Board</h1>
        <button onClick={() => setView('list')} className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
          List →
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {COLUMNS.map((col) => {
          const colActions = allActions.filter((a: any) => a.status === col.status)
          return (
            <div key={col.status}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: col.color }}>
                  {col.label}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">{colActions.length}</span>
              </div>
              <div className="space-y-2">
                {colActions.map((action: any) => (
                  <div
                    key={action.id}
                    className="card p-3 hover:border-[var(--border-bright)] transition-all"
                  >
                    <p className="text-xs font-medium text-[var(--text-primary)] mb-2 line-clamp-2">
                      {action.title}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                      <LifeAreaBadge area={action.blockArea} />
                      <PriorityBadge priority={action.priority} />
                    </div>
                    <div className="flex gap-1">
                      {COLUMNS.filter((c) => c.status !== action.status).map((c) => (
                        <button
                          key={c.status}
                          onClick={() => onStatusChange(action.blockId, action.id, c.status)}
                          className="flex-1 py-1 text-[9px] font-medium rounded transition-all hover:opacity-80"
                          style={{ background: `${c.color}20`, color: c.color }}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {colActions.length === 0 && (
                  <div className="h-16 rounded-[var(--radius)] border border-dashed border-[var(--border)] flex items-center justify-center">
                    <p className="text-[10px] text-[var(--text-muted)]">Empty</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
