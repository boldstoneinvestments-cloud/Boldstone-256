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
  .pb-wrapper {
    background: linear-gradient(135deg, #f0faf8 0%, #ffffff 60%, #f0faf8 100%);
    border-top: 1px solid #c8e6df;
    border-bottom: 1px solid #c8e6df;
  }

  .pb-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 14px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .pb-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 1rem;
    font-weight: 800;
    color: #0d1f1c;
    margin: 0;
    white-space: nowrap;
  }

  .pb-title-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #0f8972;
    flex-shrink: 0;
    box-shadow: 0 0 0 2px rgba(15,137,114,0.2);
  }

  .pb-logos {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
  }

  /* ── MOBILE ── */
  .pb-mobile-logos {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 16px 14px;
    scrollbar-width: none;
    width: 100%;
  }
  .pb-mobile-logos::-webkit-scrollbar { display: none; }

  @media (max-width: 640px) {
    .pb-logos { display: none; }
    .pb-mobile-logos { display: flex; }
  }
  @media (min-width: 641px) {
    .pb-mobile-logos { display: none; }
  }
`

function Badge({ method, small }) {
  const h = small ? '34px' : '44px'
  if (method.raw) {
    return (
      <img
        src={method.logo} alt={method.label} title={method.label}
        {...protect}
        style={{ ...protectStyle, height: h, width: 'auto', maxWidth: '52px', objectFit: 'contain', display: 'block', borderRadius: '6px', flexShrink: 0 }}
      />
    )
  }
  return (
    <div
      title={method.label}
      style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '7px', padding: small ? '3px 6px' : '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: h, minWidth: small ? '36px' : '44px', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
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
        <div className="pb-inner">
          <p className="pb-title">
            Secure &amp; Encrypted Payments
          </p>
          {/* Desktop: wrapping logos */}
          <div className="pb-logos">
            {MAIN_METHODS.map(m => <Badge key={m.label} method={m} />)}
          </div>
          {/* Mobile: scrollable logos */}
          <div className="pb-mobile-logos">
            {MAIN_METHODS.map(m => <Badge key={m.label} method={m} small />)}
          </div>
        </div>
      </div>
    </>
  )
}
