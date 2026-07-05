import React from 'react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
} from 'recharts'
import { Scale, TrendingUp, Target, Flame } from 'lucide-react'
import { useStore } from '../store'
import { LIFE_AREA_CONFIG, LifeArea } from '../types'
import { cn } from '../lib/utils'

const AREAS = Object.keys(LIFE_AREA_CONFIG) as LifeArea[]

export function Assessment() {
  const lifeAreaScores = useStore((s) => s.lifeAreaScores)
  const setLifeAreaScore = useStore((s) => s.setLifeAreaScore)
  const rpmBlocks = useStore((s) => s.rpmBlocks)
  const dailyFocuses = useStore((s) => s.dailyFocuses)

  const radarData = AREAS.map((area) => ({
    area: LIFE_AREA_CONFIG[area].label.replace('Personal ', ''),
    score: lifeAreaScores[area],
    fullMark: 10,
  }))

  const avgScore = AREAS.reduce((sum, a) => sum + lifeAreaScores[a], 0) / AREAS.length
  const lowestArea = AREAS.reduce((a, b) => lifeAreaScores[a] < lifeAreaScores[b] ? a : b)
  const highestArea = AREAS.reduce((a, b) => lifeAreaScores[a] > lifeAreaScores[b] ? a : b)

  const gapAreas = AREAS
    .map((a) => ({ area: a, gap: 10 - lifeAreaScores[a] }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3)

  const recentFocuses = dailyFocuses.slice(0, 7)
  const avgMomentum = recentFocuses.length > 0
    ? recentFocuses.reduce((s, f) => s + f.momentumScore, 0) / recentFocuses.length
    : 0

  const insightText =
    avgScore >= 8
      ? 'Outstanding balance. Maintain momentum across all areas.'
      : avgScore >= 6
      ? `Good balance. ${LIFE_AREA_CONFIG[lowestArea].label.replace('Personal ', '')} deserves your next RPM block.`
      : `Build momentum. Start with an RPM block for ${LIFE_AREA_CONFIG[lowestArea].label.replace('Personal ', '')}.`

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="mb-8 fade-up">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(201,150,61,0.18) 0%, rgba(201,150,61,0.08) 100%)',
              border: '1px solid rgba(201,150,61,0.22)',
            }}
          >
            <Scale size={16} style={{ color: '#C9963D' }} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Life Assessment
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Rate each life domain · 1 = poor · 10 = extraordinary
            </p>
          </div>
        </div>
        <div className="gold-line mt-6" />
      </div>

      {/* ── Summary Stats ───────────────────────────────────────────── */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 fade-up"
        style={{ animationDelay: '0.05s' }}
      >
        {[
          {
            label: 'Life Balance',
            value: avgScore.toFixed(1),
            sub: '/ 10 average',
            color: '#C9963D',
            icon: <Scale size={14} />,
          },
          {
            label: 'Highest Area',
            value: LIFE_AREA_CONFIG[highestArea].label.replace('Personal ', ''),
            sub: `${lifeAreaScores[highestArea]} / 10`,
            color: LIFE_AREA_CONFIG[highestArea].color,
            icon: <TrendingUp size={14} />,
          },
          {
            label: 'Needs Focus',
            value: LIFE_AREA_CONFIG[lowestArea].label.replace('Personal ', ''),
            sub: `${lifeAreaScores[lowestArea]} / 10`,
            color: LIFE_AREA_CONFIG[lowestArea].color,
            icon: <Target size={14} />,
          },
          {
            label: 'Avg Momentum',
            value: avgMomentum > 0 ? avgMomentum.toFixed(1) : '—',
            sub: avgMomentum > 0 ? `${recentFocuses.length}-day avg` : 'No data yet',
            color: '#E8B860',
            icon: <Flame size={14} />,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[var(--radius-lg)] p-4"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              className="w-7 h-7 rounded-[6px] flex items-center justify-center mb-3"
              style={{ background: `${s.color}14`, color: s.color }}
            >
              {s.icon}
            </div>
            <p
              className="text-lg font-bold leading-tight truncate"
              style={{ color: s.color }}
            >
              {s.value}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {s.sub}
            </p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Score Each Area ─────────────────────────────────────────── */}
      <div
        className="rounded-[var(--radius-lg)] p-5 md:p-6 mb-6 fade-up"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          animationDelay: '0.10s',
        }}
      >
        <h2
          className="text-sm font-semibold mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          Rate Your Life Domains
        </h2>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          Tap a number to set your score. Be honest — this is your baseline.
        </p>

        <div className="space-y-5">
          {AREAS.map((area) => {
            const config = LIFE_AREA_CONFIG[area]
            const score = lifeAreaScores[area]
            return (
              <div key={area}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: config.color }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {config.label.replace('Personal ', '')}
                    </span>
                  </div>
                  <span
                    className="text-lg font-bold font-mono-data leading-none"
                    style={{ color: config.color }}
                  >
                    {score}
                    <span className="text-xs font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>
                      /10
                    </span>
                  </span>
                </div>

                {/* 1–10 tap row */}
                <div className="flex gap-1.5">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                    const active = n === score
                    const filled = n <= score
                    return (
                      <button
                        key={n}
                        onClick={() => setLifeAreaScore(area, n)}
                        className="flex-1 rounded-[5px] transition-all duration-150 text-xs font-semibold"
                        style={{
                          height: 36,
                          background: active
                            ? config.color
                            : filled
                            ? `${config.color}22`
                            : 'rgba(255,255,255,0.04)',
                          color: active
                            ? '#0A0B0E'
                            : filled
                            ? config.color
                            : 'rgba(255,255,255,0.25)',
                          border: active
                            ? `1px solid ${config.color}`
                            : filled
                            ? `1px solid ${config.color}44`
                            : '1px solid rgba(255,255,255,0.07)',
                          boxShadow: active ? `0 0 10px ${config.color}44` : undefined,
                          transform: active ? 'scale(1.08)' : undefined,
                        }}
                        aria-label={`Set ${config.label} to ${n}`}
                      >
                        {n}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Wheel of Life ───────────────────────────────────────────── */}
      <div
        className="rounded-[var(--radius-lg)] p-5 md:p-6 mb-6 fade-up"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          animationDelay: '0.15s',
        }}
      >
        <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          Wheel of Life
        </h2>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          Balance across all 7 life domains
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 10, right: 32, bottom: 10, left: 32 }}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis
                dataKey="area"
                tick={{ fill: 'rgba(237,232,224,0.45)', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 10]}
                tick={{ fill: 'rgba(237,232,224,0.25)', fontSize: 8 }}
                tickCount={4}
                stroke="rgba(255,255,255,0.04)"
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#C9963D"
                fill="#C9963D"
                fillOpacity={0.14}
                strokeWidth={2}
                dot={{ fill: '#C9963D', strokeWidth: 0, r: 3 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Gap Analysis ────────────────────────────────────────────── */}
      <div
        className="rounded-[var(--radius-lg)] p-5 md:p-6 mb-6 fade-up"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          animationDelay: '0.20s',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Target size={13} style={{ color: '#C9963D' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Highest Opportunity Gaps
          </h2>
        </div>
        <div className="space-y-5">
          {gapAreas.map(({ area, gap }) => {
            const config = LIFE_AREA_CONFIG[area]
            const score = lifeAreaScores[area]
            const areaBlocks = rpmBlocks.filter((b) => b.lifeArea === area && b.status === 'active')
            return (
              <div key={area}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {config.label.replace('Personal ', '')}
                    </span>
                    <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                      {areaBlocks.length} block{areaBlocks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono-data" style={{ color: config.color }}>
                      {score}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/10</span>
                  </div>
                </div>
                {/* Progress track */}
                <div
                  className="h-2 rounded-full overflow-hidden mb-1.5"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${score * 10}%`,
                      background: config.color,
                      boxShadow: `0 0 8px ${config.color}55`,
                    }}
                  />
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {gap} point gap to ideal
                  {areaBlocks.length === 0 ? ' · No RPM blocks assigned yet' : ''}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Balance Insight ──────────────────────────────────────────── */}
      <div
        className="rounded-[var(--radius-lg)] p-5 fade-up"
        style={{
          background: 'linear-gradient(135deg, rgba(201,150,61,0.07) 0%, rgba(201,150,61,0.03) 100%)',
          border: '1px solid rgba(201,150,61,0.18)',
          animationDelay: '0.25s',
        }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2"
          style={{ color: 'rgba(201,150,61,0.6)' }}
        >
          Balance Insight
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {insightText}
        </p>
      </div>
    </div>
  )
}
