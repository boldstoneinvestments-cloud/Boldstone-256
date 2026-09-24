import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faEnvelope, faPaperPlane, faPlus, faRotate, faUser } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend.replace(/\/$/, '') : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')
const ADMIN_IDENTITIES = [
  { name: 'SSEMATA SABIRA', avatar: 'https://address-restaurant2.odoo.com/web/image/1888-df4ef49b/Sabira.webp' },
  { name: 'MOSES ALICWAMU', avatar: 'https://address-restaurant2.odoo.com/web/image/1571-51dfbae5/Moses%20Photo%20-%20up%20to%20date.webp' },
  { name: 'HABIB TUMWESIGE', avatar: 'https://address-restaurant2.odoo.com/web/image/1982-2595a3af/Habib%20Salah.webp' },
]

export default function AdminChat() {
  const { email: encodedEmail } = useParams()
  const selectedEmail = encodedEmail ? decodeURIComponent(encodedEmail) : null
  const [messages, setMessages] = useState(null)
  const [status, setStatus] = useState('loading')
  const [replies, setReplies] = useState({})
  const [sending, setSending] = useState('')
  const [adminIdentity, setAdminIdentity] = useState('')
  const [identityMenuOpen, setIdentityMenuOpen] = useState(false)
  const [identityPromptOpen, setIdentityPromptOpen] = useState(false)
  const [attachment, setAttachment] = useState(null)

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
    if ((!message && !attachment) || sending) return
    let identity = ADMIN_IDENTITIES.find(item => item.name === adminIdentity)
    if (!identity) {
      setIdentityMenuOpen(true)
      setIdentityPromptOpen(true)
      return
    }
    setSending(email)
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('message', message)
    formData.append('admin_name', identity.name)
    if (attachment) formData.append('attachment', attachment)
    const response = await fetch(`${BACKEND}/api/admin/chat/reply`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).catch(() => null)
    if (response?.ok) {
      const data = await response.json()
      setMessages(current => [data.message, ...(current || [])])
      setReplies(current => ({ ...current, [email]: '' }))
      setAttachment(null)
    }
    setSending('')
  }

  if (status === 'loading' && messages === null) return <div className="admin-state">Loading chat messages...</div>
  if (status === 'error') return <Navigate to="/admin/sign-in" replace />

  const threads = Object.values(messages.reduce((grouped, message) => {
    const key = message.email.toLowerCase()
    if (!grouped[key]) grouped[key] = { name: message.name, email: message.email, messages: [] }
    grouped[key].messages.push(message)
    return grouped
  }, {}))

  if (selectedEmail) {
    const thread = threads.find(item => item.email.toLowerCase() === selectedEmail.toLowerCase())
    if (!thread) {
      return <section className="admin-content-page admin-chat-page">
        <Link className="admin-chat-back" to="/admin/chat">Back to chats</Link>
        <div className="admin-empty admin-chat-empty"><FontAwesomeIcon icon={faComments} /><p>We couldn’t find this chat.</p></div>
      </section>
    }

    const orderedMessages = [...thread.messages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    return <section className="admin-content-page admin-chat-page">
      <div className="admin-page-heading admin-chat-heading">
        <div>
          <Link className="admin-chat-back" to="/admin/chat">Back to chats</Link>
          <span className="admin-eyebrow">Chat detail</span>
          <h1>{thread.name}</h1>
          <p><a href={`mailto:${thread.email}`}><FontAwesomeIcon icon={faEnvelope} />{thread.email}</a></p>
        </div>
        <span className="admin-status">Closed</span>
      </div>
      <article className="admin-chat-thread admin-chat-detail">
        <div className="admin-chat-thread-messages">
          {orderedMessages.map(message => <div className={`admin-chat-bubble${message.is_admin ? ' is-admin' : ''}`} key={message.id}>
            <p>{message.message}</p>
            {message.attachment_url && <a className="admin-chat-attachment" href={`${BACKEND}${message.attachment_url}`} target="_blank" rel="noreferrer">Open attachment: {message.attachment_name || 'file'}</a>}
            <time dateTime={message.created_at}>{message.is_ai ? 'Boldstone AI' : (message.is_admin ? (message.admin_name || 'Admin') : thread.name)} · {new Date(message.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</time>
          </div>)}
        </div>
        {identityPromptOpen && <div className="admin-modal-backdrop" role="presentation" onClick={() => setIdentityPromptOpen(false)}>
          <section className="admin-identity-modal" role="dialog" aria-modal="true" aria-labelledby="identity-modal-title" onClick={event => event.stopPropagation()}>
            <div className="admin-identity-modal-icon"><FontAwesomeIcon icon={faUser} /></div>
            <h2 id="identity-modal-title">Select your identity</h2>
            <p>Please choose the profile that is replying before sending this message.</p>
            <div className="admin-identity-modal-actions">
              <button type="button" className="admin-user-cancel" onClick={() => setIdentityPromptOpen(false)}>Cancel</button>
              <button type="button" className="admin-user-submit" onClick={() => { setIdentityPromptOpen(false); setIdentityMenuOpen(true) }}>Choose profile</button>
            </div>
          </section>
        </div>}
        <form className="admin-chat-reply" onSubmit={event => sendReply(event, thread.email, thread.name)}>
          <div className="admin-chat-identity-picker">
            <button className="admin-chat-reply-avatar" type="button" onClick={() => setIdentityMenuOpen(open => !open)} aria-label={adminIdentity ? `Replying as ${adminIdentity}. Change profile` : 'Select profile for reply'} title={adminIdentity ? `Replying as ${adminIdentity}. Change profile` : 'Select profile for reply'}>
              {adminIdentity ? <img src={ADMIN_IDENTITIES.find(identity => identity.name === adminIdentity).avatar} alt="" /> : <FontAwesomeIcon icon={faUser} />}
            </button>
            {identityMenuOpen && <div className="admin-chat-identity-menu" role="menu">
              {ADMIN_IDENTITIES.map(identity => <button key={identity.name} type="button" role="menuitem" className={identity.name === adminIdentity ? 'is-selected' : ''} onClick={() => { setAdminIdentity(identity.name); setIdentityMenuOpen(false) }}>
                <img src={identity.avatar} alt="" />
                <span>{identity.name}</span>
              </button>)}
            </div>}
          </div>
          <label className="admin-chat-attach-button" title="Attach a file under 5 MB">
            <input type="file" accept="image/*,.pdf,.doc,.docx,.txt,.csv" onChange={event => setAttachment(event.target.files?.[0] || null)} />
            <FontAwesomeIcon icon={faPlus} />
          </label>
          <input value={replies[thread.email] || ''} onChange={event => setReplies(current => ({ ...current, [thread.email]: event.target.value }))} placeholder="Write a reply..." aria-label={`Reply to ${thread.name}`} />
          <button type="submit" aria-label="Send reply" title="Send reply" disabled={sending === thread.email}><FontAwesomeIcon icon={faPaperPlane} /><span className="admin-chat-reply-label">Reply</span></button>
        </form>
      </article>
    </section>
  }

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
      {threads.map(thread => {
        const latestMessage = [...thread.messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
        return <Link className="admin-chat-thread admin-chat-thread-link" to={`/admin/chat/${encodeURIComponent(thread.email)}`} key={thread.email}>
        <div className="admin-chat-message-header">
          <div>
            <h2>{thread.name}</h2>
            <span className="admin-chat-email"><FontAwesomeIcon icon={faEnvelope} />{thread.email}</span>
          </div>
          <span className="admin-status">Closed</span>
        </div>
        <p className="admin-chat-preview">{latestMessage.message}</p>
        <div className="admin-chat-thread-footer"><span>{thread.messages.length} {thread.messages.length === 1 ? 'message' : 'messages'}</span><time dateTime={latestMessage.created_at}>{new Date(latestMessage.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</time><strong>Open chat</strong></div>
      </Link>
      })}
    </div>}
  </section>
}
