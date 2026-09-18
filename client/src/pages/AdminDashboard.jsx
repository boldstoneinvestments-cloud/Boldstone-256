import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faClipboardList, faFileSignature } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend.replace(/\/$/, '') : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

export default function AdminDashboard() {
  const [data, setData] = useState({ orders: [], applications: [] })
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    Promise.all([
      fetch(`${BACKEND}/api/admin/orders`, { credentials: 'include' }).then(response => response.ok ? response.json() : Promise.reject()),
      fetch(`${BACKEND}/api/admin/lease-applications`, { credentials: 'include' }).then(response => response.ok ? response.json() : Promise.reject()),
    ]).then(([orders, applications]) => { setData({ orders: orders.orders || [], applications: applications.applications || [] }); setStatus('ready') }).catch(() => setStatus('error'))
  }, [])

  if (status === 'loading') return <div className="admin-state">Loading dashboard...</div>
  if (status === 'error') return <Navigate to="/admin/sign-in" replace />

  return <section className="admin-dashboard-page">
    <div className="admin-dashboard-card-grid">
      <Link className="admin-metric-card" to="/admin/orders"><span><FontAwesomeIcon icon={faClipboardList} /></span><small>Total orders</small><strong>{data.orders.length}</strong><em>View orders <FontAwesomeIcon icon={faArrowRight} /></em></Link>
      <Link className="admin-metric-card" to="/admin/lease-applications"><span><FontAwesomeIcon icon={faFileSignature} /></span><small>Lease applications</small><strong>{data.applications.length}</strong><em>Review applications <FontAwesomeIcon icon={faArrowRight} /></em></Link>
    </div>
    <div className="admin-welcome-band"><div><span className="admin-eyebrow">Today</span><h2>Build the next harvest.</h2><p>Review every customer request from one calm, focused workspace.</p></div><Link to="/admin/orders">Open orders <FontAwesomeIcon icon={faArrowRight} /></Link></div>
  </section>
}
