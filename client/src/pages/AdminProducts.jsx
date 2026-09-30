import { useCallback, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus, faRotate, faSkull, faTrash } from '@fortawesome/free-solid-svg-icons'

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
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
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

  const deleteProduct = async () => {
    if (!productToDelete || deleting) return
    setDeleting(true)
    setDeleteError('')
    try {
      const response = await fetch(`${BACKEND}/api/admin/shop/products/${encodeURIComponent(productToDelete.slug || productToDelete.id)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await response.json().catch(() => ({}))
      if (response.status === 401 || response.status === 403) {
        setAuthed(false)
        return
      }
      if (!response.ok) throw new Error(data.error || 'Could not delete this product.')
      setProducts(current => current.filter(product => product.id !== productToDelete.id))
      setProductToDelete(null)
    } catch (deleteFailure) {
      setDeleteError(deleteFailure.message || 'Could not delete this product.')
    } finally {
      setDeleting(false)
    }
  }

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
            <td className="admin-product-row-actions">
              <button className="admin-table-action" type="button" onClick={() => navigate(`/admin/products/${encodeURIComponent(product.slug || product.id)}/edit`)}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
              <button className="admin-product-delete-action" type="button" title={`Delete ${product.name}`} aria-label={`Delete ${product.name}`} onClick={() => { setDeleteError(''); setProductToDelete(product) }}><FontAwesomeIcon icon={faTrash} /></button>
            </td>
          </tr>)}</tbody>
        </table>
      </div>}
    </div>
    {productToDelete && <div className="admin-modal-backdrop" role="presentation" onClick={() => { if (!deleting) setProductToDelete(null) }}>
      <section className="admin-product-delete-modal" role="dialog" aria-modal="true" aria-labelledby="admin-product-delete-title" onClick={event => event.stopPropagation()} onKeyDown={event => { if (event.key === 'Escape' && !deleting) setProductToDelete(null) }} tabIndex={-1}>
        <div className="admin-product-delete-icon" aria-hidden="true"><FontAwesomeIcon icon={faSkull} /></div>
        <span className="admin-product-delete-kicker">Permanent action</span>
        <h2 id="admin-product-delete-title">Delete {productToDelete.name}?</h2>
        <p>This removes the product from the shop and cannot be undone. Existing orders are preserved; if any orders reference this product, deletion will be blocked.</p>
        {deleteError && <p className="admin-product-delete-error" role="alert">{deleteError}</p>}
        <div className="admin-product-delete-modal-actions">
          <button className="admin-user-cancel" type="button" onClick={() => setProductToDelete(null)} disabled={deleting} autoFocus>Cancel</button>
          <button className="admin-product-delete-confirm" type="button" onClick={deleteProduct} disabled={deleting}><FontAwesomeIcon icon={faTrash} /> {deleting ? 'Deleting...' : 'Delete product'}</button>
        </div>
      </section>
    </div>}
  </section>
}