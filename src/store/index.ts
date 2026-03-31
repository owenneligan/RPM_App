import { create } from 'zustand'
import {
  RPMBlock,
  Action,
  Outcome,
  DailyFocus,
  Review,
  BrainDump,
  LifeArea,
  ActionStatus,
  BlockStatus,
} from '../types'
import { uid, now, todayStr } from '../lib/utils'
import {
  loadAllData,
  DEFAULT_LIFE_AREA_SCORES,
  dbAddRPMBlock,
  dbUpdateRPMBlock,
  dbDeleteRPMBlock,
  dbAddAction,
  dbUpdateAction,
  dbDeleteAction,
  dbReorderActions,
  dbAddOutcome,
  dbUpdateOutcome,
  dbDeleteOutcome,
  dbSaveDailyFocus,
  dbSaveReview,
  dbDeleteReview,
  dbAddBrainDump,
  dbUpdateBrainDump,
  dbDeleteBrainDump,
  dbSetLifeAreaScores,
} from './db'

interface AppStore {
  // ── Loading state ──────────────────────────────────────────────────────────
  isLoading: boolean
  loadAllData: (userId: string) => Promise<void>
  clearAllData: () => void

  // ── RPM Blocks ────────────────────────────────────────────────────────────
  rpmBlocks: RPMBlock[]
  addRPMBlock: (block: Omit<RPMBlock, 'id' | 'createdAt' | 'updatedAt' | 'actions'>) => RPMBlock
  updateRPMBlock: (id: string, updates: Partial<RPMBlock>) => void
  deleteRPMBlock: (id: string) => void
  setBlockStatus: (id: string, status: BlockStatus) => void

  // ── Actions ───────────────────────────────────────────────────────────────
  addAction: (action: Omit<Action, 'id'>) => void
  updateAction: (blockId: string, actionId: string, updates: Partial<Action>) => void
  deleteAction: (blockId: string, actionId: string) => void
  setActionStatus: (blockId: string, actionId: string, status: ActionStatus) => void
  reorderActions: (blockId: string, actions: Action[]) => void

  // ── Outcomes ──────────────────────────────────────────────────────────────
  outcomes: Outcome[]
  addOutcome: (outcome: Omit<Outcome, 'id' | 'createdAt'>) => void
  updateOutcome: (id: string, updates: Partial<Outcome>) => void
  deleteOutcome: (id: string) => void

  // ── Daily Focus ───────────────────────────────────────────────────────────
  dailyFocuses: DailyFocus[]
  getTodayFocus: () => DailyFocus | undefined
  saveDailyFocus: (focus: Omit<DailyFocus, 'id' | 'createdAt'>) => void

  // ── Life Area Scores ──────────────────────────────────────────────────────
  lifeAreaScores: Record<LifeArea, number>
  setLifeAreaScore: (area: LifeArea, score: number) => void

  // ── Reviews ───────────────────────────────────────────────────────────────
  reviews: Review[]
  saveReview: (review: Omit<Review, 'id' | 'createdAt'>) => void
  deleteReview: (id: string) => void

  // ── Brain Dumps ───────────────────────────────────────────────────────────
  brainDumps: BrainDump[]
  addBrainDump: (text: string) => BrainDump
  updateBrainDump: (id: string, updates: Partial<BrainDump>) => void
  deleteBrainDump: (id: string) => void
  applyBrainDump: (dumpId: string) => RPMBlock | null

  // ── UI Filters ────────────────────────────────────────────────────────────
  activeLifeAreaFilter: LifeArea | 'all'
  setLifeAreaFilter: (area: LifeArea | 'all') => void
}

