import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

export function Login() {
  const navigate = useNavigate()
  const { signInWithEmail, signInWithGoogle, signInWithApple } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null)

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signInWithEmail(email.trim(), password)
    if (error) {
      setError(error.includes('Invalid login credentials') ? 'Incorrect email or password.' : error)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  async function handleGoogle() {
    setOauthLoading('google')
    await signInWithGoogle()
  }

  async function handleApple() {
    setOauthLoading('apple')
    await signInWithApple()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'var(--bg-base)',
        backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,150,61,0.08) 0%, transparent 70%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: 'linear-gradient(135deg, #C9963D 0%, #E8B860 50%, #C9963D 100%)',
              boxShadow: '0 0 40px rgba(201,150,61,0.35), 0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            {/* Concentric circles icon */}
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="11" stroke="#0A0B0E" strokeWidth="1.5" strokeOpacity="0.6" />
              <circle cx="13" cy="13" r="7" stroke="#0A0B0E" strokeWidth="1.5" strokeOpacity="0.6" />
              <circle cx="13" cy="13" r="3" fill="#0A0B0E" fillOpacity="0.7" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
            RPM Life OS
          </h1>
          <p className="text-xs mt-2 tracking-[0.12em] uppercase" style={{ color: 'var(--text-muted)' }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(201,150,61,0.12)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        >
          {/* OAuth buttons */}
          <div className="flex flex-col gap-2.5 mb-6">
            <OAuthButton
              onClick={handleGoogle}
              disabled={oauthLoading !== null || loading}
              loading={oauthLoading === 'google'}
              icon={<GoogleIcon />}
              label="Continue with Google"
            />
            <OAuthButton
              onClick={handleApple}
              disabled={oauthLoading !== null || loading}
              loading={oauthLoading === 'apple'}
              icon={<AppleIcon />}
              label="Continue with Apple"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-[11px] tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>or email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Email/password form */}
          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3">
            <DarkInput
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={14} />}
              autoComplete="email"
              required
            />
            <DarkInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={14} />}
              autoComplete="current-password"
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />

            {error && (
              <div
                className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs"
                style={{ background: 'rgba(224,92,74,0.08)', color: '#E05C4A', border: '1px solid rgba(224,92,74,0.18)' }}
              >
                <AlertCircle size={13} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || oauthLoading !== null}
              className="h-11 rounded-[10px] text-sm font-semibold mt-1 transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #C9963D 0%, #D4A84E 50%, #C9963D 100%)',
                backgroundSize: '200% auto',
                color: '#0A0B0E',
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: '0 2px 12px rgba(201,150,61,0.30)',
                letterSpacing: '0.02em',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-1.5 mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          <span>No account?</span>
          <Link
            to="/signup"
            className="transition-colors"
            style={{ color: 'var(--gold-light)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#F0C46A' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gold-light)' }}
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ── helpers ────────────────────────────────────────────── */

function OAuthButton({
  onClick, disabled, loading, icon, label,
}: {
  onClick: () => void
  disabled: boolean
  loading: boolean
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2.5 h-11 rounded-[10px] text-sm font-medium transition-all disabled:opacity-50"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
        color: 'var(--text-primary)',
        cursor: disabled ? 'wait' : 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
      }}
    >
      {loading ? (
        <span
          className="w-3.5 h-3.5 rounded-full border-2"
          style={{
            borderColor: 'rgba(255,255,255,0.2)',
            borderTopColor: 'var(--text-secondary)',
            animation: 'spin 0.7s linear infinite',
            display: 'inline-block',
          }}
        />
      ) : icon}
      {label}
    </button>
  )
}

function DarkInput({
  icon, rightElement, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode
  rightElement?: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div
      className="relative"
      style={{
        border: `1px solid ${focused ? 'rgba(201,150,61,0.45)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 10,
        transition: 'border-color 150ms',
        boxShadow: focused ? '0 0 0 3px rgba(201,150,61,0.08)' : 'none',
      }}
    >
      <span
        className="absolute flex items-center"
        style={{ left: 13, top: '50%', transform: 'translateY(-50%)', color: focused ? 'var(--gold)' : 'var(--text-muted)', transition: 'color 150ms', pointerEvents: 'none' }}
      >
        {icon}
      </span>
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
        style={{
          width: '100%',
          height: 44,
          padding: rightElement ? '0 40px 0 38px' : '0 14px 0 38px',
          background: 'rgba(255,255,255,0.03)',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          color: 'var(--text-primary)',
          outline: 'none',
          fontFamily: 'inherit',
        }}
        className="placeholder:text-[var(--text-muted)]"
      />
      {rightElement && (
        <span className="absolute flex items-center" style={{ right: 13, top: '50%', transform: 'translateY(-50%)' }}>
          {rightElement}
        </span>
      )}
    </div>
  )
}
