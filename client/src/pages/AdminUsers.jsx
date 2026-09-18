import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app')
  ? configuredBackend.replace(/\/$/, '')
  : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

const emptyForm = { username: '', email: '', password: '' }

export default function AdminUsers() {
  const [authed, setAuthed] = useState(null)
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadUsers = async () => {
    try {
      const response = await fetch(`${BACKEND}/api/admin/users`, { credentials: 'include' })
      if (response.status === 401 || response.status === 403) {
        setAuthed(false)
        return
      }
      if (!response.ok) throw new Error()
      const data = await response.json()
      setUsers(data.users || [])
      setAuthed(true)
    } catch {
      setError('Could not load admin users.')
      setAuthed(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async event => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const response = await fetch(`${BACKEND}/api/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await response.json().catch(() => ({}))
      if (response.status === 401 || response.status === 403) {
        setAuthed(false)
        return
      }
      if (!response.ok) throw new Error(data.error || 'Could not create admin user.')
      setUsers(current => [...current, data.user].sort((a, b) => a.username.localeCompare(b.username)))
      setForm(emptyForm)
      setMessage('Admin user created successfully.')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSaving(false)
    }
  }

  if (authed === null || loading) return <div className="admin-state">Loading admin users...</div>
  if (!authed) return <Navigate to="/admin/sign-in" replace />

  return (
    <section className="admin-content-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Access</span>
          <h1>Admin users</h1>
          <p>Add trusted team members who can manage the portal.</p>
        </div>
      </div>

      <div className="admin-users-layout">
        <form className="admin-user-form" onSubmit={submit}>
          <div>
            <span className="admin-eyebrow">New account</span>
            <h2>Add an admin</h2>
          </div>
          <label>Username<input name="username" value={form.username} onChange={update} autoComplete="username" required /></label>
          <label>Email address<input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={update} autoComplete="new-password" minLength="8" required /><small>Use at least 8 characters.</small></label>
          {error && <p className="admin-form-error">{error}</p>}
          {message && <p className="admin-form-success">{message}</p>}
          <button className="admin-user-submit" type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create admin'}</button>
        </form>

        <div className="admin-user-list">
          <div className="admin-user-list-heading"><div><span className="admin-eyebrow">Team access</span><h2>Portal admins</h2></div><strong>{users.length}</strong></div>
          {users.length === 0 ? <p className="admin-user-empty">No admin users found.</p> : users.map(user => (
            <div className="admin-user-row" key={user.id}>
              <div><strong>{user.username}</strong><span>{user.email}</span></div>
              <small>{user.is_active ? 'Active' : 'Inactive'}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
