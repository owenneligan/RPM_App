/**
 * db.ts — All Supabase CRUD operations.
 * Each function maps between TypeScript camelCase types and Postgres snake_case columns.
 * Row Level Security on all tables ensures users only access their own data.
 */
import { supabase } from '../lib/supabase'
import {
  RPMBlock,
  Action,
  Outcome,
  DailyFocus,
  Review,
  BrainDump,
  LifeArea,
} from '../types'
import { now } from '../lib/utils'

// ── Default scores used when no record exists ────────────────────────────────
export const DEFAULT_LIFE_AREA_SCORES: Record<LifeArea, number> = {
  career: 7,
  business: 6,
  finances: 6,
  health: 7,
  relationships: 7,
  growth: 8,
  lifestyle: 6,
}

// ── Row → TypeScript mappers ─────────────────────────────────────────────────

function rowToAction(row: Record<string, unknown>): Action {
  return {
    id: row.id as string,
    rpmBlockId: row.rpm_block_id as string,
    title: row.title as string,
    priority: row.priority as Action['priority'],
    effort: row.effort as Action['effort'],
    sequence: row.sequence as number,
    status: row.status as Action['status'],
    scheduledDate: (row.scheduled_date as string | null) ?? undefined,
    completedAt: (row.completed_at as string | null) ?? undefined,
    notes: (row.notes as string | null) ?? undefined,
  }
}

function rowToBlock(row: Record<string, unknown>, actions: Action[]): RPMBlock {
  const id = row.id as string
  return {
    id,
    result: row.result as string,
    purpose: row.purpose as string,
    emotionalDrivers: (row.emotional_drivers as string[]) ?? [],
    identityAlignment: (row.identity_alignment as string) ?? '',
    lifeArea: row.life_area as LifeArea,
    status: row.status as RPMBlock['status'],
    priority: row.priority as RPMBlock['priority'],
    targetDate: (row.target_date as string | null) ?? undefined,
    actions: actions.filter((a) => a.rpmBlockId === id),
    progressNotes: (row.progress_notes as string) ?? '',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function rowToOutcome(row: Record<string, unknown>): Outcome {
  return {
    id: row.id as string,
    lifeArea: row.life_area as LifeArea,
    title: row.title as string,
    purpose: row.purpose as string,
    measurableIndicators: (row.measurable_indicators as string[]) ?? [],
    targetDate: (row.target_date as string | null) ?? undefined,
    currentScore: (row.current_score as number) ?? 5,
    linkedRPMBlocks: (row.linked_rpm_blocks as string[]) ?? [],
    status: row.status as Outcome['status'],
    createdAt: row.created_at as string,
  }
}

function rowToFocus(row: Record<string, unknown>): DailyFocus {
  return {
    id: row.id as string,
    date: row.date as string,
    topRPMBlockIds: (row.top_rpm_block_ids as string[]) ?? [],
    focusActionIds: (row.focus_action_ids as string[]) ?? [],
    momentumScore: (row.momentum_score as number) ?? 0,
    morningIntention: (row.morning_intention as string) ?? '',
    eveningReflection: (row.evening_reflection as string) ?? '',
    wins: (row.wins as string[]) ?? [],
    createdAt: row.created_at as string,
  }
}

function rowToReview(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    type: row.type as Review['type'],
    date: row.date as string,
    answers: (row.answers as Review['answers']) ?? [],
    overallScore: (row.overall_score as number) ?? 0,
    keyInsight: (row.key_insight as string) ?? '',
    topCommitment: (row.top_commitment as string) ?? '',
    createdAt: row.created_at as string,
  }
}

function rowToDump(row: Record<string, unknown>): BrainDump {
  return {
    id: row.id as string,
    rawText: row.raw_text as string,
    convertedBlock: (row.converted_block as BrainDump['convertedBlock']) ?? undefined,
    status: row.status as BrainDump['status'],
    createdAt: row.created_at as string,
  }
}

// ── TypeScript → row update mappers ─────────────────────────────────────────

function blockUpdateToRow(updates: Partial<RPMBlock>): Record<string, unknown> {
  const row: Record<string, unknown> = { updated_at: now() }
  if ('result' in updates) row.result = updates.result
  if ('purpose' in updates) row.purpose = updates.purpose
  if ('emotionalDrivers' in updates) row.emotional_drivers = updates.emotionalDrivers
  if ('identityAlignment' in updates) row.identity_alignment = updates.identityAlignment
  if ('lifeArea' in updates) row.life_area = updates.lifeArea
  if ('status' in updates) row.status = updates.status
  if ('priority' in updates) row.priority = updates.priority
  if ('targetDate' in updates) row.target_date = updates.targetDate ?? null
  if ('progressNotes' in updates) row.progress_notes = updates.progressNotes
  return row
}

function actionUpdateToRow(updates: Partial<Action>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if ('title' in updates) row.title = updates.title
  if ('priority' in updates) row.priority = updates.priority
  if ('effort' in updates) row.effort = updates.effort
  if ('sequence' in updates) row.sequence = updates.sequence
  if ('status' in updates) row.status = updates.status
  if ('scheduledDate' in updates) row.scheduled_date = updates.scheduledDate ?? null
  if ('completedAt' in updates) row.completed_at = updates.completedAt ?? null
  if ('notes' in updates) row.notes = updates.notes ?? null
  return row
}

// ── RPM Blocks ───────────────────────────────────────────────────────────────

export async function dbAddRPMBlock(block: RPMBlock): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const { error } = await supabase.from('rpm_blocks').insert({
    id: block.id,
    user_id: session.user.id,
    result: block.result,
    purpose: block.purpose,
    emotional_drivers: block.emotionalDrivers,
    identity_alignment: block.identityAlignment,
    life_area: block.lifeArea,
    status: block.status,
    priority: block.priority,
    target_date: block.targetDate ?? null,
    progress_notes: block.progressNotes,
    created_at: block.createdAt,
    updated_at: block.updatedAt,
  })
  if (error) throw error
}

