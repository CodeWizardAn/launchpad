import { useState, useEffect } from 'react'
import { Plus, Trash2, ExternalLink, Briefcase, MapPin } from 'lucide-react'

const card = {
  background: '#0f1117',
  border: '1px solid #1e2130',
  borderRadius: '12px',
  padding: '1.25rem',
}

const inputStyle = {
  background: '#0a0c10',
  border: '1px solid #1e2130',
  borderRadius: '8px',
  padding: '8px 12px',
  color: '#e8eaf0',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
}

const statusColors = {
  saved:        { bg: '#1e2130', text: '#6b7280'  },
  applied:      { bg: '#0d1829', text: '#4f8ef7'  },
  interviewing: { bg: '#1a1508', text: '#f7c94f'  },
  offered:      { bg: '#0f1f12', text: '#3dd68c'  },
  rejected:     { bg: '#1a0f0f', text: '#f87171'  },
}

const statuses = ['saved', 'applied', 'interviewing', 'offered', 'rejected']

export default function Jobs() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding]   = useState(false)
  const [saving, setSaving]   = useState(false)
  const [filter, setFilter]   = useState('all')
  const [form, setForm]       = useState({
    title: '', company: '', location: '',
    type: 'internship', url: '', notes: ''
  })

  async function fetchJobs() {
    const res  = await fetch('http://localhost:8000/jobs')
    const data = await res.json()
    setJobs(data)
    setLoading(false)
  }

  useEffect(() => { fetchJobs() }, [])

  async function addJob() {
    if (!form.title.trim()) return
    setSaving(true)
    const res = await fetch('http://localhost:8000/jobs', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form)
    })
    const job = await res.json()
    setJobs(prev => [job, ...prev])
    setForm({ title: '', company: '', location: '', type: 'internship', url: '', notes: '' })
    setAdding(false)
    setSaving(false)
  }

  async function updateStatus(id, status) {
    const res     = await fetch(`http://localhost:8000/jobs/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status })
    })
    const updated = await res.json()
    setJobs(prev => prev.map(j => j.id === id ? updated : j))
  }

  async function deleteJob(id) {
    await fetch(`http://localhost:8000/jobs/${id}`, { method: 'DELETE' })
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter)

  return (
    <div style={{ maxWidth: '900px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Opportunities</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>{jobs.length} tracked · {jobs.filter(j => j.status === 'applied').length} applied</p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#4f8ef7', border: 'none', borderRadius: '8px', padding: '8px 16px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          <Plus size={15} /> Add opportunity
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ ...card, marginBottom: '1.25rem', borderColor: '#4f8ef7' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <input style={inputStyle} placeholder="Job title *" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
            <input style={inputStyle} placeholder="Company" value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            <input style={inputStyle} placeholder="Location" value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <select style={inputStyle} value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="internship">Internship</option>
              <option value="fulltime">Full-time</option>
            </select>
            <input style={{ ...inputStyle, gridColumn: 'span 2' }} placeholder="Job URL (optional)" value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
            <textarea style={{ ...inputStyle, gridColumn: 'span 2', resize: 'vertical', minHeight: '60px', fontFamily: 'inherit' }}
              placeholder="Notes (optional)" value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setAdding(false)}
              style={{ background: '#1e2130', border: 'none', borderRadius: '8px', padding: '7px 16px', color: '#6b7280', fontSize: '13px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={addJob} disabled={saving}
              style={{ background: '#4f8ef7', border: 'none', borderRadius: '8px', padding: '7px 16px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['all', ...statuses].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '5px 14px', borderRadius: '99px', fontSize: '12px',
              cursor: 'pointer', border: 'none', textTransform: 'capitalize',
              background: filter === f ? '#4f8ef7' : '#1e2130',
              color: filter === f ? '#fff' : '#6b7280',
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Jobs list */}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', color: '#6b7280', padding: '3rem' }}>
          {filter === 'all' ? 'No opportunities yet — add one above' : `No ${filter} opportunities`}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(job => (
            <div key={job.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '500' }}>{job.title}</span>
                    <span style={{ fontSize: '11px', background: '#1e2130', color: '#6b7280', padding: '2px 8px', borderRadius: '99px' }}>
                      {job.type}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {job.company && (
                      <span style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Briefcase size={11} /> {job.company}
                      </span>
                    )}
                    {job.location && (
                      <span style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={11} /> {job.location}
                      </span>
                    )}
                  </div>
                  {job.notes && (
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>{job.notes}</div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {/* Status dropdown */}
                  <select
                    value={job.status}
                    onChange={e => updateStatus(job.id, e.target.value)}
                    style={{
                      background: statusColors[job.status]?.bg,
                      color: statusColors[job.status]?.text,
                      border: 'none', borderRadius: '99px',
                      padding: '4px 10px', fontSize: '12px',
                      cursor: 'pointer', outline: 'none',
                      textTransform: 'capitalize'
                    }}
                  >
                    {statuses.map(s => (
                      <option key={s} value={s} style={{ background: '#0f1117', color: '#e8eaf0' }}>
                        {s}
                      </option>
                    ))}
                  </select>

                  {job.url && (
                    <a href={job.url} target="_blank" rel="noreferrer"
                      style={{ color: '#6b7280', display: 'flex' }}>
                      <ExternalLink size={15} />
                    </a>
                  )}

                  <button onClick={() => deleteJob(job.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}>
                    <Trash2 size={15} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}