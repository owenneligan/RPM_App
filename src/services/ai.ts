import { RPMBlock, Action, LifeArea } from '../types'
import { supabase } from '../lib/supabase'

interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

async function chat(
  messages: AIMessage[],
  system: string
): Promise<string> {
  // Attach the user's JWT so the server can verify identity
  const { data: { session } } = await supabase.auth.getSession()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages, system }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }

  const data = await res.json()
  return data.content[0]?.text || ''
}

// ── Brain Dump → RPM Conversion ─────────────────────────────────────────────

const BRAIN_DUMP_SYSTEM = `You are an expert RPM (Result, Purpose, Massive Action Plan) performance coach trained in Tony Robbins' methodology. You help high-performing entrepreneurs and executives transform raw thoughts into structured, compelling RPM blocks.

When given raw thoughts, ideas, or goals, extract and structure them into the RPM framework:

R = Result: A specific, compelling, measurable outcome. Use powerful language. Make it concrete.
P = Purpose: The deep emotional WHY. What does achieving this mean? What pain does it eliminate? What pleasure does it create?
M = Massive Action Plan: Prioritised, concrete action steps with clear sequencing.

Return ONLY valid JSON with this exact structure:
{
  "result": "A specific, compelling outcome statement",
  "purpose": "Deep emotional purpose — the compelling WHY behind this result",
  "emotionalDrivers": ["driver1", "driver2", "driver3"],
  "identityAlignment": "Who you must become to achieve this (identity statement)",
  "lifeArea": "career|business|finances|health|relationships|growth|lifestyle",
  "targetDate": "YYYY-MM-DD or null",
  "actions": [
    {
      "title": "Specific action step",
      "priority": "must|should|could",
      "effort": "low|medium|high",
      "notes": "optional context"
    }
  ]
}

Rules:
- Result should start with an active verb and be specific
- Purpose should be emotionally compelling, not corporate-speak
- Include 3-6 actions, ordered by priority
- Infer the most likely life area from context
- Emotional drivers must come from: Freedom, Security, Significance, Connection, Growth, Adventure, Contribution, Love, Power, Achievement, Certainty, Variety, Legacy, Health, Wealth`

export async function convertBrainDump(
  rawText: string
): Promise<Partial<RPMBlock> & { actions?: Partial<Action>[] }> {
  const text = await chat(
    [{ role: 'user', content: rawText }],
    BRAIN_DUMP_SYSTEM
  )

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Could not parse AI response')

  const parsed = JSON.parse(jsonMatch[0])
  return parsed
}

// ── Goal Refinement ──────────────────────────────────────────────────────────

export async function refineResult(weakResult: string): Promise<string> {
  const system = `You are a Tony Robbins RPM coach. Transform weak, vague goals into powerful, specific, compelling RESULT statements.

  A great Result:
  - Starts with an active verb
  - Is specific and measurable
  - Is emotionally charged
  - Has a clear timeframe if possible
  - Uses powerful language that creates momentum

  Return ONLY the refined result statement, nothing else.`

  return await chat(
    [{ role: 'user', content: `Refine this result: "${weakResult}"` }],
    system
  )
}

// ── Purpose Deepening ────────────────────────────────────────────────────────

export async function deepenPurpose(result: string, weakPurpose: string): Promise<string> {
  const system = `You are a Tony Robbins performance coach specialising in emotional leverage and purpose.

  Given a result and a weak purpose statement, write a compelling, emotionally resonant PURPOSE that:
  - Connects to deep human drivers (freedom, significance, love, growth, etc.)
  - Creates emotional urgency
  - Explains what achieving this result MEANS at a life level
  - Uses vivid, sensory language

  Return ONLY the refined purpose statement (2-4 sentences), nothing else.`

  return await chat(
    [{ role: 'user', content: `Result: "${result}"\n\nWeak purpose: "${weakPurpose}"` }],
    system
  )
}

// ── Next Action Suggestions ───────────────────────────────────────────────────

export async function suggestNextActions(
  result: string,
  existingActions: string[]
): Promise<string[]> {
  const system = `You are a strategic action coach. Given a result and existing actions, suggest 3 high-leverage next actions that are:
  - Specific and immediately actionable
  - Different from existing actions
  - Ordered by impact

  Return a JSON array of strings: ["action 1", "action 2", "action 3"]`

  const text = await chat(
    [
      {
        role: 'user',
        content: `Result: "${result}"\n\nExisting actions:\n${existingActions.map((a) => `- ${a}`).join('\n')}`,
      },
    ],
    system
  )

  const match = text.match(/\[[\s\S]*\]/)
  if (!match) return []
  return JSON.parse(match[0])
}

// ── Blocker Analysis ─────────────────────────────────────────────────────────

export async function analyzeBlocker(result: string, blocker: string): Promise<string> {
  const system = `You are a high-performance coach. Analyse a blocker and provide:
  1. The root cause (usually a belief, resource, or skill gap)
  2. The reframe (how to see this differently)
  3. The immediate next step to break through

  Be direct, insightful, and action-oriented. Keep response under 150 words.`

  return await chat(
    [{ role: 'user', content: `Result: "${result}"\n\nBlocker: "${blocker}"` }],
    system
  )
}

// ── API Key Check ─────────────────────────────────────────────────────────────

export async function checkApiKey(): Promise<boolean> {
  const res = await fetch('/api/key')
  const data = await res.json()
  return data.hasKey
}

export async function saveApiKey(key: string): Promise<void> {
  const res = await fetch('/api/key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to save key')
  }
}

export async function deleteApiKey(): Promise<void> {
  await fetch('/api/key', { method: 'DELETE' })
}

export type { LifeArea }
