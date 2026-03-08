import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONFIG_PATH = path.join(__dirname, '.rpm-config.json')

const app = express()
app.use(cors())
app.use(express.json())

// ── Supabase admin client (server-side only, uses service role key) ──────────
// The service role key bypasses RLS — keep it strictly server-side.
const supabaseAdmin = (() => {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.warn('  ⚠  SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — AI endpoint will be unauthenticated')
    return null
  }
  return createClient(url, key, { auth: { persistSession: false } })
})()

// ── Auth middleware — verifies Supabase JWT ───────────────────────────────────
async function requireAuth(req, res, next) {
  if (!supabaseAdmin) {
    // Dev mode: no Supabase configured — allow through with a warning
    req.user = null
    return next()
  }

  const authHeader = req.headers['authorization']
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' })
  }

  const token = authHeader.slice(7)
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' })
  }

  req.user = user
  next()
}

function getConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
  } catch {
    return {}
  }
}

function saveConfig(data) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2))
}

// Save API key
app.post('/api/key', (req, res) => {
  const { key } = req.body
  if (!key || !key.startsWith('sk-ant-')) {
    return res.status(400).json({ error: 'Invalid API key format' })
  }
  const config = getConfig()
  config.apiKey = key
  saveConfig(config)
  res.json({ success: true })
})

// Check if key exists
app.get('/api/key', (req, res) => {
  const config = getConfig()
  res.json({ hasKey: !!config.apiKey })
})

// Delete API key
app.delete('/api/key', (req, res) => {
  const config = getConfig()
  delete config.apiKey
  saveConfig(config)
  res.json({ success: true })
})

// AI chat endpoint — requires a valid user session
app.post('/api/chat', requireAuth, async (req, res) => {
  const config = getConfig()
  if (!config.apiKey) {
    return res.status(401).json({ error: 'No API key configured. Add your key in Settings.' })
  }

  const { messages, system, model = 'claude-opus-4-6' } = req.body

  try {
    const client = new Anthropic({ apiKey: config.apiKey })
    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      system,
      messages,
    })
    res.json(response)
  } catch (err) {
    console.error('AI error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`\n  RPM Life OS API  →  http://localhost:${PORT}\n`)
})
