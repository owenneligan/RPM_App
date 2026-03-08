import React, { useState } from 'react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts'
import { BarChart3, TrendingUp, Target, Minus, Plus } from 'lucide-react'
import { useStore } from '../store'
import { LIFE_AREA_CONFIG, LifeArea } from '../types'
import { Card } from '../components/ui/Card'
import { ScoreRing, ProgressBar } from '../components/ui/ProgressBar'
import { cn } from '../lib/utils'

export function Assessment() {
  const lifeAreaScores = useStore((s) => s.lifeAreaScores)
  const setLifeAreaScore = useStore((s) => s.setLifeAreaScore)
  const rpmBlocks = useStore((s) => s.rpmBlocks)
  const dailyFocuses = useStore((s) => s.dailyFocuses)

  const areas = Object.keys(LIFE_AREA_CONFIG) as LifeArea[]

  const radarData = areas.map((area) => ({
    area: LIFE_AREA_CONFIG[area].label.replace('Personal ', ''),
    score: lifeAreaScores[area],
    fullMark: 10,
  }))

  const barData = areas.map((area) => ({
    name: LIFE_AREA_CONFIG[area].label.replace('Personal ', ''),
    score: lifeAreaScores[area],
    color: LIFE_AREA_CONFIG[area].color,
  }))

  const avgScore = areas.reduce((sum, a) => sum + lifeAreaScores[a], 0) / areas.length
  const lowestArea = areas.reduce((a, b) => lifeAreaScores[a] < lifeAreaScores[b] ? a : b)
  const highestArea = areas.reduce((a, b) => lifeAreaScores[a] > lifeAreaScores[b] ? a : b)

  const gapAreas = areas
    .map((a) => ({ area: a, gap: 10 - lifeAreaScores[a] }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3)

  const recentFocuses = dailyFocuses.slice(0, 7)
  const avgMomentum = recentFocuses.length > 0
    ? recentFocuses.reduce((s, f) => s + f.momentumScore, 0) / recentFocuses.length
    : 0

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 fade-up">
        <div className="flex items-center gap-3">
          <BarChart3 size={20} style={{ color: '#2B4C7E' }} />
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Self Assessment</h1>
            <p className="text-sm text-[var(--text-secondary)]">Wheel of Life · Balance analysis · Performance momentum</p>
          </div>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 fade-up" style={{ animationDelay: '0.05s' }}>
        {[
          { label: 'Life Balance Score', value: avgScore.toFixed(1), sub: '/10 average', color: '#2B4C7E', icon: '⚖️' },
          { label: 'Highest Scoring', value: LIFE_AREA_CONFIG[highestArea].label, sub: `${lifeAreaScores[highestArea]}/10`, color: LIFE_AREA_CONFIG[highestArea].color, icon: '↑' },
          { label: 'Needs Attention', value: LIFE_AREA_CONFIG[lowestArea].label, sub: `${lifeAreaScores[lowestArea]}/10`, color: '#B35C44', icon: '↓' },
          { label: 'Avg Momentum', value: avgMomentum > 0 ? avgMomentum.toFixed(1) : '—', sub: avgMomentum > 0 ? `${recentFocuses.length} days` : 'No data yet', color: '#B8893A', icon: '🔥' },
        ].map((s) => (
          <Card key={s.label} padding="sm">
            <div className="w-8 h-8 rounded-[var(--radius)] flex items-center justify-center mb-3 text-base" style={{ background: `${s.color}12` }}>
              {s.icon}
            </div>
            <p className="text-lg font-bold text-[var(--text-primary)] leading-tight">{s.value}</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{s.sub}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Wheel of Life */}
        <Card className="fade-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Wheel of Life</h2>
          <p className="text-xs text-[var(--text-secondary)] mb-4">Current balance across all 7 life domains</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="rgba(0,0,0,0.07)" />
                <PolarAngleAxis dataKey="area" tick={{ fill: '#9EA3A8', fontSize: 10, fontFamily: 'Inter' }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#9EA3A8', fontSize: 8 }} tickCount={4} />
                <Radar name="Score" dataKey="score" stroke="#2B4C7E" fill="#2B4C7E" fillOpacity={0.12} strokeWidth={2}
                  dot={{ fill: '#2B4C7E', strokeWidth: 0, r: 3 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Editable scores */}
        <Card className="fade-up" style={{ animationDelay: '0.15s' }}>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Score Each Area</h2>
          <p className="text-xs text-[var(--text-secondary)] mb-4">1 = poor · 10 = extraordinary</p>
          <div className="space-y-3">
            {areas.map((area) => (
              <div key={area} className="flex items-center gap-3">
                <div className="w-24 shrink-0">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {LIFE_AREA_CONFIG[area].label.replace('Personal ', '')}
                  </span>
                </div>
                <ProgressBar value={lifeAreaScores[area]} max={10} color={LIFE_AREA_CONFIG[area].color} size="sm" className="flex-1" />
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setLifeAreaScore(area, Math.max(1, lifeAreaScores[area] - 1))}
                    className="w-5 h-5 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[rgba(0,0,0,0.05)] transition-all"
                  >
                    <Minus size={10} />
                  </button>
                  <span className="w-6 text-center text-sm font-bold" style={{ color: LIFE_AREA_CONFIG[area].color }}>
                    {lifeAreaScores[area]}
                  </span>
                  <button
                    onClick={() => setLifeAreaScore(area, Math.min(10, lifeAreaScores[area] + 1))}
                    className="w-5 h-5 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[rgba(0,0,0,0.05)] transition-all"
                  >
                    <Plus size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card className="mb-6 fade-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Score Distribution</h2>
        <p className="text-xs text-[var(--text-secondary)] mb-4">Life balance scores across all domains</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barGap={4}>
              <XAxis dataKey="name" tick={{ fill: '#9EA3A8', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: '#9EA3A8', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #E3E4E6', borderRadius: 8, fontSize: 12, color: '#111111', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              />
              <Bar dataKey="score" radius={[3, 3, 0, 0]} name="Score">
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gap Analysis + Rings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-up" style={{ animationDelay: '0.25s' }}>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Target size={14} style={{ color: '#B35C44' }} />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Highest Opportunity Gaps</h2>
          </div>
          <div className="space-y-4">
            {gapAreas.map(({ area, gap }) => {
              const config = LIFE_AREA_CONFIG[area]
              const areaBlocks = rpmBlocks.filter((b) => b.lifeArea === area && b.status === 'active')
              return (
                <div key={area}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-xs font-medium text-[var(--text-primary)]">{config.label}</span>
                      <span className="text-xs text-[var(--text-muted)] ml-2">
                        {areaBlocks.length} block{areaBlocks.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: config.color }}>{lifeAreaScores[area]}/10</span>
                  </div>
                  <ProgressBar value={lifeAreaScores[area]} max={10} color={config.color} size="sm" />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">
                    {gap} point gap to ideal{areaBlocks.length === 0 ? ' · No RPM blocks assigned' : ''}
                  </p>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#3F7D6A' }} />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Area Overview</h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
            {areas.map((area) => (
              <ScoreRing key={area} score={lifeAreaScores[area]} max={10} color={LIFE_AREA_CONFIG[area].color} size={52}
                label={LIFE_AREA_CONFIG[area].label.replace('Personal ', '')} />
            ))}
          </div>
          <div
            className="mt-4 p-3 rounded-[var(--radius)]"
            style={{ background: 'rgba(43,76,126,0.06)', border: '1px solid rgba(43,76,126,0.12)' }}
          >
            <p className="text-xs font-semibold text-[#2B4C7E] mb-1">Balance Insight</p>
            <p className="text-xs text-[var(--text-secondary)]">
              {avgScore >= 8
                ? 'Outstanding life balance. Focus on maintaining momentum across all areas.'
                : avgScore >= 6
                ? `Good balance. ${LIFE_AREA_CONFIG[lowestArea].label} deserves focused attention.`
                : `Life balance needs work. Start by creating RPM blocks for ${LIFE_AREA_CONFIG[lowestArea].label}.`}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
