import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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

interface AppStore {
  // ── Profile ───────────────────────────────────────────────────────────────
  userName: string
  updateUserName: (name: string) => void

  // ── RPM Blocks ────────────────────────────────────────────────────────────
  rpmBlocks: RPMBlock[]
  addRPMBlock: (block: Omit<RPMBlock, 'id' | 'createdAt' | 'updatedAt' | 'actions'>) => RPMBlock
  updateRPMBlock: (id: string, updates: Partial<RPMBlock>) => void
  deleteRPMBlock: (id: string) => void
  setBlockStatus: (id: string, status: BlockStatus) => void
  duplicateRPMBlock: (id: string) => RPMBlock | null

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

  // ── Data Management ───────────────────────────────────────────────────────
  importData: (data: {
    rpmBlocks?: RPMBlock[]
    outcomes?: Outcome[]
    reviews?: Review[]
    brainDumps?: BrainDump[]
    dailyFocuses?: DailyFocus[]
  }) => void
}

const DEFAULT_LIFE_AREA_SCORES: Record<LifeArea, number> = {
  career: 7,
  business: 6,
  finances: 6,
  health: 7,
  relationships: 7,
  growth: 8,
  lifestyle: 6,
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── Profile ─────────────────────────────────────────────────────────────
      userName: '',
      updateUserName: (name) => set({ userName: name }),

      // ── RPM Blocks ──────────────────────────────────────────────────────────
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
        return block
      },

      updateRPMBlock: (id, updates) => {
        set((s) => ({
          rpmBlocks: s.rpmBlocks.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: now() } : b
          ),
        }))
      },

      deleteRPMBlock: (id) => {
        set((s) => ({ rpmBlocks: s.rpmBlocks.filter((b) => b.id !== id) }))
      },

      setBlockStatus: (id, status) => {
        set((s) => ({
          rpmBlocks: s.rpmBlocks.map((b) =>
            b.id === id ? { ...b, status, updatedAt: now() } : b
          ),
        }))
      },

      duplicateRPMBlock: (id) => {
        const block = get().rpmBlocks.find((b) => b.id === id)
        if (!block) return null
        const newBlock: RPMBlock = {
          ...block,
          id: uid(),
          result: `${block.result} (copy)`,
          status: 'active',
          actions: block.actions.map((a) => ({
            ...a,
            id: uid(),
            status: 'todo' as ActionStatus,
            completedAt: undefined,
          })),
          progressNotes: '',
          createdAt: now(),
          updatedAt: now(),
        }
        set((s) => ({ rpmBlocks: [newBlock, ...s.rpmBlocks] }))
        return newBlock
      },

      // ── Actions ─────────────────────────────────────────────────────────────
      addAction: (actionData) => {
        const action: Action = { id: uid(), ...actionData }
        set((s) => ({
          rpmBlocks: s.rpmBlocks.map((b) =>
            b.id === actionData.rpmBlockId
              ? { ...b, actions: [...b.actions, action], updatedAt: now() }
              : b
          ),
        }))
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
      },

      deleteAction: (blockId, actionId) => {
        set((s) => ({
          rpmBlocks: s.rpmBlocks.map((b) =>
            b.id === blockId
              ? { ...b, actions: b.actions.filter((a) => a.id !== actionId), updatedAt: now() }
              : b
          ),
        }))
      },

      setActionStatus: (blockId, actionId, status) => {
        set((s) => ({
          rpmBlocks: s.rpmBlocks.map((b) =>
            b.id === blockId
              ? {
                  ...b,
                  actions: b.actions.map((a) =>
                    a.id === actionId
                      ? { ...a, status, completedAt: status === 'done' ? now() : undefined }
                      : a
                  ),
                  updatedAt: now(),
                }
              : b
          ),
        }))
      },

      reorderActions: (blockId, actions) => {
        set((s) => ({
          rpmBlocks: s.rpmBlocks.map((b) =>
            b.id === blockId ? { ...b, actions, updatedAt: now() } : b
          ),
        }))
      },

      // ── Outcomes ─────────────────────────────────────────────────────────────
      outcomes: [],

      addOutcome: (outcomeData) => {
        const outcome: Outcome = { id: uid(), createdAt: now(), ...outcomeData }
        set((s) => ({ outcomes: [outcome, ...s.outcomes] }))
      },

      updateOutcome: (id, updates) => {
        set((s) => ({
          outcomes: s.outcomes.map((o) => (o.id === id ? { ...o, ...updates } : o)),
        }))
      },

      deleteOutcome: (id) => {
        set((s) => ({ outcomes: s.outcomes.filter((o) => o.id !== id) }))
      },

      // ── Daily Focus ───────────────────────────────────────────────────────────
      dailyFocuses: [],

      getTodayFocus: () => {
        const today = todayStr()
        return get().dailyFocuses.find((f) => f.date === today)
      },

      saveDailyFocus: (focusData) => {
        const today = todayStr()
        const existing = get().dailyFocuses.find((f) => f.date === today)
        if (existing) {
          set((s) => ({
            dailyFocuses: s.dailyFocuses.map((f) =>
              f.date === today ? { ...f, ...focusData } : f
            ),
          }))
        } else {
          const focus: DailyFocus = { id: uid(), createdAt: now(), ...focusData }
          set((s) => ({ dailyFocuses: [focus, ...s.dailyFocuses] }))
        }
      },

      // ── Life Area Scores ─────────────────────────────────────────────────────
      lifeAreaScores: DEFAULT_LIFE_AREA_SCORES,

      setLifeAreaScore: (area, score) => {
        set((s) => ({ lifeAreaScores: { ...s.lifeAreaScores, [area]: score } }))
      },

      // ── Reviews ──────────────────────────────────────────────────────────────
      reviews: [],

      saveReview: (reviewData) => {
        const review: Review = { id: uid(), createdAt: now(), ...reviewData }
        set((s) => ({ reviews: [review, ...s.reviews] }))
      },

      deleteReview: (id) => {
        set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) }))
      },

      // ── Brain Dumps ───────────────────────────────────────────────────────────
      brainDumps: [],

      addBrainDump: (text) => {
        const dump: BrainDump = {
          id: uid(),
          rawText: text,
          status: 'raw',
          createdAt: now(),
        }
        set((s) => ({ brainDumps: [dump, ...s.brainDumps] }))
        return dump
      },

      updateBrainDump: (id, updates) => {
        set((s) => ({
          brainDumps: s.brainDumps.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }))
      },

      deleteBrainDump: (id) => {
        set((s) => ({ brainDumps: s.brainDumps.filter((d) => d.id !== id) }))
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

        // Add actions
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

      // ── UI Filters ────────────────────────────────────────────────────────────
      activeLifeAreaFilter: 'all',
      setLifeAreaFilter: (area) => set({ activeLifeAreaFilter: area }),

      // ── Data Management ───────────────────────────────────────────────────────
      importData: (data) => {
        set((s) => ({
          rpmBlocks: data.rpmBlocks ?? s.rpmBlocks,
          outcomes: data.outcomes ?? s.outcomes,
          reviews: data.reviews ?? s.reviews,
          brainDumps: data.brainDumps ?? s.brainDumps,
          dailyFocuses: data.dailyFocuses ?? s.dailyFocuses,
        }))
      },
    }),
    {
      name: 'rpm-life-os-v1',
    }
  )
)
