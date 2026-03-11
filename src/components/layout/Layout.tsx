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
              background: 'var(--bg-nav)',
              borderBottom: '1px solid rgba(201, 150, 61, 0.12)',
            }}
          >
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-[var(--radius-sm)] transition-all"
              style={{ color: 'rgba(237,232,224,0.6)' }}
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #C9963D 0%, #E8B860 100%)',
                  borderRadius: '5px',
                  boxShadow: '0 0 8px rgba(201,150,61,0.35)',
                }}
              >
                <Target size={11} color="#0A0B0E" strokeWidth={2.5} />
              </div>
              <span
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: '#EDE8E0' }}
              >
                RPM Life OS
              </span>
            </div>

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
