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
  const userName = useStore((s) => s.userName)
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

  const areaHasContent = (area: LifeArea): boolean =>
    rpmBlocks.some((b) => b.lifeArea === area) ||
    outcomes.some((o) => o.lifeArea === area)

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
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 md:mb-10 fade-up">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p
              className="text-[10px] font-medium mb-2 uppercase tracking-[0.18em]"
              style={{ color: 'rgba(201, 150, 61, 0.55)' }}
            >
              {format(new Date(), 'EEEE, MMMM d · yyyy')}
            </p>
            <h1
              className="font-display text-4xl md:text-5xl font-light tracking-tight leading-none mb-1"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
            >
              {getGreeting()},{' '}
              <span className="gold-shimmer-text font-medium">{userName || 'Owen'}</span>
            </h1>
            <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
              Your personal performance operating system
            </p>
          </div>
          <Link to="/focus" className="shrink-0">
            <Button variant="primary" icon={<Flame size={14} />}>
              Start Focus Session
            </Button>
          </Link>
        </div>

        {/* Gold rule */}
        <div className="gold-line mt-8" />
      </div>

      {/* Stat Row */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 fade-up"
        style={{ animationDelay: '0.06s' }}
      >
        <StatCard
          label="Active RPM Blocks"
          value={activeBlocks.length}
          icon={<Target size={15} />}
          color="#C9963D"
          to="/rpm"
        />
        <StatCard
          label="Actions Completed"
          value={`${doneActions}/${totalActions}`}
          icon={<CheckCircle2 size={15} />}
          color="#3DB87A"
          to="/actions"
        />
        <StatCard
          label="Life Balance Score"
          value={`${avgLifeScore.toFixed(1)}`}
          suffix="/10"
          icon={<TrendingUp size={15} />}
          color="#D4924A"
          to="/assessment"
        />
        <StatCard
          label="Reviews This Month"
          value={recentReviews.length}
          icon={<Trophy size={15} />}
          color="#5A9AE0"
          to="/reviews"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* RPM Blocks — spans 2 cols */}
        <div className="md:col-span-2 space-y-4 fade-up" style={{ animationDelay: '0.12s' }}>
          <div className="flex items-center justify-between">
            <h2
              className="text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: 'var(--text-muted)' }}
            >
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
        <div className="space-y-4 fade-up" style={{ animationDelay: '0.18s' }}>
          {/* Wheel of Life */}
          <Card padding="sm">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-[11px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: 'var(--text-muted)' }}
              >
                Life Balance
              </h3>
              <Link to="/assessment">
                <button
                  className="text-[11px] transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                >
                  Update →
                </button>
              </Link>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis
                    dataKey="area"
                    tick={{ fill: 'rgba(237,232,224,0.28)', fontSize: 8.5, fontFamily: 'DM Sans' }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#C9963D"
                    fill="#C9963D"
                    fillOpacity={0.10}
                    strokeWidth={1.5}
                    dot={{ fill: '#C9963D', r: 2 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {(Object.keys(LIFE_AREA_CONFIG) as LifeArea[]).map((area) => {
                const active = areaHasContent(area)
                return (
                  <div key={area} className="flex items-center gap-2">
                    <span
                      className="text-[9.5px] w-[72px] truncate"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {LIFE_AREA_CONFIG[area].label}
                    </span>
                    <ProgressBar
                      value={active ? lifeAreaScores[area] : 0}
                      max={10}
                      color={active ? LIFE_AREA_CONFIG[area].color : 'rgba(255,255,255,0.08)'}
                      size="xs"
                      className="flex-1"
                    />
                    <span
                      className="text-[9.5px] font-semibold font-mono-data w-5 text-right"
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
              <h3
                className="text-[11px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: 'var(--text-muted)' }}
              >
                Today's Focus
              </h3>
              <Link to="/focus">
                <button
                  className="text-[11px] transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                >
                  Open →
                </button>
              </Link>
            </div>
            {todayFocus ? (
              <div className="space-y-2">
                {todayFocus.morningIntention && (
                  <div
                    className="p-2.5 rounded-[var(--radius)]"
                    style={{
                      background: 'rgba(201, 150, 61, 0.06)',
                      border: '1px solid rgba(201, 150, 61, 0.14)',
                    }}
                  >
                    <p
                      className="text-[9px] font-semibold uppercase mb-1 tracking-[0.12em]"
                      style={{ color: 'rgba(201, 150, 61, 0.7)' }}
                    >
                      Intention
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {truncate(todayFocus.morningIntention, 80)}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={12} style={{ color: '#3DB87A' }} />
                  {todayFocus.focusActionIds.length} actions scheduled
                </div>
                {todayFocus.momentumScore > 0 && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Flame size={12} style={{ color: '#D4924A' }} />
                    Momentum: <span className="font-mono-data" style={{ color: '#D4924A' }}>{todayFocus.momentumScore}/10</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  No focus session yet today
                </p>
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
      <div className="mt-8 fade-up" style={{ animationDelay: '0.22s' }}>
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: 'var(--text-muted)' }}
          >
            Life Domain Overview
          </h2>
          <Link to="/outcomes">
            <Button variant="ghost" size="sm" iconRight={<ArrowRight size={12} />}>
              Manage outcomes
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
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
                  className="p-3 rounded-[var(--radius-lg)] border transition-all duration-200 cursor-pointer"
                  style={{
                    background: active ? 'rgba(255,255,255,0.025)' : 'transparent',
                    borderColor: active ? 'var(--border)' : 'rgba(255,255,255,0.04)',
                    borderStyle: active ? 'solid' : 'dashed',
                    opacity: active ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = `${config.color}40`
                    el.style.background = `${config.color}08`
                    el.style.opacity = '1'
                    el.style.transform = 'translateY(-1px)'
                    el.style.boxShadow = `0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px ${config.color}18`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = active ? 'var(--border)' : 'rgba(255,255,255,0.04)'
                    el.style.background = active ? 'rgba(255,255,255,0.025)' : 'transparent'
                    el.style.opacity = active ? '1' : '0.5'
                    el.style.transform = ''
                    el.style.boxShadow = ''
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center mb-2"
                    style={{ background: active ? config.bgColor : 'rgba(255,255,255,0.03)' }}
                  >
                    <span className="text-sm">{EMOJI[area]}</span>
                  </div>
                  <p
                    className="text-[9.5px] font-medium mb-1 leading-tight uppercase tracking-wide"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {config.label.replace('Personal ', '')}
                  </p>
                  {active ? (
                    <>
                      <p
                        className="text-xl font-semibold font-mono-data leading-none"
                        style={{ color: config.color }}
                      >
                        {lifeAreaScores[area]}
                        <span className="text-[9px] font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>/10</span>
                      </p>
                      <p className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-base font-semibold font-mono-data" style={{ color: 'rgba(255,255,255,0.12)' }}>—</p>
                      <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Not started</p>
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
  suffix,
  icon,
  color,
  to,
}: {
  label: string
  value: string | number
  suffix?: string
  icon: React.ReactNode
  color: string
  to: string
}) {
  return (
    <Link to={to}>
      <div className="card card-hover p-4 group relative overflow-hidden">
        {/* Subtle corner glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 0% 0%, ${color}10 0%, transparent 60%)`,
          }}
        />
        <div
          className="w-8 h-8 rounded-[var(--radius)] flex items-center justify-center mb-4"
          style={{
            background: `${color}12`,
            boxShadow: `0 0 12px ${color}20`,
          }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <div className="flex items-baseline gap-0.5 mb-1">
          <p
            className="text-2xl font-semibold font-mono-data leading-none"
            style={{ color }}
          >
            {value}
          </p>
          {suffix && (
            <span className="text-xs font-mono-data" style={{ color: 'var(--text-muted)' }}>
              {suffix}
            </span>
          )}
        </div>
        <p className="text-[11px] tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {label}
        </p>
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
        style={{ borderLeft: `2px solid ${config.color}60` }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3
            className="text-sm font-medium leading-snug flex-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {truncate(block.result, 75)}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant="default" className="font-mono-data">P{block.priority}</Badge>
            <LifeAreaBadge area={block.lifeArea} />
          </div>
        </div>

        {block.purpose && (
          <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
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
            <span className="text-[10.5px] font-mono-data shrink-0" style={{ color: 'var(--text-muted)' }}>
              {done}/{total}
            </span>
          </div>
        )}

        {block.actions.filter((a) => a.status === 'todo').slice(0, 2).map((action) => (
          <div key={action.id} className="flex items-center gap-2 mt-2">
            <Circle size={9} style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
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
        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{
          background: 'rgba(201, 150, 61, 0.08)',
          boxShadow: '0 0 20px rgba(201, 150, 61, 0.10)',
        }}
      >
        <Target size={18} style={{ color: '#C9963D' }} />
      </div>
      <h3
        className="font-display text-xl font-medium mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        No active RPM blocks
      </h3>
      <p className="text-sm mb-5 max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
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
