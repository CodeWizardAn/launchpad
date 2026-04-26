import { useState } from 'react'
import { Sparkles, Copy, Check } from 'lucide-react'

const card = {
  background: '#0f1117',
  border: '1px solid #1e2130',
  borderRadius: '12px',
  padding: '1.25rem',
}

export default function Resume() {
  const [resume, setResume]   = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied]   = useState(false)
  const [error, setError]     = useState('')

  async function generate() {
    setLoading(true)
    setError('')
    setResume('')
    try {
      const res  = await fetch('http://localhost:8000/resume/generate')
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResume(data.resume)
      }
    } catch (e) {
      setError('Failed to connect to backend')
    }
    setLoading(false)
  }

  async function copy() {
    await navigator.clipboard.writeText(resume)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: '800px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Resume Generator</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>One click — AI builds your resume from your profile</p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#4f8ef7', border: 'none', borderRadius: '8px', padding: '8px 16px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          <Sparkles size={14} />
          {loading ? 'Generating...' : 'Generate resume'}
        </button>
      </div>

      {/* Empty state */}
      {!resume && !loading && !error && (
        <div style={{ ...card, textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          <Sparkles size={32} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <div style={{ fontSize: '15px', marginBottom: '8px' }}>Your resume will appear here</div>
          <div style={{ fontSize: '13px' }}>
            Make sure your <a href="/profile" style={{ color: '#4f8ef7' }}>Profile</a> is filled in first
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ ...card, textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Sparkles size={16} style={{ color: '#4f8ef7' }} />
            AI is writing your resume...
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#1a0f0f', border: '1px solid #3a1f1f', borderRadius: '8px', padding: '1rem', color: '#f87171', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Resume output */}
      {resume && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '8px' }}>
            <button
              onClick={generate}
              style={{ background: '#1e2130', border: 'none', borderRadius: '8px', padding: '6px 14px', color: '#6b7280', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Sparkles size={12} /> Regenerate
            </button>
            <button
              onClick={copy}
              style={{ background: copied ? '#0f1f12' : '#1e2130', border: 'none', borderRadius: '8px', padding: '6px 14px', color: copied ? '#3dd68c' : '#6b7280', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{ fontFamily: 'inherit', fontSize: '13px', lineHeight: '1.8', color: '#c0c8d8', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {resume}
          </pre>
        </div>
      )}

    </div>
  )
}