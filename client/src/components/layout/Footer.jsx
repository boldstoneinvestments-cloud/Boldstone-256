import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/farmers', label: 'For Farmers' },
  { to: '/lease-a-coffee-farm', label: 'Lease A Coffee Farm' },
  { to: '/partnership', label: 'Partnerships' },
  { to: '/about', label: 'About Us' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact Us' },
]

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.boldstoneinvestments.com/website/social/linkedin',
    bg: '#0A66C2',
    icon: (
      <svg width={18} height={18} fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.boldstoneinvestments.com/website/social/instagram',
    bg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
    icon: (
      <svg width={18} height={18} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/256785688921',
    bg: '#25D366',
    icon: (
      <svg width={18} height={18} fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <footer style={{ background: '#0f8972', color: '#fff', fontFamily: 'inherit' }}>

      {/* Main footer body */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 40px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48 }}>

        {/* Brand column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <NavLink to="/">
            <img
              src="https://address-restaurant2.odoo.com/web/image/1959-1ec89697/Boldstone%20logo.webp"
              alt="Boldstone"
              style={{ height: 64, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', alignSelf: 'flex-start' }}
            />
          </NavLink>
          <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.8, color: '#fff', maxWidth: 280, margin: 0 }}>
            Boldstone Property Investments is a diversified alternative asset investment firm with specialist expertise in commercial coffee farming, processing and trade in Uganda and East Africa.
          </p>

        </div>

        {/* Quick Links */}
        <div>
          <p style={{ fontSize: 16, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', color: '#000', marginBottom: 20, margin: '0 0 20px' }}>
            Quick Links
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {quickLinks.map(({ to, label }) => (
              <NavLink key={to} to={to}
                style={{ fontSize: 14, fontWeight: 500, color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = '#000'}
                onMouseOut={e => e.currentTarget.style.color = '#fff'}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0, display: 'inline-block' }} />
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p style={{ fontSize: 16, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', color: '#000', margin: '0 0 20px' }}>
            Get In Touch
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                icon: <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
                text: 'boldstone.investments@gmail.com',
                href: 'mailto:boldstone.investments@gmail.com',
              },
              {
                icon: <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
                text: '+256 785688921 / 0787964572',
                href: 'tel:+256785688921',
              },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ marginTop: 2, color: '#fff', flexShrink: 0 }}>{item.icon}</span>
                {item.href
                  ? <a href={item.href} style={{ fontSize: 14, fontWeight: 500, color: '#fff', textDecoration: 'none' }}>{item.text}</a>
                  : <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{item.text}</span>
                }
              </div>
            ))}
          </div>

          {/* Connect with us — desktop only, inside Get In Touch */}
          {!isMobile && (
            <div style={{ marginTop: 36 }}>
              <p style={{ fontSize: 16, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', color: '#000', marginBottom: 12 }}>Connect with us</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {socials.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                    style={{ width: 36, height: 36, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'opacity 0.2s', textDecoration: 'none' }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Socials — mobile only, below all columns */}
      {isMobile && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px 40px' }}>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 14 }}>Connect with us</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'opacity 0.2s', textDecoration: 'none' }}
                  onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#fff', margin: 0 }}>
            © {new Date().getFullYear()} Boldstone Property Investments LLC. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Use'].map(label => (
              <a key={label} href="#" style={{ fontSize: 14, fontWeight: 500, color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = '#000'}
                onMouseOut={e => e.currentTarget.style.color = '#fff'}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}
