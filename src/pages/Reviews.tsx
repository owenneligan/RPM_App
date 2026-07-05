import React, { useState } from 'react'
import { useSwipe } from '../hooks/useSwipe'
import {
  BookOpen,
  ChevronRight,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { format } from 'date-fns'
import { useStore } from '../store'
import {
  ReviewType,
  Review,
  ReviewAnswer,
  DAILY_REVIEW_QUESTIONS,
  WEEKLY_REVIEW_QUESTIONS,
  MONTHLY_REVIEW_QUESTIONS,
} from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { TextArea } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { ConfirmModal } from '../components/ui/Modal'
import { formatDate, todayStr, uid, now } from '../lib/utils'
import { cn } from '../lib/utils'

const REVIEW_TYPES: { type: ReviewType; label: string; color: string; questions: typeof DAILY_REVIEW_QUESTIONS }[] = [
  { type: 'daily', label: 'Daily', color: 'var(--blue)', questions: DAILY_REVIEW_QUESTIONS },
  { type: 'weekly', label: 'Weekly', color: 'var(--accent)', questions: WEEKLY_REVIEW_QUESTIONS },
  { type: 'monthly', label: 'Monthly', color: 'var(--gold)', questions: MONTHLY_REVIEW_QUESTIONS },
]

export function Reviews() {
  const reviews = useStore((s) => s.reviews)
  const saveReview = useStore((s) => s.saveReview)
  const deleteReview = useStore((s) => s.deleteReview)

  const [activeType, setActiveType] = useState<ReviewType>('daily')
  const [mode, setMode] = useState<'list' | 'create' | 'view'>('list')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [mobileShowDetail, setMobileShowDetail] = useState(false)

  const activeConfig = REVIEW_TYPES.find((r) => r.type === activeType)!
  const filteredReviews = reviews.filter((r) => r.type === activeType)

  const handleSave = (data: Omit<Review, 'id' | 'createdAt'>) => {
    saveReview(data)
    setMode('list')
  }

  const swipe = useSwipe(
    () => { if (!mobileShowDetail && filteredReviews.length > 0) setMobileShowDetail(true) },
    () => { if (mobileShowDetail) setMobileShowDetail(false) }
  )

  return (
    <div className="flex h-full" {...swipe}>
      {/* Left — list */}
      <div className={cn(
        'shrink-0 border-r border-[var(--border)] flex flex-col h-full overflow-hidden',
        mobileShowDetail ? 'hidden md:flex' : 'flex',
        'w-full md:w-72'
      )}>
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-sm font-bold text-[var(--text-primary)]">Reviews</h1>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={13} />}
              onClick={() => { setMode('create'); setSelectedReview(null); setMobileShowDetail(true) }}
            >
              New
            </Button>
          </div>

          {/* Type tabs */}
          <div className="flex gap-1 p-1 rounded-[var(--radius)] bg-[var(--bg-input)]">
            {REVIEW_TYPES.map((rt) => (
              <button
                key={rt.type}
                onClick={() => { setActiveType(rt.type); setMode('list') }}
                className={cn(
                  'flex-1 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-all',
                  activeType === rt.type
                    ? 'bg-[var(--bg-card-hover)] text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                )}
              >
                {rt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8 px-4">
              <BookOpen size={24} className="text-[var(--text-muted)] mx-auto mb-2" />
              <p className="text-xs text-[var(--text-muted)]">No {activeType} reviews yet</p>
              <button
                onClick={() => setMode('create')}
                className="text-xs text-[var(--accent)] hover:underline mt-2"
              >
                Create first review →
              </button>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                onClick={() => { setSelectedReview(review); setMode('view'); setMobileShowDetail(true) }}
                className={cn(
                  'p-3 rounded-[var(--radius)] cursor-pointer transition-all border group relative',
                  selectedReview?.id === review.id
                    ? 'bg-[var(--accent-dim)] border-[var(--border-accent)]'
                    : 'border-transparent hover:bg-[rgba(255,255,255,0.03)]'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={11} className="text-[var(--text-muted)]" />
                  <span className="text-xs text-[var(--text-secondary)]">
                    {formatDate(review.date)}
                  </span>
                  <span
                    className="text-xs font-semibold ml-auto"
                    style={{ color: activeConfig.color }}
                  >
                    {review.overallScore}/10
                  </span>
                </div>
                {review.keyInsight && (
                  <p className="text-[10px] text-[var(--text-muted)] line-clamp-2">
                    {review.keyInsight}
                  </p>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirm(review.id) }}
                  className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--red)] transition-all"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right — create/view */}
      <div className={cn('flex-1 overflow-y-auto', !mobileShowDetail && 'hidden md:block')}>
        <button
          onClick={() => setMobileShowDetail(false)}
          className="md:hidden flex items-center gap-1.5 text-xs text-[var(--text-secondary)] m-4 hover:text-[var(--accent)] transition-colors"
        >
          ← Back to list
        </button>
        {mode === 'create' ? (
          <CreateReview
            type={activeType}
            config={activeConfig}
            onSave={handleSave}
            onCancel={() => { setMode('list'); setMobileShowDetail(false) }}
          />
        ) : mode === 'view' && selectedReview ? (
          <ViewReview review={selectedReview} config={activeConfig} />
        ) : (
          <div className="flex items-center justify-center h-full text-center p-8">
            <div>
              <BookOpen size={40} className="text-[var(--text-muted)] mx-auto mb-4" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                Structured reflection drives growth
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mb-4 max-w-xs">
                Regular reviews are how high performers identify patterns, celebrate wins, and course-correct fast.
              </p>
              <Button
                variant="primary"
                icon={<Plus size={14} />}
                onClick={() => setMode('create')}
              >
                Start {activeType} review
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => { if (deleteConfirm) deleteReview(deleteConfirm) }}
        title="Delete Review"
        message="This review will be permanently deleted."
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}

function CreateReview({
  type,
  config,
  onSave,
  onCancel,
}: {
  type: ReviewType
  config: typeof REVIEW_TYPES[0]
  onSave: (data: Omit<Review, 'id' | 'createdAt'>) => void
  onCancel: () => void
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [overallScore, setOverallScore] = useState(0)
  const [keyInsight, setKeyInsight] = useState('')
  const [topCommitment, setTopCommitment] = useState('')

  const setAnswer = (id: string, val: string) =>
    setAnswers((prev) => ({ ...prev, [id]: val }))

  const handleSave = () => {
    const reviewAnswers: ReviewAnswer[] = config.questions.map((q) => ({
      questionId: q.id,
      answer: answers[q.id] || '',
    }))
    onSave({
      type,
      date: todayStr(),
      answers: reviewAnswers,
      overallScore,
      keyInsight,
      topCommitment,
    })
  }

  const completedCount = config.questions.filter((q) => answers[q.id]?.trim()).length

  return (
    <div className="p-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: config.color }}>
            {config.label} Review
          </span>
          <Badge variant="default">{format(new Date(), 'MMM d, yyyy')}</Badge>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          {type === 'daily' ? 'End of Day Reflection' : type === 'weekly' ? 'Weekly Performance Review' : 'Monthly Strategic Review'}
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {completedCount}/{config.questions.length} questions answered
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-5 mb-6">
        {config.questions.map((q, i) => (
          <div key={q.id}>
            <label className="flex items-start gap-2 mb-2">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                style={{
                  background: answers[q.id]?.trim() ? config.color + '25' : 'rgba(255,255,255,0.06)',
                  color: answers[q.id]?.trim() ? config.color : 'var(--text-muted)',
                }}
              >
                {answers[q.id]?.trim() ? '✓' : i + 1}
              </span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{q.label}</span>
            </label>
            <TextArea
              value={answers[q.id] || ''}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              placeholder="Your honest reflection…"
              rows={2}
              className="ml-7"
            />
          </div>
        ))}
      </div>

      {/* Overall score */}
      <div className="mb-5">
        <p className="text-sm font-medium text-[var(--text-primary)] mb-3">
          Overall {type} score
        </p>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              onClick={() => setOverallScore(n)}
              className={cn(
                'flex-1 h-10 rounded-[var(--radius-sm)] text-sm font-semibold transition-all border',
                overallScore === n
                  ? 'text-white border-transparent'
                  : overallScore >= n
                  ? 'border-[rgba(255,255,255,0.1)]'
                  : 'text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-bright)]'
              )}
              style={
                overallScore >= n
                  ? { background: config.color + (overallScore === n ? '' : '60'), color: overallScore === n ? '#fff' : config.color }
                  : {}
              }
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Key insight + commitment */}
      <div className="space-y-4 mb-6">
        <TextArea
          label="Key Insight"
          value={keyInsight}
          onChange={(e) => setKeyInsight(e.target.value)}
          placeholder="What is the single most important insight from this review?"
          rows={2}
        />
        <TextArea
          label="Top Commitment"
          value={topCommitment}
          onChange={(e) => setTopCommitment(e.target.value)}
          placeholder="What is the one action you commit to with full intensity?"
          rows={2}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={overallScore === 0}
          icon={<CheckCircle2 size={14} />}
        >
          Save Review
        </Button>
      </div>
    </div>
  )
}

function ViewReview({
  review,
  config,
}: {
  review: Review
  config: typeof REVIEW_TYPES[0]
}) {
  const questionMap = Object.fromEntries(config.questions.map((q) => [q.id, q.label]))

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: config.color }}>
            {config.label} Review
          </span>
          <Badge variant="default">{formatDate(review.date)}</Badge>
          <span
            className="ml-auto text-xl font-bold"
            style={{ color: config.color }}
          >
            {review.overallScore}/10
          </span>
        </div>
      </div>

      <div className="space-y-5 mb-6">
        {review.answers
          .filter((a) => a.answer.trim())
          .map((a) => (
            <div key={a.questionId}>
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                {questionMap[a.questionId] || a.questionId}
              </p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">{a.answer}</p>
            </div>
          ))}
      </div>

      {review.keyInsight && (
        <div
          className="p-4 rounded-[var(--radius-lg)] mb-4"
          style={{ background: config.color + '15', border: `1px solid ${config.color}30` }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: config.color }}>
            Key Insight
          </p>
          <p className="text-sm text-[var(--text-primary)]">{review.keyInsight}</p>
        </div>
      )}

      {review.topCommitment && (
        <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--accent-dim)] border border-[var(--border-accent)]">
          <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wide mb-1.5">
            Top Commitment
          </p>
          <p className="text-sm text-[var(--text-primary)]">{review.topCommitment}</p>
        </div>
      )}
    </div>
  )
}
