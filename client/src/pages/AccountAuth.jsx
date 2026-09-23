import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend.replace(/\/$/, '') : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

const getCsrfToken = async () => (await (await fetch(`${BACKEND}/api/account/csrf`, { credentials: 'include' })).json()).csrfToken

export default function AccountAuth({ mode }) {
  const isSignup = mode === 'sign-up'
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async event => {
    event.preventDefault()
    setSaving(true)
    setError('')
    const csrfToken = await getCsrfToken()
    const response = await fetch(`${BACKEND}/api/account/${mode}`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
      body: JSON.stringify(form),
    }).catch(() => null)
    const data = response ? await response.json().catch(() => ({})) : {}
    if (!response?.ok) setError(data.error || 'Unable to access your account.')
    else navigate(location.state?.from || '/')
    setSaving(false)
  }

  return <main className="account-page">
    <section className="account-panel">
      <span className="admin-eyebrow">Boldstone account</span>
      <h1>{isSignup ? 'Create your account' : 'Sign in to continue'}</h1>
      <p>{isSignup ? 'Create a private account before starting a support chat.' : 'Your conversations are visible only to you and the Boldstone team.'}</p>
      <form onSubmit={submit}>
        {isSignup && <label>Name<input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} autoComplete="name" required /></label>}
        <label>Email<input type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} autoComplete="email" required /></label>
        <label>Password<input type="password" minLength="8" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} autoComplete={isSignup ? 'new-password' : 'current-password'} required /></label>
        {error && <p className="account-error">{error}</p>}
        <button type="submit" disabled={saving}>{saving ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}</button>
      </form>
      <p className="account-switch">{isSignup ? 'Already have an account?' : 'New to Boldstone?'} <Link to={isSignup ? '/account/sign-in' : '/account/sign-up'}>{isSignup ? 'Sign in' : 'Create an account'}</Link></p>
    </section>
  </main>
}