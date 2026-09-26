import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app')
  ? configuredBackend.replace(/\/$/, '')
  : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
          setCaptchaError('reCAPTCHA rejected the key or could not connect. Check that it is a v2 checkbox key and both site domains are allowed.')
        },
      })
    }
    const handleLoad = () => renderCaptcha()
    const handleError = () => setCaptchaError('reCAPTCHA could not load. Refresh the page and try again.')
    if (!script) {
      script = document.createElement('script')
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.dataset.googleRecaptcha = 'true'
    }
    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })
    if (!script.isConnected) document.head.appendChild(script)
    if (window.grecaptcha?.ready) window.grecaptcha.ready(renderCaptcha)
    else renderCaptcha()

    return () => {
      active = false
      if (retryTimer !== null) window.clearTimeout(retryTimer)
      script?.removeEventListener('load', handleLoad)
      script?.removeEventListener('error', handleError)
    }
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    if (!captchaToken) {
      setCaptchaError('Please complete the reCAPTCHA check before signing in.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${BACKEND}/api/admin/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, recaptcha_token: captchaToken }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setCaptchaToken('')
        if (captchaWidget.current !== null && window.grecaptcha) window.grecaptcha.reset(captchaWidget.current)
        throw new Error(data.error || 'Unable to sign in. Please try again.')
      }
      navigate('/admin')
    } catch (requestError) {
      setError(requestError.message || 'Invalid admin credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '60vh', background: '#f4f8f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(20px, 6vw, 48px) 16px' }}>
      <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: 'clamp(28px, 8vw, 48px) clamp(20px, 7vw, 40px)', width: '100%', maxWidth: 400, textAlign: 'center', boxSizing: 'border-box' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#0f8972', margin: '0 0 8px' }}>Boldstone</p>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0d1f1c', margin: '0 0 8px' }}>Admin sign in</h1>
        <p style={{ fontSize: 13, color: '#777', margin: '0 0 28px' }}>Sign in to view shop orders.</p>
        <input type="text" placeholder="Username" value={username} onChange={event => setUsername(event.target.value)} required autoComplete="username" style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 0, padding: '12px 14px', fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
        <div className="admin-login-password-field" style={{ position: 'relative', width: '100%' }}>
          <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={event => setPassword(event.target.value)} required autoComplete="current-password" style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 0, padding: '12px 42px 12px 14px', fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
          <button className="password-visibility-toggle" type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'} style={{ position: 'absolute', top: 0, right: 0, display: 'grid', placeItems: 'center', width: 40, height: 44, padding: 0, border: 0, borderRadius: 0, background: 'transparent', color: '#56736d', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} aria-hidden="true" />
          </button>
        </div>
        <div className="signup-recaptcha">
          {RECAPTCHA_SITE_KEY ? <div ref={captchaContainer} /> : <p className="account-error">reCAPTCHA verification is not configured. Please try again later.</p>}
          {captchaError && <p className="account-error" role="alert">{captchaError}</p>}
        </div>
        <p style={{ textAlign: 'right', margin: '0 0 8px', fontSize: 12 }}><Link to="/admin/password-reset" style={{ color: '#0f8972', fontWeight: 700, textDecoration: 'none' }}>Forgot password?</Link></p>
        {error && <p style={{ color: '#dc2626', fontSize: 13, margin: '4px 0 12px' }}>{error}</p>}
        <button type="submit" disabled={loading || !RECAPTCHA_SITE_KEY || !captchaToken} style={{ width: '100%', background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: 13, borderRadius: 0, border: 'none', cursor: loading ? 'wait' : 'pointer', marginTop: 8 }}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="account-divider"><span>or</span></div>
        <button type="button" className="google-account-button" onClick={() => { window.location.href = `${BACKEND}/api/admin/google/start` }}>
          <svg className="google-mark" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z" />
            <path fill="#34A853" d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.55 0-4.7-1.72-5.47-4.03H3.28v2.53A9.75 9.75 0 0 0 12 21.6Z" />
            <path fill="#FBBC05" d="M6.53 13.68A5.86 5.86 0 0 1 6.22 12c0-.58.11-1.15.31-1.68V7.79H3.28A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.06 1.03 4.21l3.25-2.53Z" />
            <path fill="#EA4335" d="M12 6.29c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.39 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.72 5.39l3.25 2.53c.77-2.31 2.92-4.03 5.47-4.03Z" />
          </svg>
          Sign in with Google
        </button>
        {new URLSearchParams(location.search).get('error') && <p style={{ color: '#dc2626', fontSize: 13, margin: '10px 0 0' }}>{new URLSearchParams(location.search).get('error') === 'google_not_admin' ? 'This Google account is not enabled for admin access.' : 'Google sign-in could not be completed. Please try again.'}</p>}
      </form>
    </div>
  )
}
