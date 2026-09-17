import { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faRotateRight, faBoxOpen } from '@fortawesome/free-solid-svg-icons'

const ADMIN_PASSWORD = 'boldstone2026'
const BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const STATUS_STYLES = {
  Pending:   { bg: '#fef3c7', color: '#d97706', next: 'Confirmed' },
  Confirmed: { bg: '#dbeafe', color: '#2563eb', next: 'Delivered' },
  Delivered: { bg: '#dcfce7', color: '#16a34a', next: null },
}

function StatusBadge({ status, orderId, onUpdate }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pending
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20 }}>
        {status}
      </span>
      {s.next && (
        <button
          onClick={() => onUpdate(orderId, s.next)}
          style={{ fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.color}`, borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}
        >
          → {s.next}
        </button>
      )}
    </div>
  )
}

export default function AdminOrders() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwErr, setPwErr] = useState(false)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchErr, setFetchErr] = useState('')

  const login = e => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwErr(false) }
    else setPwErr(true)
  }

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setFetchErr('')
    try {
      const res = await fetch(`${BACKEND}/api/orders`)
      if (!res.ok) throw new Error()
      setOrders(await res.json())
    } catch {
      setFetchErr('Could not load orders. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (authed) fetchOrders() }, [authed, fetchOrders])

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${BACKEND}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    } catch {
      alert('Failed to update status.')
    }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f8f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <form onSubmit={login} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(15,137,114,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <FontAwesomeIcon icon={faLock} style={{ color: '#0f8972', fontSize: 22 }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0d1f1c', marginBottom: 6 }}>Admin Access</h2>
          <p style={{ fontSize: 13, color: '#777', marginBottom: 28 }}>Enter the password to view orders</p>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            style={{ width: '100%', border: `1px solid ${pwErr ? '#f87171' : '#e0e0e0'}`, borderRadius: 8, padding: '12px 14px', fontSize: 14, outline: 'none', marginBottom: 8, boxSizing: 'border-box' }}
          />
          {pwErr && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>Incorrect password</p>}
          <button type="submit" style={{ width: '100%', background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: 13, borderRadius: 8, border: 'none', cursor: 'pointer', marginTop: 8 }}>
            Login
          </button>
        </form>
      </div>
    )
  }

  const counts = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    confirmed: orders.filter(o => o.status === 'Confirmed').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
  }

  return (
    <div style={{ background: '#f4f8f7', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#0f8972', marginBottom: 4 }}>Admin Panel</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0d1f1c', margin: 0 }}>Orders Dashboard</h1>
          </div>
          <button onClick={fetchOrders} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e0e0e0', color: '#0f8972', fontWeight: 700, fontSize: 14, padding: '10px 18px', borderRadius: 8, cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faRotateRight} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Orders', value: counts.total, color: '#0f8972', bg: '#e6f4f1' },
            { label: 'Pending',      value: counts.pending,   color: '#d97706', bg: '#fef3c7' },
            { label: 'Confirmed',    value: counts.confirmed, color: '#2563eb', bg: '#dbeafe' },
            { label: 'Delivered',    value: counts.delivered, color: '#16a34a', bg: '#dcfce7' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: '20px 24px' }}>
              <p style={{ fontSize: 12, color: '#888', fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: s.color, margin: 0 }}>{s.value}</p>
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
                    {['#', 'Date', 'Customer', 'Phone', 'Email', 'Product', 'Qty', 'Location', 'Status'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '14px 16px', color: '#999', fontWeight: 600 }}>{o.id}</td>
                      <td style={{ padding: '14px 16px', color: '#555', whiteSpace: 'nowrap' }}>
                        {new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0d1f1c', whiteSpace: 'nowrap' }}>{o.name}</td>
                      <td style={{ padding: '14px 16px', color: '#555' }}>{o.phone}</td>
                      <td style={{ padding: '14px 16px', color: '#555' }}>{o.email || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#0d1f1c', fontWeight: 600, maxWidth: 200 }}>{o.product}</td>
                      <td style={{ padding: '14px 16px', color: '#0d1f1c', fontWeight: 700, textAlign: 'center' }}>{o.quantity}</td>
                      <td style={{ padding: '14px 16px', color: '#555', maxWidth: 160 }}>{o.location}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={o.status} orderId={o.id} onUpdate={updateStatus} />
                      </td>
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
