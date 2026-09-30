import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus, faRotate } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app')
  ? configuredBackend.replace(/\/$/, '')
  : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

const CATEGORIES = [
  { value: 'seedlings', label: 'Coffee Seedlings' },
  { value: 'roasted', label: 'Roasted Coffee' },
  { value: 'trees', label: 'Indigenous Trees' },
]

const emptyProduct = () => ({
  id: '',
  category: 'seedlings',
  name: '',
  price: '',
  unit: 'per seedling',
  image: '',
  description: '',
  badge: '',
  varieties: '',
  active: true,
})

const newDetail = () => ({ id: `${Date.now()}-${Math.random()}`, label: '', value: '' })

export default function AdminProducts() {
  const [authed, setAuthed] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [details, setDetails] = useState([newDetail()])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${BACKEND}/api/admin/shop/products`, { credentials: 'include' })
      if (response.status === 401 || response.status === 403) {
        setAuthed(false)
        return
      }
      if (!response.ok) throw new Error('Could not load shop products.')
      const data = await response.json()
      setProducts(data.products || [])
      setAuthed(true)
    } catch (loadError) {
      setError(loadError.message || 'Could not load shop products.')
      setAuthed(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  const startNew = () => {
    setEditingId(null)
    setForm(emptyProduct())
    setDetails([newDetail()])
    setError('')
    setMessage('')
  }

  const editProduct = product => {
    setEditingId(product.id)
    setForm({ ...product, price: String(product.price), varieties: (product.varieties || []).join('\n') })
    setDetails(Object.entries(product.details || {}).map(([label, value]) => ({
      id: `${label}-${Math.random()}`,
      label,
      value: String(value),
    })))
    setError('')
    setMessage('')
  }

  const updateField = event => {
    const { name, value, type, checked } = event.target
    setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const updateDetail = (id, field, value) => {
    setDetails(current => current.map(detail => detail.id === id ? { ...detail, [field]: value } : detail))
  }

  const saveProduct = async event => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    const payload = {
      ...form,
      price: Number(form.price),
      varieties: form.varieties.split('\n').map(value => value.trim()).filter(Boolean),
      details: Object.fromEntries(details
        .filter(detail => detail.label.trim())
        .map(detail => [detail.label.trim(), detail.value.trim()])),
    }
    try {
      const response = await fetch(`${BACKEND}/api/admin/shop/products${editingId ? `/${encodeURIComponent(editingId)}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json().catch(() => ({}))
      if (response.status === 401 || response.status === 403) {
        setAuthed(false)
        return
      }
      if (!response.ok) throw new Error(data.error || 'Could not save this product.')
      setMessage(editingId ? 'Product updated.' : 'Product added to the shop.')
      await loadProducts()
      if (!editingId) {
        setEditingId(data.product.id)
        setForm({ ...data.product, price: String(data.product.price), varieties: (data.product.varieties || []).join('\n') })
        setDetails(Object.entries(data.product.details || {}).map(([label, value]) => ({
          id: `${label}-${Math.random()}`,
          label,
          value: String(value),
        })))
      }
    } catch (saveError) {
      setError(saveError.message || 'Could not save this product.')
    } finally {
      setSaving(false)
    }
  }

  if (authed === null && loading) return <div className="admin-state">Loading shop products...</div>
  if (!authed) return <Navigate to="/admin/sign-in" replace />

  return <section className="admin-content-page admin-products-page">
    <div className="admin-page-heading admin-products-heading">
      <div><span className="admin-eyebrow">Shop</span><h1>Products</h1><p>Manage the catalog and the details customers see in the shop.</p></div>
      <div className="admin-products-actions">
        <button className="admin-table-action" type="button" onClick={loadProducts} disabled={loading}><FontAwesomeIcon icon={faRotate} /> Refresh</button>
        <button className="admin-user-submit admin-products-add" type="button" onClick={startNew}><FontAwesomeIcon icon={faPlus} /> Add product</button>
      </div>
    </div>

    {error && <p className="admin-form-error" role="alert">{error}</p>}
    {message && <p className="admin-form-success" role="status">{message}</p>}

    <div className="admin-products-layout">
      <section className="admin-products-list" aria-label="Shop products">
        <div className="admin-user-list-heading"><div><span className="admin-eyebrow">Catalog</span><h2>{products.length} products</h2></div></div>
        {loading ? <p className="admin-products-empty">Loading products...</p> : products.length === 0 ? <p className="admin-products-empty">No products yet.</p> : <div className="admin-products-table-wrap">
          <table className="admin-data-table admin-products-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Status</th><th /></tr></thead>
            <tbody>{products.map(product => <tr key={product.id}>
              <td><div className="admin-product-table-name"><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.id}</small></span></div></td>
              <td>{CATEGORIES.find(category => category.value === product.category)?.label || product.category}</td>
              <td>UGX {Number(product.price).toLocaleString()} <small>{product.unit}</small></td>
              <td><small className={product.active ? 'admin-table-status' : 'admin-table-muted'}>{product.active ? 'Active' : 'Hidden'}</small></td>
              <td><button className="admin-table-action" type="button" onClick={() => editProduct(product)}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button></td>
            </tr>)}</tbody>
          </table>
        </div>}
      </section>

      <form className="admin-product-form" onSubmit={saveProduct}>
        <div className="admin-user-list-heading"><div><span className="admin-eyebrow">{editingId ? 'Edit product' : 'New product'}</span><h2>{form.name || 'Product details'}</h2></div><span className={`admin-table-status${form.active ? '' : ' is-inactive'}`}>{form.active ? 'Visible' : 'Hidden'}</span></div>
        <div className="admin-product-fields">
          <label>Product ID<input name="id" value={form.id} onChange={updateField} placeholder="e.g. light-roast" disabled={Boolean(editingId)} required /></label>
          <label>Category<select name="category" value={form.category} onChange={updateField} required>{CATEGORIES.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}</select></label>
          <label className="admin-product-field-wide">Product name<input name="name" value={form.name} onChange={updateField} maxLength="200" required /></label>
          <label>Price (UGX)<input name="price" type="number" min="0" step="1" value={form.price} onChange={updateField} required /></label>
          <label>Unit<input name="unit" value={form.unit} onChange={updateField} maxLength="50" placeholder="per kg" required /></label>
          <label className="admin-product-field-wide">Image URL<input name="image" type="url" value={form.image} onChange={updateField} placeholder="https://..." required /></label>
          {form.image && <img className="admin-product-image-preview" src={form.image} alt="Product preview" />}
          <label className="admin-product-field-wide">Description<textarea name="description" value={form.description} onChange={updateField} rows="4" /></label>
          <label>Badge<input name="badge" value={form.badge} onChange={updateField} maxLength="80" placeholder="Optional" /></label>
          <label className="admin-product-active"><input name="active" type="checkbox" checked={form.active} onChange={updateField} /> Show in public shop</label>
          <label className="admin-product-field-wide">Varieties<textarea name="varieties" value={form.varieties} onChange={updateField} rows="4" placeholder={'One variety per line\nSL14\nSL28'} /><small>Leave empty for products without variety selection.</small></label>
        </div>

        <div className="admin-product-details-editor">
          <div className="admin-user-list-heading"><div><span className="admin-eyebrow">Optional shop details</span><h3>Additional fields</h3></div><button className="admin-table-action" type="button" onClick={() => setDetails(current => [...current, newDetail()])}><FontAwesomeIcon icon={faPlus} /> Add field</button></div>
          {details.map(detail => <div className="admin-product-detail-row" key={detail.id}>
            <label>Label<input value={detail.label} onChange={event => updateDetail(detail.id, 'label', event.target.value)} placeholder="e.g. Roast level" /></label>
            <label>Value<input value={detail.value} onChange={event => updateDetail(detail.id, 'value', event.target.value)} placeholder="e.g. Medium" /></label>
            <button className="admin-product-remove-detail" type="button" onClick={() => setDetails(current => current.filter(item => item.id !== detail.id))} aria-label={`Remove ${detail.label || 'detail field'}`}>Remove</button>
          </div>)}
        </div>

        <div className="admin-product-form-footer">
          <button className="admin-user-cancel" type="button" onClick={startNew}>Clear form</button>
          <button className="admin-user-submit" type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}</button>
        </div>
      </form>
    </div>
  </section>
}