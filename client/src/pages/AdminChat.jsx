import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faEnvelope, faRotate } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend.replace(/\/$/, '') : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

export default function AdminChat() {
  const [messages, setMessages] = useState(null)
  const [status, setStatus] = useState('loading')

  const loadMessages = useCallback(() => {
    setStatus('loading')
    fetch(`${BACKEND}/api/admin/chat`, { credentials: 'include' })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Unable to load messages')))
      .then(data => {
        setMessages(data.messages || [])
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => { loadMessages() }, [loadMessages])

  if (status === 'loading' && messages === null) return <div className="admin-state">Loading chat messages...</div>
  if (status === 'error') return <Navigate to="/admin/sign-in" replace />

  return <section className="admin-content-page admin-chat-page">
    <div className="admin-page-heading admin-chat-heading">
      <div>
        <span className="admin-eyebrow">Inbox</span>
        <h1>Chat messages</h1>
        <p>Messages sent by visitors through the website chat.</p>
      </div>
      <button className="admin-refresh-button" type="button" onClick={loadMessages} disabled={status === 'loading'}>
        <FontAwesomeIcon icon={faRotate} spin={status === 'loading'} />
        Refresh
      </button>
    </div>

    <div className="admin-chat-summary">
      <span><FontAwesomeIcon icon={faComments} /></span>
      <div><strong>{messages.length}</strong><small>{messages.length === 1 ? 'message received' : 'messages received'}</small></div>
    </div>

    {messages.length === 0 ? <div className="admin-empty admin-chat-empty"><FontAwesomeIcon icon={faComments} /><p>No chat messages yet.</p></div> : <div className="admin-chat-list">
      {messages.map(message => <article className="admin-chat-message" key={message.id}>
        <div className="admin-chat-message-header">
          <div>
            <h2>{message.name}</h2>
            <a href={`mailto:${message.email}`}><FontAwesomeIcon icon={faEnvelope} />{message.email}</a>
          </div>
          <time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</time>
        </div>
        <p>{message.message}</p>
      </article>)}
    </div>}
  </section>
}