export async function dbUpdateRPMBlock(id: string, updates: Partial<RPMBlock>): Promise<void> {
  const { error } = await supabase
    .from('rpm_blocks')
    .update(blockUpdateToRow(updates))
    .eq('id', id)
  if (error) throw error
}

export async function dbDeleteRPMBlock(id: string): Promise<void> {
  const { error } = await supabase.from('rpm_blocks').delete().eq('id', id)
  if (error) throw error
}

// ── Actions ──────────────────────────────────────────────────────────────────

export async function dbAddAction(action: Action): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const { error } = await supabase.from('actions').insert({
    id: action.id,
    user_id: session.user.id,
    rpm_block_id: action.rpmBlockId,
    title: action.title,
    priority: action.priority,
    effort: action.effort,
    sequence: action.sequence,
    status: action.status,
    scheduled_date: action.scheduledDate ?? null,
    completed_at: action.completedAt ?? null,
    notes: action.notes ?? null,
  })
  if (error) throw error
}

export async function dbUpdateAction(actionId: string, updates: Partial<Action>): Promise<void> {
  const { error } = await supabase
    .from('actions')
    .update(actionUpdateToRow(updates))
    .eq('id', actionId)
  if (error) throw error
}

export async function dbDeleteAction(actionId: string): Promise<void> {
  const { error } = await supabase.from('actions').delete().eq('id', actionId)
  if (error) throw error
}

export async function dbReorderActions(actions: Action[]): Promise<void> {
  const updates = actions.map((a) => ({
    id: a.id,
    sequence: a.sequence,
  }))
  for (const u of updates) {
    const { error } = await supabase
      .from('actions')
      .update({ sequence: u.sequence })
      .eq('id', u.id)
    if (error) throw error
  }
}

// ── Outcomes ─────────────────────────────────────────────────────────────────

export async function dbAddOutcome(outcome: Outcome): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const { error } = await supabase.from('outcomes').insert({
    id: outcome.id,
    user_id: session.user.id,
    life_area: outcome.lifeArea,
    title: outcome.title,
    purpose: outcome.purpose,
    measurable_indicators: outcome.measurableIndicators,
    target_date: outcome.targetDate ?? null,
    current_score: outcome.currentScore,
    linked_rpm_blocks: outcome.linkedRPMBlocks,
    status: outcome.status,
    created_at: outcome.createdAt,
  })
  if (error) throw error
}

