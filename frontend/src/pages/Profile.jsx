import { useState, useEffect } from 'react'
import { Save, Plus, X, User, BookOpen, Code, Link } from 'lucide-react'
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

const labelStyle = {
  fontSize: '12px',
  color: '#6b7280',
  display: 'block',
  marginBottom: '6px'
}

const sectionTitle = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#a0b4cc',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
}

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills]   = useState([])
  const [links, setLinks]     = useState({ github: '', linkedin: '', portfolio: '' })
  const [form, setForm]       = useState({
    name: '', email: '', phone: '', college: '',
    degree: '', branch: '', cgpa: '', year: '', bio: ''
  })

  useEffect(() => {
    fetch('http://localhost:8000/profile')
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        setForm({
          name:    data.name    || '',
          email:   data.email   || '',
          phone:   data.phone   || '',
          college: data.college || '',
          degree:  data.degree  || '',
          branch:  data.branch  || '',
          cgpa:    data.cgpa    || '',
          year:    data.year    || '',
          bio:     data.bio     || '',
        })
        setSkills(data.skills ? data.skills.split(',').filter(Boolean) : [])
        try { setLinks(JSON.parse(data.links || '{}')) } catch (e) { console.log(e) }
        setLoading(false)
      })
  }, [])

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function addSkill() {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) {
      setSkills(prev => [...prev, s])
    }
    setSkillInput('')
  }

  function removeSkill(s) {
    setSkills(prev => prev.filter(x => x !== s))
  }

  async function save() {
    setSaving(true)
    await fetch('http://localhost:8000/profile', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        ...form,
        skills: skills.join(','),
        links:  JSON.stringify(links)
      })
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <p style={{ color: '#6b7280' }}>Loading...</p>

  return (
    <div style={{ maxWidth: '800px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Profile</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>Your living resume — keep it updated</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: saved ? '#3dd68c' : '#4f8ef7', border: 'none', borderRadius: '8px', padding: '8px 16px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
        >
          <Save size={14} /> {saved ? 'Saved!' : saving ? 'Saving...' : 'Save profile'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Personal info */}
        <div style={card}>
          <div style={sectionTitle}><User size={14} /> Personal Info</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Full name</label>
              <input style={inputStyle} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Advaith Kumar" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} value={form.email} onChange={e => update('email', e.target.value)} placeholder="advaith@email.com" />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label style={labelStyle}>Year of study</label>
              <select style={inputStyle} value={form.year} onChange={e => update('year', e.target.value)}>
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <label style={labelStyle}>Bio</label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' }}
              value={form.bio}
              onChange={e => update('bio', e.target.value)}
              placeholder="A passionate CS student interested in ML and full-stack development..."
            />
          </div>
        </div>

        {/* Academic info */}
        <div style={card}>
          <div style={sectionTitle}><BookOpen size={14} /> Academic Info</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>College</label>
              <input style={inputStyle} value={form.college} onChange={e => update('college', e.target.value)} placeholder="IIT Bombay" />
            </div>
            <div>
              <label style={labelStyle}>Degree</label>
              <input style={inputStyle} value={form.degree} onChange={e => update('degree', e.target.value)} placeholder="B.Tech" />
            </div>
            <div>
              <label style={labelStyle}>Branch</label>
              <input style={inputStyle} value={form.branch} onChange={e => update('branch', e.target.value)} placeholder="Computer Science" />
            </div>
            <div>
              <label style={labelStyle}>CGPA</label>
              <input style={inputStyle} value={form.cgpa} onChange={e => update('cgpa', e.target.value)} placeholder="8.5" />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div style={card}>
          <div style={sectionTitle}><Code size={14} /> Skills</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              style={{ ...inputStyle }}
              placeholder="Add a skill (e.g. React, Python, SQL)"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
            />
            <button
              onClick={addSkill}
              style={{ background: '#1e2130', border: 'none', borderRadius: '8px', padding: '8px 14px', color: '#e8eaf0', cursor: 'pointer', flexShrink: 0 }}
            >
              <Plus size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.length === 0 ? (
              <span style={{ fontSize: '13px', color: '#6b7280' }}>No skills added yet</span>
            ) : skills.map((s, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#1e2130', color: '#a0b4cc', padding: '4px 10px', borderRadius: '99px', fontSize: '13px' }}>
                {s}
                <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', padding: '0' }}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={card}>
          <div style={sectionTitle}><Link size={14} /> Links</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['github', 'linkedin', 'portfolio'].map(key => (
              <div key={key}>
                <label style={labelStyle}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input
                  style={inputStyle}
                  placeholder={`https://${key}.com/yourprofile`}
                  value={links[key] || ''}
                  onChange={e => setLinks(l => ({ ...l, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}