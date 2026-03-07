import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
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
      <Routes>
        <Route path="/" element={<Layout />}>
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
      </Routes>
    </BrowserRouter>
  )
}
