import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'

const BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${BACKEND}/api/admin/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!response.ok) throw new Error()
      navigate('/admin/orders')
    } catch {
      setError('Invalid admin credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f8f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(15,137,114,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <FontAwesomeIcon icon={faLock} style={{ color: '#0f8972', fontSize: 22 }} />
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#0f8972', margin: '0 0 8px' }}>Boldstone</p>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0d1f1c', margin: '0 0 8px' }}>Admin sign in</h1>
        <p style={{ fontSize: 13, color: '#777', margin: '0 0 28px' }}>Sign in to view shop orders.</p>
        <input type="text" placeholder="Username" value={username} onChange={event => setUsername(event.target.value)} required autoComplete="username" style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 8, padding: '12px 14px', fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
        <input type="password" placeholder="Password" value={password} onChange={event => setPassword(event.target.value)} required autoComplete="current-password" style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 8, padding: '12px 14px', fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
        {error && <p style={{ color: '#dc2626', fontSize: 13, margin: '4px 0 12px' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: 13, borderRadius: 8, border: 'none', cursor: loading ? 'wait' : 'pointer', marginTop: 8 }}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
