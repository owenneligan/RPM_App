import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Target, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

// Password strength: returns 0–4
function passwordStrength(pw: string): number {
  let score = 0
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const STRENGTH_LABELS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = ['#B35C44', '#B35C44', '#B8893A', '#3F7D6A', '#3F7D6A']

export function Signup() {
  const { signUpWithEmail, signInWithGoogle, signInWithApple } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verificationSent, setVerificationSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null)

  const strength = password.length > 0 ? passwordStrength(password) : -1

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 12) {
      setError('Password must be at least 12 characters.')
      return
    }

    setLoading(true)
    const { error, needsVerification } = await signUpWithEmail(email.trim(), password)

    if (error) {
      setError(
        error.includes('already registered')
          ? 'An account with this email already exists. Try signing in.'
          : error
      )
      setLoading(false)
    } else if (needsVerification) {
      setVerificationSent(true)
      setLoading(false)
    }
    // If no verification needed, onAuthStateChange fires and ProtectedRoute handles redirect
  }

  async function handleGoogle() {
    setOauthLoading('google')
    await signInWithGoogle()
  }

  async function handleApple() {
    setOauthLoading('apple')
    await signInWithApple()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 44,
    padding: '0 12px 0 40px',
    background: '#F7F7F5',
    border: '1px solid #E3E4E6',
    borderRadius: 8,
    fontSize: 14,
    color: '#111111',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 140ms',
  }

  if (verificationSent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: '#1A1C1E' }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: '#FFFFFF', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(63,125,106,0.1)' }}
            >
              <CheckCircle size={24} style={{ color: '#3F7D6A' }} />
            </div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: '#111111' }}>
              Check your email
            </h2>
            <p className="text-sm mb-6" style={{ color: '#6B6E73' }}>
              We sent a confirmation link to <strong style={{ color: '#111111' }}>{email}</strong>.
              Click it to activate your account.
            </p>
            <Link
              to="/login"
              className="inline-block h-10 px-6 rounded-[8px] text-sm font-medium leading-10 transition-all"
              style={{ background: '#2B4C7E', color: '#FFFFFF', textDecoration: 'none' }}
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#1A1C1E' }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-4"
            style={{ background: '#2B4C7E', boxShadow: '0 4px 20px rgba(43,76,126,0.35)' }}
          >
            <Target size={22} color="#fff" />
          </div>
          <h1 className="text-xl font-semibold" style={{ color: '#F0F0EE' }}>
            RPM Life OS
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(240,240,238,0.45)' }}>
            Create your account
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7"
          style={{ background: '#FFFFFF', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}
        >
          {/* SSO buttons */}
          <div className="flex flex-col gap-2.5 mb-6">
            <button
              onClick={handleGoogle}
              disabled={oauthLoading !== null || loading}
              className="flex items-center justify-center gap-3 h-11 rounded-[8px] text-sm font-medium transition-all"
              style={{
                border: '1px solid #E3E4E6',
                background: '#FFFFFF',
                color: '#111111',
                cursor: oauthLoading !== null ? 'wait' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!oauthLoading) (e.currentTarget as HTMLElement).style.background = '#F7F7F5'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#FFFFFF'
              }}
            >
              {oauthLoading === 'google' ? (
                <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-gray-600" style={{ animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              ) : <GoogleIcon />}
              Continue with Google
            </button>

            <button
              onClick={handleApple}
              disabled={oauthLoading !== null || loading}
              className="flex items-center justify-center gap-3 h-11 rounded-[8px] text-sm font-medium transition-all"
              style={{
                background: '#111111',
                color: '#FFFFFF',
                cursor: oauthLoading !== null ? 'wait' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!oauthLoading) (e.currentTarget as HTMLElement).style.background = '#222222'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#111111'
              }}
            >
              {oauthLoading === 'apple' ? (
                <span className="w-4 h-4 rounded-full border-2 border-gray-600 border-t-gray-200" style={{ animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              ) : <AppleIcon />}
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: '#E3E4E6' }} />
            <span className="text-xs" style={{ color: '#9EA3A8' }}>or email</span>
            <div className="flex-1 h-px" style={{ background: '#E3E4E6' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="flex flex-col gap-3">
            {/* Email */}
            <div className="relative">
              <Mail
                size={15}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9EA3A8', pointerEvents: 'none' }}
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#2B4C7E' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#E3E4E6' }}
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock
                  size={15}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9EA3A8', pointerEvents: 'none' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (12+ characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  style={{ ...inputStyle, paddingRight: 40 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#2B4C7E' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E3E4E6' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9EA3A8', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Strength meter */}
              {strength >= 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          background: i <= strength
                            ? STRENGTH_COLORS[strength + 1] ?? '#3F7D6A'
                            : '#E3E4E6',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: STRENGTH_COLORS[strength + 1] ?? '#9EA3A8' }}>
                    {STRENGTH_LABELS[strength + 1] ?? 'Strong'}
                  </p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2 px-3 py-2.5 rounded-[7px] text-sm"
                style={{ background: 'rgba(179,92,68,0.08)', color: '#B35C44', border: '1px solid rgba(179,92,68,0.2)' }}
              >
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || oauthLoading !== null}
              className="h-11 rounded-[8px] text-sm font-semibold mt-1 transition-all"
              style={{
                background: loading ? '#1F3A6B' : '#2B4C7E',
                color: '#FFFFFF',
                cursor: loading ? 'wait' : 'pointer',
                border: 'none',
              }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#1F3A6B' }}
              onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#2B4C7E' }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-xs mt-4 text-center" style={{ color: '#9EA3A8' }}>
            By creating an account you agree to our terms of service and privacy policy.
          </p>
        </div>

        {/* Footer links */}
        <div className="flex justify-center gap-4 mt-6 text-sm" style={{ color: 'rgba(240,240,238,0.4)' }}>
          <span>Already have an account?</span>
          <Link
            to="/login"
            style={{ color: '#5B82BE' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#7AAAE0' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#5B82BE' }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
