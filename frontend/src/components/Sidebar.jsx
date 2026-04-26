import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, CheckSquare, FileText, Lock,
  User, FileOutput, Calculator, DollarSign, Briefcase
} from 'lucide-react'

const links = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard',     color: '#6366f1' },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tasks',         color: '#10b981' },
  { to: '/notes',     icon: FileText,        label: 'Notes',         color: '#3b82f6' },
  { to: '/vault',     icon: Lock,            label: 'Vault',         color: '#facc15' },
  { to: '/profile',   icon: User,            label: 'Profile',       color: '#a78bfa' },
  { to: '/resume',    icon: FileOutput,      label: 'Resume',        color: '#f472b6' },
  { to: '/cgpa',      icon: Calculator,      label: 'CGPA',          color: '#34d399' },
  { to: '/salary',    icon: DollarSign,      label: 'Salary',        color: '#fb923c' },
  { to: '/jobs',      icon: Briefcase,       label: 'Opportunities', color: '#60a5fa' },
]

export default function Sidebar() {
  const [hovered, setHovered] = useState(null)

  return (
    <aside style={{
      width: '240px',
      height: '100vh',
      background: 'linear-gradient(180deg, #080c14 0%, #04050a 100%)',
      borderRight: '1px solid var(--border)',
      padding: '2rem 0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      overflowY: 'auto',
      zIndex: 100,
    }}> 

      {/* Logo */}
      <div style={{ padding: '0 1.5rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
  width: '36px', height: '36px', borderRadius: '10px',
  background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '18px', flexShrink: 0,
  boxShadow: '0 0 16px rgba(124,58,237,0.5)'
}}>⚡</div>
          <div>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: '800',
              background: 'linear-gradient(135deg, #f1f5f9, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              Launchpad
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text3)', letterSpacing: '0.15em' }}>LIFE OS</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 0.75rem' }}>
        {links.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onMouseEnter={() => setHovered(to)}
            onMouseLeave={() => setHovered(null)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px', fontSize: '14px', fontWeight: '500',
              borderRadius: '10px', textDecoration: 'none',
              transition: 'all 0.2s ease',
              background: isActive
                ? `linear-gradient(135deg, ${color}18, ${color}08)`
                : hovered === to ? 'rgba(255,255,255,0.04)' : 'transparent',
              color: isActive ? color : hovered === to ? 'var(--text)' : 'var(--text2)',
              boxShadow: isActive ? `inset 0 0 0 1px ${color}30` : 'none',
              transform: hovered === to && !isActive ? 'translateX(4px)' : 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: isActive ? `${color}20` : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.2s',
                  boxShadow: isActive ? `0 0 12px ${color}40` : 'none'
                }}>
                  <Icon size={16} style={{ color: isActive ? color : 'inherit' }} />
                </div>
                {label}
                {isActive && (
                  <div style={{
                    marginLeft: 'auto', width: '6px', height: '6px',
                    borderRadius: '50%', background: color,
                    boxShadow: `0 0 8px ${color}`
                  }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom tag */}
      <div style={{ marginTop: 'auto', padding: '1.5rem', fontSize: '11px', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>
        v1.0.0 · built by you
      </div>
    </aside>
  )
}