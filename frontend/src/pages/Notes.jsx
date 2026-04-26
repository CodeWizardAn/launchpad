import { useState, useEffect } from 'react'
import { Plus, Trash2, Tag, Sparkles } from 'lucide-react'

const card = {
  background: '#0f1117',
  border: '1px solid #1e2130',
  borderRadius: '12px',
  padding: '1.25rem',
  cursor: 'pointer',
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

export default function Notes() {
  const [notes, setNotes]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [adding, setAdding]     = useState(false)
  const [saving, setSaving]     = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState({ title: '', content: '' })

  useEffect(() => { fetchNotes() }, [])

  async function fetchNotes() {
    const res  = await fetch('http://localhost:8000/notes')
    const data = await res.json()
    setNotes(data)
    setLoading(false)
  }

  async function saveNote() {
    if (!form.content.trim()) return
    setSaving(true)
    const res  = await fetch('http://localhost:8000/notes', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form)
    })
    const note = await res.json()
    setNotes(prev => [note, ...prev])
    setForm({ title: '', content: '' })
    setAdding(false)
    setSaving(false)
  }

  async function deleteNote(id) {
    await fetch(`http://localhost:8000/notes/${id}`, { method: 'DELETE' })
    setNotes(prev => prev.filter(n => n.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div style={{ maxWidth: '1000px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Notes</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            {notes.length} notes · AI summarized
          </p>
        </div>
        <button
          onClick={() => { setAdding(true); setSelected(null) }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#4f8ef7', border: 'none', borderRadius: '8px', padding: '8px 16px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          <Plus size={15} /> New note
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px' }}>

        {/* Notes list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {loading ? (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading...</p>
          ) : notes.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>No notes yet</p>
          ) : notes.map(note => (
            <div
              key={note.id}
              onClick={() => { setSelected(note); setAdding(false) }}
              style={{
                ...card,
                borderColor: selected?.id === note.id ? '#4f8ef7' : '#1e2130'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                {note.title || 'Untitled'}
              </div>
              <div style={{
                fontSize: '12px', color: '#6b7280',
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
              }}>
                {note.content}
              </div>
              {note.tags && (
                <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {note.tags.split(',').map((tag, i) => (
                    <span key={i} style={{ fontSize: '10px', background: '#1e2130', color: '#6b7280', padding: '2px 6px', borderRadius: '99px' }}>
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div>
          {adding ? (
            <div style={{ ...card, cursor: 'default' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  style={inputStyle}
                  placeholder="Note title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
                <textarea
                  style={{ ...inputStyle, minHeight: '200px', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' }}
                  placeholder="Write your note here... (AI will summarize and tag it automatically)"
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                  {saving && (
                    <span style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={12} /> AI summarizing...
                    </span>
                  )}
                  <button
                    onClick={() => setAdding(false)}
                    style={{ background: '#1e2130', border: 'none', borderRadius: '8px', padding: '7px 16px', color: '#6b7280', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNote}
                    disabled={saving}
                    style={{ background: '#4f8ef7', border: 'none', borderRadius: '8px', padding: '7px 16px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    {saving ? 'Saving...' : 'Save note'}
                  </button>
                </div>
              </div>
            </div>

          ) : selected ? (
            <div style={{ ...card, cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
                  {selected.title || 'Untitled'}
                </h2>
                <button
                  onClick={() => deleteNote(selected.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {selected.summary && (
                <div style={{ background: '#0d1829', border: '1px solid #1e3a5f', borderRadius: '8px', padding: '10px 12px', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '11px', color: '#4f8ef7', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={11} /> AI Summary
                  </div>
                  <div style={{ fontSize: '13px', color: '#a0b4cc', lineHeight: '1.6' }}>
                    {selected.summary}
                  </div>
                </div>
              )}

              {selected.tags && (
                <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Tag size={12} style={{ color: '#6b7280' }} />
                  {selected.tags.split(',').map((tag, i) => (
                    <span key={i} style={{ fontSize: '11px', background: '#1e2130', color: '#a0b4cc', padding: '3px 8px', borderRadius: '99px' }}>
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ fontSize: '14px', color: '#c0c8d8', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                {selected.content}
              </div>
            </div>

          ) : (
            <div style={{ ...card, cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#6b7280', fontSize: '14px' }}>
              Select a note or create a new one
            </div>
          )}
        </div>

      </div>
    </div>
  )
}