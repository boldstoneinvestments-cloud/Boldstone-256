import { useEffect, useState } from 'react'
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
  const [open, setOpen] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [identity, setIdentity] = useState(null)
  const [identities, setIdentities] = useState([])
  const [identitySaving, setIdentitySaving] = useState(false)
  const [identityError, setIdentityError] = useState('')
  const [twoFactor, setTwoFactor] = useState(null)
  const [pendingIdentity, setPendingIdentity] = useState(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [useRecoveryCode, setUseRecoveryCode] = useState(false)
  const [recoveryCodes, setRecoveryCodes] = useState([])

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

  const verifyIdentity = async event => {
    event.preventDefault()
    setIdentitySaving(true)
    setIdentityError('')
    try {
      const response = await fetch(`${API}/api/admin/2fa/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(useRecoveryCode
          ? { recovery_code: verificationCode }
          : { token: verificationCode }),
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

  if (!authorized) return <main className="admin-auth-check" aria-busy="true">Checking admin access...</main>
  if (!identity) return <main className="admin-identity-page">
    <section className="admin-identity-panel">
      {!twoFactor && <div className="admin-identity-2fa-banner" role="note">
        <strong>Authenticator setup required</strong>
        <span>Each admin identity has its own two-factor setup. Select a profile to set it up if this is its first use; otherwise, enter that profile's authenticator code.</span>
      </div>}
      <span className="admin-eyebrow">Admin sign-in</span>
      {!twoFactor && <>
        <h1>Choose your identity</h1>
        <p>Your activity and chat replies will be attributed to this profile.</p>
        <div className="admin-identity-options">
          {identities.map(option => <button key={option.name} type="button" disabled={identitySaving} onClick={() => chooseIdentity(option.name)}>
            <img src={option.avatar} alt="" />
            <span>{option.name}</span>
          </button>)}
        </div>
      </>}
      {twoFactor && !twoFactor.recovery_codes_ready && <>
        <h1>{twoFactor.setup_required ? `Set up 2FA for ${pendingIdentity?.name}` : `Verify ${pendingIdentity?.name}`}</h1>
        <p>{twoFactor.setup_required ? 'Add this identity to your authenticator app, then enter its six-digit code.' : 'Enter the current code from the authenticator assigned to this identity.'}</p>
        {twoFactor.setup_required && <div className="admin-identity-setup">
          <div className="admin-identity-qr">
            <QRCodeSVG value={twoFactor.provisioning_uri} size={208} level="M" includeMargin title={`Authenticator setup QR code for ${pendingIdentity?.name || 'admin identity'}`} />
          </div>
          <p className="admin-identity-qr-help">Scan with Google Authenticator, Microsoft Authenticator, or another TOTP app.</p>
          <button type="button" onClick={copySetupSecret}>Copy setup key</button>
          <details><summary>Can't scan? Enter setup key manually</summary><code>{twoFactor.secret}</code><p>Time-based one-time password (TOTP), 6 digits, 30-second interval.</p></details>
        </div>}
        <form onSubmit={verifyIdentity}>
          <input autoFocus value={verificationCode} onChange={event => setVerificationCode(event.target.value)} placeholder={useRecoveryCode ? 'Recovery code' : '6-digit code'} inputMode={useRecoveryCode ? 'text' : 'numeric'} autoComplete="one-time-code" maxLength={useRecoveryCode ? 13 : 6} required />
          {!twoFactor.setup_required && <button type="button" className="admin-identity-recovery-toggle" onClick={() => { setUseRecoveryCode(value => !value); setVerificationCode('') }}>{useRecoveryCode ? 'Use authenticator code' : 'Use recovery code'}</button>}
          <button type="submit" disabled={identitySaving || !verificationCode}>{identitySaving ? 'Verifying...' : twoFactor.setup_required ? 'Verify and enable' : 'Verify identity'}</button>
        </form>
      </>}
      {twoFactor?.recovery_codes_ready && <>
        <h1>Save {pendingIdentity?.name} recovery codes</h1>
        <p>Each code works once. Store these securely before continuing.</p>
        <div className="admin-identity-recovery-codes">{recoveryCodes.map(code => <code key={code}>{code}</code>)}</div>
        <button className="admin-identity-recovery-toggle" type="button" onClick={() => navigator.clipboard.writeText(recoveryCodes.join('\n')).catch(() => setIdentityError('Copy failed. Select and copy the codes instead.'))}>Copy recovery codes</button>
        <button type="button" disabled={identitySaving} onClick={finishRecoverySetup}>I saved the recovery codes</button>
      </>}
      {identityError && <p className="account-error" role="alert">{identityError}</p>}
      {!twoFactor && <button className="admin-identity-signout" type="button" onClick={logout}>Sign out</button>}
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
