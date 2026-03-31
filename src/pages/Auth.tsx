import React, { useState } from 'react'
import { Target, Mail, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function Auth() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registered, setRegistered] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
        setRegistered(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-12 h-12 flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #C9963D 0%, #E8B860 100%)',
              borderRadius: 12,
              boxShadow: '0 0 28px rgba(201,150,61,0.35), 0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            <Target size={22} color="#0A0B0E" strokeWidth={2.5} />
          </div>
          <h1
            className="text-2xl font-semibold tracking-wide"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
            }}
          >
            RPM Life OS
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-[var(--radius-lg)] p-6"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          }}
        >
          {registered ? (
            <div className="text-center py-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: 'var(--green-dim)', border: '1px solid rgba(61,184,122,0.25)' }}
              >
                <span style={{ color: 'var(--green)', fontSize: 18 }}>✓</span>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Account created!
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Check your email to confirm your account, then sign in.
              </p>
              <button
                onClick={() => { setMode('login'); setRegistered(false) }}
                className="mt-4 text-xs font-medium"
                style={{ color: 'var(--accent)' }}
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[11px] font-semibold tracking-wide uppercase"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full h-9 rounded-[var(--radius)] pl-9 pr-3 text-sm transition-all"
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-accent)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[11px] font-semibold tracking-wide uppercase"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
                    required
                    minLength={mode === 'register' ? 6 : undefined}
                    className="w-full h-9 rounded-[var(--radius)] pl-9 pr-3 text-sm transition-all"
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-accent)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                    }}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <p
                  className="text-xs rounded-[var(--radius-sm)] px-3 py-2"
                  style={{
                    color: 'var(--red)',
                    background: 'var(--red-dim)',
                    border: '1px solid rgba(224,92,74,0.18)',
                  }}
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="h-10 rounded-[var(--radius)] text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #C9963D 0%, #D4A84E 50%, #C9963D 100%)',
                  backgroundSize: '200% auto',
                  color: '#0A0B0E',
                  boxShadow: '0 1px 8px rgba(201,150,61,0.3)',
                }}
              >
                {loading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : mode === 'login' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Toggle mode */}
        {!registered && (
          <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
              className="font-medium"
              style={{ color: 'var(--accent)' }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
