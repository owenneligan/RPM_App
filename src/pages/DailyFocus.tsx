import React, { useState } from 'react'
import {
  Sun,
  Moon,
  Flame,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react'
import { format } from 'date-fns'
import { useStore } from '../store'
import { LIFE_AREA_CONFIG, Action, ActionStatus } from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { TextArea } from '../components/ui/Input'
import { LifeAreaBadge, PriorityBadge } from '../components/ui/Badge'
import { truncate, todayStr } from '../lib/utils'
import { cn } from '../lib/utils'

export function DailyFocus() {
  const rpmBlocks = useStore((s) => s.rpmBlocks)
  const getTodayFocus = useStore((s) => s.getTodayFocus)
  const saveDailyFocus = useStore((s) => s.saveDailyFocus)
  const setActionStatus = useStore((s) => s.setActionStatus)

  const todayFocus = getTodayFocus()
  const today = todayStr()

  const [morningIntention, setMorningIntention] = useState(
    todayFocus?.morningIntention || ''
  )
  const [eveningReflection, setEveningReflection] = useState(
    todayFocus?.eveningReflection || ''
  )
  const [momentumScore, setMomentumScore] = useState(todayFocus?.momentumScore || 0)
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>(
    todayFocus?.topRPMBlockIds || []
  )
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>(
    todayFocus?.focusActionIds || []
  )
  const [wins, setWins] = useState<string[]>(todayFocus?.wins || [''])
  const [saved, setSaved] = useState(false)
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set())

  const activeBlocks = rpmBlocks.filter((b) => b.status === 'active')
  const focusedBlocks = activeBlocks.filter((b) => selectedBlockIds.includes(b.id))

  const allFocusedActions = focusedBlocks.flatMap((b) =>
    b.actions
      .filter((a) => a.status !== 'done')
      .map((a) => ({ ...a, blockResult: b.result, blockArea: b.lifeArea }))
  )

  const toggleBlock = (id: string) => {
    setSelectedBlockIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleAction = (id: string) => {
    setSelectedActionIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleBlockExpand = (id: string) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSave = () => {
    saveDailyFocus({
      date: today,
      topRPMBlockIds: selectedBlockIds,
      focusActionIds: selectedActionIds,
      momentumScore,
      morningIntention,
      eveningReflection,
      wins: wins.filter(Boolean),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const completeAction = (blockId: string, actionId: string) => {
    setActionStatus(blockId, actionId, 'done')
  }

  const addWin = () => setWins((prev) => [...prev, ''])
  const updateWin = (i: number, val: string) =>
    setWins((prev) => prev.map((w, idx) => (idx === i ? val : w)))

  const hour = new Date().getHours()
  const isEvening = hour >= 17

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8 fade-up">
        <div className="flex items-center gap-3 mb-2">
          {isEvening ? (
            <Moon size={22} className="text-[var(--accent)]" />
          ) : (
            <Sun size={22} className="text-[var(--gold)]" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Daily Focus
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Morning Intention */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Sun size={15} className="text-[var(--gold)]" />
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Morning Intention
              </h2>
            </div>
            <TextArea
              value={morningIntention}
              onChange={(e) => setMorningIntention(e.target.value)}
              placeholder="What is your primary intention for today? What will make today a great day? What must you accomplish?"
              rows={3}
            />
          </Card>

          {/* Select Focus Blocks */}
          <Card>
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              Today's RPM Focus
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Select up to 3 RPM blocks to focus on today
            </p>

            {activeBlocks.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] text-center py-4">
                No active RPM blocks. Create some in the RPM Planner.
              </p>
            ) : (
              <div className="space-y-2">
                {activeBlocks.map((block) => {
                  const isSelected = selectedBlockIds.includes(block.id)
                  const isExpanded = expandedBlocks.has(block.id)
                  const config = LIFE_AREA_CONFIG[block.lifeArea]
                  const pendingActions = block.actions.filter((a) => a.status !== 'done')
                  const doneActions = block.actions.filter((a) => a.status === 'done')

                  return (
                    <div
                      key={block.id}
                      className={cn(
                        'rounded-[var(--radius)] border transition-all',
                        isSelected
                          ? 'border-[var(--border-accent)] bg-[var(--accent-dim)]'
                          : 'border-[var(--border)] bg-[var(--bg-input)]'
                      )}
                    >
                      <div
                        className="flex items-start gap-3 p-3 cursor-pointer"
                        onClick={() => toggleBlock(block.id)}
                      >
                        <div
                          className={cn(
                            'w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all',
                            isSelected
                              ? 'bg-[var(--accent)] border-[var(--accent)]'
                              : 'border-[var(--border-bright)]'
                          )}
                        >
                          {isSelected && <CheckCircle2 size={10} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--text-primary)] font-medium leading-snug">
                            {truncate(block.result, 70)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <LifeAreaBadge area={block.lifeArea} />
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {doneActions.length}/{block.actions.length} done
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBlockExpand(block.id) }}
                          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>

                      {isExpanded && isSelected && pendingActions.length > 0 && (
                        <div className="px-3 pb-3 space-y-1 border-t border-[var(--border)]">
                          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide py-2">
                            Select actions for today
                          </p>
                          {pendingActions.map((action) => (
                            <div
                              key={action.id}
                              onClick={() => toggleAction(action.id)}
                              className={cn(
                                'flex items-center gap-2.5 p-2 rounded-[var(--radius-sm)] cursor-pointer transition-all',
                                selectedActionIds.includes(action.id)
                                  ? 'bg-[rgba(124,106,245,0.1)]'
                                  : 'hover:bg-[rgba(255,255,255,0.03)]'
                              )}
                            >
                              <div
                                className={cn(
                                  'w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all',
                                  selectedActionIds.includes(action.id)
                                    ? 'bg-[var(--accent)] border-[var(--accent)]'
                                    : 'border-[var(--border-bright)]'
                                )}
                              >
                                {selectedActionIds.includes(action.id) && (
                                  <CheckCircle2 size={8} className="text-white" />
                                )}
                              </div>
                              <span className="text-xs text-[var(--text-secondary)] flex-1">
                                {action.title}
                              </span>
                              <PriorityBadge priority={action.priority} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          {/* Today's Actions (from selected blocks) */}
          {selectedActionIds.length > 0 && (
            <Card>
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                Today's Action List
              </h2>
              <TodayActionList
                selectedActionIds={selectedActionIds}
                focusedBlocks={focusedBlocks}
                onComplete={completeAction}
              />
            </Card>
          )}

          {/* Evening Reflection (shown later in day) */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Moon size={15} className="text-[var(--accent)]" />
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Evening Reflection
              </h2>
            </div>
            <TextArea
              value={eveningReflection}
              onChange={(e) => setEveningReflection(e.target.value)}
              placeholder="What did you accomplish? What would you do differently? What are you proud of today?"
              rows={3}
            />
          </Card>

          {/* Wins */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star size={15} className="text-[var(--gold)]" />
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Today's Wins</h2>
              </div>
              <Button variant="ghost" size="sm" icon={<Plus size={12} />} onClick={addWin}>
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {wins.map((win, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Star size={12} className="text-[var(--gold)] shrink-0" />
                  <input
                    value={win}
                    onChange={(e) => updateWin(i, e.target.value)}
                    placeholder={`Win #${i + 1}`}
                    className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none border-b border-[var(--border)] pb-1 focus:border-[var(--border-accent)] transition-colors"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          {/* Momentum Score */}
          <Card padding="sm">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={15} className="text-[var(--amber)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Momentum Score
              </h3>
            </div>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setMomentumScore(n)}
                  className={cn(
                    'h-9 rounded-[var(--radius-sm)] text-sm font-semibold transition-all border',
                    momentumScore === n
                      ? 'bg-[var(--amber)] text-[#07070F] border-[var(--amber)]'
                      : momentumScore >= n
                      ? 'bg-[var(--amber-dim)] text-[var(--amber)] border-[rgba(251,191,36,0.2)]'
                      : 'text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-bright)]'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] text-center">
              {momentumScore === 0
                ? 'Rate your day'
                : momentumScore <= 3
                ? 'Tough day — what can shift tomorrow?'
                : momentumScore <= 6
                ? 'Solid — you showed up'
                : momentumScore <= 8
                ? 'Strong momentum building'
                : 'Exceptional — you crushed it'}
            </p>
          </Card>

          {/* Summary stats */}
          <Card padding="sm">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Today's Stats</h3>
            <div className="space-y-2.5">
              <StatRow
                label="Blocks in focus"
                value={selectedBlockIds.length}
                icon={<Flame size={12} />}
                color="var(--accent)"
              />
              <StatRow
                label="Actions planned"
                value={selectedActionIds.length}
                icon={<CheckCircle2 size={12} />}
                color="var(--blue)"
              />
              {todayFocus && (
                <StatRow
                  label="Wins captured"
                  value={todayFocus.wins.length}
                  icon={<Star size={12} />}
                  color="var(--gold)"
                />
              )}
            </div>
          </Card>

          {/* Save button */}
          <Button
            variant="primary"
            className="w-full"
            onClick={handleSave}
          >
            {saved ? '✓ Saved' : 'Save Focus Session'}
          </Button>

          {/* Quick tips */}
          <Card padding="sm" className="border-[var(--gold-dim)]" style={{ borderColor: 'rgba(232,184,75,0.2)' }}>
            <p className="text-[10px] text-[var(--gold)] font-semibold uppercase tracking-wide mb-2">
              RPM Focus Principle
            </p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">
              "It's not about getting more done — it's about identifying the highest-leverage actions that move your most important results forward."
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-2">— Tony Robbins</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

function TodayActionList({
  selectedActionIds,
  focusedBlocks,
  onComplete,
}: {
  selectedActionIds: string[]
  focusedBlocks: import('../types').RPMBlock[]
  onComplete: (blockId: string, actionId: string) => void
}) {
  const actions = focusedBlocks.flatMap((b) =>
    b.actions
      .filter((a) => selectedActionIds.includes(a.id))
      .map((a) => ({ ...a, blockId: b.id, blockResult: b.result, blockArea: b.lifeArea }))
  )

  const sorted = [...actions].sort((a, b) => {
    const order = { must: 0, should: 1, could: 2 }
    return order[a.priority] - order[b.priority]
  })

  return (
    <div className="space-y-2">
      {sorted.map((action) => {
        const isDone = action.status === 'done'
        return (
          <div
            key={action.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-[var(--radius)] border transition-all',
              isDone
                ? 'bg-[var(--green-dim)] border-[rgba(52,211,153,0.15)]'
                : 'border-[var(--border)] hover:border-[var(--border-bright)]'
            )}
          >
            <button
              onClick={() => !isDone && onComplete(action.blockId, action.id)}
              className="mt-0.5 shrink-0"
            >
              {isDone ? (
                <CheckCircle2 size={16} className="text-[var(--green)]" />
              ) : (
                <Circle size={16} className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-sm',
                  isDone
                    ? 'line-through text-[var(--text-muted)]'
                    : 'text-[var(--text-primary)]'
                )}
              >
                {action.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <LifeAreaBadge area={action.blockArea} />
                <PriorityBadge priority={action.priority} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StatRow({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <span className="text-sm font-semibold" style={{ color }}>
        {value}
      </span>
    </div>
  )
}
