import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileSignature } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend.replace(/\/$/, '') : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

export default function AdminApplications() {
  const [applications, setApplications] = useState(null)
  useEffect(() => { fetch(`${BACKEND}/api/admin/lease-applications`, { credentials: 'include' }).then(response => response.ok ? response.json() : Promise.reject()).then(data => setApplications(data.applications || [])).catch(() => setApplications([])) }, [])
  if (applications === null) return <div className="admin-state">Loading applications...</div>
  return <section className="admin-content-page"><div className="admin-page-heading"><div><span className="admin-eyebrow">Applications</span><h1>Lease applications</h1><p>Review people interested in growing with Boldstone.</p></div></div><div className="admin-table-wrap">{applications.length === 0 ? <div className="admin-empty"><FontAwesomeIcon icon={faFileSignature} /><p>No lease applications yet.</p></div> : <table className="admin-data-table"><thead><tr><th>Applicant</th><th>Plan</th><th>Contact</th><th>Country</th><th>Status</th><th>Date</th></tr></thead><tbody>{applications.map(application => <tr key={application.id}><td><strong>{application.full_name}</strong><small>{application.address || 'No address provided'}</small></td><td>{application.plan}</td><td><strong>{application.email}</strong><small>{application.phone}</small></td><td>{application.country}</td><td><span className="admin-status">{application.status}</span></td><td>{new Date(application.created_at).toLocaleDateString('en-GB')}</td></tr>)}</tbody></table>}</div></section>
}
