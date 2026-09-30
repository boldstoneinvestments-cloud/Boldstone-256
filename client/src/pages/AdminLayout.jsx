import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

const configuredBackend = import.meta.env.VITE_API_URL
const API = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend.replace(/\/$/, '') : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/lease-applications', label: 'Lease applications' },
  { to: '/admin/chat', label: 'Chat messages' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/activity', label: 'Activity' },
  { to: '/admin/blog', label: 'Blog manager' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const [loginSession] = useState(() => location.state?.adminSession || null)
  const [loginTwoFactor] = useState(() => location.state?.twoFactor || null)
  const [loginPendingIdentity] = useState(() => location.state?.pendingIdentity || null)
  const [open, setOpen] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [identity, setIdentity] = useState(null)
  const [identities, setIdentities] = useState([])
  const [identitySaving, setIdentitySaving] = useState(false)
  const [identityError, setIdentityError] = useState('')
  const [twoFactor, setTwoFactor] = useState(loginTwoFactor)
  const [pendingIdentity, setPendingIdentity] = useState(loginPendingIdentity)
  const [verificationCode, setVerificationCode] = useState('')
  const [useRecoveryCode, setUseRecoveryCode] = useState(false)
  const [recoveryCodes, setRecoveryCodes] = useState([])
  const verificationInFlight = useRef(false)

  useEffect(() => {
    let active = true
    if (loginSession?.authenticated && Array.isArray(loginSession.identities)) {
      setIdentities(loginSession.identities)
      setIdentity(loginSession.identity || null)
      setAuthorized(true)
      return () => { active = false }
    }
    fetch(`${API}/api/admin/session`, { credentials: 'include' })
      .then(response => response.ok ? response.json() : null)
      .then(session => {
        if (!active) return
        if (!session?.authenticated) {
          navigate('/admin/sign-in', { replace: true })
          return
        }
        setIdentities(session.identities || [])
        setIdentity(session.identity || null)
        setAuthorized(true)
      })
      .catch(() => {
        if (active) navigate('/admin/sign-in', { replace: true })
      })
    return () => { active = false }
  }, [loginSession, navigate])

  useEffect(() => {
    if (!authorized || !identity) return undefined
    const sendPresence = () => fetch(`${API}/api/admin/presence`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname }),
    }).catch(() => {})
    sendPresence()
    const interval = window.setInterval(sendPresence, 20000)
    return () => window.clearInterval(interval)
  }, [authorized, identity, pathname])

  const chooseIdentity = async identityName => {
    setIdentitySaving(true)
    setIdentityError('')
    try {
      const response = await fetch(`${API}/api/admin/identity`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity_name: identityName }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to save the selected identity.')
      if (data.two_factor_required) {
        setPendingIdentity(identities.find(option => option.name === identityName))
        setTwoFactor(data)
        setVerificationCode('')
        setUseRecoveryCode(false)
      } else {
        setIdentity(data.identity)
      }
    } catch (error) {
      setIdentityError(error.message || 'Unable to save the selected identity.')
    } finally {
      setIdentitySaving(false)
    }
  }

  const changeIdentity = async () => {
    setIdentitySaving(true)
    setIdentityError('')
    try {
      const response = await fetch(`${API}/api/admin/identity`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity_name: '' }),
      })
      if (!response.ok) throw new Error('Unable to change the selected identity.')
      setIdentity(null)
      setTwoFactor(null)
      setPendingIdentity(null)
    } catch (error) {
      setIdentityError(error.message || 'Unable to change the selected identity.')
    } finally {
      setIdentitySaving(false)
    }
  }

  const logout = async () => {
    await fetch(`${API}/api/admin/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
    navigate('/admin/sign-in')
  }

  const verifyIdentity = async (event, code = verificationCode) => {
    event?.preventDefault()
    if (verificationInFlight.current) return
    verificationInFlight.current = true
    setIdentitySaving(true)
    setIdentityError('')
    try {
      const response = await fetch(`${API}/api/admin/2fa/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(useRecoveryCode
          ? { recovery_code: code }
          : { token: code }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Verification failed. Try again.')
      if (data.recovery_codes?.length) {
        setRecoveryCodes(data.recovery_codes)
        setTwoFactor({ recovery_codes_ready: true })
      } else {
        setIdentity(pendingIdentity)
        setTwoFactor(null)
      }
    } catch (error) {
      setIdentityError(error.message || 'Verification failed. Try again.')
    } finally {
      verificationInFlight.current = false
      setIdentitySaving(false)
    }
  }

  const finishRecoverySetup = () => {
    setIdentity(pendingIdentity)
    setTwoFactor(null)
    setPendingIdentity(null)
    setRecoveryCodes([])
  }

  const copySetupSecret = async () => {
    try {
      await navigator.clipboard.writeText(twoFactor.secret)
    } catch {
      setIdentityError('Copy failed. Select and copy the setup key instead.')
    }
  }

  if (!authorized) return <main className="admin-auth-check" aria-busy="true"><span className="admin-loading-spinner" aria-hidden="true" /><span>Opening admin...</span></main>
  if (!identity) return <main className="admin-identity-page">
    <section className="admin-login-story admin-identity-story" aria-label="Boldstone admin workspace">
      <div className="admin-login-story-top">
        <img src="https://res.cloudinary.com/cwj8d38f/image/upload/v1789729870/Boldstone_logo_hiv7pl.jpg" alt="" />
        <span>Boldstone <i /> Workspace</span>
      </div>
      <div className="admin-login-story-copy">
        <span className="admin-login-kicker">A shared purpose</span>
        <h2>One team.<br /><em>One identity.</em></h2>
        <p>Choose the profile that represents you. Your actions and conversations will be connected to this identity.</p>
      </div>
      <div className="admin-login-story-foot">
        <span className="admin-login-status-dot" />
        <span>Private workspace <b>·</b> Secure access</span>
        <span className="admin-login-story-index">02 <i /> 03</span>
      </div>
      <div className="admin-login-orbit admin-login-orbit-one" aria-hidden="true" />
      <div className="admin-login-orbit admin-login-orbit-two" aria-hidden="true" />
      <span className="admin-login-story-coordinate" aria-hidden="true">0° 20' 12.0&quot; N&nbsp;&nbsp; 32° 34' 55.0&quot; E</span>
    </section>

    <section className="admin-login-workspace admin-identity-workspace">
      <div className="admin-login-mobile-brand"><span>Boldstone</span><i /> Admin workspace</div>
      <div className="admin-identity-panel" aria-busy={identitySaving}>
        {!twoFactor && <div className="admin-identity-2fa-banner" role="note">
          <span className="admin-identity-banner-icon" aria-hidden="true">2F</span>
          <span><strong>Authenticator setup required</strong><small>Each admin identity has its own two-factor setup. Select a profile to set it up if this is its first use; otherwise, enter that profile's authenticator code.</small></span>
        </div>}
        {!twoFactor && <>
          <div className="admin-identity-heading">
            <span className="admin-login-kicker">ADMIN SIGN-IN</span>
            <span className="admin-identity-step"><b>01</b><i /><span>02</span></span>
          </div>
          <h1>Choose your identity</h1>
          <p className="admin-identity-intro">Your activity and chat replies will be attributed to this profile.</p>
          <div className="admin-identity-options">
            {identities.map((option, index) => <button key={option.name} type="button" disabled={identitySaving} onClick={() => chooseIdentity(option.name)}>
              <span className="admin-identity-avatar-wrap"><img src={option.avatar} alt="" />{identitySaving && <span className="admin-identity-avatar-spinner"><span className="admin-loading-spinner" /></span>}</span>
              <span className="admin-identity-profile-copy"><small>PROFILE 0{index + 1}</small><strong>{option.name}</strong></span>
              <span className="admin-identity-profile-arrow" aria-hidden="true">↗</span>
            </button>)}
          </div>
        </>}
        {twoFactor && !twoFactor.recovery_codes_ready && <>
          <div className="admin-identity-heading">
            <span className="admin-login-kicker">TWO-FACTOR AUTHENTICATION</span>
            <span className="admin-identity-step"><b>02</b><i /><span>02</span></span>
          </div>
          <h1>{twoFactor.setup_required ? 'Set up your authenticator' : 'Verify your identity'}</h1>
          <p className="admin-identity-intro">{twoFactor.setup_required ? `Set up two-factor authentication for ${pendingIdentity?.name}.` : `Enter the current code for ${pendingIdentity?.name}.`}</p>
          {twoFactor.setup_required && <div className="admin-identity-setup">
            <div className="admin-identity-qr">
              <QRCodeSVG
                value={twoFactor.provisioning_uri}
                size={208}
                level="H"
                includeMargin
                imageSettings={{
                  src: 'https://res.cloudinary.com/cwj8d38f/image/upload/v1789729870/Boldstone_logo_hiv7pl.jpg',
                  width: 48,
                  height: 36,
                  excavate: true,
                }}
                title={`Authenticator setup QR code for ${pendingIdentity?.name || 'admin identity'}`}
              />
            </div>
            <p className="admin-identity-qr-help">Scan this code with Google Authenticator, Microsoft Authenticator, or another TOTP app.</p>
            <button type="button" onClick={copySetupSecret}><span aria-hidden="true">▣</span> Copy setup key</button>
            <details><summary>Can't scan? Enter setup key manually</summary><code>{twoFactor.secret}</code><p>Time-based one-time password (TOTP), 6 digits, 30-second interval.</p></details>
          </div>}
          <form className="admin-identity-verify-form" onSubmit={verifyIdentity} aria-busy={identitySaving}>
            <label htmlFor="admin-verification-code">{useRecoveryCode ? 'Recovery code' : 'Authenticator code'}</label>
            <input id="admin-verification-code" autoFocus value={verificationCode} onChange={event => {
              const code = useRecoveryCode
                ? event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 13)
                : event.target.value.replace(/\D/g, '').slice(0, 6)
              setVerificationCode(code)
              if (!useRecoveryCode && code.length === 6) verifyIdentity(null, code)
            }} placeholder={useRecoveryCode ? 'Enter your recovery code' : '000000'} inputMode={useRecoveryCode ? 'text' : 'numeric'} autoComplete="one-time-code" maxLength={useRecoveryCode ? 24 : 16} required />
            {!useRecoveryCode && <small className="admin-identity-code-hint">Enter the current six-digit code. It refreshes every 30 seconds.</small>}
            {!twoFactor.setup_required && <button type="button" className="admin-identity-recovery-toggle" onClick={() => { setUseRecoveryCode(value => !value); setVerificationCode('') }}>{useRecoveryCode ? 'Use authenticator code' : 'Use recovery code'}</button>}
            <button className="admin-identity-primary" type="submit" disabled={identitySaving || !verificationCode}>
              {identitySaving
                ? <span className="auth-action-progress" role="status"><span className="admin-loading-spinner" aria-hidden="true" />Checking code...</span>
                : twoFactor.setup_required ? 'Verify and enable' : 'Verify identity'}
              {!identitySaving && <span aria-hidden="true">→</span>}
            </button>
          </form>
        </>}
        {twoFactor?.recovery_codes_ready && <div className="admin-identity-recovery-state">
          <span className="admin-identity-recovery-mark" aria-hidden="true">✓</span>
          <div className="admin-identity-heading">
            <span className="admin-login-kicker">SETUP COMPLETE</span>
            <span className="admin-identity-step"><b>02</b><i /><span>02</span></span>
          </div>
          <h1>Save your recovery codes</h1>
          <p className="admin-identity-intro">These codes work once each. Store them somewhere private before continuing.</p>
          <div className="admin-identity-recovery-codes">{recoveryCodes.map(code => <code key={code}>{code}</code>)}</div>
          <button className="admin-identity-copy-codes" type="button" onClick={() => navigator.clipboard.writeText(recoveryCodes.join('\n')).catch(() => setIdentityError('Copy failed. Select and copy the codes instead.'))}>Copy recovery codes</button>
          <button className="admin-identity-primary" type="button" disabled={identitySaving} onClick={finishRecoverySetup}>I saved the recovery codes <span aria-hidden="true">→</span></button>
        </div>}
        {identityError && <p className="admin-identity-error" role="alert">{identityError}</p>}
        {!twoFactor && <button className="admin-identity-signout" type="button" onClick={logout}>Sign out</button>}
      </div>
      <footer className="admin-login-footer"><span>© {new Date().getFullYear()} Boldstone Investments</span><span>Need help? <a href="mailto:boldstone.investments@gmail.com">Contact support</a></span></footer>
    </section>
  </main>

  return (
    <div className="admin-shell">
      <header className="admin-mobile-header">
        <button className="admin-back-button" aria-label="Go back" onClick={() => navigate(-1)}>
          <span aria-hidden="true" />
          <span>Back</span>
        </button>
        <button className="admin-menu-button" aria-label="Open admin menu" onClick={() => setOpen(true)}>
          <span aria-hidden="true"><i /><i /><i /></span>
        </button>
      </header>
      {open && <button className="admin-menu-backdrop" aria-label="Close admin menu" onClick={() => setOpen(false)} />}
      <aside className={`admin-sidebar${open ? ' is-open' : ''}`}>
        <div className="admin-sidebar-brand"><img className="admin-brand-mark" src="https://res.cloudinary.com/cwj8d38f/image/upload/v1789729870/Boldstone_logo_hiv7pl.jpg" alt="Boldstone Investments" /><div><strong>Boldstone</strong><small>Admin workspace</small></div><button className="admin-close-button" aria-label="Close admin menu" onClick={() => setOpen(false)}>Close</button></div>
        <nav className="admin-sidebar-nav" aria-label="Admin pages">
          <span className="admin-nav-label">Workspace</span>
          {links.map(link => <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)}><span>{link.label}</span></NavLink>)}
        </nav>
        <div className="admin-sidebar-identity">
          <img src={identity.avatar} alt="" />
          <div><small>Working as</small><strong>{identity.name}</strong></div>
          <button type="button" onClick={changeIdentity} disabled={identitySaving}>Change</button>
        </div>
        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer">View website</a>
          <button onClick={logout}>Sign out</button>
        </div>
      </aside>
      <main className="admin-main"><Outlet context={{ identity }} /></main>
    </div>
  )
}
