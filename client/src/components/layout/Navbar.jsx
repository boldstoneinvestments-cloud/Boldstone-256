import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/investors', label: 'Investors' },
  { to: '/farmers', label: 'Farmers' },
  { to: '/partnership', label: 'Partnership' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

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

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
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
          <NavLink
            to="/contact"
            style={{ background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Contact Us
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          className="hamburger"
        >
          <svg width={24} height={24} fill="none" stroke="#374151" strokeWidth={2} viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
              style={({ isActive }) => ({ fontSize: 15, fontWeight: 600, color: isActive ? '#0f8972' : '#374151', textDecoration: 'none' })}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/contact" onClick={() => setOpen(false)}
            style={{ background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 8, textDecoration: 'none', textAlign: 'center' }}
          >
            Contact Us
          </NavLink>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
