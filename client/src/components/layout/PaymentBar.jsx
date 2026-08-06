const MAIN_METHODS = [
  { label: 'Visa',         logo: './images/Visa logo.png' },
  { label: 'Mastercard',  logo: './images/mastercard-logo.png' },
  { label: 'Amex',        logo: './images/American_Express_logo.webp', raw: true },
  { label: 'Google Pay',  logo: './images/google-pay logo.png' },
  { label: 'Apple Pay',   logo: './images/Apple_Pay-Logo.wine.svg' },
  { label: 'OPay',        logo: './images/opay logo.png' },
  { label: 'MTN MoMo',    logo: './images/MTN MoMo.jpg',   raw: true },
  { label: 'Airtel Money', logo: './images/Airtel Money.png' },
]

const protect = { onContextMenu: e => e.preventDefault(), draggable: false }
const protectStyle = { userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }

const css = `
  .pb-wrapper { background: #f8fffe; border-top: 1px solid #e0ede9; border-bottom: 1px solid #e0ede9; }

  .pb-desktop {
    padding: 10px 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .pb-desktop-logos {
    display: flex; align-items: center; gap: 5px;
    overflow-x: auto;
  }
  .pb-desktop-logos::-webkit-scrollbar { display: none; }

  .pb-mobile { display: none; flex-direction: column; }

  /* Row 1: fixed left label | scrollable logos | fixed right stripe */
  .pb-mobile-row1 {
    display: flex; align-items: center;
    border-bottom: 1px solid #e0ede9;
    overflow: hidden;
  }
  .pb-mobile-label {
    padding: 8px 10px 8px 12px;
    flex-shrink: 0;
    border-right: 1px solid #e0ede9;
  }
  .pb-mobile-label p { margin: 0; white-space: nowrap; }
  .pb-mobile-logos-scroll {
    flex: 1;
    display: flex; align-items: center; gap: 6px;
    overflow-x: auto; -webkit-overflow-scrolling: touch;
    padding: 8px 8px;
  }
  .pb-mobile-logos-scroll::-webkit-scrollbar { display: none; }
  .pb-mobile-stripe {
    padding: 8px 12px 8px 10px;
    flex-shrink: 0;
    display: flex; align-items: center; gap: 4px;
    border-left: 1px solid #e0ede9;
  }

  @media (max-width: 640px) {
    .pb-desktop { display: none; }
    .pb-mobile  { display: flex; }
  }
`

function Badge({ method, small }) {
  const h = small ? '26px' : '32px'
  if (method.raw) {
    return (
      <img
        src={method.logo} alt={method.label} title={method.label}
        {...protect}
        style={{ ...protectStyle, height: h, width: 'auto', maxWidth: '56px', objectFit: 'contain', display: 'block', borderRadius: '6px', flexShrink: 0 }}
      />
    )
  }
  return (
    <div
      title={method.label}
      style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: small ? '2px 5px' : '3px 7px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: h, minWidth: small ? '38px' : '46px', flexShrink: 0 }}
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
  return (
    <>
      <style>{css}</style>
      <div className="pb-wrapper">

        {/* ── DESKTOP ── */}
        <div className="pb-desktop">
          <div style={{ flexShrink: 0 }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#0d1f1c', lineHeight: 1.2, margin: 0, whiteSpace: 'nowrap' }}>Secure &amp; Trusted Payments</p>
            <p style={{ fontSize: '10px', color: '#9ca3af', lineHeight: 1.3, margin: '2px 0 0', whiteSpace: 'nowrap' }}>All payments are secure and encrypted</p>
          </div>
          <div className="pb-desktop-logos">
            {MAIN_METHODS.map(m => <Badge key={m.label} method={m} />)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span style={{ fontSize: '10px', color: '#9ca3af', whiteSpace: 'nowrap' }}>Payments powered by</span>
            <img src="./images/stripe logo.png" alt="Stripe" {...protect} style={{ ...protectStyle, height: '28px', width: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="pb-mobile">

          {/* Row 1: fixed label | scrollable logos | fixed stripe */}
          <div className="pb-mobile-row1">
            <div className="pb-mobile-label">
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#0d1f1c', lineHeight: 1.2 }}>Secure &amp; Trusted Payments</p>
              <p style={{ fontSize: '10px', color: '#9ca3af', lineHeight: 1.3, marginTop: '1px' }}>Encrypted &amp; PCI compliant</p>
            </div>
            <div className="pb-mobile-logos-scroll">
              {MAIN_METHODS.map(m => <Badge key={m.label} method={m} small />)}
            </div>
            <div className="pb-mobile-stripe">
              <span style={{ fontSize: '9px', color: '#9ca3af', whiteSpace: 'nowrap' }}>Powered by</span>
              <img src="./images/stripe logo.png" alt="Stripe" {...protect} style={{ ...protectStyle, height: '22px', width: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>
          </div>

        </div>

      </div>
    </>
  )
}
