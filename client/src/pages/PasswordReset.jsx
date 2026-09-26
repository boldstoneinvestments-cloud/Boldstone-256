import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = (configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')).replace(/\/api\/?$/, '')

const getCsrfToken = async () => (await (await fetch(`${BACKEND}/api/account/csrf`, { credentials: 'include' })).json()).csrfToken

export default function PasswordReset({ admin = false }) {
  const { uid, token } = useParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const accountPath = admin ? '/admin/sign-in' : '/account/sign-in'
  const endpoint = admin ? 'admin/password-reset' : 'account/password-reset'

  const submit = async event => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    if (uid && password !== confirmPassword) {
      setError('The passwords do not match.')
      setSaving(false)
      return
    }
    try {
      const csrfToken = await getCsrfToken()
      const response = await fetch(`${BACKEND}/api/${endpoint}${uid ? '/confirm' : ''}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
        body: JSON.stringify(uid ? { uid, token, password } : { email }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to process this request.')
      setMessage(uid ? 'Your password has been reset. You can sign in now.' : data.message)
    } catch (requestError) {
      setError(requestError.message || 'Unable to process this request. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return <main className="account-page">
    <section className="account-panel">
      <span className="admin-eyebrow">Boldstone {admin ? 'admin' : 'account'}</span>
      <h1>{uid ? 'Choose a new password' : 'Reset your password'}</h1>
      <p>{uid ? 'Set a new password for your account.' : 'Enter your account email and we will send a password reset link if it matches an account.'}</p>
      {message ? <p role="status">{message}</p> : <form onSubmit={submit}>
        {uid ? <>
          <label>New password<input type="password" minLength="8" value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" required /></label>
          <label>Confirm new password<input type="password" minLength="8" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} autoComplete="new-password" required /></label>
        </> : <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required /></label>}
        {error && <p className="account-error" role="alert">{error}</p>}
        <button type="submit" disabled={saving}>{saving ? 'Please wait...' : uid ? 'Reset password' : 'Send reset link'}</button>
      </form>}
      <p className="account-switch"><Link to={accountPath}>Back to sign in</Link></p>
    </section>
  </main>
}