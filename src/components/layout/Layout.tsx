import React, { useState, createContext, useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, Target } from 'lucide-react'
import { Sidebar } from './Sidebar'

interface SidebarContextValue {
  collapsed: boolean
  mobileOpen: boolean
  toggleCollapsed: () => void
  openMobile: () => void
  closeMobile: () => void
}

export const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  mobileOpen: false,
  toggleCollapsed: () => {},
  openMobile: () => {},
  closeMobile: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        mobileOpen,
        toggleCollapsed: () => setCollapsed((c) => !c),
        openMobile: () => setMobileOpen(true),
        closeMobile: () => setMobileOpen(false),
      }}
    >
      <div className="flex h-screen bg-[var(--bg-base)] overflow-hidden">
        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={() => setMobileOpen(false)}
          />
        )}

        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Mobile top bar */}
          <header
            className="md:hidden flex items-center justify-between shrink-0 px-4"
            style={{
              height: 52,
              background: '#1A1C1E',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-[var(--radius-sm)] transition-all"
              style={{ color: 'rgba(240,240,238,0.7)' }}
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded flex items-center justify-center"
                style={{ background: '#2B4C7E' }}
              >
                <Target size={11} color="#fff" />
              </div>
              <span className="text-sm font-semibold" style={{ color: '#F0F0EE' }}>
                RPM Life OS
              </span>
            </div>

            {/* Spacer to balance the hamburger */}
            <div style={{ width: 34 }} />
          </header>

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
