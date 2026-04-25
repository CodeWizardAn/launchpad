import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, CheckSquare, FileText, Lock,
  User, FileOutput, Calculator, DollarSign, Briefcase
} from 'lucide-react'

const links = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tasks'        },
  { to: '/notes',     icon: FileText,        label: 'Notes'        },
  { to: '/vault',     icon: Lock,            label: 'Vault'        },
  { to: '/profile',   icon: User,            label: 'Profile'      },
  { to: '/resume',    icon: FileOutput,      label: 'Resume'       },
  { to: '/cgpa',      icon: Calculator,      label: 'CGPA'         },
  { to: '/salary',    icon: DollarSign,      label: 'Salary'       },
  { to: '/jobs',      icon: Briefcase,       label: 'Opportunities'},
]

export default function Sidebar() {
  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: '#0f1117',
      borderRight: '1px solid #1e2130',
      padding: '1.5rem 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      flexShrink: 0,
    }}>
      <div style={{ padding: '0 1.25rem 1.5rem', fontSize: '18px', fontWeight: '700', color: '#fff', letterSpacing: '-0.5px' }}>
        🚀 Launchpad
      </div>

      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 1.25rem',
            fontSize: '14px',
            color: isActive ? '#fff' : '#6b7280',
            background: isActive ? '#1e2130' : 'transparent',
            textDecoration: 'none',
            borderRight: isActive ? '2px solid #4f8ef7' : '2px solid transparent',
            transition: 'all 0.15s',
          })}
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </aside>
  )
}