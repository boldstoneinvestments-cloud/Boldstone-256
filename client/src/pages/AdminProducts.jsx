import { useCallback, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus, faRotate } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app')
  ? configuredBackend.replace(/\/$/, '')
  : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

const CATEGORIES = {
  seedlings: 'Coffee Seedlings',
  roasted: 'Roasted Coffee',
  trees: 'Indigenous Trees',
}

export default function AdminProducts() {
  const navigate = useNavigate()
  const location = useLocation()
  const [authed, setAuthed] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  if (authed === null && loading) return <div className="admin-state">Loading shop products...</div>
  if (!authed) return <Navigate to="/admin/sign-in" replace />

  return <section className="admin-content-page admin-products-page">
    <div className="admin-page-heading admin-products-heading">
      <div><span className="admin-eyebrow">Shop</span><h1>Products</h1><p>Manage products and the details customers see in the shop.</p></div>
      <div className="admin-products-actions">
        <button className="admin-table-action" type="button" onClick={loadProducts} disabled={loading}><FontAwesomeIcon icon={faRotate} /> Refresh</button>
        <button className="admin-user-submit admin-products-add" type="button" onClick={() => navigate('/admin/products/new')}><FontAwesomeIcon icon={faPlus} /> Add Product</button>
      </div>
    </div>
    <div className="admin-products-list admin-products-list-only" aria-label="Shop products">
    {location.state?.message && <p className="admin-form-success" role="status">{location.state.message}</p>}
    {error && <p className="admin-form-error" role="alert">{error}</p>}

      <div className="admin-user-list-heading"><div><span className="admin-eyebrow">Catalog</span><h2>{products.length} products</h2></div></div>
      {loading ? <p className="admin-products-empty">Loading products...</p> : products.length === 0 ? <p className="admin-products-empty">No products yet.</p> : <div className="admin-products-table-wrap">
        <table className="admin-data-table admin-products-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Status</th><th /></tr></thead>
          <tbody>{products.map(product => <tr key={product.id}>
            <td><div className="admin-product-table-name"><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.id}</small></span></div></td>
            <td>{CATEGORIES[product.category] || product.category}</td>
            <td>UGX {Number(product.price).toLocaleString()} <small>{product.unit}</small></td>
            <td><small className={product.active ? 'admin-table-status' : 'admin-table-muted'}>{product.active ? 'Active' : 'Hidden'}</small></td>
            <td><button className="admin-table-action" type="button" onClick={() => navigate(`/admin/products/${encodeURIComponent(product.id)}/edit`)}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button></td>
          </tr>)}</tbody>
        </table>
      </div>}
    </div>
  </section>
}