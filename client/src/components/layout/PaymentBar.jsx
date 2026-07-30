import { useState } from 'react'

const MAIN_METHODS = [
  { label: 'Visa',         logo: './images/Visa logo.png' },
  { label: 'Mastercard',  logo: './images/mastercard-logo.png' },
  { label: 'Amex',        logo: './images/American_Express_logo.webp', raw: true },
  { label: 'Google Pay',  logo: './images/google-pay logo.png' },
  { label: 'Apple Pay',   logo: './images/Apple_Pay-Logo.wine.svg' },
  { label: 'OPay',        logo: './images/opay logo.png' },
  { label: 'MTN MoMo',    logo: './images/MTN MoMo.jpg',              raw: true, mobileMore: true },
  { label: 'Airtel Money', logo: './images/Airtel Money.png',                     mobileMore: true },
]

const protect = { onContextMenu: e => e.preventDefault(), draggable: false }
const protectStyle = { userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }

function Badge({ method }) {
  if (method.raw) {
    return (
      <img
        src={method.logo} alt={method.label} title={method.label}
        {...protect}
        style={{ ...protectStyle, height: '36px', width: 'auto', maxWidth: '72px', objectFit: 'contain', display: 'block', borderRadius: '6px', flexShrink: 0 }}
      />
    )
  }
  return (
    <div
      title={method.label}
      style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '36px', minWidth: '52px', flexShrink: 0 }}
    >
      <img
        src={method.logo} alt={method.label}
        {...protect}
        style={{ ...protectStyle, height: '100%', width: '100%', objectFit: 'contain', display: 'block' }}
      />
    </div>
  )
}

export default function PaymentBar() {
  const [open, setOpen] = useState(false)

  const mainLogos  = MAIN_METHODS.filter(m => !m.mobileMore)
  const moreLogos  = MAIN_METHODS.filter(m => m.mobileMore)

  return (
    <div style={{ background: '#f8fffe', borderTop: '1px solid #e0ede9', borderBottom: '1px solid #e0ede9' }}>
      <div className="bs-wrap" style={{ padding: '12px 24px' }}>

        {/* Top row — lock text + stripe (desktop) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>

          {/* LEFT — lock + text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(15,137,114,0.1)', border: '1px solid rgba(15,137,114,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0f8972" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#0d1f1c', lineHeight: 1.2 }}>Secure &amp; Trusted Payments</p>
              <p style={{ fontSize: '10px', color: '#9ca3af', lineHeight: 1.3, marginTop: '2px' }}>All payments are secure and encrypted</p>
            </div>
          </div>

          {/* RIGHT — Stripe desktop only */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '10px', color: '#9ca3af', whiteSpace: 'nowrap' }}>Payments powered by</span>
            <img src="./images/stripe logo.png" alt="Stripe" {...protect} style={{ ...protectStyle, height: '32px', width: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>
        </div>

        {/* Bottom row — logos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* Always visible logos */}
          {mainLogos.map(m => <Badge key={m.label} method={m} />)}

          {/* MTN + Airtel — visible on desktop, hidden on mobile */}
          {moreLogos.map(m => (
            <div key={m.label} className="hide-mobile">
              <Badge method={m} />
            </div>
          ))}

          {/* More button + inline logos — mobile only, all in one row */}
          <div className="show-mobile" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap', flexShrink: 0 }}>
            {open && moreLogos.map(m => <Badge key={m.label} method={m} />)}
            <button
              onClick={() => setOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '4px 9px', fontSize: '11px', fontWeight: 700, color: '#555', cursor: 'pointer', height: '36px', flexShrink: 0 }}
            >
              {open ? 'Less' : 'More'}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          {/* Stripe — always after logos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '4px' }}>
            <span style={{ fontSize: '10px', color: '#9ca3af', whiteSpace: 'nowrap' }}>Powered by</span>
            <img src="./images/stripe logo.png" alt="Stripe" {...protect} style={{ ...protectStyle, height: '32px', width: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>

        </div>
      </div>
    </div>
  )
}
