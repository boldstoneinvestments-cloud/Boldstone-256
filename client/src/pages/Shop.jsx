import { useState, useRef } from 'react'
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
      price: 4500,
      unit: 'per seedling',
      image: 'https://res.cloudinary.com/cwj8d38f/image/upload/v1789651003/Mvule_lhgpld.png',
      desc: "One of Uganda's most prized hardwoods, known for its durability and high timber value. A long-term investment in land and biodiversity.",
      badge: '',
    },
    {
      id: 'musizi',
      name: 'Musizi (Maesopsis eminii)',
      variety: '',
      price: 3000,
      unit: 'per seedling',
      image: 'https://res.cloudinary.com/cwj8d38f/image/upload/v1789650949/Musizi_atn3xr.png',
      desc: 'A fast-growing indigenous hardwood native to Uganda. Excellent for timber, shade, and agroforestry integration with coffee farms.',
      badge: '',
    },
    {
      id: 'mutuba',
      name: 'Mutuba (Ficus natalensis)',
      variety: '',
      price: 2500,
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

export default function Shop() {
  const formRef = useRef(null)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', product: '', quantity: 1,
    location: '', date: '', notes: '',
  })
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const onOrder = (product, qty, variety) => {
    const productName = variety ? `${product.name} — ${variety}` : product.name
    setForm(f => ({ ...f, product: productName, quantity: qty }))
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const submit = async e => {
    e.preventDefault()
    setErr('')
    try {
      const res = await fetch('https://formsubmit.co/ajax/boldstone.investments@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Shop Order — ${form.product}`,
          name: form.name,
          phone: form.phone,
          email: form.email,
          product: form.product,
          quantity: form.quantity,
          delivery_location: form.location,
          preferred_date: form.date,
          notes: form.notes,
          _captcha: 'false',
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      setForm({ name: '', phone: '', email: '', product: '', quantity: 1, location: '', date: '', notes: '' })
    } catch {
      setErr('Failed to submit order. Please try again or contact us directly.')
    }
  }

  const allProducts = [
    ...PRODUCTS.seedlings.map(p => p.name),
    ...PRODUCTS.roasted.map(p => p.name),
    ...PRODUCTS.trees.map(p => p.name),
  ]

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
        {Object.entries(PRODUCTS).map(([key, items]) => (
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

        {/* ORDER FORM */}
        <section className="shop-form-section" ref={formRef}>
          <div className="bs-wrap">
            <div className="shop-form-wrap">
              <div className="shop-form-left">
                <span className="shop-form-eyebrow">Place Your Order</span>
                <h2>Ready to Order?<br />Fill in the Details</h2>
                <p>Complete the form and our team will confirm your order within 24 hours and arrange delivery to your location.</p>
                <ul className="shop-form-perks">
                  {['Delivery across Uganda', 'Bulk order discounts available', 'Expert agronomic advice included', 'Certified, quality-assured products'].map(p => (
                    <li key={p}><span className="perk-dot" />  {p}</li>
                  ))}
                </ul>
              </div>

              <form className="shop-form" onSubmit={submit}>
                {sent && (
                  <div className="shop-alert shop-alert-success">
                    ✓ Order submitted! We'll contact you within 24 hours to confirm.
                  </div>
                )}
                {err && <div className="shop-alert shop-alert-error">✗ {err}</div>}

                <div className="shop-form-row">
                  <div className="shop-field">
                    <label>Full Name *</label>
                    <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={handle} required />
                  </div>
                  <div className="shop-field">
                    <label>Phone Number *</label>
                    <input name="phone" type="tel" placeholder="+256 7XX XXX XXX" value={form.phone} onChange={handle} required />
                  </div>
                </div>

                <div className="shop-field">
                  <label>Email Address</label>
                  <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handle} />
                </div>

                <div className="shop-form-row">
                  <div className="shop-field">
                    <label>Product / Type *</label>
                    <select name="product" value={form.product} onChange={handle} required>
                      <option value="">Select a product</option>
                      {allProducts.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="shop-field">
                    <label>Quantity *</label>
                    <input name="quantity" type="number" min="1" value={form.quantity} onChange={handle} required />
                  </div>
                </div>

                <div className="shop-field">
                  <label>Delivery Location *</label>
                  <input name="location" type="text" placeholder="Town, district or full address" value={form.location} onChange={handle} required />
                </div>

                <div className="shop-field">
                  <label>Preferred Delivery Date</label>
                  <input name="date" type="date" value={form.date} onChange={handle} min={new Date().toISOString().split('T')[0]} />
                </div>

                <div className="shop-field">
                  <label>Additional Notes</label>
                  <textarea name="notes" rows={3} placeholder="Any special requirements, planting advice needed, etc." value={form.notes} onChange={handle} />
                </div>

                <button type="submit" className="shop-submit-btn">
                  Submit Order →
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
