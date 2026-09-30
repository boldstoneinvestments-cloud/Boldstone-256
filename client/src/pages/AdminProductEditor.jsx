import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app')
  ? configuredBackend.replace(/\/$/, '')
  : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'cwj8d38f'
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

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

export default function AdminProductEditor() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const isEditing = Boolean(productId)
  const [form, setForm] = useState(emptyProduct)
  const [details, setDetails] = useState([newDetail()])
  const [loading, setLoading] = useState(isEditing)
  const [authed, setAuthed] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!productId) {
      setAuthed(true)
      setLoading(false)
      setForm(emptyProduct())
      setDetails([newDetail()])
      return undefined
    }

    let current = true
    setLoading(true)
    fetch(`${BACKEND}/api/admin/shop/products/${encodeURIComponent(productId)}`, { credentials: 'include' })
      .then(async response => {
        const data = await response.json().catch(() => ({}))
        if (response.status === 401 || response.status === 403) {
          if (current) setAuthed(false)
          return null
        }
        if (!response.ok) throw new Error(data.error || 'Could not load this product.')
        if (current) {
          const product = data.product
          setForm({ ...product, price: String(product.price), varieties: (product.varieties || []).join('\n') })
          const productDetails = Object.entries(product.details || {}).map(([label, value]) => ({
            id: `${label}-${Math.random()}`,
            label,
            value: String(value),
          }))
          setDetails(productDetails.length ? productDetails : [newDetail()])
          setAuthed(true)
        }
        return data
      })
      .catch(loadError => {
        if (current) {
          setError(loadError.message || 'Could not load this product.')
          setAuthed(true)
        }
      })
      .finally(() => { if (current) setLoading(false) })
    return () => { current = false }
  }, [productId])

  const updateField = event => {
    const { name, value, type, checked } = event.target
    setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const updateDetail = (id, field, value) => {
    setDetails(current => current.map(detail => detail.id === id ? { ...detail, [field]: value } : detail))
  }

  const uploadImage = async event => {
    const input = event.target
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image must be 10 MB or smaller.')
      return
    }
    if (!CLOUDINARY_UPLOAD_PRESET) {
      setError('Direct upload is not configured. Enter an image URL or configure the Cloudinary upload preset.')
      return
    }

    setUploadingImage(true)
    setError('')
    setMessage('')
    const uploadData = new FormData()
    uploadData.append('file', file)
    uploadData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: uploadData,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.secure_url) throw new Error(data.error?.message || 'Image upload failed.')
      setForm(current => ({ ...current, image: data.secure_url }))
      setMessage('Image uploaded. Save the product to publish it.')
    } catch (uploadError) {
      setError(uploadError.message || 'Image upload failed. You can still use an image URL.')
    } finally {
      setUploadingImage(false)
    }
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
      const response = await fetch(`${BACKEND}/api/admin/shop/products${isEditing ? `/${encodeURIComponent(productId)}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
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
      if (isEditing) {
        setMessage('Product updated.')
        setForm({ ...data.product, price: String(data.product.price), varieties: (data.product.varieties || []).join('\n') })
        const savedDetails = Object.entries(data.product.details || {}).map(([label, value]) => ({
          id: `${label}-${Math.random()}`,
          label,
          value: String(value),
        }))
        setDetails(savedDetails.length ? savedDetails : [newDetail()])
      } else {
        navigate('/admin/products', { replace: true, state: { message: 'Product added to the shop.' } })
      }
    } catch (saveError) {
      setError(saveError.message || 'Could not save this product.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || authed === null) return <div className="admin-state">{isEditing ? 'Loading product...' : 'Checking admin session...'}</div>
  if (!authed) return <Navigate to="/admin/sign-in" replace />

  return <section className="admin-content-page admin-product-editor-page">
    <header className="admin-product-editor-heading">
      <Link className="admin-chat-back" to="/admin/products"><FontAwesomeIcon icon={faArrowLeft} /> Products</Link>
      <span className="admin-eyebrow">Shop catalog</span>
      <h1>{isEditing ? 'Edit product' : 'Add product'}</h1>
      <p>Manage the product information and details shown to customers.</p>
    </header>

    {error && <p className="admin-form-error" role="alert">{error}</p>}
    {message && <p className="admin-form-success" role="status">{message}</p>}

    <form className="admin-product-form" onSubmit={saveProduct}>
      <div className="admin-user-list-heading"><div><span className="admin-eyebrow">Product information</span><h2>{form.name || 'Product details'}</h2></div><span className={`admin-table-status${form.active ? '' : ' is-inactive'}`}>{form.active ? 'Visible' : 'Hidden'}</span></div>
      <div className="admin-product-fields">
        <label>Product ID<input name="id" value={form.id} onChange={updateField} placeholder="e.g. light-roast" disabled={isEditing} required /></label>
        <label>Category<select name="category" value={form.category} onChange={updateField} required>{CATEGORIES.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}</select></label>
        <label className="admin-product-field-wide">Product name<input name="name" value={form.name} onChange={updateField} maxLength="200" required /></label>
        <label>Price (UGX)<input name="price" type="number" min="0" step="1" value={form.price} onChange={updateField} required /></label>
        <label>Unit<input name="unit" value={form.unit} onChange={updateField} maxLength="50" placeholder="per kg" required /></label>
        <div className="admin-product-image-field admin-product-field-wide">
          <label htmlFor="product-image-url">Image URL</label>
          <input id="product-image-url" name="image" type="url" value={form.image} onChange={updateField} placeholder="https://..." required />
          <label className={`admin-product-upload-button${!CLOUDINARY_UPLOAD_PRESET || uploadingImage ? ' is-disabled' : ''}`}>
            <input type="file" accept="image/*" onChange={uploadImage} disabled={!CLOUDINARY_UPLOAD_PRESET || uploadingImage} />
            <FontAwesomeIcon icon={faUpload} /> {uploadingImage ? 'Uploading photo...' : 'Upload photo'}
          </label>
          <small>{CLOUDINARY_UPLOAD_PRESET ? 'Upload an image (max 10 MB) or paste an image URL.' : 'Paste a URL, or configure VITE_CLOUDINARY_UPLOAD_PRESET to enable direct upload.'}</small>
        </div>
        {form.image && <img className="admin-product-image-preview" src={form.image} alt="Product preview" />}
        <label className="admin-product-field-wide">Description<textarea name="description" value={form.description} onChange={updateField} rows="4" /></label>
        <label>Badge<input name="badge" value={form.badge} onChange={updateField} maxLength="80" placeholder="Optional" /></label>
        <label className="admin-product-active"><input name="active" type="checkbox" checked={form.active} onChange={updateField} /> Show in public shop</label>
        <label className="admin-product-field-wide">Varieties<textarea name="varieties" value={form.varieties} onChange={updateField} rows="4" placeholder={'One variety per line\nSL14\nSL28'} /><small>Leave empty for products without variety selection.</small></label>
      </div>

      <div className="admin-product-details-editor">
        <div className="admin-user-list-heading"><div><span className="admin-eyebrow">Optional shop details</span><h2>Additional fields</h2></div><button className="admin-table-action" type="button" onClick={() => setDetails(current => [...current, newDetail()])}><FontAwesomeIcon icon={faPlus} /> Add field</button></div>
        {details.map(detail => <div className="admin-product-detail-row" key={detail.id}>
          <label>Label<input value={detail.label} onChange={event => updateDetail(detail.id, 'label', event.target.value)} placeholder="e.g. Roast level" /></label>
          <label>Value<input value={detail.value} onChange={event => updateDetail(detail.id, 'value', event.target.value)} placeholder="e.g. Medium" /></label>
          <button className="admin-product-remove-detail" type="button" onClick={() => setDetails(current => current.filter(item => item.id !== detail.id))} aria-label={`Remove ${detail.label || 'detail field'}`}>Remove</button>
        </div>)}
      </div>

      <div className="admin-product-form-footer">
        <Link className="admin-user-cancel" to="/admin/products">Cancel</Link>
        <button className="admin-user-submit" type="submit" disabled={saving || uploadingImage}>{saving ? 'Saving...' : isEditing ? 'Save changes' : 'Add product'}</button>
      </div>
    </form>
  </section>
}