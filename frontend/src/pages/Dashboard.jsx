import { useEffect, useState } from 'react'
import { CheckSquare, FileText, Lock, TrendingUp, Flame, Clock } from 'lucide-react'

const card = {
  background: '#0f1117',
  border: '1px solid #1e2130',
  borderRadius: '12px',
  padding: '1.25rem',
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/dashboard')
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
  }, [])

  if (loading) return <p style={{ color: '#6b7280' }}>Loading...</p>

  return (
    <div style={{ maxWidth: '900px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>
          Hey {data.name} 👋
        </h1>
        <p style={{ color: '#6b7280', marginTop: '4px' }}>
          Here's what's happening today
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
        
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
            <TrendingUp size={14} /> CGPA
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#4f8ef7' }}>{data.cgpa}</div>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
            <CheckSquare size={14} /> Tasks done
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#3dd68c' }}>{data.tasks_done}</div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{data.tasks_pending} pending</div>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
            <FileText size={14} /> Notes
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{data.notes_count}</div>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
            <Lock size={14} /> Vault files
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{data.vault_files}</div>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
            <Flame size={14} /> Streak
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#f7824f' }}>{data.streak_days} days</div>
        </div>

      </div>

      {/* Upcoming deadlines */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#6b7280', fontSize: '13px' }}>
          <Clock size={14} /> Upcoming deadlines
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {data.upcoming_deadlines.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#0a0c10', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{d.title}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{d.subject}</div>
              </div>
              <div style={{ fontSize: '12px', color: '#f7824f', background: '#1a1208', padding: '3px 10px', borderRadius: '99px' }}>
                {d.due}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}