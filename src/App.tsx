import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useDataLoader } from './hooks/useDataLoader'
import { useStore } from './store'
import { Layout } from './components/layout/Layout'
import { MigrationPrompt } from './components/MigrationPrompt'
import { Auth } from './pages/Auth'
import { Dashboard } from './pages/Dashboard'
import { RPMPlanner } from './pages/RPMPlanner'
import { OutcomeEngine } from './pages/OutcomeEngine'
import { DailyFocus } from './pages/DailyFocus'
import { ActionPlanner } from './pages/ActionPlanner'
import { Assessment } from './pages/Assessment'
import { Reviews } from './pages/Reviews'
import { BrainDump } from './pages/BrainDump'
import { Settings } from './pages/Settings'

function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-3"
      style={{ background: 'var(--bg-base)' }}
    >
      <Loader2
        size={22}
        className="animate-spin"
        style={{ color: 'var(--accent)' }}
      />
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        Loading your data…
      </p>
    </div>
  )
}

function AppRoutes() {
  const { user, loading: authLoading } = useAuth()
  const isLoading = useStore((s) => s.isLoading)
  const loadAllData = useStore((s) => s.loadAllData)

  // Load data when user logs in; hook also handles logout cleanup
  useDataLoader()

  // Migration prompt: shown once if localStorage data is found after login+data-load
  const [showMigration, setShowMigration] = useState(false)

  useEffect(() => {
    if (user && !isLoading) {
      const stored = localStorage.getItem('rpm-life-os-v1')
      if (stored) setShowMigration(true)
    }
  }, [user?.id, isLoading])

  // Show loading screen while auth is being resolved or initial data is fetching
  if (authLoading || (user && isLoading)) {
    return <LoadingScreen />
  }

  return (
    <>
      {showMigration && user && (
        <MigrationPrompt
          onDone={() => {
            setShowMigration(false)
            loadAllData(user.id)
          }}
        />
      )}

      <Routes>
        {/* Auth page — redirect to home if already logged in */}
        <Route
          path="/auth"
          element={user ? <Navigate to="/" replace /> : <Auth />}
        />

        {/* Protected app routes */}
        <Route
          path="/"
          element={user ? <Layout /> : <Navigate to="/auth" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="rpm" element={<RPMPlanner />} />
          <Route path="outcomes" element={<OutcomeEngine />} />
          <Route path="focus" element={<DailyFocus />} />
          <Route path="actions" element={<ActionPlanner />} />
          <Route path="assessment" element={<Assessment />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="braindump" element={<BrainDump />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
