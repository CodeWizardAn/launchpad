import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Percent, PiggyBank } from 'lucide-react'

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

function formatINR(n) {
  if (!n || isNaN(n)) return '—'
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr'
  if (n >= 100000)   return '₹' + (n / 100000).toFixed(2) + ' L'
  return '₹' + n.toLocaleString('en-IN')
}

export default function Salary() {
  const [options, setOptions] = useState({ roles: [], cities: [] })
  const [form, setForm]       = useState({ role: '', city: '', experience: 1, cgpa: 8.0, skills: 5, ctc: 0 })
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode]       = useState('predict')
  const [error, setError]     = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/salary/options')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load options')
        return r.json()
      })
      .then(d => {
        setOptions(d)
        setForm(f => ({ ...f, role: d.roles[0], city: d.cities[0] }))
      })
      .catch(e => setError(e.message))
  }, [])

  function update(field, value) {
    setForm(f => ({
      ...f,
      [field]: field === 'role' || field === 'city' ? value : Number(value)
    }))
  }

  async function submit() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('http://localhost:8000/salary/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ctc: mode === 'predict' ? 0 : form.ctc
        })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(JSON.stringify(err))
      }
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (error) return (
    <div style={{ color: '#f87171', background: '#1a0f0f', padding: '1rem', borderRadius: '8px', fontSize: '14px' }}>
      Error: {error}
    </div>
  )

  if (options.roles.length === 0) return (
    <p style={{ color: '#6b7280' }}>Loading options...</p>
  )

  return (
    <div style={{ maxWidth: '800px' }}>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Salary Calculator</h1>
        <p style={{ color: '#6b7280', marginTop: '4px' }}>ML-predicted CTC + real Indian tax breakdown</p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
        {['predict', 'calculate'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '7px 16px', borderRadius: '8px', fontSize: '13px',
              cursor: 'pointer', border: 'none',
              background: mode === m ? '#4f8ef7' : '#1e2130',
              color: mode === m ? '#fff' : '#6b7280',
              fontWeight: mode === m ? '600' : '400'
            }}
          >
            {m === 'predict' ? 'Predict my CTC' : 'I know my CTC'}
          </button>
        ))}
      </div>

      <div style={{ ...card, marginBottom: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

          <div>
            <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Role</label>
            <select style={inputStyle} value={form.role} onChange={e => update('role', e.target.value)}>
              {options.roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '6px' }}>City</label>
            <select style={inputStyle} value={form.city} onChange={e => update('city', e.target.value)}>
              {options.cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Experience (years)</label>
            <input style={inputStyle} type="number" min="0" max="20"
              value={form.experience} onChange={e => update('experience', e.target.value)} />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '6px' }}>CGPA</label>
            <input style={inputStyle} type="number" step="0.1" min="0" max="10"
              value={form.cgpa} onChange={e => update('cgpa', e.target.value)} />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Number of skills</label>
            <input style={inputStyle} type="number" min="1" max="20"
              value={form.skills} onChange={e => update('skills', e.target.value)} />
          </div>

          {mode === 'calculate' && (
            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Your CTC (per year ₹)</label>
              <input style={inputStyle} type="number"
                value={form.ctc} onChange={e => update('ctc', e.target.value)}
                placeholder="e.g. 1200000" />
            </div>
          )}

        </div>

        <button
          onClick={submit}
          disabled={loading}
          style={{
            marginTop: '1.25rem', width: '100%', padding: '10px',
            background: loading ? '#1e2130' : '#4f8ef7',
            border: 'none', borderRadius: '8px',
            color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
          }}
        >
          {loading ? 'Calculating...' : mode === 'predict' ? 'Predict salary' : 'Calculate in-hand'}
        </button>
      </div>

      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>

          <div style={card}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={12} /> Predicted CTC
            </div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#4f8ef7' }}>{formatINR(result.predicted_ctc)}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>per year</div>
          </div>

          <div style={card}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={12} /> Monthly in-hand
            </div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#3dd68c' }}>{formatINR(result.monthly_inhand)}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{formatINR(result.annual_inhand)} / year</div>
          </div>

          <div style={card}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Percent size={12} /> Tax paid
            </div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#f7824f' }}>{formatINR(result.tax_paid)}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{result.effective_tax_pct}% effective rate</div>
          </div>

          <div style={card}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PiggyBank size={12} /> PF deduction
            </div>
            <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatINR(result.pf_deduction)}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>₹1,800 / month</div>
          </div>

        </div>
      )}

    </div>
  )
}