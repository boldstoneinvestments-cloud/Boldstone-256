import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faEnvelope, faPaperPlane, faPlus, faRotate, faTrash, faUser } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend.replace(/\/$/, '') : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')
const ADMIN_IDENTITIES = [
  { name: 'SSEMATA SABIRA', avatar: 'https://address-restaurant2.odoo.com/web/image/1888-df4ef49b/Sabira.webp' },
  { name: 'MOSES ALICWAMU', avatar: 'https://address-restaurant2.odoo.com/web/image/1571-51dfbae5/Moses%20Photo%20-%20up%20to%20date.webp' },
  { name: 'HABIB TUMWESIGE', avatar: 'https://address-restaurant2.odoo.com/web/image/1982-2595a3af/Habib%20Salah.webp' },
]

export default function AdminChat() {
  const { email: encodedEmail } = useParams()
  const navigate = useNavigate()
  const selectedEmail = encodedEmail ? decodeURIComponent(encodedEmail) : null
  const [messages, setMessages] = useState(null)
  const [status, setStatus] = useState('loading')
  const [replies, setReplies] = useState({})
  const [sending, setSending] = useState('')
  const [adminIdentity, setAdminIdentity] = useState('')
  const [identityMenuOpen, setIdentityMenuOpen] = useState(false)
  const [identityPromptOpen, setIdentityPromptOpen] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [openMessageMenu, setOpenMessageMenu] = useState(null)
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editText, setEditText] = useState('')

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

  useEffect(() => {
    loadMessages()
    const interval = window.setInterval(loadMessages, 5000)
    return () => window.clearInterval(interval)
  }, [loadMessages])

  const sendReply = async (event, email, name) => {
    event.preventDefault()
    const message = (replies[email] || '').trim()
    if ((!message && !attachments.length) || sending) return
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
    attachments.forEach(attachment => formData.append('attachment', attachment))
    const response = await fetch(`${BACKEND}/api/admin/chat/reply`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).catch(() => null)
    if (response?.ok) {
      const data = await response.json()
      setMessages(current => [...(data.messages || [data.message]).reverse(), ...(current || [])])
      setReplies(current => ({ ...current, [email]: '' }))
      setAttachments([])
    }
    setSending('')
  }

  const deleteAdminMessage = async messageId => {
    if (!window.confirm('Delete this message?')) return
    const response = await fetch(`${BACKEND}/api/admin/chat/messages/${messageId}`, { method: 'DELETE', credentials: 'include' }).catch(() => null)
    if (response?.ok) setMessages(current => (current || []).filter(message => message.id !== messageId))
    setOpenMessageMenu(null)
  }

  const editAdminMessage = async messageId => {
    const response = await fetch(`${BACKEND}/api/admin/chat/messages/${messageId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ message: editText }) }).catch(() => null)
    if (!response?.ok) return
    setMessages(current => (current || []).map(message => message.id === messageId ? { ...message, message: editText } : message))
    setEditingMessageId(null)
  }

  const deleteChat = async (email, name) => {
    if (!window.confirm(`Delete the entire chat with ${name || 'this user'}?`)) return
    const response = await fetch(`${BACKEND}/api/admin/chat/${encodeURIComponent(email)}/delete`, { method: 'DELETE', credentials: 'include' }).catch(() => null)
    if (response?.ok) navigate('/admin/chat')
  }

  const deleteAllChats = async () => {
    if (!messages?.length || !window.confirm(`Delete all ${messages.length} chat messages? This cannot be undone.`)) return
    const response = await fetch(`${BACKEND}/api/admin/chat/delete-all`, { method: 'DELETE', credentials: 'include' }).catch(() => null)
    if (response?.ok) setMessages([])
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
    const latestMessage = orderedMessages[orderedMessages.length - 1]
    const aiThinking = latestMessage && !latestMessage.is_admin && !latestMessage.is_ai
    return <section className="admin-content-page admin-chat-page">
      <div className="admin-page-heading admin-chat-heading">
        <div>
          <Link className="admin-chat-back" to="/admin/chat">Back to chats</Link>
          <span className="admin-eyebrow">Chat detail</span>
          <h1 className="admin-chat-detail-title">{thread.name}{(latestMessage?.is_ai || aiThinking) && <img className={`admin-chat-header-ai-icon${aiThinking ? ' is-thinking' : ''}`} src="/images/AI%20icon.png" alt="AI is in control" />}</h1>
          <p><a href={`mailto:${thread.email}`}><FontAwesomeIcon icon={faEnvelope} />{thread.email}</a></p>
        </div>
        <div className="admin-chat-detail-actions"><span className="admin-status">Closed</span><button className="admin-chat-delete-button" type="button" onClick={() => deleteChat(thread.email, thread.name)} title="Delete entire chat" aria-label="Delete entire chat"><FontAwesomeIcon icon={faTrash} /></button></div>
      </div>
      <article className="admin-chat-thread admin-chat-detail">
        <div className="admin-chat-thread-messages">
          {orderedMessages.map(message => <div className={`admin-chat-bubble${message.is_admin ? ' is-admin' : ''}${message.is_ai ? ' is-ai' : ''}`} key={message.id}>
            <div className="admin-chat-message-actions"><button type="button" onClick={() => setOpenMessageMenu(openMessageMenu === message.id ? null : message.id)} aria-label="Message actions">...</button>{openMessageMenu === message.id && <div className="admin-chat-message-menu"><button type="button" onClick={() => deleteAdminMessage(message.id)}>Delete</button>{message.is_admin && <button type="button" onClick={() => { setEditingMessageId(message.id); setEditText(message.message); setOpenMessageMenu(null) }}>Edit</button>}</div>}</div>
            <span className="admin-chat-sender">{message.is_ai ? <><img className="admin-chat-ai-icon" src="/images/AI%20icon.png" alt="AI" />Boldstone AI</> : (message.is_admin ? (message.admin_name || 'Sent by admin') : thread.name)}</span>
            {editingMessageId === message.id ? <div className="admin-chat-edit"><textarea value={editText} onChange={event => setEditText(event.target.value)} /><span><button type="button" onClick={() => editAdminMessage(message.id)}>Save</button><button type="button" onClick={() => setEditingMessageId(null)}>Cancel</button></span></div> : <p>{message.message}</p>}
            {message.attachment_url && <a className="admin-chat-attachment" href={`${BACKEND}${message.attachment_url}`} target="_blank" rel="noreferrer">Open attachment: {message.attachment_name || 'file'}</a>}
            <time dateTime={message.created_at}>{message.is_ai ? 'Boldstone AI' : (message.is_admin ? (message.admin_name || 'Admin') : thread.name)} · {new Date(message.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</time>
          </div>)}
          {aiThinking && <div className="admin-chat-bubble is-ai admin-chat-thinking" aria-label="Boldstone AI is thinking">
            <span className="admin-chat-sender"><img className="admin-chat-ai-icon is-thinking" src="/images/AI%20icon.png" alt="AI" />Boldstone AI</span>
            <span className="admin-chat-thinking-dots"><i /><i /><i /></span>
          </div>}
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
            <input type="file" accept="image/*,.pdf,.doc,.docx,.txt,.csv" multiple onChange={event => setAttachments(Array.from(event.target.files || []))} />
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
      <div className="admin-chat-inbox-actions">
        <button className="admin-chat-delete-all-button" type="button" onClick={deleteAllChats} disabled={!messages.length}>
          <FontAwesomeIcon icon={faTrash} /> Delete all chats
        </button>
        <button className="admin-refresh-button" type="button" onClick={loadMessages} disabled={status === 'loading'}>
          <FontAwesomeIcon icon={faRotate} spin={status === 'loading'} /> Refresh
        </button>
      </div>
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
