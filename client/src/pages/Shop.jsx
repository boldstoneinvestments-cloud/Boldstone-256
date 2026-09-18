import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useCart } from '../CartContext'
import './Shop.css'

const PRODUCTS = {
  seedlings: [
    {
      id: 'arabica',
      name: 'Arabica Seedlings',
      variety: '',
      price: 1500,
      unit: 'per seedling',
      image: 'https://res.cloudinary.com/cwj8d38f/image/upload/v1789646469/Arabica-Coffee-Seeds-For-Planting_o2ijiw.jpg',
      desc: 'High-altitude Arabica varieties known for their smooth, mild flavour with hints of fruit and chocolate. Ideal for elevations above 1,200m.',
      badge: 'Best Seller',
      varieties: ['SL14', 'SL28', 'SL34', 'Ruiru 11', 'Batian', 'CIFC 635', 'K7', 'Blue Mountain', 'Nyasaland'],
    },
    {
      id: 'robusta',
      name: 'Robusta Seedlings',
      variety: '',
      price: 1200,
      unit: 'per seedling',
      image: 'https://res.cloudinary.com/cwj8d38f/image/upload/v1789646468/Robusta_svyvej.jpg',
      desc: 'Hardy Robusta varieties with strong, bold flavour and higher caffeine content. Thrives in lower altitudes and are highly disease-resistant.',
      badge: 'High Yield',
      varieties: ['BP42', 'BP358', 'BP409', 'Newton', 'Napak 1', 'Napak 2', 'Napak 3', 'Napak 4', 'Clone 186'],
    },
  ],
  roasted: [
    {
      id: 'light-roast',
      name: 'Light Roast Coffee',
      variety: '',
      price: 28000,
      unit: 'per kg',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      desc: 'Lightly roasted to preserve the natural fruity and floral notes of Ugandan coffee. Bright acidity with a light body, perfect for filter and pour-over brewing.',
      badge: '',
    },
    {
      id: 'medium-roast',
      name: 'Medium Roast Coffee',
      variety: '',
      price: 30000,
      unit: 'per kg',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
      desc: 'A balanced medium roast delivering a smooth, well-rounded cup with hints of caramel and chocolate. Ideal for drip coffee and espresso.',
      badge: '',
    },
    {
      id: 'dark-roast',
      name: 'Dark Roast Coffee',
      variety: '',
      price: 32000,
      unit: 'per kg',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
      desc: 'Boldly roasted for a rich, intense flavour with low acidity and a full body. Deep notes of dark chocolate and smoky undertones. Perfect for espresso and French press.',
      badge: '',
    },
  ],
  trees: [
    {
      id: 'mvule',
      name: 'Mvule (Milicia excelsa)',
      variety: '',
      price: 1500,
      unit: 'per seedling',
      image: 'https://res.cloudinary.com/cwj8d38f/image/upload/v1789651003/Mvule_lhgpld.png',
      desc: "One of Uganda's most prized hardwoods, known for its durability and high timber value. A long-term investment in land and biodiversity.",
      badge: '',
    },
    {
      id: 'musizi',
      name: 'Musizi (Maesopsis eminii)',
      variety: '',
      price: 1500,
      unit: 'per seedling',
      image: 'https://res.cloudinary.com/cwj8d38f/image/upload/v1789650949/Musizi_atn3xr.png',
      desc: 'A fast-growing indigenous hardwood native to Uganda. Excellent for timber, shade, and agroforestry integration with coffee farms.',
      badge: '',
    },
    {
      id: 'mutuba',
      name: 'Mutuba (Ficus natalensis)',
      variety: '',
      price: 1500,
      unit: 'per seedling',
      image: 'https://res.cloudinary.com/cwj8d38f/image/upload/v1789650887/Mutuba_qz02q5.jpg',
      desc: 'A culturally significant tree in Uganda, widely used for bark cloth production, shade, and soil conservation. Grows well across a range of climates.',
      badge: '',
    },
  ],
}

const CATEGORY_ORDER = ['seedlings', 'roasted', 'trees']

const CATEGORY_META = {
  seedlings: { label: 'Coffee Seedlings', icon: '', desc: 'Certified, nursery-grown coffee seedlings ready for planting.' },
  roasted:   { label: 'Roasted Coffee',   icon: '☕', desc: 'Freshly roasted coffee from our partner farms in Uganda.' },
  trees:     { label: 'Indigenous Trees', icon: '', desc: 'Native Ugandan tree seedlings for agroforestry and reforestation.' },
}

