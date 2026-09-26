import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

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
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [identity, setIdentity] = useState(null)
  const [identities, setIdentities] = useState([])
  const [identitySaving, setIdentitySaving] = useState(false)
  const [identityError, setIdentityError] = useState('')

  useEffect(() => {
    let active = true
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
  }, [navigate])

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
      setIdentity(data.identity)
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

  if (!authorized) return <main className="admin-auth-check" aria-busy="true">Checking admin access...</main>
  if (!identity) return <main className="admin-identity-page">
    <section className="admin-identity-panel">
      <span className="admin-eyebrow">Admin sign-in</span>
      <h1>Choose your identity</h1>
      <p>Your activity and chat replies will be attributed to this profile.</p>
      <div className="admin-identity-options">
        {identities.map(option => <button key={option.name} type="button" disabled={identitySaving} onClick={() => chooseIdentity(option.name)}>
          <img src={option.avatar} alt="" />
          <span>{option.name}</span>
        </button>)}
      </div>
      {identityError && <p className="account-error" role="alert">{identityError}</p>}
      <button className="admin-identity-signout" type="button" onClick={logout}>Sign out</button>
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