export async function dbUpdateOutcome(id: string, updates: Partial<Outcome>): Promise<void> {
  const row: Record<string, unknown> = {}
  if ('lifeArea' in updates) row.life_area = updates.lifeArea
  if ('title' in updates) row.title = updates.title
  if ('purpose' in updates) row.purpose = updates.purpose
  if ('measurableIndicators' in updates) row.measurable_indicators = updates.measurableIndicators
  if ('targetDate' in updates) row.target_date = updates.targetDate ?? null
  if ('currentScore' in updates) row.current_score = updates.currentScore
  if ('linkedRPMBlocks' in updates) row.linked_rpm_blocks = updates.linkedRPMBlocks
  if ('status' in updates) row.status = updates.status
  const { error } = await supabase.from('outcomes').update(row).eq('id', id)
  if (error) throw error
}

export async function dbDeleteOutcome(id: string): Promise<void> {
  const { error } = await supabase.from('outcomes').delete().eq('id', id)
  if (error) throw error
}

// ── Daily Focus ───────────────────────────────────────────────────────────────

export async function dbSaveDailyFocus(focus: DailyFocus): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const { error } = await supabase.from('daily_focuses').upsert(
    {
      id: focus.id,
      user_id: session.user.id,
      date: focus.date,
      top_rpm_block_ids: focus.topRPMBlockIds,
      focus_action_ids: focus.focusActionIds,
      momentum_score: focus.momentumScore,
      morning_intention: focus.morningIntention,
      evening_reflection: focus.eveningReflection,
      wins: focus.wins,
      created_at: focus.createdAt,
    },
    { onConflict: 'user_id,date' }
  )
  if (error) throw error
}

// ── Reviews ──────────────────────────────────────────────────────────────────

export async function dbSaveReview(review: Review): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const { error } = await supabase.from('reviews').insert({
    id: review.id,
    user_id: session.user.id,
    type: review.type,
    date: review.date,
    answers: review.answers,
    overall_score: review.overallScore,
    key_insight: review.keyInsight,
    top_commitment: review.topCommitment,
    created_at: review.createdAt,
  })
  if (error) throw error
}

export async function dbDeleteReview(id: string): Promise<void> {
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) throw error
}

// ── Brain Dumps ───────────────────────────────────────────────────────────────

export async function dbAddBrainDump(dump: BrainDump): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const { error } = await supabase.from('brain_dumps').insert({
    id: dump.id,
    user_id: session.user.id,
    raw_text: dump.rawText,
    converted_block: dump.convertedBlock ?? null,
    status: dump.status,
    created_at: dump.createdAt,
  })
  if (error) throw error
}

export async function dbUpdateBrainDump(id: string, updates: Partial<BrainDump>): Promise<void> {
  const row: Record<string, unknown> = {}
  if ('rawText' in updates) row.raw_text = updates.rawText
  if ('convertedBlock' in updates) row.converted_block = updates.convertedBlock ?? null
  if ('status' in updates) row.status = updates.status
  const { error } = await supabase.from('brain_dumps').update(row).eq('id', id)
  if (error) throw error
}

export async function dbDeleteBrainDump(id: string): Promise<void> {
  const { error } = await supabase.from('brain_dumps').delete().eq('id', id)
  if (error) throw error
}

// ── Life Area Scores ─────────────────────────────────────────────────────────

export async function dbSetLifeAreaScores(scores: Record<LifeArea, number>): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const { error } = await supabase
    .from('life_area_scores')
    .upsert({ user_id: session.user.id, scores }, { onConflict: 'user_id' })
  if (error) throw error
}

// ── Load All Data ─────────────────────────────────────────────────────────────

export interface AllUserData {
  rpmBlocks: RPMBlock[]
  outcomes: Outcome[]
  dailyFocuses: DailyFocus[]
  reviews: Review[]
  brainDumps: BrainDump[]
  lifeAreaScores: Record<LifeArea, number>
}

export async function loadAllData(userId: string): Promise<AllUserData> {
  const [
    { data: blockRows },
    { data: actionRows },
    { data: outcomeRows },
    { data: focusRows },
    { data: reviewRows },
    { data: dumpRows },
    { data: scoreRow },
  ] = await Promise.all([
    supabase.from('rpm_blocks').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('actions').select('*').eq('user_id', userId).order('sequence', { ascending: true }),
    supabase.from('outcomes').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('daily_focuses').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('reviews').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('brain_dumps').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('life_area_scores').select('*').eq('user_id', userId).maybeSingle(),
  ])

  const actions = (actionRows ?? []).map(rowToAction)
  const rpmBlocks = (blockRows ?? []).map((row) => rowToBlock(row, actions))
  const outcomes = (outcomeRows ?? []).map(rowToOutcome)
  const dailyFocuses = (focusRows ?? []).map(rowToFocus)
  const reviews = (reviewRows ?? []).map(rowToReview)
  const brainDumps = (dumpRows ?? []).map(rowToDump)
  const lifeAreaScores: Record<LifeArea, number> = scoreRow
    ? (scoreRow.scores as Record<LifeArea, number>)
    : { ...DEFAULT_LIFE_AREA_SCORES }

  return { rpmBlocks, outcomes, dailyFocuses, reviews, brainDumps, lifeAreaScores }
}

