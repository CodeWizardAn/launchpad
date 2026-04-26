import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle, Flag } from 'lucide-react'

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

const priorityColors = {
  low:    { bg: '#0f1f12', text: '#3dd68c', dot: '#3dd68c' },
  medium: { bg: '#1a1508', text: '#f7c94f', dot: '#f7c94f' },
  high:   { bg: '#1a0f0f', text: '#f87171', dot: '#f87171' },
}

export default function Tasks() {
  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all') // all | pending | done
  const [form, setForm]       = useState({ title: '', subject: '', priority: 'medium', due_date: '' })
  const [adding, setAdding]   = useState(false)
  const [saving, setSaving]   = useState(false)

  useEffect(() => { fetchTasks() }, [])

  async function fetchTasks() {
    setLoading(true)
    const res  = await fetch('http://localhost:8000/tasks')
    const data = await res.json()
    setTasks(data)
    setLoading(false)
  }

  async function addTask() {
    if (!form.title.trim()) return
    setSaving(true)
    const res  = await fetch('http://localhost:8000/tasks', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form)
    })
    const task = await res.json()
    setTasks(prev => [task, ...prev])
    setForm({ title: '', subject: '', priority: 'medium', due_date: '' })
    setAdding(false)
    setSaving(false)
  }

  async function toggleTask(id, done) {
    const res  = await fetch(`http://localhost:8000/tasks/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ done: !done })
    })
    const updated = await res.json()
    setTasks(prev => prev.map(t => t.id === id ? updated : t))
  }

  async function deleteTask(id) {
    await fetch(`http://localhost:8000/tasks/${id}`, { method: 'DELETE' })
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const filtered = tasks.filter(t =>
    filter === 'all'     ? true :
    filter === 'pending' ? !t.done :
    t.done
  )

  const pending = tasks.filter(t => !t.done).length
  const done    = tasks.filter(t =>  t.done).length

  return (
    <div style={{ maxWidth: '800px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Tasks</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            {pending} pending · {done} done
          </p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#4f8ef7', border: 'none', borderRadius: '8px', padding: '8px 16px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          <Plus size={15} /> New task
        </button>
      </div>

      {/* Add task form */}
      {adding && (
        <div style={{ ...card, marginBottom: '1.25rem', borderColor: '#4f8ef7' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              style={inputStyle}
              placeholder="Task title *"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              autoFocus
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <input
                style={inputStyle}
                placeholder="Subject (e.g. CS401)"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              />
              <select
                style={inputStyle}
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>
              <input
                style={inputStyle}
                type="date"
                value={form.due_date}
                onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setAdding(false)}
                style={{ background: '#1e2130', border: 'none', borderRadius: '8px', padding: '7px 16px', color: '#6b7280', fontSize: '13px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                disabled={saving}
                style={{ background: '#4f8ef7', border: 'none', borderRadius: '8px', padding: '7px 16px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
              >
                {saving ? 'Saving...' : 'Add task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        {['all', 'pending', 'done'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '5px 14px', borderRadius: '99px', fontSize: '12px',
              cursor: 'pointer', border: 'none', textTransform: 'capitalize',
              background: filter === f ? '#4f8ef7' : '#1e2130',
              color: filter === f ? '#fff' : '#6b7280',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task list */}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', color: '#6b7280', padding: '3rem' }}>
          {filter === 'all' ? 'No tasks yet — add one above' : `No ${filter} tasks`}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(task => (
            <div
              key={task.id}
              style={{
                ...card,
                display: 'flex', alignItems: 'center', gap: '12px',
                opacity: task.done ? 0.5 : 1,
                transition: 'opacity 0.2s'
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id, task.done)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.done ? '#3dd68c' : '#6b7280', flexShrink: 0 }}
              >
                {task.done ? <CheckCircle size={20} /> : <Circle size={20} />}
              </button>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '500', textDecoration: task.done ? 'line-through' : 'none' }}>
                  {task.title}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                  {task.subject && (
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>{task.subject}</span>
                  )}
                  {task.due_date && (
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>· Due {task.due_date}</span>
                  )}
                </div>
              </div>

              {/* Priority */}
              <span style={{
                fontSize: '11px', padding: '2px 8px', borderRadius: '99px',
                background: priorityColors[task.priority]?.bg,
                color: priorityColors[task.priority]?.text,
                flexShrink: 0
              }}>
                <Flag size={10} style={{ display: 'inline', marginRight: '3px' }} />
                {task.priority}
              </span>

              {/* Delete */}
              <button
                onClick={() => deleteTask(task.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', flexShrink: 0 }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}