function VarietyQtyTable({ varieties, qtys, onChange, open, onToggle }) {
  return (
    <div className={`shop-variety-table${open ? ' shop-variety-table--open' : ''}`}>
      <button type="button" className="shop-variety-toggle" onClick={onToggle}>
        <span>Select Varieties & Quantities</span>
        <span className={`shop-variety-toggle-icon${open ? ' open' : ''}`}>▾</span>
      </button>
      {open && (
        <>
          <div className="shop-variety-table-head">
            <span>Variety</span>
            <span>Quantity</span>
          </div>
          {varieties.map(v => (
            <div key={v} className="shop-variety-table-row">
              <span className="shop-variety-name">{v}</span>
              <div className="shop-qty">
                <button type="button" onClick={() => onChange(v, Math.max(0, (qtys[v] || 0) - 1))}>−</button>
                <input
                  type="number"
                  min="0"
                  value={qtys[v] || ''}
                  onChange={e => onChange(v, Math.max(0, parseInt(e.target.value) || 0))}
                  className="shop-qty-input"
                  placeholder="0"
                />
                <button type="button" onClick={() => onChange(v, (qtys[v] || 0) + 1)}>+</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function ProductCard({ product }) {
  const [qty, setQty] = useState('')
  const [varietyQtys, setVarietyQtys] = useState({})
  const [added, setAdded] = useState(false)
  const [tableOpen, setTableOpen] = useState(false)
  const { addToCart } = useCart()

  const handleVarietyQty = (variety, val) =>
    setVarietyQtys(q => ({ ...q, [variety]: val }))

  const handleAdd = () => {
    if (product.varieties?.length) {
      const selections = product.varieties
        .filter(v => (varietyQtys[v] || 0) > 0)
        .map(v => ({ variety: v, qty: varietyQtys[v] }))
      if (selections.length === 0) return
      addToCart({ id: product.id, productName: product.name, unitPrice: product.price, unit: product.unit, selections })
    } else {
      const q = parseInt(qty) || 1
      addToCart({ id: product.id, productName: product.name, unitPrice: product.price, unit: product.unit, qty: q })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="shop-card">
      <div className="shop-card-img-wrap" style={product.varieties ? { height: '260px' } : undefined}>
        <img src={product.image} alt={product.name} className="shop-card-img" loading="lazy" />
      </div>
      <div className="shop-card-body">
        <p className="shop-card-variety">{product.variety}</p>
        <h3 className="shop-card-name">{product.name}</h3>
        <p className="shop-card-desc">{product.desc}</p>
        {product.varieties ? (
          <VarietyQtyTable varieties={product.varieties} qtys={varietyQtys} onChange={handleVarietyQty} open={tableOpen} onToggle={() => setTableOpen(o => !o)} />
        ) : (
          <div className="shop-qty-row" style={{ marginBottom: '12px' }}>
            <div className="shop-qty">
              <button type="button" onClick={() => setQty(q => Math.max(1, (parseInt(q) || 0) - 1))}>−</button>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={e => setQty(e.target.value)}
                className="shop-qty-input"
                placeholder="Qty"
              />
              <button type="button" onClick={() => setQty(q => (parseInt(q) || 0) + 1)}>+</button>
            </div>
          </div>
        )}
        <div className="shop-card-footer">
          <div className="shop-card-price">
            <span className="shop-price-amount">UGX {product.price.toLocaleString()}</span>
            <span className="shop-price-unit">{product.unit}</span>
          </div>
          <button className={`shop-order-btn${added ? ' shop-order-btn--added' : ''}`} onClick={handleAdd}>
            {added ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app')
  ? configuredBackend.replace(/\/$/, '')
  : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

const ARABICA_VARIETIES = new Set(['SL14','SL28','SL34','Ruiru 11','Batian','CIFC 635','K7','Blue Mountain','Nyasaland'])

function groupSeedlingSelections(selections) {
  const arabica = selections.filter(s => ARABICA_VARIETIES.has(s.variety))
  const robusta = selections.filter(s => !ARABICA_VARIETIES.has(s.variety))
  return { arabica, robusta }
}

function CartDrawer({ onClose }) {
  const { cart, removeFromCart, clearCart } = useCart()
  const [step, setStep] = useState('receipt')
  const [form, setForm] = useState({ name: '', phone: '', email: '', country: 'Uganda', province: '', district: '', street: '', village: '', notes: '' })
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const grandTotal = cart.reduce((sum, item) => {
    if (item.selections) return sum + item.selections.reduce((a, b) => a + b.qty * item.unitPrice, 0)
    return sum + (item.qty || 0) * item.unitPrice
  }, 0)

  const totalQty = cart.reduce((s, c) => {
    if (c.selections) return s + c.selections.reduce((a, b) => a + b.qty, 0)
    return s + (c.qty || 0)
  }, 0)

  const submit = async e => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch(`${BACKEND}/api/shop/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          items: cart,
          quantity: totalQty,
          location: [form.district, form.province, form.country].filter(Boolean).join(', '),
          country: form.country,
          province: form.province,
          district: form.district,
          street: form.street,
          village: form.village,
          notes: form.notes,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to place order.')
      }
      const data = await res.json()
      setInvoiceNumber(data.invoiceNumber || '')
      setStatus('success')
      clearCart()
    } catch (error) {
      setStatus('error')
      setErrorMessage(error.message || 'Failed to place order. Please try again.')
    }
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <button className="drawer-close" onClick={onClose}>✕</button>

        {status === 'success' ? (
          <div className="drawer-success">
            <div className="drawer-success-icon">✓</div>
            <h3>Order Placed!</h3>
            <p>Thank you, <strong>{form.name}</strong>. We'll contact you within 24 hours to confirm your order.</p>
            {invoiceNumber && <p className="drawer-invoice-number">Invoice: <strong>{invoiceNumber}</strong></p>}
            <button className="drawer-done-btn" onClick={onClose}>Done</button>
          </div>
        ) : step === 'receipt' ? (
          <>
            <div className="drawer-receipt">
              <div className="drawer-header">
                <span className="drawer-eyebrow">Your Cart</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 className="drawer-title">Order Summary</h2>
                  {cart.length > 0 && (
                    <button className="drawer-clear-btn" onClick={clearCart}>Clear Cart</button>
                  )}
                </div>
              </div>

              {cart.length === 0 ? (
                <p style={{ color: '#888', fontSize: '0.9rem', marginTop: 8 }}>Your cart is empty. Add items from the shop.</p>
              ) : (
                <div className="drawer-cart-items">
                  {cart.map(item => {
                    const itemTotal = item.selections
                      ? item.selections.reduce((a, b) => a + b.qty * item.unitPrice, 0)
                      : (item.qty || 0) * item.unitPrice
                    return (
                      <div key={item.id} className="drawer-cart-item">
                        <div className="drawer-cart-item-header">
                          <span className="drawer-cart-item-name">{item.productName}</span>
                          <button className="drawer-cart-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                        </div>
                        <div className="drawer-variety-summary">
                          {item.selections ? (() => {
                            const { arabica, robusta } = groupSeedlingSelections(item.selections)
                            const groups = [
                              { label: 'Arabica Seedlings', rows: arabica, unitPrice: 1500 },
                              { label: 'Robusta Seedlings', rows: robusta, unitPrice: 1200 },
                            ].filter(g => g.rows.length > 0)
                            return groups.map(g => {
                              const groupTotal = g.rows.reduce((a, b) => a + b.qty * g.unitPrice, 0)
                              const groupQty = g.rows.reduce((a, b) => a + b.qty, 0)
                              return (
                                <div key={g.label} className="drawer-seedling-group">
                                  <div className="drawer-seedling-group-header">
                                    <span>{g.label}</span>
                                    <span>{groupQty.toLocaleString()} seedlings · UGX {g.unitPrice.toLocaleString()} each</span>
                                  </div>
                                  {g.rows.map(s => (
                                    <div key={s.variety} className="drawer-variety-row">
                                      <span>{s.variety} <span style={{color:'#aaa', fontWeight:400}}>× {s.qty.toLocaleString()}</span></span>
                                      <span>UGX {(s.qty * g.unitPrice).toLocaleString()}</span>
                                    </div>
                                  ))}
                                  <div className="drawer-variety-total">
                                    <span>Subtotal</span>
                                    <span>UGX {groupTotal.toLocaleString()}</span>
                                  </div>
                                </div>
                              )
                            })
                          })() : (
                            <>
                              <div className="drawer-variety-row">
                                <span>{item.productName} × {item.qty}</span>
                                <span>UGX {itemTotal.toLocaleString()}</span>
                              </div>
                              <div className="drawer-variety-total">
                                <span>Subtotal</span>
                                <span>UGX {itemTotal.toLocaleString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  <div className="drawer-grand-total">
                    <span>Grand Total</span>
                    <span>UGX {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="drawer-form-panel">
              <button
                className="drawer-submit-btn"
                onClick={() => setStep('form')}
                disabled={cart.length === 0}
              >
                Proceed to Checkout →
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="drawer-receipt">
              <div className="drawer-header">
                <button className="drawer-back-btn" onClick={() => setStep('receipt')}>← Back to Cart</button>
                <h2 className="drawer-title" style={{ marginTop: 12 }}>Delivery Details</h2>
              </div>
              <form id="checkout-form" className="drawer-form" onSubmit={submit}>
                {status === 'error' && (
                  <div className="drawer-alert-error">{errorMessage || 'Failed to place order. Please try again.'}</div>
                )}
                <div className="drawer-row">
                  <div className="drawer-field">
                    <label>Full Name *</label>
                    <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={handle} required />
                  </div>
                  <div className="drawer-field">
                    <label>Phone Number *</label>
                    <input name="phone" type="tel" placeholder="+256 7XX XXX XXX" value={form.phone} onChange={handle} required />
                  </div>
                </div>
                <div className="drawer-field">
                  <label>Email Address *</label>
                  <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handle} required />
                </div>
                <div className="drawer-row">
                  <div className="drawer-field">
                    <label>Country *</label>
                    <input name="country" type="text" value={form.country} onChange={handle} required />
                  </div>
                  <div className="drawer-field">
                    <label>Province / Region *</label>
                    <input name="province" type="text" placeholder="Central, Western..." value={form.province} onChange={handle} required />
                  </div>
                </div>
                <div className="drawer-row">
                  <div className="drawer-field">
                    <label>District *</label>
                    <input name="district" type="text" placeholder="District" value={form.district} onChange={handle} required />
                  </div>
                  <div className="drawer-field">
                    <label>Street <span>(optional)</span></label>
                    <input name="street" type="text" placeholder="Street or road" value={form.street} onChange={handle} />
                  </div>
                </div>
                <div className="drawer-field">
                  <label>Village <span>(optional)</span></label>
                  <input name="village" type="text" placeholder="Village or locality" value={form.village} onChange={handle} />
                </div>
                <div className="drawer-field">
                  <label>Additional Notes</label>
                  <textarea name="notes" rows={3} placeholder="Any special requirements..." value={form.notes} onChange={handle} />
                </div>
              </form>
            </div>

            <div className="drawer-form-panel">
              <button type="submit" form="checkout-form" className="drawer-submit-btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'Placing Order…' : 'Confirm Order →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Shop() {
  const { cartOpen, setCartOpen, totalItems } = useCart()
  const [fabVisible, setFabVisible] = useState(true)
  const [products, setProducts] = useState(PRODUCTS)

  useEffect(() => {
    fetch(`${BACKEND}/api/shop/products`)
      .then(res => { if (!res.ok) throw new Error(); return res.json() })
      .then(data => {
        const ordered = Object.fromEntries(
          CATEGORY_ORDER.filter(k => k in data).map(k => [k, data[k]])
        )
        setProducts(ordered)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const observer = new IntersectionObserver(
      ([entry]) => setFabVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Helmet>
        <title>Shop | Boldstone Investments — Coffee Seedlings, Roasted Coffee & Indigenous Trees</title>
        <meta name="description" content="Order coffee seedlings (Arabica & Robusta), freshly roasted coffee, and indigenous tree seedlings from Boldstone Investments Uganda." />
        <link rel="canonical" href="https://www.boldstoneinvestments.com/shop" />
      </Helmet>

      <section className="shop-hero">
        <div className="shop-hero-overlay" />
        <div className="shop-hero-content">
          <span className="shop-hero-label">Boldstone Shop</span>
          <h1>Order Coffee Seedlings, Roasted Coffee & Indigenous Trees From Our Shop</h1>
          <p>Quality coffee seedlings, freshly roasted coffee, and indigenous tree seedlings — grown and sourced sustainably in Uganda.</p>
        </div>
      </section>

      <div className="shop-page">
        {Object.entries(products).map(([key, items]) => (
          <section key={key} className="shop-section">
            <div className="bs-wrap">
              <div className="shop-section-header">
                <span className="shop-section-icon">{CATEGORY_META[key]?.icon}</span>
                <div>
                  <h2 className="shop-section-title">{CATEGORY_META[key]?.label ?? key}</h2>
                  <p className="shop-section-desc">{CATEGORY_META[key]?.desc}</p>
                </div>
              </div>
              <div className={`shop-grid shop-grid-${items.length}${key === 'roasted' ? ' shop-grid-stretch' : ''}`}>
                {items.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}

      {fabVisible && (
        <button
          className="shop-cart-fab"
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
        >
          <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          {totalItems > 0 && (
            <span className="shop-cart-fab-badge">{totalItems}</span>
          )}
        </button>
      )}
    </>
  )
}
