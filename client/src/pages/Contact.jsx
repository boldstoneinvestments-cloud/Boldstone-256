import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setErr('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setErr('Failed to send message. Please try again.')
    }
  }

  return (
    <div style={{ background: '#f4f8f7', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#0f8972', marginBottom: 8 }}>Get In Touch</p>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#0d1f1c', marginBottom: 12, lineHeight: 1.1 }}>Contact Us</h1>
        <p style={{ fontSize: 15, color: '#555', marginBottom: 48, maxWidth: 520 }}>
          Have a question or want to partner with us? Fill in the form and we'll get back to you as soon as possible.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 40, alignItems: 'start' }}>

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { icon: faLocationDot, label: 'Address', value: 'Kyenjojo District, Uganda' },
              { icon: faPhone, label: 'Phone', value: '+256 700 000 000' },
              { icon: faEnvelope, label: 'Email', value: 'boldstone.investments@gmail.com' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(15,137,114,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FontAwesomeIcon icon={item.icon} style={{ color: '#0f8972', fontSize: 18 }} />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#999', marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0d1f1c' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {sent && (
              <div style={{ background: '#e6f4f1', border: '1px solid #0f8972', borderRadius: 8, padding: '12px 16px', color: '#0f8972', fontSize: 14, fontWeight: 600 }}>
                ✓ Message sent! We'll be in touch soon.
              </div>
            )}
            {err && (
              <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: 8, padding: '12px 16px', color: '#dc2626', fontSize: 14, fontWeight: 600 }}>
                ✗ {err}
              </div>
            )}
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
              { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+256 700 000 000' },
            ].map(f => (
              <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#0d1f1c' }}>{f.label}</label>
                <input
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handle}
                  required
                  style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: '#0d1f1c', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#0f8972'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0d1f1c' }}>Message</label>
              <textarea
                name="message"
                placeholder="Tell us how we can help..."
                value={form.message}
                onChange={handle}
                required
                rows={5}
                style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: '#0d1f1c', outline: 'none', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#0f8972'}
                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
            <button type="submit" style={{ background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => e.target.style.background = '#0d7a65'}
              onMouseOut={e => e.target.style.background = '#0f8972'}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
