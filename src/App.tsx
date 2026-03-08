import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { AuthCallback } from './pages/AuthCallback'
import { Dashboard } from './pages/Dashboard'
import { RPMPlanner } from './pages/RPMPlanner'
import { OutcomeEngine } from './pages/OutcomeEngine'
import { DailyFocus } from './pages/DailyFocus'
import { ActionPlanner } from './pages/ActionPlanner'
import { Assessment } from './pages/Assessment'
import { Reviews } from './pages/Reviews'
import { BrainDump } from './pages/BrainDump'
import { Settings } from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public auth routes ───────────────────────── */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* ── Protected app routes ─────────────────────── */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
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

          {/* ── Catch-all ────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
