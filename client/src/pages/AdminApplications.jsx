import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileSignature } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend.replace(/\/$/, '') : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

export default function AdminApplications() {
  const [applications, setApplications] = useState(null)
  useEffect(() => { fetch(`${BACKEND}/api/admin/lease-applications`, { credentials: 'include' }).then(response => response.ok ? response.json() : Promise.reject()).then(data => setApplications(data.applications || [])).catch(() => setApplications([])) }, [])
  const deleteApplication = async (event, application) => {
    event.stopPropagation()
    if (!window.confirm(`Delete the application from ${application.full_name}? This cannot be undone.`)) return

    const response = await fetch(`${BACKEND}/api/admin/lease-applications/${application.id}`, { method: 'DELETE', credentials: 'include' })
    if (response.ok) {
      setApplications(current => current.filter(item => item.id !== application.id))
    }
  }
  if (applications === null) return <div className="admin-state">Loading applications...</div>
  return <section className="admin-content-page"><div className="admin-page-heading"><div><span className="admin-eyebrow">Applications</span><h1>Lease applications</h1><p>Review people interested in growing with Boldstone.</p></div></div><div className="admin-table-wrap">{applications.length === 0 ? <div className="admin-empty"><FontAwesomeIcon icon={faFileSignature} /><p>No lease applications yet.</p></div> : <table className="admin-data-table"><thead><tr><th>Applicant</th><th>Plan</th><th>Contact</th><th>Country</th><th>Status</th><th>Date</th><th>Action</th></tr></thead><tbody>{applications.map(application => <tr key={application.id}><td><strong>{application.full_name}</strong><small>{application.address || 'No address provided'}</small></td><td>{application.plan}</td><td><strong>{application.email}</strong><small>{application.phone}</small></td><td>{application.country}</td><td><span className="admin-status">{application.status}</span></td><td>{new Date(application.created_at).toLocaleDateString('en-GB')}</td><td><button onClick={event => deleteApplication(event, application)} style={{ border: '1px solid #f1c8c4', borderRadius: 7, padding: '7px 10px', background: '#fff7f6', color: '#b64035', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Delete</button></td></tr>)}</tbody></table>}</div></section>
}
