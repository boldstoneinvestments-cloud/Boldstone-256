import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const configuredBackend = import.meta.env.VITE_API_URL
const API = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend.replace(/\/$/, '') : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/lease-applications', label: 'Lease applications' },
  { to: '/admin/blog', label: 'Blog manager' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const logout = async () => {
    await fetch(`${API}/api/admin/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
    navigate('/admin/sign-in')
  }

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
        <div className="admin-sidebar-brand"><span className="admin-brand-mark">B</span><div><strong>Boldstone</strong><small>Admin workspace</small></div><button className="admin-close-button" aria-label="Close admin menu" onClick={() => setOpen(false)}>Close</button></div>
        <nav className="admin-sidebar-nav" aria-label="Admin pages">
          <span className="admin-nav-label">Workspace</span>
          {links.map(link => <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)}><span>{link.label}</span></NavLink>)}
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer">View website</a>
          <button onClick={logout}>Sign out</button>
        </div>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  )
}
