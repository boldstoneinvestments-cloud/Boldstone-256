import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app')
  ? configuredBackend.replace(/\/$/, '')
  : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

const emptyForm = { name: '', username: '', email: '', password: '' }

export default function AdminUsers() {
  const [authed, setAuthed] = useState(null)
  const [users, setUsers] = useState([])
  const [customers, setCustomers] = useState([])
  const [activeTab, setActiveTab] = useState('users')
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadUsers = async () => {
    try {
      const [usersResponse, customersResponse] = await Promise.all([
        fetch(`${BACKEND}/api/admin/users`, { credentials: 'include' }),
        fetch(`${BACKEND}/api/admin/customers`, { credentials: 'include' }),
      ])
      if ([usersResponse, customersResponse].some(response => response.status === 401 || response.status === 403)) {
        setAuthed(false)
        return
      }
      if (!usersResponse.ok || !customersResponse.ok) throw new Error()
      const [usersData, customersData] = await Promise.all([usersResponse.json(), customersResponse.json()])
      setUsers(usersData.users || [])
      setCustomers(customersData.customers || [])
      setAuthed(true)
    } catch {
      setError('Could not load users.')
      setAuthed(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))

  const startEditing = user => {
    setEditingId(user.id)
    setEditForm({ name: user.name || user.username, username: user.username, email: user.email, password: '' })
    setMessage('')
    setError('')
  }

  const updateEdit = event => setEditForm(current => ({ ...current, [event.target.name]: event.target.value }))

  const deleteCustomer = async () => {
    if (!selectedCustomer || !window.confirm(`Delete all records for ${selectedCustomer.name || selectedCustomer.email}?`)) return
    setDeleting(true)
    try {
      const response = await fetch(`${BACKEND}/api/admin/customers/${encodeURIComponent(selectedCustomer.email)}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const data = await response.json().catch(() => ({}))
      if (response.status === 401 || response.status === 403) {
        setAuthed(false)
        return
      }
      if (!response.ok) throw new Error(data.error || 'Could not delete customer.')
      setCustomers(current => current.filter(customer => customer.email.toLowerCase() !== selectedCustomer.email.toLowerCase()))
      setSelectedCustomer(null)
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setDeleting(false)
    }
  }

  const saveEdit = async event => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const response = await fetch(`${BACKEND}/api/admin/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm),
      })
      const data = await response.json().catch(() => ({}))
      if (response.status === 401 || response.status === 403) {
        setAuthed(false)
        return
      }
      if (!response.ok) throw new Error(data.error || 'Could not update admin user.')
      setUsers(current => current.map(user => user.id === data.user.id ? data.user : user).sort((a, b) => a.username.localeCompare(b.username)))
      setEditingId(null)
      setMessage('Admin user updated successfully.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

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

  if (authed === null || loading) return <div className="admin-state">Loading users...</div>
  if (!authed) return <Navigate to="/admin/sign-in" replace />

  return (
    <section className="admin-content-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">People</span>
          <h1>Users</h1>
          <p>Manage customer accounts and the admins who manage the portal.</p>
        </div>
      </div>

      <div className="admin-users-tabs" role="tablist" aria-label="User types">
        <button className={activeTab === 'users' ? 'is-active' : ''} type="button" role="tab" aria-selected={activeTab === 'users'} onClick={() => setActiveTab('users')}>Users <strong>{customers.length}</strong></button>
        <button className={activeTab === 'admins' ? 'is-active' : ''} type="button" role="tab" aria-selected={activeTab === 'admins'} onClick={() => setActiveTab('admins')}>Admins <strong>{users.length}</strong></button>
      </div>

      {activeTab === 'users' && <section className="admin-customer-section">
        <div className="admin-user-list-heading"><div><span className="admin-eyebrow">Customer accounts</span><h2>People signed up for chat</h2></div><strong>{customers.length}</strong></div>
        <p className="admin-customer-intro">Review and correct the account details customers use to sign in and receive chat replies.</p>
        <div className="admin-table-wrap">
          <table className="admin-data-table admin-users-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Username</th><th>Joined</th><th>Source</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{customers.length === 0 ? <tr><td colSpan="8" className="admin-table-empty">No customer records found.</td></tr> : customers.map(customer => (
              <tr className="admin-clickable-row" key={customer.id} onClick={() => setSelectedCustomer(customer)} tabIndex="0" onKeyDown={event => event.key === 'Enter' && setSelectedCustomer(customer)}>
                <td><strong>{customer.name || customer.username}</strong></td>
                <td>{customer.email}</td>
                <td>{customer.phone || '—'}</td>
                <td>{customer.username}</td>
                <td>{new Date(customer.date_joined).toLocaleDateString('en-GB', { dateStyle: 'medium' })}</td>
                <td><span className="admin-table-sources">{(customer.sources || []).join(', ')}</span></td>
                <td>{customer.account_id ? <small className="admin-table-status">{customer.is_active ? 'Active' : 'Inactive'}</small> : <small className="admin-table-muted">No account</small>}</td>
                <td><span className="admin-table-action">View</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>}

      {activeTab === 'admins' && <section className="admin-admins-section">
        <div className="admin-user-list-heading"><div><span className="admin-eyebrow">Team access</span><h2>Admins</h2></div><strong>{users.length}</strong></div>
        <div className="admin-users-layout">
          <form className="admin-user-form" onSubmit={submit}>
            <div><span className="admin-eyebrow">New account</span><h2>Add an admin</h2></div>
            <label>Full name<input name="name" value={form.name} onChange={update} autoComplete="name" required /></label>
            <label>Username<input name="username" value={form.username} onChange={update} autoComplete="username" required /></label>
            <label>Email address<input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required /></label>
            <label>Password<input name="password" type="password" value={form.password} onChange={update} autoComplete="new-password" minLength="8" required /><small>Use at least 8 characters.</small></label>
            {error && <p className="admin-form-error">{error}</p>}
            {message && <p className="admin-form-success">{message}</p>}
            <button className="admin-user-submit" type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create admin'}</button>
          </form>

          <div className="admin-table-wrap">
            <table className="admin-data-table admin-users-table">
              <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>{users.length === 0 ? <tr><td colSpan="5" className="admin-table-empty">No admins found.</td></tr> : users.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.name || user.username}</strong></td><td>{user.username}</td><td>{user.email}</td>
                  <td><small className="admin-table-status">{user.is_active ? 'Active' : 'Inactive'}</small></td>
                  <td><button className="admin-table-action" type="button" onClick={() => startEditing(user)}>Edit</button></td>
                </tr>
              ))}</tbody>
            </table>
            {editingId !== null && (
              <form className="admin-user-edit-form admin-inline-edit" onSubmit={saveEdit}>
                <div className="admin-user-list-heading"><div><span className="admin-eyebrow">Edit admin</span><h2>{editForm.username}</h2></div><button type="button" className="admin-user-cancel" onClick={() => setEditingId(null)}>Cancel</button></div>
                <label>Full name<input name="name" value={editForm.name} onChange={updateEdit} autoComplete="name" required /></label>
                <label>Username<input name="username" value={editForm.username} onChange={updateEdit} autoComplete="username" required /></label>
                <label>Email address<input name="email" type="email" value={editForm.email} onChange={updateEdit} autoComplete="email" required /></label>
                <label>New password<input name="password" type="password" value={editForm.password} onChange={updateEdit} autoComplete="new-password" minLength="8" placeholder="Leave blank to keep current password" /></label>
                <button className="admin-user-submit" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
              </form>
            )}
          </div>
        </div>
      </section>}

      {selectedCustomer && <div className="admin-modal-backdrop" role="presentation" onClick={() => setSelectedCustomer(null)}>
        <section className="admin-customer-modal" role="dialog" aria-modal="true" aria-labelledby="customer-modal-title" onClick={event => event.stopPropagation()}>
          <div className="admin-customer-modal-header"><div><span className="admin-eyebrow">Customer details</span><h2 id="customer-modal-title">{selectedCustomer.name || selectedCustomer.email}</h2><p>{selectedCustomer.email}</p></div><button className="admin-user-cancel" type="button" onClick={() => setSelectedCustomer(null)}>Close</button></div>
          <div className="admin-customer-summary"><div><small>Phone</small><strong>{selectedCustomer.phone || 'Not provided'}</strong></div><div><small>Username</small><strong>{selectedCustomer.username || 'No account'}</strong></div><div><small>Sources</small><strong>{(selectedCustomer.sources || []).join(', ') || 'Unknown'}</strong></div></div>
          <div className="admin-customer-records"><h3>Why they signed up</h3>
            {(selectedCustomer.records || []).map((record, index) => <article key={`${record.source}-${record.date}-${index}`}><div><strong>{record.source}</strong><span>{record.reason}</span><time>{record.date ? new Date(record.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'Date unavailable'}</time></div><dl>{Object.entries(record.details || {}).filter(([, value]) => value !== '' && value !== null && value !== undefined).map(([label, value]) => <div key={label}><dt>{label.replaceAll('_', ' ')}</dt><dd>{String(value)}</dd></div>)}</dl></article>)}
          </div>
          <div className="admin-customer-modal-footer"><button className="admin-danger-button" type="button" onClick={deleteCustomer} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete customer'}</button></div>
        </section>
      </div>}
    </section>
  )
}
