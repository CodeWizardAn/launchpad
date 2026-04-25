import { useState } from 'react'
import { Plus, Trash2, TrendingUp, AlertTriangle, Star } from 'lucide-react'

const card = {
  background: '#0f1117',
  border: '1px solid #1e2130',
  borderRadius: '12px',
  padding: '1.25rem',
}

const input = {
  background: '#0a0c10',
  border: '1px solid #1e2130',
  borderRadius: '8px',
  padding: '8px 12px',
  color: '#e8eaf0',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
}

const gradeOptions = [10, 9, 8, 7, 6, 5, 4, 0]

export default function CGPA() {
  const [subjects, setSubjects] = useState([
    { name: '', grade: 9, credits: 4 }
  ])
  const [currentCGPA, setCurrentCGPA] = useState(8.0)
  const [completedCredits, setCompletedCredits] = useState(80)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  function addSubject() {
    setSubjects([...subjects, { name: '', grade: 9, credits: 4 }])
  }

  function removeSubject(i) {
    setSubjects(subjects.filter((_, idx) => idx !== i))
  }

  function updateSubject(i, field, value) {
    const updated = [...subjects]
    updated[i][field] = field === 'name' ? value : Number(value)
    setSubjects(updated)
  }

  async function calculate() {
    setLoading(true)
    const res = await fetch('http://localhost:8000/cgpa/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subjects,
        current_cgpa: currentCGPA,
        completed_credits: completedCredits
      })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '800px' }}>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>CGPA Calculator</h1>
        <p style={{ color: '#6b7280', marginTop: '4px' }}>Add your subjects, get your GPA + predictions</p>
      </div>

      {/* Current standing */}
      <div style={{ ...card, marginBottom: '1.25rem' }}>
        <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '1rem' }}>Your current standing</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Current CGPA</label>
            <input
              style={input}
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={currentCGPA}
              onChange={e => setCurrentCGPA(Number(e.target.value))}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Credits completed so far</label>
            <input
              style={input}
              type="number"
              value={completedCredits}
              onChange={e => setCompletedCredits(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div style={{ ...card, marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ color: '#6b7280', fontSize: '13px' }}>This semester's subjects</div>
          <button
            onClick={addSubject}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1e2130', border: 'none', color: '#e8eaf0', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}
          >
            <Plus size={14} /> Add subject
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 36px', gap: '8px' }}>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>Subject name</div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>Grade point</div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>Credits</div>
            <div />
          </div>

          {subjects.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 36px', gap: '8px', alignItems: 'center' }}>
              <input
                style={input}
                placeholder="e.g. Data Structures"
                value={s.name}
                onChange={e => updateSubject(i, 'name', e.target.value)}
              />
              <select
                style={{ ...input }}
                value={s.grade}
                onChange={e => updateSubject(i, 'grade', e.target.value)}
              >
                {gradeOptions.map(g => (
                  <option key={g} value={g}>{g} {g === 10 ? '(O)' : g === 9 ? '(A+)' : g === 8 ? '(A)' : g === 7 ? '(B+)' : g === 6 ? '(B)' : g === 5 ? '(C)' : g === 4 ? '(P)' : '(F)'}</option>
                ))}
              </select>
              <input
                style={input}
                type="number"
                min="1"
                max="6"
                value={s.credits}
                onChange={e => updateSubject(i, 'credits', e.target.value)}
              />
              <button
                onClick={() => removeSubject(i)}
                style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={calculate}
          disabled={loading}
          style={{ marginTop: '1.25rem', width: '100%', padding: '10px', background: '#4f8ef7', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
        >
          {loading ? 'Calculating...' : 'Calculate CGPA'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>

          <div style={card}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={12} /> Semester GPA</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#4f8ef7' }}>{result.semester_gpa}</div>
          </div>

          <div style={card}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><TrendingUp size={12} /> New CGPA</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#3dd68c' }}>{result.new_cgpa}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{result.total_credits_after} total credits</div>
          </div>

          <div style={card}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><TrendingUp size={12} /> Predicted next sem</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#f7824f' }}>{result.predicted_next}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>if same performance</div>
          </div>

          {result.weak_subjects.length > 0 && (
            <div style={{ ...card, borderColor: '#3a1f1f' }}>
              <div style={{ fontSize: '12px', color: '#f87171', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={12} /> Weak subjects</div>
              {result.weak_subjects.map((s, i) => (
                <div key={i} style={{ fontSize: '13px', color: '#f87171', marginTop: '4px' }}>• {s}</div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  )
}