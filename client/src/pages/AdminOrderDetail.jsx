import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app')
  ? configuredBackend.replace(/\/$/, '')
  : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

export default function AdminOrderDetail() {
  const { id } = useParams()
  const [authed, setAuthed] = useState(null)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/admin/orders`, { credentials: 'include' })
        if (res.status === 401 || res.status === 403) {
          setAuthed(false)
          return
        }
        if (!res.ok) throw new Error()

        const data = await res.json()
        const matched = (data.orders || []).find(item => String(item.id) === String(id))
        setOrder(matched || null)
        setAuthed(true)
      } catch {
        setOrder(null)
        setAuthed(true)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [id])

  if (authed === null || loading) {
    return <div className="admin-state">Loading order...</div>
  }

  if (!authed) {
    return <Navigate to="/admin/sign-in" replace />
  }

  return (
    <section className="admin-content-page admin-order-detail-page">
      <div className="admin-page-heading admin-order-detail-header">
        <div>
          <span className="admin-eyebrow">Order detail</span>
          <h1>{order ? (order.invoice_number || 'Order detail') : 'Order not found'}</h1>
          <p>Review the full customer order and delivery information.</p>
        </div>
      </div>

      {!order ? (
        <div className="admin-empty admin-order-empty">
          <p>We couldn’t find this order.</p>
        </div>
      ) : (
        <div className="admin-order-detail-shell">
          <div className="admin-order-detail-grid">
            {[
              ['Customer', order.name],
              ['Email', order.email || '—'],
              ['Phone', order.phone || '—'],
              ['Date', new Date(order.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })],
              ['Product', order.product],
              ['Quantity', order.quantity],
              ['Location', order.location || '—'],
            ].map(([label, value]) => (
              <div key={label} className="admin-order-info-card">
                <p className="admin-order-info-label">{label}</p>
                <p className="admin-order-info-value">{value}</p>
              </div>
            ))}
          </div>

          <div className="admin-order-note-card">
            <p className="admin-order-note-label">Notes</p>
            <p className="admin-order-note-value">
              {order.notes || 'No notes provided.'}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
