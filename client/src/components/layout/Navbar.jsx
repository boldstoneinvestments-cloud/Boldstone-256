import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/farmers', label: 'For Farmers' },
  { to: '/lease-a-coffee-farm', label: 'Lease A Coffee Farm' },
  { to: '/partnership', label: 'Partnerships' },
  { to: '/about', label: 'About Us' },
  { to: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false) }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 100, maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>

        {/* Logo */}
        <NavLink to="/">
          <img
            src="https://address-restaurant2.odoo.com/web/image/1959-1ec89697/Boldstone%20logo.webp"
            alt="Boldstone"
            style={{ height: 90, width: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </NavLink>

        {/* Desktop links + Contact Us */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1 }} className="desktop-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginLeft: 40 }}>
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                style={({ isActive }) => ({
                  fontSize: 15,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#0f8972' : '#374151',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <NavLink
              to="/contact"
              style={{ background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              Contact Us
            </NavLink>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, transition: 'background 0.2s' }}
          className="hamburger"
          aria-label="Toggle menu"
        >
          <svg width={24} height={24} fill="none" stroke="#374151" strokeWidth={2} viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          display: 'none',
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 40, opacity: open ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: open ? 'auto' : 'none',
        }}
        className="mobile-backdrop"
      />

      {/* Mobile drawer */}
      <div
        ref={menuRef}
        style={{
          display: 'none',
          position: 'fixed', top: 0, right: 0, height: '100vh', width: '75%', maxWidth: 320,
          background: '#fff', zIndex: 50, boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
        }}
        className="mobile-drawer"
      >
        {/* Drawer header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <NavLink to="/" onClick={() => setOpen(false)}>
            <img
              src="https://address-restaurant2.odoo.com/web/image/1959-1ec89697/Boldstone%20logo.webp"
              alt="Boldstone"
              style={{ height: 48, width: 'auto', objectFit: 'contain' }}
            />
          </NavLink>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <svg width={22} height={22} fill="none" stroke="#374151" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer links */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 0', flex: 1 }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                fontSize: 15, fontWeight: 600,
                color: isActive ? '#0f8972' : '#374151',
                textDecoration: 'none',
                padding: '14px 24px',
                borderLeft: isActive ? '3px solid #0f8972' : '3px solid transparent',
                background: isActive ? 'rgba(15,137,114,0.05)' : 'transparent',
                transition: 'all 0.2s',
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Drawer CTA */}
        <div style={{ padding: '16px 24px 56px', borderTop: '1px solid #e5e7eb' }}>
          <NavLink to="/contact" onClick={() => setOpen(false)}
            style={{ display: 'block', background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '13px 20px', borderRadius: 8, textDecoration: 'none', textAlign: 'center' }}
          >
            Contact Us
          </NavLink>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
          .mobile-backdrop { display: block !important; }
          .mobile-drawer { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
