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
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full px-8 flex items-center justify-between h-16">
        <NavLink to="/" className="text-2xl font-black text-[#0d1f1c] tracking-tight">
          Bold<span className="text-[#0f8972]">stone</span>
        </NavLink>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-base font-semibold transition-colors ${isActive ? 'text-[#0f8972] font-bold' : 'text-gray-700 hover:text-[#0f8972]'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/partnership"
            className="bg-[#0f8972] text-white text-base font-bold px-5 py-2 rounded-lg hover:bg-[#0d7a65] transition-colors"
          >
            Become a Partner
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? 'text-[#0f8972]' : 'text-gray-600'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
