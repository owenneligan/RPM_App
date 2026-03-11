export type LifeArea =
  | 'career'
  | 'business'
  | 'finances'
  | 'health'
  | 'relationships'
  | 'growth'
  | 'lifestyle'

export type Priority = 'must' | 'should' | 'could'
export type Effort = 'low' | 'medium' | 'high'
export type ActionStatus = 'todo' | 'in-progress' | 'done' | 'blocked'
export type BlockStatus = 'active' | 'completed' | 'paused' | 'archived'
export type ReviewType = 'daily' | 'weekly' | 'monthly'

export interface Action {
  id: string
  rpmBlockId: string
  title: string
  priority: Priority
  effort: Effort
  sequence: number
  status: ActionStatus
  scheduledDate?: string
  completedAt?: string
  notes?: string
}

export interface RPMBlock {
  id: string
  result: string
  purpose: string
  emotionalDrivers: string[]
  identityAlignment: string
  lifeArea: LifeArea
  status: BlockStatus
  priority: 1 | 2 | 3
  targetDate?: string
  actions: Action[]
  progressNotes: string
  createdAt: string
  updatedAt: string
}

export interface Outcome {
  id: string
  lifeArea: LifeArea
  title: string
  purpose: string
  measurableIndicators: string[]
  targetDate?: string
  currentScore: number
  linkedRPMBlocks: string[]
  status: 'active' | 'achieved' | 'deferred'
  createdAt: string
}

export interface DailyFocus {
  id: string
  date: string
  topRPMBlockIds: string[]
  focusActionIds: string[]
  momentumScore: number
  morningIntention: string
  eveningReflection: string
  wins: string[]
  createdAt: string
}

export interface ReviewAnswer {
  questionId: string
  answer: string
}

export interface Review {
  id: string
  type: ReviewType
  date: string
  answers: ReviewAnswer[]
  overallScore: number
  keyInsight: string
  topCommitment: string
  createdAt: string
}

export interface BrainDump {
  id: string
  rawText: string
  convertedBlock?: Partial<RPMBlock> & { actions?: Partial<Action>[] }
  status: 'raw' | 'converting' | 'converted' | 'applied'
  createdAt: string
}

export interface LifeAreaConfig {
  label: string
  color: string
  bgColor: string
  description: string
}

export const LIFE_AREA_CONFIG: Record<LifeArea, LifeAreaConfig> = {
  career: {
    label: 'Career',
    color: '#5A9AE0',
    bgColor: 'rgba(90,154,224,0.09)',
    description: 'Professional growth, role, impact',
  },
  business: {
    label: 'Business',
    color: '#C9963D',
    bgColor: 'rgba(201,150,61,0.09)',
    description: 'Ventures, revenue, strategy',
  },
  finances: {
    label: 'Finances',
    color: '#3DB87A',
    bgColor: 'rgba(61,184,122,0.09)',
    description: 'Wealth, investments, freedom',
  },
  health: {
    label: 'Health',
    color: '#E05C4A',
    bgColor: 'rgba(224,92,74,0.09)',
    description: 'Energy, fitness, wellbeing',
  },
  relationships: {
    label: 'Relationships',
    color: '#D47A8A',
    bgColor: 'rgba(212,122,138,0.09)',
    description: 'Family, partnership, network',
  },
  growth: {
    label: 'Personal Growth',
    color: '#5A9AE0',
    bgColor: 'rgba(90,154,224,0.09)',
    description: 'Learning, mindset, mastery',
  },
  lifestyle: {
    label: 'Lifestyle',
    color: '#8B7BC8',
    bgColor: 'rgba(139,123,200,0.09)',
    description: 'Adventure, creativity, fulfilment',
  },
}

export const EMOTIONAL_DRIVERS = [
  'Freedom',
  'Security',
  'Significance',
  'Connection',
  'Growth',
  'Adventure',
  'Contribution',
  'Love',
  'Power',
  'Achievement',
  'Certainty',
  'Variety',
  'Legacy',
  'Health',
  'Wealth',
]

export const DAILY_REVIEW_QUESTIONS = [
  { id: 'wins', label: 'What were my top 3 wins today?' },
  { id: 'focus', label: 'Did I operate on my highest-priority outcomes?' },
  { id: 'energy', label: 'How was my energy and focus? (1–10)' },
  { id: 'obstacles', label: 'What obstacles or patterns showed up?' },
  { id: 'gratitude', label: 'What am I most grateful for today?' },
  { id: 'tomorrow', label: 'What is the single most important action tomorrow?' },
]

export const WEEKLY_REVIEW_QUESTIONS = [
  { id: 'results', label: 'Which RPM outcomes moved forward this week?' },
  { id: 'consistency', label: 'Rate your execution consistency (1–10)' },
  { id: 'learning', label: 'What was the biggest learning or insight?' },
  { id: 'patterns', label: 'What patterns are helping or hurting you?' },
  { id: 'relationships', label: 'How did you invest in key relationships?' },
  { id: 'vitality', label: 'How did you invest in your physical energy?' },
  { id: 'priorities', label: 'Are your current RPM blocks aligned with your deepest why?' },
  { id: 'adjustment', label: 'What one adjustment would most improve next week?' },
]

export const MONTHLY_REVIEW_QUESTIONS = [
  { id: 'outcomes', label: 'Which outcomes were achieved or advanced significantly?' },
  { id: 'lifeBalance', label: 'Which life areas received the most/least attention?' },
  { id: 'identity', label: 'Who are you becoming? Is it aligned with your vision?' },
  { id: 'momentum', label: 'What is your overall momentum score? (1–10)' },
  { id: 'beliefs', label: 'What limiting beliefs are you ready to eliminate?' },
  { id: 'celebration', label: 'What progress deserves genuine celebration?' },
  { id: 'recommit', label: 'What do you need to recommit to with full intensity?' },
  { id: 'nextMonth', label: 'What are the 3 highest-leverage outcomes for next month?' },
]
