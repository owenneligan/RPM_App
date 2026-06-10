# Mainspring Advisory — Landing Site

Next.js 14 lead-magnet site for Mainspring Advisory. Single-page conversion funnel with a Supabase lead-capture backend and Tally diagnostic handoff.

## Stack

- **Next.js 14** (App Router, TypeScript strict)
- **Tailwind CSS** — custom design tokens only, no UI libraries
- **Supabase** (PostgreSQL) — server-side route handler only
- **Vercel Analytics** — cookieless, no consent banner required
- **Fonts** — Cormorant Garamond (display) + Jost (body) via `next/font/google`

## Setup

### 1. Install dependencies

```bash
cd landing
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key — never expose to client |
| `NEXT_PUBLIC_TALLY_URL` | Full Tally form URL (e.g. `https://tally.so/r/abc123`) |
| `NEXT_PUBLIC_SITE_URL` | Production domain (e.g. `https://mainspringadvisory.co.uk`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email shown in form error states |
| `CONTACT_EMAIL` | Contact email shown in footer/privacy page |

### 3. Set up Supabase

Run `supabase/schema.sql` against your Supabase project via the SQL editor or CLI:

```bash
psql "$SUPABASE_DB_URL" -f supabase/schema.sql
```

Or paste into Supabase Dashboard → SQL Editor.

### 4. Wire up Tally

Set `NEXT_PUBLIC_TALLY_URL` to your Tally form URL. The form appends `?email={email}&name={first_name}` as Tally hidden-field params. In your Tally form settings, configure those as hidden fields mapped to `email` and `name`.

### 5. Run locally

```bash
npm run dev
```

### 6. Build

```bash
npm run build
```

## Deployment

The site deploys to Vercel with zero config — just connect the repo and set the environment variables in the Vercel dashboard.

**Important:** set all env vars in Vercel, including `SUPABASE_SERVICE_ROLE_KEY` as a non-public env var (not prefixed with `NEXT_PUBLIC_`).

## Form behaviour

Three form variants — `hero`, `diagnostic`, `cta` — all POST to `/api/leads`. The API:

1. Checks IP rate limit (5 req/min in-memory)
2. Checks honeypot field `website`
3. Validates with Zod
4. Inserts to Supabase `leads` table
5. Returns `200 {ok:true}` / `409 {error:'duplicate'}` / `400 {error:'validation'}` / `500 {error:'server'}`

On success, the form replaces itself with a **"You're in."** state and a button opening the Tally diagnostic in a new tab with pre-filled email and name params.

## Design system

Colour tokens in `tailwind.config.ts`:

| Token | Hex | Usage |
|---|---|---|
| `ink` | `#16181A` | Primary dark field |
| `ink-2` | `#1F2225` | Raised dark surface |
| `brass` | `#B9893E` | Mark, accents, CTAs |
| `brass-hi` | `#D4A958` | Hover states |
| `parchment` | `#EFE7D8` | Light sections |
| `steel` | `#8D9296` | Muted text on dark |
| `ink-text` | `#2A2C2E` | Body text on parchment |
