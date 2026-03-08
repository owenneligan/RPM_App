import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Target,
  Compass,
  Sun,
  CheckSquare,
  BarChart3,
  BookOpen,
  Zap,
  Settings,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  LogOut,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useStore } from '../../store'
import { useSidebar } from './Layout'
import { useAuth } from '../../contexts/AuthContext'

const NAV_ITEMS = [
  {
    section: 'Command',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { to: '/focus', label: 'Daily Focus', icon: Sun },
    ],
  },
  {
    section: 'RPM System',
    items: [
      { to: '/rpm', label: 'RPM Planner', icon: Target },
      { to: '/outcomes', label: 'Outcome Engine', icon: Compass },
      { to: '/actions', label: 'Action Planner', icon: CheckSquare },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { to: '/assessment', label: 'Assessment', icon: BarChart3 },
      { to: '/reviews', label: 'Reviews', icon: BookOpen },
      { to: '/braindump', label: 'Brain Dump → RPM', icon: Zap },
    ],
  },
]

export function Sidebar() {
  const rpmBlocks = useStore((s) => s.rpmBlocks)
  const activeCount = rpmBlocks.filter((b) => b.status === 'active').length
  const { collapsed, mobileOpen, toggleCollapsed, closeMobile } = useSidebar()
  const { user, signOut } = useAuth()

  // Derive display name: use email prefix or full name from metadata
  const displayEmail = user?.email ?? ''
  const initials = displayEmail
    ? displayEmail.slice(0, 2).toUpperCase()
    : '?'

  const sidebarContent = (isMobile: boolean) => (
    <div className="flex flex-col h-full">
      {/* Brand + toggle */}
      <div
        className="shrink-0 flex items-center justify-between px-3 pt-4 pb-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 shrink-0 rounded-[6px] flex items-center justify-center"
              style={{ background: '#2B4C7E' }}
            >
              <Target size={13} color="#ffffff" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold tracking-tight block truncate" style={{ color: '#F0F0EE' }}>
                RPM Life OS
              </span>
              <p className="text-[10px] truncate" style={{ color: 'rgba(240,240,238,0.35)' }}>
                Personal Performance System
              </p>
            </div>
          </div>
        )}

        {collapsed && !isMobile && (
          <div
            className="w-7 h-7 shrink-0 rounded-[6px] flex items-center justify-center mx-auto"
            style={{ background: '#2B4C7E' }}
          >
            <Target size={13} color="#ffffff" />
          </div>
        )}

        {isMobile ? (
          <button
            onClick={closeMobile}
            className="ml-2 shrink-0 p-1.5 rounded-[5px] transition-all"
            style={{ color: 'rgba(240,240,238,0.5)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            <X size={15} />
          </button>
        ) : (
          <button
            onClick={toggleCollapsed}
            className="shrink-0 p-1.5 rounded-[5px] transition-all"
            style={{ color: 'rgba(240,240,238,0.4)' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        )}
      </div>

      {/* Active blocks indicator */}
      {activeCount > 0 && (!collapsed || isMobile) && (
        <div
          className="mx-3 mt-3 px-3 py-2 rounded-[6px]"
          style={{
            background: 'rgba(43,76,126,0.2)',
            border: '1px solid rgba(43,76,126,0.35)',
          }}
        >
          <p className="text-xs font-medium" style={{ color: '#5B82BE' }}>
            {activeCount} active RPM block{activeCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {collapsed && !isMobile && activeCount > 0 && (
        <div
          className="mx-auto mt-3 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: 'rgba(43,76,126,0.35)', color: '#5B82BE' }}
          title={`${activeCount} active RPM block${activeCount !== 1 ? 's' : ''}`}
        >
          {activeCount}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {NAV_ITEMS.map((section) => (
          <div key={section.section} className="mb-4">
            {(!collapsed || isMobile) && (
              <p
                className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'rgba(240,240,238,0.3)' }}
              >
                {section.section}
              </p>
            )}
            {collapsed && !isMobile && (
              <div className="mb-1.5 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.exact}
                    onClick={isMobile ? closeMobile : undefined}
                    className="flex items-center gap-2.5 rounded-[6px] text-sm transition-all duration-150"
                    style={({ isActive }) => ({
                      background: isActive ? 'rgba(43,76,126,0.22)' : 'transparent',
                      color: isActive ? '#7AAAE0' : 'rgba(240,240,238,0.6)',
                      padding: collapsed && !isMobile ? '7px' : '7px 10px',
                      justifyContent: collapsed && !isMobile ? 'center' : undefined,
                    })}
                    title={collapsed && !isMobile ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          size={14}
                          style={{
                            color: isActive ? '#7AAAE0' : 'rgba(240,240,238,0.35)',
                            flexShrink: 0,
                          }}
                        />
                        {(!collapsed || isMobile) && (
                          <>
                            <span className="flex-1 leading-none text-[13px]">{item.label}</span>
                            {isActive && (
                              <ChevronRight size={11} style={{ color: 'rgba(122,170,224,0.5)' }} />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} className="p-2 flex flex-col gap-1">
        <NavLink
          to="/settings"
          onClick={isMobile ? closeMobile : undefined}
          className="flex items-center gap-2.5 rounded-[6px] text-sm transition-all duration-150"
          style={({ isActive }) => ({
            background: isActive ? 'rgba(43,76,126,0.22)' : 'transparent',
            color: isActive ? '#7AAAE0' : 'rgba(240,240,238,0.55)',
            padding: collapsed && !isMobile ? '7px' : '7px 10px',
            justifyContent: collapsed && !isMobile ? 'center' : undefined,
          })}
          title={collapsed && !isMobile ? 'Settings' : undefined}
        >
          <Settings size={14} style={{ color: 'rgba(240,240,238,0.35)', flexShrink: 0 }} />
          {(!collapsed || isMobile) && <span className="text-[13px]">Settings</span>}
        </NavLink>

        {/* User row */}
        <div
          className="flex items-center rounded-[6px] mt-1"
          style={{ padding: collapsed && !isMobile ? '6px 0' : '6px 8px', justifyContent: collapsed && !isMobile ? 'center' : undefined }}
        >
          {/* Avatar */}
          <div
            className="shrink-0 flex items-center justify-center rounded-full text-[10px] font-bold"
            style={{ width: 24, height: 24, background: 'rgba(43,76,126,0.55)', color: '#7AAAE0' }}
            title={displayEmail}
          >
            {initials}
          </div>

          {(!collapsed || isMobile) && (
            <>
              <span
                className="flex-1 text-[11px] ml-2 truncate"
                style={{ color: 'rgba(240,240,238,0.4)' }}
                title={displayEmail}
              >
                {displayEmail}
              </span>
              <button
                onClick={signOut}
                title="Sign out"
                className="shrink-0 p-1 rounded-[4px] transition-all ml-1"
                style={{ color: 'rgba(240,240,238,0.3)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
                  ;(e.currentTarget as HTMLElement).style.color = 'rgba(240,240,238,0.7)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = 'rgba(240,240,238,0.3)'
                }}
              >
                <LogOut size={13} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col h-screen sticky top-0 shrink-0 overflow-hidden"
        style={{
          width: collapsed ? 52 : 240,
          background: '#1A1C1E',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile sidebar — slide-in overlay */}
      <aside
        className="md:hidden fixed inset-y-0 left-0 z-50 flex flex-col"
        style={{
          width: 260,
          background: '#1A1C1E',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 240ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {sidebarContent(true)}
      </aside>
    </>
  )
}
