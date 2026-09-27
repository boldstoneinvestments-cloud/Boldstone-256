import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app')
  ? configuredBackend.replace(/\/$/, '')
  : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')
export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('sign-in')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error || 'Unable to sign in. Please try again.')
      }
      navigate('/admin', {
        state: Array.isArray(data.identities)
          ? {
            adminSession: { authenticated: true, identities: data.identities, identity: null },
            twoFactor: data.two_factor || null,
            pendingIdentity: data.pending_identity || null,
          }
          : undefined,
      })
    } catch (requestError) {
      setError(requestError.message || 'Invalid admin credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-story" aria-label="Boldstone admin workspace">
        <div className="admin-login-story-top">
          <img src="https://res.cloudinary.com/cwj8d38f/image/upload/v1789729870/Boldstone_logo_hiv7pl.jpg" alt="" />
          <span>Boldstone <i /> Workspace</span>
        </div>
        <div className="admin-login-story-copy">
          <span className="admin-login-kicker">Operations, with purpose</span>
          <h2>Good work<br />starts <em>here.</em></h2>
          <p>A considered space for the people growing Boldstone, from the first seedling to the next harvest.</p>
        </div>
        <div className="admin-login-story-foot">
          <span className="admin-login-status-dot" />
          <span>Private workspace <b>·</b> Secure access</span>
          <span className="admin-login-story-index">01 <i /> 03</span>
        </div>
        <div className="admin-login-orbit admin-login-orbit-one" aria-hidden="true" />
        <div className="admin-login-orbit admin-login-orbit-two" aria-hidden="true" />
        <span className="admin-login-story-coordinate" aria-hidden="true">0° 20' 12.0&quot; N&nbsp;&nbsp; 32° 34' 55.0&quot; E</span>
      </section>

      <section className="admin-login-workspace">
        <div className="admin-login-mobile-brand"><span>Boldstone</span><i /> Admin workspace</div>
        <div className="admin-login-panel">
          <div className="admin-login-heading">
            <span className="admin-login-kicker">ADMIN WORKSPACE</span>
            <h1>{mode === 'sign-in' ? 'Welcome back.' : 'Join the team.'}</h1>
            <p>{mode === 'sign-in' ? 'Sign in to continue to your workspace.' : 'Get in touch to request secure admin access.'}</p>
          </div>

          <div className="admin-login-switch" role="tablist" aria-label="Admin access options">
            <span className={`admin-login-switch-indicator ${mode === 'sign-up' ? 'is-signup' : ''}`} aria-hidden="true" />
            <button type="button" role="tab" aria-selected={mode === 'sign-in'} aria-controls="admin-login-tab-content" onClick={() => setMode('sign-in')}>Sign in</button>
            <button type="button" role="tab" aria-selected={mode === 'sign-up'} aria-controls="admin-login-tab-content" onClick={() => { setMode('sign-up'); setError('') }}>Sign up</button>
          </div>

          <div id="admin-login-tab-content" role="tabpanel" className="admin-login-tab-content">
            <AnimatePresence mode="wait" initial={false}>
              {mode === 'sign-in' ? (
                <motion.div key="sign-in" className="admin-login-form-stage" initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
                  <form className="admin-login-form" onSubmit={submit} aria-busy={loading}>
                    <label htmlFor="admin-username">Username</label>
                    <input id="admin-username" type="text" placeholder="Enter your username" value={username} onChange={event => setUsername(event.target.value)} required autoComplete="username" />
                    <div className="admin-login-password-heading">
                      <label htmlFor="admin-password">Password</label>
                      <Link to="/admin/password-reset">Forgot password?</Link>
                    </div>
                    <div className="admin-login-password-field">
                      <input id="admin-password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={event => setPassword(event.target.value)} required autoComplete="current-password" />
                      <button className="password-visibility-toggle" type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} aria-hidden="true" />
                      </button>
                    </div>
                    {error && <p className="admin-login-error" role="alert">{error}</p>}
                    <button className="admin-login-submit" type="submit" disabled={loading}>
                      {loading ? <><span className="admin-loading-spinner" aria-hidden="true" />Checking your details...</> : <>Continue securely <span aria-hidden="true">→</span></>}
                    </button>
                    {loading && <div className="admin-login-progress" role="progressbar" aria-label="Signing in"><span /></div>}
                  </form>
                  <div className="admin-login-divider"><span>OR CONTINUE WITH</span></div>
                  <button type="button" className="admin-login-google" onClick={() => { window.location.href = `${BACKEND}/api/admin/google/start` }}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z" /><path fill="#34A853" d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.55 0-4.7-1.72-5.47-4.03H3.28v2.53A9.75 9.75 0 0 0 12 21.6Z" /><path fill="#FBBC05" d="M6.53 13.68A5.86 5.86 0 0 1 6.22 12c0-.58.11-1.15.31-1.68V7.79H3.28A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.06 1.03 4.21l3.25-2.53Z" /><path fill="#EA4335" d="M12 6.29c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.39 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.72 5.39l3.25 2.53c.77-2.31 2.92-4.03 5.47-4.03Z" /></svg>
                    Continue with Google
                  </button>
                  {new URLSearchParams(location.search).get('error') && <p className="admin-login-error" role="alert">{new URLSearchParams(location.search).get('error') === 'google_not_admin' ? 'This Google account is not enabled for admin access.' : 'Google sign-in could not be completed. Please try again.'}</p>}
                </motion.div>
              ) : (
                <motion.div key="sign-up" className="admin-login-invite" initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
                  <span className="admin-login-invite-mark" aria-hidden="true">+</span>
                  <h2>Access is by invitation.</h2>
                  <p>Admin accounts are created by the Boldstone team. Contact us to request access to the workspace.</p>
                  <a href="mailto:boldstone.investments@gmail.com?subject=Admin%20workspace%20access%20request">Request admin access <span aria-hidden="true">↗</span></a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <footer className="admin-login-footer"><span>© {new Date().getFullYear()} Boldstone Investments</span><span>Need help? <a href="mailto:boldstone.investments@gmail.com">Contact support</a></span></footer>
      </section>
    </main>
  )
}
