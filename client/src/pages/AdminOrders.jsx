import { useState, useEffect, useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight, faBoxOpen } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app')
  ? configuredBackend.replace(/\/$/, '')
  : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

export default function AdminOrders() {
  const [authed, setAuthed] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchErr, setFetchErr] = useState('')

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setFetchErr('')
    try {
      const res = await fetch(`${BACKEND}/api/admin/orders`, { credentials: 'include' })
      if (res.status === 401 || res.status === 403) { setAuthed(false); return }
      if (!res.ok) throw new Error()
      const data = await res.json()
      setOrders(data.orders || [])
      setAuthed(true)
    } catch {
      setFetchErr('Could not load orders. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  if (authed === null) {
    return <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', color: '#777', padding: 24 }}>Checking admin session...</div>
  }

  if (!authed) {
    return <Navigate to="/admin/sign-in" replace />
  }

  return (
    <div style={{ background: '#f4f8f7', minHeight: '100vh', padding: 'clamp(24px, 6vw, 48px) clamp(14px, 4vw, 24px)' }}>
      <div style={{ width: '100%', maxWidth: 'none', margin: '0 auto', boxSizing: 'border-box' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#0f8972', marginBottom: 4 }}>Admin Portal</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0d1f1c', margin: 0 }}>Orders Dashboard</h1>
          </div>
          <button onClick={fetchOrders} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e0e0e0', color: '#0f8972', fontWeight: 700, fontSize: 14, padding: '10px 18px', borderRadius: 8, cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faRotateRight} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginBottom: 32 }}>
          {[
            { label: 'Total Orders', value: orders.length, color: '#0f8972', bg: '#e6f4f1' },
            { label: 'Latest order', value: orders[0] ? new Date(orders[0].created_at).toLocaleDateString() : '—', color: '#2563eb', bg: '#dbeafe' },
            { label: 'Customers', value: new Set(orders.map(order => order.email)).size, color: '#16a34a', bg: '#dcfce7' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '12px 8px', minWidth: 0, overflow: 'hidden' }}>
              <p style={{ fontSize: 9, color: '#888', fontWeight: 700, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1.25, overflowWrap: 'anywhere' }}>{s.label}</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: s.color, margin: 0, lineHeight: 1.15, overflowWrap: 'anywhere' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {fetchErr && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '12px 16px', fontSize: 14, marginBottom: 24 }}>
            {fetchErr}
          </div>
        )}

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#888', fontSize: 14 }}>Loading orders…</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: 64, textAlign: 'center' }}>
              <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: 40, color: '#ccc', marginBottom: 16 }} />
              <p style={{ color: '#888', fontSize: 15, margin: 0 }}>No orders yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f4f8f7', borderBottom: '1px solid #e0e0e0' }}>
                          {['Invoice', 'Date', 'Customer', 'Phone', 'Email', 'Product', 'Qty', 'Location', 'Notes'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '14px 16px', color: '#999', fontWeight: 600, whiteSpace: 'nowrap' }}>{o.invoice_number || o.id}</td>
                      <td style={{ padding: '14px 16px', color: '#555', whiteSpace: 'nowrap' }}>
                        {new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0d1f1c', whiteSpace: 'nowrap' }}>{o.name}</td>
                      <td style={{ padding: '14px 16px', color: '#555' }}>{o.phone}</td>
                      <td style={{ padding: '14px 16px', color: '#555' }}>{o.email || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#0d1f1c', fontWeight: 600, maxWidth: 200, whiteSpace: 'nowrap' }}>{o.product}</td>
                      <td style={{ padding: '14px 16px', color: '#0d1f1c', fontWeight: 700, textAlign: 'center' }}>{o.quantity}</td>
                      <td style={{ padding: '14px 16px', color: '#555', maxWidth: 160 }}>{o.location}</td>
                      <td style={{ padding: '14px 16px', color: '#555', minWidth: 180 }}>{o.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
