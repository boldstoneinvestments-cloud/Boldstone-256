import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = (configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')).replace(/\/api\/?$/, '')
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''

const getCsrfToken = async () => (await (await fetch(`${BACKEND}/api/account/csrf`, { credentials: 'include' })).json()).csrfToken

export default function AccountAuth({ mode }) {
  const isSignup = mode === 'sign-up'
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  const captchaContainer = useRef(null)
  const captchaWidget = useRef(null)

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY || !captchaContainer.current) return undefined
    let active = true
    let attempts = 0
    let retryTimer = null
    let script = document.querySelector('script[data-google-recaptcha]')
    const renderCaptcha = () => {
      if (!active || captchaWidget.current !== null || !captchaContainer.current) return
      if (typeof window.grecaptcha?.render !== 'function') {
        if (attempts++ >= 100) {
          setCaptchaError('reCAPTCHA could not load. Refresh the page and try again.')
          return
        }
        if (retryTimer === null) {
          retryTimer = window.setTimeout(() => {
            retryTimer = null
            renderCaptcha()
          }, 100)
        }
        return
      }
      captchaWidget.current = window.grecaptcha.render(captchaContainer.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: token => {
          setCaptchaToken(token)
          setCaptchaError('')
        },
        'expired-callback': () => setCaptchaToken(''),
        'error-callback': () => {
          setCaptchaToken('')
          setCaptchaError('reCAPTCHA could not load. Refresh the page and try again.')
        },
      })
    }

    const handleScriptLoad = () => renderCaptcha()
    const handleScriptError = () => setCaptchaError('reCAPTCHA could not load. Refresh the page and try again.')
    if (!script) {
      script = document.createElement('script')
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.dataset.googleRecaptcha = 'true'
    }
    script.addEventListener('load', handleScriptLoad, { once: true })
    script.addEventListener('error', handleScriptError, { once: true })
    if (!script.isConnected) document.head.appendChild(script)
    if (window.grecaptcha?.ready) window.grecaptcha.ready(renderCaptcha)
    else renderCaptcha()

    return () => {
      active = false
      if (retryTimer !== null) window.clearTimeout(retryTimer)
      script?.removeEventListener('load', handleScriptLoad)
      script?.removeEventListener('error', handleScriptError)
    }
  }, [])

  const submit = async event => {
    event.preventDefault()
    if (!captchaToken) {
      setCaptchaError(`Please complete the reCAPTCHA check before ${isSignup ? 'creating your account' : 'signing in'}.`)
      return
    }
    setSaving(true)
    setError('')
    try {
      const csrfToken = await getCsrfToken()
      const response = await fetch(`${BACKEND}/api/account/${mode}`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
        body: JSON.stringify({ ...form, recaptcha_token: captchaToken }),
      }).catch(() => null)
      const data = response ? await response.json().catch(() => ({})) : {}
      if (!response?.ok) {
        setError(data.error || 'Unable to access your account.')
        setCaptchaToken('')
        if (captchaWidget.current !== null && window.grecaptcha) window.grecaptcha.reset(captchaWidget.current)
      } else {
        localStorage.setItem('boldstone_customer_token', data.token)
        localStorage.setItem('boldstone_customer_account', JSON.stringify(data.user))
        window.dispatchEvent(new CustomEvent('boldstone-account-authenticated', { detail: data.user }))
        navigate(location.state?.from || '/')
      }
    } catch {
      setError('Unable to access your account. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return <main className="account-page">
    <section className="account-panel">
      <span className="admin-eyebrow">Boldstone account</span>
      <h1>{isSignup ? 'Create your account' : 'Sign in to continue'}</h1>
      <p>{isSignup ? 'Create a private account before starting a support chat.' : 'Your conversations are visible only to you and the Boldstone team.'}</p>
      <form onSubmit={submit}>
        {isSignup && <label>Name<input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} autoComplete="name" required /></label>}
        <label>Email<input type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} autoComplete="email" required /></label>
        <label>Password<div className="account-password-field" style={{ position: 'relative', width: '100%' }}>
          <input type={showPassword ? 'text' : 'password'} minLength="8" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} autoComplete={isSignup ? 'new-password' : 'current-password'} required style={{ borderRadius: 0, paddingRight: 44 }} />
          <button className="password-visibility-toggle" type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'} style={{ position: 'absolute', top: 0, right: 0, display: 'grid', placeItems: 'center', width: 40, height: 44, padding: 0, border: 0, borderRadius: 0, background: 'transparent', color: '#56736d', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} aria-hidden="true" />
          </button>
        </div></label>
        <div className="signup-recaptcha">
          {RECAPTCHA_SITE_KEY ? <div ref={captchaContainer} /> : <p className="account-error">reCAPTCHA verification is not configured. Please try again later.</p>}
          {captchaError && <p className="account-error" role="alert">{captchaError}</p>}
        </div>
        {!isSignup && <p className="account-switch account-forgot"><Link to="/account/password-reset">Forgot password?</Link></p>}
        {error && <p className="account-error">{error}</p>}
        <button type="submit" disabled={saving || !RECAPTCHA_SITE_KEY || !captchaToken}>{saving ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}</button>
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