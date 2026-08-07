import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope, faLocationDot, faPaperPlane, faUser, faFile, faPencil } from '@fortawesome/free-solid-svg-icons'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [agreed, setAgreed] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    if (!agreed) return setErr('Please agree to the privacy policy and terms of service.')
    setErr('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setAgreed(false)
    } catch {
      setErr('Failed to send message. Please try again.')
    }
  }

  const inputBox = {
    width: '100%', background: 'rgba(15,25,45,0.8)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8, padding: '14px 44px 14px 16px', fontSize: 14,
    color: 'rgba(255,255,255,0.35)', outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh', fontFamily: "'Inter','Segoe UI',sans-serif",
      background: '#0a1628',
      position: 'relative', overflow: 'hidden', paddingBottom: isMobile ? 40 : 0,
    }}>

      {/* ── dot pattern overlay ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* ── glow blobs ── */}
      <div style={{ position: 'absolute', top: '-8%', left: '-4%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,137,114,0.13) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '25%', left: '8%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,137,114,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* ── plant image bottom-right ── */}
      <img
        src="https://address-restaurant2.odoo.com/web/image/1984-0a7897c7/Image%20plant.webp"
        alt=""
        style={{ position: 'absolute', bottom: 0, right: isMobile ? -60 : -120, width: isMobile ? 320 : 480, pointerEvents: 'none', opacity: 0.9 }}
      />

      {/* ── white glow top-right ── */}
      <div style={{ position: 'absolute', top: '5%', right: '2%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,220,255,0.08) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(10px)' }} />

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '36px 20px 40px' : '56px 48px 40px', position: 'relative', zIndex: 1 }}>

        {/* ── TWO COLUMN GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '420px 1fr', gap: isMobile ? 32 : 40, alignItems: 'start', marginBottom: 28 }}>

          {/* ════ LEFT PANEL ════ */}
          <div>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#0f8972' }}>Contact Us</span>
            </div>

            {/* Heading */}
            <h1 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', lineHeight: 1.4, letterSpacing: '-0.01em', marginBottom: 18 }}>
              We'd love to hear<br />from you
            </h1>

            {/* Subtext */}
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, marginBottom: 32, maxWidth: 340 }}>
              Have a question, partnership idea, or need support?<br />Our team is ready to assist you.
            </p>

            {/* Thin divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 32 }} />

            {/* Contact items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 26, marginBottom: 32 }}>
              {[
                { icon: faLocationDot, label: 'Office', lines: ['Nyabukara, Fort Portal, Uganda'] },
                { icon: faPhone, label: 'Phone', lines: ['+256 785688921 / 0787964572'], href: 'tel:+256785688921' },
                { icon: faEnvelope, label: 'Email', lines: ['boldstone.investments@gmail.com'], href: 'mailto:boldstone.investments@gmail.com' },

              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(10,20,40,0.9)', border: '1px solid rgba(15,137,114,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 0 1px rgba(15,137,114,0.1)',
                  }}>
                    <FontAwesomeIcon icon={item.icon} style={{ color: '#0f8972', fontSize: 16 }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{item.label}</p>
                    {item.lines.map((l, j) => (
                      item.href
                        ? <a key={j} href={item.href} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', lineHeight: 1.65 }}>{l}</a>
                        : <p key={j} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.65 }}>{l}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Thin divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 24 }} />

            {/* Connect with us — desktop only */}
            {!isMobile && (
              <>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Connect with us</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { label: 'LinkedIn', href: 'https://www.boldstoneinvestments.com/website/social/linkedin', bg: '#0A66C2', icon: <svg width={15} height={15} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                    { label: 'Instagram', href: 'https://www.boldstoneinvestments.com/website/social/instagram', bg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)', icon: <svg width={15} height={15} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
                    { label: 'WhatsApp', href: 'https://wa.me/256785688921', bg: '#25D366', icon: <svg width={15} height={15} fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                      style={{ width: 42, height: 42, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: 'opacity 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    >{s.icon}</a>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ════ RIGHT — FORM CARD ════ */}
          <div style={{
            background: 'rgba(8,16,32,0.85)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, padding: '36px 36px 32px',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>

            {/* Card header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(15,137,114,0.12)', border: '1px solid rgba(15,137,114,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width={24} height={24} fill="none" stroke="#0f8972" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>Send us a message</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: '3px 0 0' }}>Fill out the form below and we'll get back to you.</p>
              </div>
            </div>

            {sent && (
              <div style={{ background: 'rgba(15,137,114,0.12)', border: '1px solid rgba(15,137,114,0.3)', borderRadius: 8, padding: '12px 16px', color: '#0f8972', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
                ✓ Message sent! We'll be in touch soon.
              </div>
            )}
            {err && (
              <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 8, padding: '12px 16px', color: '#f87171', fontSize: 14, marginBottom: 20 }}>
                ✗ {err}
              </div>
            )}

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Name + Email */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                {[
                  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', icon: faUser },
                  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email', icon: faEnvelope },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 8 }}>{f.label}</label>
                    <div style={{ position: 'relative' }}>
                      <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={handle} required
                        style={inputBox}
                        onFocus={e => e.target.style.borderColor = 'rgba(15,137,114,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                      />
                      <FontAwesomeIcon icon={f.icon} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.18)', fontSize: 13, pointerEvents: 'none' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Subject */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 8 }}>Subject</label>
                <div style={{ position: 'relative' }}>
                  <input name="subject" type="text" placeholder="What is this regarding?" value={form.subject} onChange={handle}
                    style={inputBox}
                    onFocus={e => e.target.style.borderColor = 'rgba(15,137,114,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <FontAwesomeIcon icon={faFile} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.18)', fontSize: 13, pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 8 }}>Message</label>
                <div style={{ position: 'relative' }}>
                  <textarea name="message" placeholder="Type your message here..." value={form.message} onChange={handle} required rows={6}
                    style={{ ...inputBox, resize: 'none', lineHeight: 1.7, paddingRight: 16 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(15,137,114,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <FontAwesomeIcon icon={faPencil} style={{ position: 'absolute', right: 14, bottom: 14, color: 'rgba(255,255,255,0.18)', fontSize: 13, pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Checkbox */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} required
                  style={{ marginTop: 2, accentColor: '#0f8972', width: 15, height: 15, flexShrink: 0 }}
                />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                  I agree to the{' '}
                  <a href="#" style={{ color: '#0f8972', textDecoration: 'none' }}>privacy policy</a>
                  {' '}and{' '}
                  <a href="#" style={{ color: '#0f8972', textDecoration: 'none' }}>terms of service</a>.
                </span>
              </label>

              {/* Submit button */}
              <button type="submit"
                style={{ background: 'linear-gradient(90deg, #0f8972 0%, #12a688 100%)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '16px', borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, letterSpacing: 0.3, transition: 'opacity 0.2s, transform 0.2s', boxShadow: '0 8px 24px rgba(15,137,114,0.3)' }}
                onMouseOver={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Connect with us — mobile only, after form */}
        {isMobile && (
          <div style={{ marginTop: 32 }}>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 24 }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Connect with us</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { label: 'LinkedIn', href: 'https://www.boldstoneinvestments.com/website/social/linkedin', bg: '#0A66C2', icon: <svg width={15} height={15} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                { label: 'Instagram', href: 'https://www.boldstoneinvestments.com/website/social/instagram', bg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)', icon: <svg width={15} height={15} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
                { label: 'WhatsApp', href: 'https://wa.me/256785688921', bg: '#25D366', icon: <svg width={15} height={15} fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  style={{ width: 42, height: 42, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: 'opacity 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >{s.icon}</a>
              ))}
            </div>
          </div>
        )}

      </div>

      <style>{`
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
      `}</style>
    </div>
  )
}
