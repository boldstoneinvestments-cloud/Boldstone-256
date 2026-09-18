import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
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

const CATEGORY_META = {
  seedlings: { label: 'Coffee Seedlings', icon: '', desc: 'Certified, nursery-grown coffee seedlings ready for planting.' },
  roasted:   { label: 'Roasted Coffee',   icon: '☕', desc: 'Freshly roasted coffee from our partner farms in Uganda.' },
  trees:     { label: 'Indigenous Trees', icon: '', desc: 'Native Ugandan tree seedlings for agroforestry and reforestation.' },
}

function ProductCard({ product, onOrder }) {
  const [qty, setQty] = useState('')
  const [selectedVariety, setSelectedVariety] = useState(product.varieties?.[0] || '')
  return (
    <div className="shop-card">
      <div className="shop-card-img-wrap">
        <img src={product.image} alt={product.name} className="shop-card-img" loading="lazy" />
      </div>
      <div className="shop-card-body">
        <p className="shop-card-variety">{product.variety}</p>
        <h3 className="shop-card-name">{product.name}</h3>
        <p className="shop-card-desc">{product.desc}</p>
        {product.varieties && (
          <div className="shop-variety-select">
            <label>Select Variety</label>
            <select value={selectedVariety} onChange={e => setSelectedVariety(e.target.value)}>
              {product.varieties.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        )}
        <div className="shop-card-footer">
          <div className="shop-card-price">
            <span className="shop-price-amount">UGX {product.price.toLocaleString()}</span>
            <span className="shop-price-unit">{product.unit}</span>
          </div>
          <div className="shop-qty-row">
            <div className="shop-qty">
              <button onClick={() => setQty(q => Math.max(1, (parseInt(q) || 0) - 1))}>−</button>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={e => setQty(e.target.value)}
                className="shop-qty-input"
                placeholder="Qty"
              />
              <button onClick={() => setQty(q => (parseInt(q) || 0) + 1)}>+</button>
            </div>
    <button className="shop-order-btn" onClick={() => onOrder(product, parseInt(qty) || 1, selectedVariety)}>
              Order Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app')
  ? configuredBackend.replace(/\/$/, '')
  : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

function OrderDrawer({ order, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', location: '', notes: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(`${BACKEND}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          product: order.productName,
          productId: order.productId,
          quantity: order.qty,
          location: form.location,
          notes: form.notes,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
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
            <p>Thank you, <strong>{form.name}</strong>. We'll contact you within 24 hours to confirm your order of <strong>{order.qty} × {order.productName}</strong>.</p>
            <button className="drawer-done-btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="drawer-header">
              <span className="drawer-eyebrow">Place Order</span>
              <h2 className="drawer-title">{order.productName}</h2>
              <p className="drawer-subtitle">Qty: <strong>{order.qty}</strong> · UGX {order.unitPrice.toLocaleString()} {order.unit}</p>
            </div>

            <form className="drawer-form" onSubmit={submit}>
              {status === 'error' && (
                <div className="drawer-alert-error">Failed to place order. Please try again.</div>
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
              <div className="drawer-field">
                <label>Delivery Location *</label>
                <input name="location" type="text" placeholder="Town, district or full address" value={form.location} onChange={handle} required />
              </div>
              <div className="drawer-field">
                <label>Additional Notes</label>
                <textarea name="notes" rows={3} placeholder="Any special requirements..." value={form.notes} onChange={handle} />
              </div>
              <button type="submit" className="drawer-submit-btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'Placing Order…' : 'Confirm Order →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function Shop() {
  const [drawerOrder, setDrawerOrder] = useState(null)
  const [products, setProducts] = useState(PRODUCTS)

  useEffect(() => {
    fetch(`${BACKEND}/api/shop/products`)
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(setProducts)
      .catch(() => {})
  }, [])

  const onOrder = (product, qty, variety) => {
    const productName = variety ? `${product.name} — ${variety}` : product.name
    setDrawerOrder({ productId: product.id, productName, qty, unitPrice: product.price, unit: product.unit })
  }

  return (
    <>
      <Helmet>
        <title>Shop | Boldstone Investments — Coffee Seedlings, Roasted Coffee & Indigenous Trees</title>
        <meta name="description" content="Order coffee seedlings (Arabica & Robusta), freshly roasted coffee, and indigenous tree seedlings from Boldstone Investments Uganda." />
        <link rel="canonical" href="https://www.boldstoneinvestments.com/shop" />
      </Helmet>

      {/* HERO */}
      <section className="shop-hero">
        <div className="shop-hero-overlay" />
        <div className="shop-hero-content">
          <span className="shop-hero-label">Boldstone Shop</span>
          <h1>Order Coffee Seedlings, Roasted Coffee & Indigenous Trees From Our Shop</h1>
          <p>Quality coffee seedlings, freshly roasted coffee, and indigenous tree seedlings — grown and sourced sustainably in Uganda.</p>
        </div>
      </section>

      <div className="shop-page">

        {/* CATEGORIES */}
        {Object.entries(products).map(([key, items]) => (
          <section key={key} className="shop-section">
            <div className="bs-wrap">
              <div className="shop-section-header">
                <span className="shop-section-icon">{CATEGORY_META[key].icon}</span>
                <div>
                  <h2 className="shop-section-title">{CATEGORY_META[key].label}</h2>
                  <p className="shop-section-desc">{CATEGORY_META[key].desc}</p>
                </div>
              </div>
              <div className={`shop-grid shop-grid-${items.length}`}>
                {items.map(p => (
                  <ProductCard key={p.id} product={p} onOrder={onOrder} />
                ))}
              </div>
            </div>
          </section>
        ))}


      </div>

      {drawerOrder && <OrderDrawer order={drawerOrder} onClose={() => setDrawerOrder(null)} />}
    </>
  )
}
