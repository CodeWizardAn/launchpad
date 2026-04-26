import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Download, FileText, Award, CreditCard, Briefcase, File } from 'lucide-react'

const card = {
  background: '#0f1117',
  border: '1px solid #1e2130',
  borderRadius: '12px',
  padding: '1.25rem',
}

const categories = [
  { value: 'marksheet',    label: 'Marksheet',    icon: FileText  },
  { value: 'certificate',  label: 'Certificate',  icon: Award     },
  { value: 'id',           label: 'ID Document',  icon: CreditCard},
  { value: 'offer_letter', label: 'Offer Letter', icon: Briefcase },
  { value: 'other',        label: 'Other',        icon: File      },
]

const categoryColors = {
  marksheet:    '#4f8ef7',
  certificate:  '#3dd68c',
  id:           '#f7c94f',
  offer_letter: '#f7824f',
  other:        '#a0b4cc',
}

export default function Vault() {
  const [files, setFiles]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState('marksheet')
  const [dragOver, setDragOver] = useState(false)
  const [filter, setFilter]     = useState('all')
  const fileInputRef            = useRef()

  useEffect(() => { fetchFiles() }, [])

  async function fetchFiles() {
    const res  = await fetch('http://localhost:8000/vault')
    const data = await res.json()
    setFiles(data)
    setLoading(false)
  }

  async function uploadFile(file) {
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)

    const res  = await fetch('http://localhost:8000/vault/upload', {
      method: 'POST',
      body:   formData
    })
    const data = await res.json()
    setFiles(prev => [data, ...prev])
    setUploading(false)
  }

  async function deleteFile(id) {
    await fetch(`http://localhost:8000/vault/${id}`, { method: 'DELETE' })
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  const filtered = filter === 'all' ? files : files.filter(f => f.category === filter)

  return (
    <div style={{ maxWidth: '900px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Vault</h1>
        <p style={{ color: '#6b7280', marginTop: '4px' }}>
          {files.length} files stored · Secure local storage
        </p>
      </div>

      {/* Upload area */}
      <div style={{ ...card, marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>Category</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {categories.map(c => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              style={{
                padding: '6px 14px', borderRadius: '8px', fontSize: '12px',
                cursor: 'pointer', border: 'none',
                background: category === c.value ? '#1e2130' : 'transparent',
                color: category === c.value ? categoryColors[c.value] : '#6b7280',
                outline: category === c.value ? `1px solid ${categoryColors[c.value]}` : 'none'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          style={{
            border: `2px dashed ${dragOver ? '#4f8ef7' : '#1e2130'}`,
            borderRadius: '10px',
            padding: '2.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? '#0d1829' : 'transparent',
            transition: 'all 0.15s'
          }}
        >
          <Upload size={24} style={{ color: '#6b7280', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '14px', color: '#a0b4cc', marginBottom: '4px' }}>
            {uploading ? 'Uploading...' : 'Drop file here or click to upload'}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            PDF, JPG, PNG, DOC — any format
          </div>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={e => uploadFile(e.target.files[0])}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          style={{ padding: '5px 14px', borderRadius: '99px', fontSize: '12px', cursor: 'pointer', border: 'none', background: filter === 'all' ? '#4f8ef7' : '#1e2130', color: filter === 'all' ? '#fff' : '#6b7280' }}
        >
          All
        </button>
        {categories.map(c => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            style={{ padding: '5px 14px', borderRadius: '99px', fontSize: '12px', cursor: 'pointer', border: 'none', background: filter === c.value ? '#1e2130' : 'transparent', color: filter === c.value ? categoryColors[c.value] : '#6b7280', outline: filter === c.value ? `1px solid ${categoryColors[c.value]}` : 'none' }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Files grid */}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          No files yet — upload something above
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {filtered.map(f => {
            const cat = categories.find(c => c.value === f.category) || categories[4]
            const Icon = cat.icon
            const color = categoryColors[f.category] || '#a0b4cc'
            return (
              <div key={f.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ background: '#1e2130', borderRadius: '8px', padding: '8px', color }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <a
                      href={`http://localhost:8000/vault/download/${f.id}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}
                    >
                      <Download size={15} />
                    </a>
                    <button
                      onClick={() => deleteFile(f.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color, background: '#1e2130', padding: '2px 8px', borderRadius: '99px' }}>
                    {cat.label}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>{f.size}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}