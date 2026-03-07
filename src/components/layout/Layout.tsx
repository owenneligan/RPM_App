import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[var(--bg-base)] overflow-hidden md:overflow-hidden">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always visible on md+, drawer on mobile */}
      <div
        className={[
          'fixed inset-y-0 left-0 z-30 transition-transform duration-[250ms]',
          'md:relative md:translate-x-0 md:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Mobile top bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 sticky top-0 z-10 md:hidden"
          style={{
            background: 'var(--bg-base)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--hover-md)] transition-colors"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-[var(--text-primary)]">RPM Life OS</span>
        </div>

        <Outlet />
      </main>
    </div>
  )
}
