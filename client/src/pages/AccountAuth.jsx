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
      <div className="account-divider"><span>or</span></div>
      <button className="google-account-button" type="button" onClick={() => { window.location.href = `${BACKEND}/api/account/google/start` }}>
        <svg className="google-mark" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z" />
          <path fill="#34A853" d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.55 0-4.7-1.72-5.47-4.03H3.28v2.53A9.75 9.75 0 0 0 12 21.6Z" />
          <path fill="#FBBC05" d="M6.53 13.68A5.86 5.86 0 0 1 6.22 12c0-.58.11-1.15.31-1.68V7.79H3.28A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.06 1.03 4.21l3.25-2.53Z" />
          <path fill="#EA4335" d="M12 6.29c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.39 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.72 5.39l3.25 2.53c.77-2.31 2.92-4.03 5.47-4.03Z" />
        </svg>
        Continue with Google
      </button>
      {new URLSearchParams(location.search).get('error') && <p className="account-error">Google sign-in could not be completed. Please try again.</p>}
      <p className="account-switch">{isSignup ? 'Already have an account?' : 'New to Boldstone?'} <Link to={isSignup ? '/account/sign-in' : '/account/sign-up'}>{isSignup ? 'Sign in' : 'Create an account'}</Link></p>
    </section>
  </main>
}