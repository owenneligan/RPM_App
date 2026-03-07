import React from 'react'
import { Link } from 'react-router-dom'
import {
  Target,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Trophy,
} from 'lucide-react'
import { format } from 'date-fns'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import { useStore } from '../store'
import { LIFE_AREA_CONFIG, LifeArea } from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge, LifeAreaBadge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { getGreeting, truncate } from '../lib/utils'

export function Dashboard() {
  const rpmBlocks = useStore((s) => s.rpmBlocks)
  const lifeAreaScores = useStore((s) => s.lifeAreaScores)
  const dailyFocuses = useStore((s) => s.dailyFocuses)
  const reviews = useStore((s) => s.reviews)

  const outcomes = useStore((s) => s.outcomes)

  const activeBlocks = rpmBlocks.filter((b) => b.status === 'active')
  const topBlocks = [...activeBlocks]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 4)

  const allActions = rpmBlocks.flatMap((b) => b.actions)
  const doneActions = allActions.filter((a) => a.status === 'done').length
  const totalActions = allActions.length
  const todayFocus = dailyFocuses.find(
    (f) => f.date === format(new Date(), 'yyyy-MM-dd')
  )

  // An area is "active" only when the user has created content in it
  const areaHasContent = (area: LifeArea): boolean =>
    rpmBlocks.some((b) => b.lifeArea === area) ||
    outcomes.some((o) => o.lifeArea === area)

  // Use 0 for empty areas in the radar so they don't mislead
  const radarData = (Object.keys(LIFE_AREA_CONFIG) as LifeArea[]).map((area) => ({
    area: LIFE_AREA_CONFIG[area].label.replace('Personal ', ''),
    score: areaHasContent(area) ? lifeAreaScores[area] : 0,
    fullMark: 10,
  }))

  const avgLifeScore =
    Object.values(lifeAreaScores).reduce((a, b) => a + b, 0) /
    Object.values(lifeAreaScores).length

  const recentReviews = reviews.slice(0, 3)

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8 fade-up">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] mb-1 uppercase tracking-wider">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              {getGreeting()}, Owen
            </h1>
            <p className="text-[var(--text-secondary)] mt-1 text-sm">
              Your personal performance operating system
            </p>
          </div>
          <Link to="/focus" className="self-start sm:self-auto">
            <Button variant="primary" icon={<Flame size={14} />}>
              Start Focus Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 fade-up" style={{ animationDelay: '0.05s' }}>
        <StatCard
          label="Active RPM Blocks"
          value={activeBlocks.length}
          icon={<Target size={15} />}
          color="#2B4C7E"
          to="/rpm"
        />
        <StatCard
          label="Actions Completed"
          value={`${doneActions}/${totalActions}`}
          icon={<CheckCircle2 size={15} />}
          color="#3F7D6A"
          to="/actions"
        />
        <StatCard
          label="Life Balance Score"
          value={`${avgLifeScore.toFixed(1)}/10`}
          icon={<TrendingUp size={15} />}
          color="#B8893A"
          to="/assessment"
        />
        <StatCard
          label="Reviews This Month"
          value={recentReviews.length}
          icon={<Trophy size={15} />}
          color="#3B6EA8"
          to="/reviews"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RPM Blocks — spans 2 cols on lg */}
        <div className="lg:col-span-2 space-y-4 fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Active RPM Blocks
            </h2>
            <Link to="/rpm">
              <Button variant="ghost" size="sm" iconRight={<ArrowRight size={12} />}>
                View all
              </Button>
            </Link>
          </div>

          {topBlocks.length === 0 ? (
            <EmptyRPM />
          ) : (
            <div className="space-y-3">
              {topBlocks.map((block) => (
                <RPMBlockCard key={block.id} block={block} />
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4 fade-up" style={{ animationDelay: '0.15s' }}>
          {/* Wheel of Life */}
          <Card padding="sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Life Balance</h3>
              <Link to="/assessment">
                <button className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Update →
                </button>
              </Link>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                  <PolarGrid stroke="rgba(0,0,0,0.07)" />
                  <PolarAngleAxis
                    dataKey="area"
                    tick={{ fill: '#9EA3A8', fontSize: 9, fontFamily: 'Inter' }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#2B4C7E"
                    fill="#2B4C7E"
                    fillOpacity={0.1}
                    strokeWidth={1.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-1">
              {(Object.keys(LIFE_AREA_CONFIG) as LifeArea[]).map((area) => {
                const active = areaHasContent(area)
                return (
                  <div key={area} className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--text-muted)] w-20 truncate">
                      {LIFE_AREA_CONFIG[area].label}
                    </span>
                    <ProgressBar
                      value={active ? lifeAreaScores[area] : 0}
                      max={10}
                      color={active ? LIFE_AREA_CONFIG[area].color : '#E3E4E6'}
                      size="xs"
                      className="flex-1"
                    />
                    <span
                      className="text-[10px] font-semibold w-4 text-right"
                      style={{ color: active ? LIFE_AREA_CONFIG[area].color : 'var(--text-muted)' }}
                    >
                      {active ? lifeAreaScores[area] : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Today's Focus Summary */}
          <Card padding="sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Today's Focus</h3>
              <Link to="/focus">
                <button className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Open →
                </button>
              </Link>
            </div>
            {todayFocus ? (
              <div className="space-y-2">
                {todayFocus.morningIntention && (
                  <div className="p-2.5 rounded-[var(--radius)] bg-[rgba(43,76,126,0.06)] border border-[rgba(43,76,126,0.12)]">
                    <p className="text-[10px] text-[#2B4C7E] font-semibold uppercase mb-0.5 tracking-wide">Intention</p>
                    <p className="text-xs text-[var(--text-primary)]">
                      {truncate(todayFocus.morningIntention, 80)}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <CheckCircle2 size={12} className="text-[#3F7D6A]" />
                  {todayFocus.focusActionIds.length} actions scheduled
                </div>
                {todayFocus.momentumScore > 0 && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Flame size={12} className="text-[#B8893A]" />
                    Momentum: {todayFocus.momentumScore}/10
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-xs text-[var(--text-muted)] mb-2">No focus session yet today</p>
                <Link to="/focus">
                  <Button variant="primary" size="sm">
                    Set Today's Focus
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Life Area Overview */}
      <div className="mt-6 fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Life Domain Overview
          </h2>
          <Link to="/outcomes">
            <Button variant="ghost" size="sm" iconRight={<ArrowRight size={12} />}>
              Manage outcomes
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
          {(Object.keys(LIFE_AREA_CONFIG) as LifeArea[]).map((area) => {
            const config = LIFE_AREA_CONFIG[area]
            const active = areaHasContent(area)
            const areaBlocks = rpmBlocks.filter((b) => b.lifeArea === area)
            const areaOutcomes = outcomes.filter((o) => o.lifeArea === area)
            const itemCount = areaBlocks.length + areaOutcomes.length

            const EMOJI: Record<LifeArea, string> = {
              career: '💼', business: '🚀', finances: '💰',
              health: '⚡', relationships: '❤️', growth: '🌱', lifestyle: '✨',
            }

            return (
              <Link key={area} to={active ? `/rpm?area=${area}` : '/rpm'}>
                <div
                  className="p-3 rounded-[var(--radius-lg)] border hover:shadow-elevated transition-all cursor-pointer"
                  style={{
                    background: active ? config.bgColor : 'transparent',
                    borderColor: active ? 'var(--border)' : 'var(--border)',
                    borderStyle: active ? 'solid' : 'dashed',
                    opacity: active ? 1 : 0.6,
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-bright)'
                    ;(e.currentTarget as HTMLElement).style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                    ;(e.currentTarget as HTMLElement).style.opacity = active ? '1' : '0.6'
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center mb-2"
                    style={{ background: active ? `${config.color}18` : 'rgba(0,0,0,0.04)' }}
                  >
                    <span className="text-sm">{EMOJI[area]}</span>
                  </div>
                  <p className="text-[10px] font-medium mb-1 leading-tight" style={{ color: 'var(--text-secondary)' }}>
                    {config.label.replace('Personal ', '')}
                  </p>
                  {active ? (
                    <>
                      <p className="text-lg font-bold" style={{ color: config.color }}>
                        {lifeAreaScores[area]}
                        <span className="text-[10px] font-normal text-[var(--text-muted)]">/10</span>
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-[var(--text-muted)]">—</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Not started</p>
                    </>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
  to,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
  to: string
}) {
  return (
    <Link to={to}>
      <div className="card card-hover p-3 sm:p-4 group">
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-[var(--radius)] flex items-center justify-center mb-2 sm:mb-3"
          style={{ background: `${color}10`, color }}
        >
          {icon}
        </div>
        <p className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-0.5">{value}</p>
        <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">{label}</p>
      </div>
    </Link>
  )
}

function RPMBlockCard({ block }: { block: import('../types').RPMBlock }) {
  const done = block.actions.filter((a) => a.status === 'done').length
  const total = block.actions.length
  const config = LIFE_AREA_CONFIG[block.lifeArea]

  return (
    <Link to={`/rpm?id=${block.id}`}>
      <div
        className="card card-hover p-4"
        style={{ borderLeft: `2.5px solid ${config.color}` }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-snug flex-1">
            {truncate(block.result, 75)}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant="default">P{block.priority}</Badge>
            <LifeAreaBadge area={block.lifeArea} />
          </div>
        </div>

        {block.purpose && (
          <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">
            {truncate(block.purpose, 100)}
          </p>
        )}

        {total > 0 && (
          <div className="flex items-center gap-3">
            <ProgressBar
              value={done}
              max={total}
              color={config.color}
              size="xs"
              className="flex-1"
            />
            <span className="text-xs text-[var(--text-muted)] shrink-0">
              {done}/{total}
            </span>
          </div>
        )}

        {block.actions.filter((a) => a.status === 'todo').slice(0, 2).map((action) => (
          <div key={action.id} className="flex items-center gap-2 mt-2">
            <Circle size={10} className="text-[var(--text-muted)] shrink-0" />
            <span className="text-xs text-[var(--text-muted)]">
              {truncate(action.title, 60)}
            </span>
          </div>
        ))}
      </div>
    </Link>
  )
}

function EmptyRPM() {
  return (
    <Card padding="lg" className="text-center">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: 'rgba(43,76,126,0.08)' }}
      >
        <Target size={18} style={{ color: '#2B4C7E' }} />
      </div>
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
        No active RPM blocks
      </h3>
      <p className="text-xs text-[var(--text-secondary)] mb-4 max-w-xs mx-auto">
        Create your first RPM block to define a compelling result and the actions needed to achieve it.
      </p>
      <Link to="/rpm">
        <Button variant="primary" icon={<Plus size={14} />}>
          Create RPM Block
        </Button>
      </Link>
    </Card>
  )
}
