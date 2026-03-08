import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Target } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

/**
 * Landing page for OAuth redirects (Google, Apple).
 * Supabase automatically exchanges the auth code in the URL for a session
 * via detectSessionInUrl:true. We just wait for the session, then navigate home.
 */
export function AuthCallback() {
  const navigate = useNavigate()
  const { session, loading } = useAuth()

  useEffect(() => {
    if (!loading && session) {
      navigate('/', { replace: true })
    }
    // If still loading, wait. If no session after load, redirect to login.
    if (!loading && !session) {
      navigate('/login', { replace: true })
    }
  }, [session, loading, navigate])

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#1A1C1E' }}
    >
      <div className="flex flex-col items-center gap-5">
        <div
          className="w-12 h-12 rounded-[12px] flex items-center justify-center"
          style={{ background: '#2B4C7E', boxShadow: '0 4px 20px rgba(43,76,126,0.35)' }}
        >
          <Target size={22} color="#fff" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium" style={{ color: 'rgba(240,240,238,0.7)' }}>
            Signing you in…
          </p>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: 'rgba(91,130,190,0.7)',
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
