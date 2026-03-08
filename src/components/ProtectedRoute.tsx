import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Target } from 'lucide-react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: '#1A1C1E' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center"
            style={{ background: '#2B4C7E' }}
          >
            <Target size={18} color="#fff" />
          </div>
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
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return null

  // Admin check — profile.plan === 'admin' is stored in user_metadata
  // Set via Supabase dashboard: UPDATE profiles SET plan='admin' WHERE id='...'
  const isAdmin =
    user?.app_metadata?.plan === 'admin' ||
    user?.user_metadata?.plan === 'admin'

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
