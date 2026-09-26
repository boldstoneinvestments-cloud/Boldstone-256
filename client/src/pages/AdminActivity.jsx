import { useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faRotate, faUsers } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend.replace(/\/$/, '') : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

const pageLabels = {
  '/admin': 'Dashboard',
  '/admin/orders': 'Orders',
  '/admin/lease-applications': 'Lease applications',
  '/admin/chat': 'Chat messages',
  '/admin/users': 'Users',
  '/admin/activity': 'Activity',
  '/admin/blog': 'Blog manager',
}

const pageLabel = path => pageLabels[path] || path || 'Not recorded'
const formatDate = value => new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })

export default function AdminActivity() {
  const [data, setData] = useState({ admins: [], activity: [] })
  const [status, setStatus] = useState('loading')

  const loadActivity = useCallback(() => {
    fetch(`${BACKEND}/api/admin/activity`, { credentials: 'include' })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Unable to load admin activity')))
      .then(result => {
        setData({ admins: result.admins || [], activity: result.activity || [] })
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => {
    loadActivity()
    const interval = window.setInterval(loadActivity, 20000)
    return () => window.clearInterval(interval)
  }, [loadActivity])

  return <section className="admin-content-page admin-activity-page">
    <div className="admin-page-heading">
      <div>
        <span className="admin-eyebrow">Team activity</span>
        <h1>Presence &amp; changes</h1>
        <p>Current admin sessions, page visits, and recorded changes.</p>
      </div>
      <button className="admin-refresh-button" type="button" onClick={loadActivity} disabled={status === 'loading'}>
        <FontAwesomeIcon icon={faRotate} spin={status === 'loading'} /> Refresh
      </button>
    </div>

    <section className="admin-activity-section" aria-labelledby="admin-presence-heading">
      <div className="admin-activity-section-heading">
        <h2 id="admin-presence-heading"><FontAwesomeIcon icon={faUsers} /> Admin presence</h2>
        <span>{data.admins.filter(admin => admin.is_online).length} online</span>
      </div>
      {status === 'loading' && data.admins.length === 0 ? <p className="admin-activity-empty">Loading presence...</p> : data.admins.length === 0 ? <p className="admin-activity-empty">No admin sessions have checked in yet.</p> : <div className="admin-presence-list">
        {data.admins.map(admin => <article className="admin-presence-row" key={admin.username}>
          {admin.avatar ? <img src={admin.avatar} alt="" /> : <span className="admin-presence-avatar">{admin.name.slice(0, 1)}</span>}
          <div className="admin-presence-person"><strong>{admin.name}</strong><small>{admin.username}</small></div>
          <span className={`admin-presence-status${admin.is_online ? ' is-online' : ''}`}><i />{admin.is_online ? 'Online' : 'Offline'}</span>
          <div className="admin-presence-page"><small>{admin.is_online ? 'Current page' : 'Last visited'}</small><strong>{pageLabel(admin.is_online ? admin.current_page : admin.last_visited_page)}</strong><span>{admin.is_online ? admin.current_page : admin.last_visited_page}</span></div>
          <time dateTime={admin.last_seen}>{formatDate(admin.last_seen)}</time>
        </article>)}
      </div>}
    </section>

    <section className="admin-activity-section" aria-labelledby="admin-audit-heading">
      <div className="admin-activity-section-heading">
        <h2 id="admin-audit-heading"><FontAwesomeIcon icon={faClockRotateLeft} /> Recent activity</h2>
        <span>Latest 100 events</span>
      </div>
      {status === 'error' ? <p className="admin-activity-empty">Activity could not be loaded. Refresh to try again.</p> : data.activity.length === 0 ? <p className="admin-activity-empty">No page visits or changes have been recorded yet.</p> : <div className="admin-audit-list">
        {data.activity.map(event => <article className="admin-audit-row" key={event.id}>
          <div className="admin-audit-actor"><strong>{event.identity_name}</strong><small>Account: {event.actor_username}</small></div>
          <div className="admin-audit-description"><strong>{event.action}</strong><span>{event.target_type && `${event.target_type}${event.target_id ? ` · ${event.target_id}` : ''}`}</span>{event.details?.title && <small>{event.details.title}</small>}</div>
          <div className="admin-audit-page"><small>Page</small><strong>{pageLabel(event.page)}</strong></div>
          <time dateTime={event.created_at}>{formatDate(event.created_at)}</time>
        </article>)}
      </div>}
    </section>
  </section>
}