// ── Migration from localStorage ───────────────────────────────────────────────

export interface LocalStorageSnapshot {
  rpmBlocks: RPMBlock[]
  outcomes: Outcome[]
  dailyFocuses: DailyFocus[]
  reviews: Review[]
  brainDumps: BrainDump[]
  lifeAreaScores: Record<LifeArea, number>
}

export async function migrateLocalStorage(
  userId: string,
  data: LocalStorageSnapshot
): Promise<void> {
  const blockRows = data.rpmBlocks.map((b) => ({
    id: b.id,
    user_id: userId,
    result: b.result,
    purpose: b.purpose,
    emotional_drivers: b.emotionalDrivers,
    identity_alignment: b.identityAlignment,
    life_area: b.lifeArea,
    status: b.status,
    priority: b.priority,
    target_date: b.targetDate ?? null,
    progress_notes: b.progressNotes,
    created_at: b.createdAt,
    updated_at: b.updatedAt,
  }))

  const actionRows = data.rpmBlocks.flatMap((b) =>
    b.actions.map((a) => ({
      id: a.id,
      user_id: userId,
      rpm_block_id: a.rpmBlockId,
      title: a.title,
      priority: a.priority,
      effort: a.effort,
      sequence: a.sequence,
      status: a.status,
      scheduled_date: a.scheduledDate ?? null,
      completed_at: a.completedAt ?? null,
      notes: a.notes ?? null,
    }))
  )

  const outcomeRows = data.outcomes.map((o) => ({
    id: o.id,
    user_id: userId,
    life_area: o.lifeArea,
    title: o.title,
    purpose: o.purpose,
    measurable_indicators: o.measurableIndicators,
    target_date: o.targetDate ?? null,
    current_score: o.currentScore,
    linked_rpm_blocks: o.linkedRPMBlocks,
    status: o.status,
    created_at: o.createdAt,
  }))

  const focusRows = data.dailyFocuses.map((f) => ({
    id: f.id,
    user_id: userId,
    date: f.date,
    top_rpm_block_ids: f.topRPMBlockIds,
    focus_action_ids: f.focusActionIds,
    momentum_score: f.momentumScore,
    morning_intention: f.morningIntention,
    evening_reflection: f.eveningReflection,
    wins: f.wins,
    created_at: f.createdAt,
  }))

  const reviewRows = data.reviews.map((r) => ({
    id: r.id,
    user_id: userId,
    type: r.type,
    date: r.date,
    answers: r.answers,
    overall_score: r.overallScore,
    key_insight: r.keyInsight,
    top_commitment: r.topCommitment,
    created_at: r.createdAt,
  }))

  const dumpRows = data.brainDumps.map((d) => ({
    id: d.id,
    user_id: userId,
    raw_text: d.rawText,
    converted_block: d.convertedBlock ?? null,
    status: d.status,
    created_at: d.createdAt,
  }))

  // Batch upsert everything (ignore conflicts in case of partial prior migration)
  const upsert = async (table: string, rows: Record<string, unknown>[], conflict: string) => {
    if (rows.length === 0) return
    const { error } = await supabase.from(table).upsert(rows, { onConflict: conflict })
    if (error) throw error
  }

  await Promise.all([
    upsert('rpm_blocks', blockRows, 'id'),
    upsert('actions', actionRows, 'id'),
    upsert('outcomes', outcomeRows, 'id'),
    upsert('daily_focuses', focusRows, 'id'),
    upsert('reviews', reviewRows, 'id'),
    upsert('brain_dumps', dumpRows, 'id'),
    (async () => {
      const { error } = await supabase
        .from('life_area_scores')
        .upsert({ user_id: userId, scores: data.lifeAreaScores }, { onConflict: 'user_id' })
      if (error) throw error
    })(),
  ])
}
