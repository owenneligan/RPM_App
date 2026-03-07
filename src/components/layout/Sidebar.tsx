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
  X,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useStore } from '../../store'

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

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const rpmBlocks = useStore((s) => s.rpmBlocks)
  const activeCount = rpmBlocks.filter((b) => b.status === 'active').length

  return (
    <aside
      className="w-60 shrink-0 h-screen flex flex-col"
      style={{
        background: '#1A1C1E',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-[6px] flex items-center justify-center"
              style={{ background: '#2B4C7E' }}
            >
              <Target size={13} color="#ffffff" />
            </div>
            <span className="text-sm font-semibold tracking-tight" style={{ color: '#F0F0EE' }}>
              RPM Life OS
            </span>
          </div>
          {/* Close button — mobile only */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded text-[rgba(240,240,238,0.4)] hover:text-[rgba(240,240,238,0.8)] transition-colors"
              aria-label="Close navigation"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <p className="text-[10px] pl-9" style={{ color: 'rgba(240,240,238,0.35)' }}>
          Personal Performance System
        </p>
      </div>

      {/* Active blocks indicator */}
      {activeCount > 0 && (
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((section) => (
          <div key={section.section} className="mb-5">
            <p
              className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: 'rgba(240,240,238,0.3)' }}
            >
              {section.section}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.exact}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 px-2.5 py-2 rounded-[6px] text-sm transition-all duration-150 group'
                      )
                    }
                    style={({ isActive }) => ({
                      background: isActive ? 'rgba(43,76,126,0.22)' : 'transparent',
                      color: isActive ? '#7AAAE0' : 'rgba(240,240,238,0.6)',
                    })}
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
                        <span className="flex-1 leading-none text-[13px]">{item.label}</span>
                        {isActive && (
                          <ChevronRight size={11} style={{ color: 'rgba(122,170,224,0.5)' }} />
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
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} className="p-3">
        <NavLink
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-[6px] text-sm transition-all duration-150"
          style={({ isActive }) => ({
            background: isActive ? 'rgba(43,76,126,0.22)' : 'transparent',
            color: isActive ? '#7AAAE0' : 'rgba(240,240,238,0.55)',
          })}
        >
          <Settings size={14} style={{ color: 'rgba(240,240,238,0.35)', flexShrink: 0 }} />
          <span className="text-[13px]">Settings</span>
        </NavLink>
        <p className="px-2.5 mt-2 text-[10px]" style={{ color: 'rgba(240,240,238,0.25)' }}>
          Local-first · Your data stays yours
        </p>
      </div>
    </aside>
  )
}
