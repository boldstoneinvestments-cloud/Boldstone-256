import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const API = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')).replace(/\/api$/, '') + '/api'

let csrfTokenPromise
const customerHeaders = () => {
  const token = localStorage.getItem('boldstone_customer_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const getCsrfToken = () => {
  if (!csrfTokenPromise) {
    csrfTokenPromise = fetch(`${API}/account/csrf`, { credentials: 'include' })
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => data.csrfToken)
      .catch(error => {
        csrfTokenPromise = undefined
        throw error
      })
  }
  return csrfTokenPromise
}

export default function ChatWidget() {
  const { search, hash } = useLocation()
  const savedAccount = (() => {
    try { return JSON.parse(localStorage.getItem('boldstone_customer_account') || 'null') } catch { return null }
  })()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('info') // 'info' | 'chat'
  const [account, setAccount] = useState(savedAccount)
  const [accountLoading, setAccountLoading] = useState(true)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! Welcome to Boldstone Investments. How can we help you today?' }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const lastIdRef = useRef(0)

  useEffect(() => {
    const googleToken = new URLSearchParams(hash.replace(/^#/, '')).get('google_token')
    if (googleToken) {
      localStorage.setItem('boldstone_customer_token', googleToken)
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
    }
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 3000)
    const token = localStorage.getItem('boldstone_customer_token')
    if (savedAccount && token) setStep('chat')
    fetch(`${API}/account/me`, { credentials: 'include', headers: customerHeaders(), signal: controller.signal })
      .then(async response => {
        if (response.status === 401) return { authenticated: false, invalidToken: true }
        if (!response.ok) throw new Error('Account check failed')
        return response.json()
      })
      .then(data => {
        if (data.authenticated && data.user) {
          setAccount(data.user)
          localStorage.setItem('boldstone_customer_account', JSON.stringify(data.user))
          setStep('chat')
          if (googleToken) setOpen(true)
        } else if (data.invalidToken) {
          localStorage.removeItem('boldstone_customer_token')
          localStorage.removeItem('boldstone_customer_account')
          setAccount(null)
          setStep('info')
        }
      })
      .catch(() => {})
      .finally(() => {
        window.clearTimeout(timeout)
        setAccountLoading(false)
      })
    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [search, hash])

  useEffect(() => {
    const handleAuthenticated = event => {
      if (!event.detail) return
      setAccount(event.detail)
      localStorage.setItem('boldstone_customer_account', JSON.stringify(event.detail))
      setStep('chat')
      setOpen(true)
      setAccountLoading(false)
    }
    window.addEventListener('boldstone-account-authenticated', handleAuthenticated)
    return () => window.removeEventListener('boldstone-account-authenticated', handleAuthenticated)
  }, [])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    if (step !== 'chat' || !account) return undefined
    let active = true
    const streamController = new AbortController()
    const wait = delay => new Promise(resolve => window.setTimeout(resolve, delay))
    const addMessages = incoming => setMessages(current => {
      let next = [...current]
      incoming.forEach(message => {
        lastIdRef.current = Math.max(lastIdRef.current, message.id)
        if (next.some(existing => existing.id === message.id)) return

        const pendingIndex = next.findIndex(existing => typeof existing.id === 'string' && existing.id.startsWith('pending-') && existing.from === 'user' && existing.text === message.message && !message.is_admin && !message.is_ai)
        if (pendingIndex !== -1) {
          next[pendingIndex] = { ...next[pendingIndex], id: message.id }
          return
        }

        next.push({ from: message.is_admin || message.is_ai ? 'bot' : 'user', text: message.message, id: message.id, is_ai: message.is_ai })
      })
      return next
    })
    const stream = async () => {
      try {
        const history = await fetch(`${API}/chat`, { credentials: 'include', headers: customerHeaders(), signal: streamController.signal }).then(response => response.ok ? response.json() : Promise.reject()).catch(() => null)
        if (history) addMessages(history.messages || [])
        while (active) {
          try {
            const response = await fetch(`${API}/chat/stream?last_id=${lastIdRef.current}`, { credentials: 'include', headers: { ...customerHeaders(), Accept: 'text/event-stream' }, signal: streamController.signal })
            if (!response.body) break
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''
            while (active) {
              const chunk = await reader.read()
              if (chunk.done) break
              buffer += decoder.decode(chunk.value, { stream: true })
              const events = buffer.split('\n\n')
              buffer = events.pop() || ''
              events.forEach(event => event.split('\n').filter(line => line.startsWith('data: ')).forEach(line => addMessages([JSON.parse(line.slice(6))])))
            }
          } catch (error) {
            if (error.name === 'AbortError') break
          }
          if (active) await wait(1000)
        }
      } catch (error) {
        if (error.name !== 'AbortError') return
      }
    }
    stream()
    return () => { active = false; streamController.abort() }
  }, [step, account])

  const send = async e => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    setSending(true)
    const pendingId = `pending-${Date.now()}`
    setMessages(messages => [...messages, { from: 'user', text, id: pendingId }])
    try {
      const csrfToken = await getCsrfToken()
      const response = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { ...customerHeaders(), 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ message: text }),
      })
      if (!response.ok) throw new Error('Message failed')
      const data = await response.json()
      setMessages(messages => {
        const updated = messages.map(message => message.id === pendingId ? { ...message, id: data.message.id } : message)
        if (!data.ai_message || updated.some(message => message.id === data.ai_message.id)) return updated
        return [...updated, { from: 'bot', text: data.ai_message.message, id: data.ai_message.id, is_ai: true }]
      })
    } catch {
      setMessages(messages => [
        ...messages.filter(message => message.id !== pendingId),
        { from: 'bot', text: 'Sorry, something went wrong. Please try again or email us directly.' },
      ])
    }
    setSending(false)
  }

  return (
    <>
      {/* Label */}
      {!open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 28, zIndex: 9999,
          color: '#c8a84b', fontWeight: 700, fontSize: 11,
          fontFamily: "'Inter','Segoe UI',sans-serif",
          pointerEvents: 'none', whiteSpace: 'nowrap',
          width: 56, textAlign: 'center',
          letterSpacing: 0.2,
        }}>
          Chat With Us
        </div>
      )}

      {/* Bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open chat"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #c8a84b, #e0c068)',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(200,168,75,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open
          ? <svg width={20} height={20} fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          : <svg width={22} height={22} fill="none" stroke="#fff" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        }
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 9998,
          width: 340, borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          background: '#0a1628', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column',
          fontFamily: "'Inter','Segoe UI',sans-serif",
        }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #0f8972, #12a688)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width={18} height={18} fill="none" stroke="#fff" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>{messages.some(message => message.is_ai) ? 'Boldstone AI' : 'Boldstone Support'}</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, margin: 0 }}>{messages.some(message => message.is_ai) ? 'Friendly answers from Boldstone AI' : 'We typically reply within a few hours'}</p>
            </div>
          </div>

          {step === 'info' ? (
            /* Info form */
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>{accountLoading ? 'Checking your account...' : 'Sign in before starting a private support chat.'}</p>
              {!accountLoading && <>
                <Link to="/account/sign-in" style={{ background: 'linear-gradient(90deg,#0f8972,#12a688)', color: '#fff', borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 13, textAlign: 'center', textDecoration: 'none' }}>Sign in</Link>
                <Link to="/account/sign-up" style={{ color: '#8be1cd', fontSize: 13, textAlign: 'center', textDecoration: 'none' }}>Create an account</Link>
              </>}
            </div>
          ) : (
            /* Chat */
            <>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '80%', padding: '9px 13px', borderRadius: m.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      background: m.from === 'user' ? 'linear-gradient(135deg,#0f8972,#12a688)' : 'rgba(255,255,255,0.08)',
                      color: '#fff', fontSize: 13, lineHeight: 1.55,
                    }}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div style={{ display: 'flex', gap: 4, padding: '6px 0' }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#0f8972', animation: `bounce 1s ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              {(
                <form onSubmit={send} style={{ padding: '10px 12px 14px', display: 'flex', gap: 8, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <input
                    value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Type a message…"
                    style={{
                      flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 13,
                      outline: 'none', fontFamily: 'inherit',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(15,137,114,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <button type="submit" disabled={sending} style={{
                    background: 'linear-gradient(135deg,#0f8972,#12a688)', border: 'none',
                    borderRadius: 8, width: 40, height: 40, cursor: 'pointer', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width={16} height={16} fill="none" stroke="#fff" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        input::placeholder { color: rgba(255,255,255,0.3) !important; }
      `}</style>
    </>
  )
}
