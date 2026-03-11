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
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useStore } from '../../store'
import { useSidebar } from './Layout'

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

  const sidebarContent = (isMobile: boolean) => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div
        className="shrink-0 flex items-center justify-between px-3 pt-5 pb-4"
        style={{ borderBottom: '1px solid rgba(201, 150, 61, 0.12)' }}
      >
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Gold logo mark */}
            <div
              className="w-7 h-7 shrink-0 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #C9963D 0%, #E8B860 100%)',
                borderRadius: '7px',
                boxShadow: '0 0 14px rgba(201, 150, 61, 0.35)',
              }}
            >
              <Target size={13} color="#0A0B0E" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <span
                className="text-sm font-semibold tracking-[0.06em] block truncate uppercase"
                style={{ color: '#EDE8E0', letterSpacing: '0.07em', fontSize: '11px' }}
              >
                RPM Life OS
              </span>
              <p className="text-[9px] truncate tracking-widest uppercase" style={{ color: 'rgba(201, 150, 61, 0.55)' }}>
                Performance System
              </p>
            </div>
          </div>
        )}

        {collapsed && !isMobile && (
          <div
            className="w-7 h-7 shrink-0 flex items-center justify-center mx-auto"
            style={{
              background: 'linear-gradient(135deg, #C9963D 0%, #E8B860 100%)',
              borderRadius: '7px',
              boxShadow: '0 0 12px rgba(201, 150, 61, 0.30)',
            }}
          >
            <Target size={13} color="#0A0B0E" strokeWidth={2.5} />
          </div>
        )}

        {isMobile ? (
          <button
            onClick={closeMobile}
            className="ml-2 shrink-0 p-1.5 rounded-[4px] transition-all"
            style={{ color: 'rgba(237,232,224,0.4)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            <X size={15} />
          </button>
        ) : (
          <button
            onClick={toggleCollapsed}
            className="shrink-0 p-1.5 rounded-[4px] transition-all"
            style={{ color: 'rgba(237,232,224,0.3)' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)')}
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
            background: 'rgba(201, 150, 61, 0.08)',
            border: '1px solid rgba(201, 150, 61, 0.20)',
          }}
        >
          <p className="text-[11px] font-medium" style={{ color: 'rgba(201, 150, 61, 0.85)' }}>
            {activeCount} active RPM block{activeCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {collapsed && !isMobile && activeCount > 0 && (
        <div
          className="mx-auto mt-3 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
          style={{
            background: 'rgba(201, 150, 61, 0.15)',
            color: '#C9963D',
            border: '1px solid rgba(201, 150, 61, 0.30)',
          }}
          title={`${activeCount} active RPM block${activeCount !== 1 ? 's' : ''}`}
        >
          {activeCount}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {NAV_ITEMS.map((section, sectionIdx) => (
          <div key={section.section} className={sectionIdx > 0 ? 'mt-5' : ''}>
            {(!collapsed || isMobile) && (
              <div className="flex items-center gap-2 px-2 mb-2">
                <p
                  className="text-[9px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: 'rgba(237, 232, 224, 0.25)' }}
                >
                  {section.section}
                </p>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
              </div>
            )}
            {collapsed && !isMobile && sectionIdx > 0 && (
              <div className="mb-3 mx-2 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.exact}
                    onClick={isMobile ? closeMobile : undefined}
                    className="relative flex items-center gap-2.5 rounded-[6px] text-sm transition-all duration-150"
                    style={({ isActive }) => ({
                      background: isActive ? 'rgba(201, 150, 61, 0.09)' : 'transparent',
                      color: isActive ? '#E8B860' : 'rgba(237, 232, 224, 0.50)',
                      padding: collapsed && !isMobile ? '7px' : '7px 10px',
                      justifyContent: collapsed && !isMobile ? 'center' : undefined,
                      borderLeft: isActive && !collapsed ? '2px solid rgba(201,150,61,0.70)' : '2px solid transparent',
                    })}
                    title={collapsed && !isMobile ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          size={14}
                          style={{
                            color: isActive ? '#C9963D' : 'rgba(237, 232, 224, 0.30)',
                            flexShrink: 0,
                          }}
                        />
                        {(!collapsed || isMobile) && (
                          <>
                            <span className="flex-1 leading-none text-[12.5px] tracking-[0.01em]">{item.label}</span>
                            {isActive && (
                              <ChevronRight size={10} style={{ color: 'rgba(201,150,61,0.45)' }} />
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
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} className="p-2 flex flex-col gap-0.5">
        <NavLink
          to="/settings"
          onClick={isMobile ? closeMobile : undefined}
          className="relative flex items-center gap-2.5 rounded-[6px] transition-all duration-150"
          style={({ isActive }) => ({
            background: isActive ? 'rgba(201, 150, 61, 0.09)' : 'transparent',
            color: isActive ? '#E8B860' : 'rgba(237, 232, 224, 0.45)',
            padding: collapsed && !isMobile ? '7px' : '7px 10px',
            justifyContent: collapsed && !isMobile ? 'center' : undefined,
            borderLeft: isActive && !collapsed ? '2px solid rgba(201,150,61,0.70)' : '2px solid transparent',
          })}
          title={collapsed && !isMobile ? 'Settings' : undefined}
        >
          <Settings size={14} style={{ color: 'rgba(237, 232, 224, 0.28)', flexShrink: 0 }} />
          {(!collapsed || isMobile) && <span className="text-[12.5px]">Settings</span>}
        </NavLink>

      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col h-screen sticky top-0 shrink-0 overflow-hidden"
        style={{
          width: collapsed ? 52 : 238,
          background: 'var(--bg-nav)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile sidebar — slide-in overlay */}
      <aside
        className="md:hidden fixed inset-y-0 left-0 z-50 flex flex-col"
        style={{
          width: 258,
          background: 'var(--bg-nav)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 240ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {sidebarContent(true)}
      </aside>
    </>
  )
}
