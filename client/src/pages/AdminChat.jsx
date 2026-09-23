import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faEnvelope, faPaperPlane, faRotate } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend.replace(/\/$/, '') : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')

export default function AdminChat() {
  const [messages, setMessages] = useState(null)
  const [status, setStatus] = useState('loading')
  const [replies, setReplies] = useState({})
  const [sending, setSending] = useState('')

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

  const sendReply = async (event, email, name) => {
    event.preventDefault()
    const message = (replies[email] || '').trim()
    if (!message || sending) return
    setSending(email)
    const response = await fetch(`${BACKEND}/api/admin/chat/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, message }),
    }).catch(() => null)
    if (response?.ok) {
      const data = await response.json()
      setMessages(current => [data.message, ...(current || [])])
      setReplies(current => ({ ...current, [email]: '' }))
    }
    setSending('')
  }

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
      {Object.values(messages.reduce((threads, message) => {
        const key = message.email.toLowerCase()
        if (!threads[key]) threads[key] = { name: message.name, email: message.email, messages: [] }
        threads[key].messages.push(message)
        return threads
      }, {})).map(thread => <article className="admin-chat-thread" key={thread.email}>
        <div className="admin-chat-message-header">
          <div>
            <h2>{thread.name}</h2>
            <a href={`mailto:${thread.email}`}><FontAwesomeIcon icon={faEnvelope} />{thread.email}</a>
          </div>
          <span className="admin-status">{thread.messages.length} {thread.messages.length === 1 ? 'message' : 'messages'}</span>
        </div>
        <div className="admin-chat-thread-messages">
          {thread.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map(message => <div className={`admin-chat-bubble${message.is_admin ? ' is-admin' : ''}`} key={message.id}>
            <p>{message.message}</p>
            <time dateTime={message.created_at}>{message.is_admin ? 'You' : thread.name} · {new Date(message.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</time>
          </div>)}
        </div>
        <form className="admin-chat-reply" onSubmit={event => sendReply(event, thread.email, thread.name)}>
          <input value={replies[thread.email] || ''} onChange={event => setReplies(current => ({ ...current, [thread.email]: event.target.value }))} placeholder="Write a reply..." aria-label={`Reply to ${thread.name}`} />
          <button type="submit" disabled={sending === thread.email}><FontAwesomeIcon icon={faPaperPlane} /> Reply</button>
        </form>
      </article>)}
    </div>}
  </section>
}