export const useStore = create<AppStore>()((set, get) => ({
  // ── Loading state ───────────────────────────────────────────────────────────
  isLoading: false,

  loadAllData: async (userId: string) => {
    set({ isLoading: true })
    try {
      const data = await loadAllData(userId)
      set({ ...data, isLoading: false })
    } catch (err) {
      console.error('Failed to load data from Supabase:', err)
      set({ isLoading: false })
    }
  },

  clearAllData: () => {
    set({
      rpmBlocks: [],
      outcomes: [],
      dailyFocuses: [],
      reviews: [],
      brainDumps: [],
      lifeAreaScores: { ...DEFAULT_LIFE_AREA_SCORES },
      isLoading: false,
    })
  },

  // ── RPM Blocks ──────────────────────────────────────────────────────────────
  rpmBlocks: [],

  addRPMBlock: (blockData) => {
    const block: RPMBlock = {
      id: uid(),
      actions: [],
      createdAt: now(),
      updatedAt: now(),
      ...blockData,
    }
    set((s) => ({ rpmBlocks: [block, ...s.rpmBlocks] }))
    dbAddRPMBlock(block).catch(console.error)
    return block
  },

  updateRPMBlock: (id, updates) => {
    set((s) => ({
      rpmBlocks: s.rpmBlocks.map((b) =>
        b.id === id ? { ...b, ...updates, updatedAt: now() } : b
      ),
    }))
    dbUpdateRPMBlock(id, updates).catch(console.error)
  },

  deleteRPMBlock: (id) => {
    set((s) => ({ rpmBlocks: s.rpmBlocks.filter((b) => b.id !== id) }))
    dbDeleteRPMBlock(id).catch(console.error)
  },

  setBlockStatus: (id, status) => {
    set((s) => ({
      rpmBlocks: s.rpmBlocks.map((b) =>
        b.id === id ? { ...b, status, updatedAt: now() } : b
      ),
    }))
    dbUpdateRPMBlock(id, { status }).catch(console.error)
  },

  // ── Actions ─────────────────────────────────────────────────────────────────
  addAction: (actionData) => {
    const action: Action = { id: uid(), ...actionData }
    set((s) => ({
      rpmBlocks: s.rpmBlocks.map((b) =>
        b.id === actionData.rpmBlockId
          ? { ...b, actions: [...b.actions, action], updatedAt: now() }
          : b
      ),
    }))
    dbAddAction(action).catch(console.error)
  },

  updateAction: (blockId, actionId, updates) => {
    set((s) => ({
      rpmBlocks: s.rpmBlocks.map((b) =>
        b.id === blockId
          ? {
              ...b,
              actions: b.actions.map((a) => (a.id === actionId ? { ...a, ...updates } : a)),
              updatedAt: now(),
            }
          : b
      ),
    }))
    dbUpdateAction(actionId, updates).catch(console.error)
  },

  deleteAction: (blockId, actionId) => {
    set((s) => ({
      rpmBlocks: s.rpmBlocks.map((b) =>
        b.id === blockId
          ? { ...b, actions: b.actions.filter((a) => a.id !== actionId), updatedAt: now() }
          : b
      ),
    }))
    dbDeleteAction(actionId).catch(console.error)
  },

  setActionStatus: (blockId, actionId, status) => {
    const completedAt = status === 'done' ? now() : undefined
    set((s) => ({
      rpmBlocks: s.rpmBlocks.map((b) =>
        b.id === blockId
          ? {
              ...b,
              actions: b.actions.map((a) =>
                a.id === actionId ? { ...a, status, completedAt } : a
              ),
              updatedAt: now(),
            }
          : b
      ),
    }))
    dbUpdateAction(actionId, { status, completedAt }).catch(console.error)
  },

  reorderActions: (blockId, actions) => {
    set((s) => ({
      rpmBlocks: s.rpmBlocks.map((b) =>
        b.id === blockId ? { ...b, actions, updatedAt: now() } : b
      ),
    }))
    dbReorderActions(actions).catch(console.error)
  },

  // ── Outcomes ─────────────────────────────────────────────────────────────────
  outcomes: [],

  addOutcome: (outcomeData) => {
    const outcome: Outcome = { id: uid(), createdAt: now(), ...outcomeData }
    set((s) => ({ outcomes: [outcome, ...s.outcomes] }))
    dbAddOutcome(outcome).catch(console.error)
  },

  updateOutcome: (id, updates) => {
    set((s) => ({
      outcomes: s.outcomes.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    }))
    dbUpdateOutcome(id, updates).catch(console.error)
  },

  deleteOutcome: (id) => {
    set((s) => ({ outcomes: s.outcomes.filter((o) => o.id !== id) }))
    dbDeleteOutcome(id).catch(console.error)
  },

  // ── Daily Focus ───────────────────────────────────────────────────────────────
  dailyFocuses: [],

  getTodayFocus: () => {
    const today = todayStr()
    return get().dailyFocuses.find((f) => f.date === today)
  },

  saveDailyFocus: (focusData) => {
    const today = todayStr()
    const existing = get().dailyFocuses.find((f) => f.date === today)
    let focus: DailyFocus

    if (existing) {
      focus = { ...existing, ...focusData }
      set((s) => ({
        dailyFocuses: s.dailyFocuses.map((f) => (f.date === today ? focus : f)),
      }))
    } else {
      focus = { id: uid(), createdAt: now(), ...focusData }
      set((s) => ({ dailyFocuses: [focus, ...s.dailyFocuses] }))
    }

    dbSaveDailyFocus(focus).catch(console.error)
  },

  // ── Life Area Scores ─────────────────────────────────────────────────────────
  lifeAreaScores: { ...DEFAULT_LIFE_AREA_SCORES },

  setLifeAreaScore: (area, score) => {
    set((s) => {
      const next = { ...s.lifeAreaScores, [area]: score }
      dbSetLifeAreaScores(next).catch(console.error)
      return { lifeAreaScores: next }
    })
  },

  // ── Reviews ──────────────────────────────────────────────────────────────────
  reviews: [],

  saveReview: (reviewData) => {
    const review: Review = { id: uid(), createdAt: now(), ...reviewData }
    set((s) => ({ reviews: [review, ...s.reviews] }))
    dbSaveReview(review).catch(console.error)
  },

  deleteReview: (id) => {
    set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) }))
    dbDeleteReview(id).catch(console.error)
  },

  // ── Brain Dumps ───────────────────────────────────────────────────────────────
  brainDumps: [],

  addBrainDump: (text) => {
    const dump: BrainDump = {
      id: uid(),
      rawText: text,
      status: 'raw',
      createdAt: now(),
    }
    set((s) => ({ brainDumps: [dump, ...s.brainDumps] }))
    dbAddBrainDump(dump).catch(console.error)
    return dump
  },

  updateBrainDump: (id, updates) => {
    set((s) => ({
      brainDumps: s.brainDumps.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }))
    dbUpdateBrainDump(id, updates).catch(console.error)
  },

  deleteBrainDump: (id) => {
    set((s) => ({ brainDumps: s.brainDumps.filter((d) => d.id !== id) }))
    dbDeleteBrainDump(id).catch(console.error)
  },

  applyBrainDump: (dumpId) => {
    const dump = get().brainDumps.find((d) => d.id === dumpId)
    if (!dump?.convertedBlock) return null

    const converted = dump.convertedBlock
    const block = get().addRPMBlock({
      result: converted.result || '',
      purpose: converted.purpose || '',
      emotionalDrivers: converted.emotionalDrivers || [],
      identityAlignment: converted.identityAlignment || '',
      lifeArea: converted.lifeArea || 'growth',
      status: 'active',
      priority: 2,
      targetDate: converted.targetDate,
      progressNotes: '',
    })

    const actions = converted.actions || []
    actions.forEach((a, i) => {
      get().addAction({
        rpmBlockId: block.id,
        title: a.title || '',
        priority: a.priority || 'should',
        effort: a.effort || 'medium',
        sequence: i,
        status: 'todo',
        notes: a.notes,
      })
    })

    get().updateBrainDump(dumpId, { status: 'applied' })
    return block
  },

  // ── UI Filters ────────────────────────────────────────────────────────────────
  activeLifeAreaFilter: 'all',
  setLifeAreaFilter: (area) => set({ activeLifeAreaFilter: area }),
}))
