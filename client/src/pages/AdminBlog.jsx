import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faTrash, faPlus, faLock } from '@fortawesome/free-solid-svg-icons'

const ADMIN_PASSWORD = 'boldstone2026'
const STORAGE_KEY = 'boldstone_blog_posts'

const categoryColors = {
  News: { bg: '#e6f4f1', color: '#0f8972' },
  Impact: { bg: '#fef3c7', color: '#d97706' },
  Industry: { bg: '#ede9fe', color: '#7c3aed' },
  Company: { bg: '#fee2e2', color: '#dc2626' },
  Agronomy: { bg: '#dcfce7', color: '#16a34a' },
}

function getPosts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

const emptyForm = { title: '', category: 'News', author: '', date: '', image: '', excerpt: '', body: '' }

export default function AdminBlog() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwErr, setPwErr] = useState(false)
  const [posts, setPosts] = useState(getPosts)
  const [form, setForm] = useState(emptyForm)
  const [success, setSuccess] = useState(false)
  const [view, setView] = useState('list') // 'list' | 'new'

  const login = e => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwErr(false) }
    else setPwErr(true)
  }

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = e => {
    e.preventDefault()
    const newPost = {
      id: Date.now(),
      title: form.title,
      category: form.category,
      author: form.author,
      date: form.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      image: form.image || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1400&q=80',
      excerpt: form.excerpt,
      body: form.body.split('\n\n').filter(p => p.trim()),
    }
    const updated = [newPost, ...posts]
    savePosts(updated)
    setPosts(updated)
    setForm(emptyForm)
    setSuccess(true)
    setView('list')
    setTimeout(() => setSuccess(false), 4000)
  }

  const deletePost = (id) => {
    const updated = posts.filter(p => p.id !== id)
    savePosts(updated)
    setPosts(updated)
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f8f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <form onSubmit={login} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(15,137,114,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <FontAwesomeIcon icon={faLock} style={{ color: '#0f8972', fontSize: 22 }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0d1f1c', marginBottom: 6 }}>Admin Access</h2>
          <p style={{ fontSize: 13, color: '#777', marginBottom: 28 }}>Enter the password to manage blog posts</p>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            style={{ width: '100%', border: `1px solid ${pwErr ? '#f87171' : '#e0e0e0'}`, borderRadius: 8, padding: '12px 14px', fontSize: 14, outline: 'none', marginBottom: 8, boxSizing: 'border-box' }}
          />
          {pwErr && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>Incorrect password</p>}
          <button type="submit" style={{ width: '100%', background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer', marginTop: 8 }}>
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ background: '#f4f8f7', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#0f8972', marginBottom: 4 }}>Admin Panel</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0d1f1c', margin: 0 }}>Blog Manager</h1>
          </div>
          {view === 'list'
            ? <button onClick={() => setView('new')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 20px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faPlus} /> New Post
              </button>
            : <button onClick={() => setView('list')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #e0e0e0', color: '#555', fontWeight: 700, fontSize: 14, padding: '11px 20px', borderRadius: 8, cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </button>
          }
        </div>

        {success && (
          <div style={{ background: '#e6f4f1', border: '1px solid #0f8972', borderRadius: 8, padding: '12px 16px', color: '#0f8972', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
            ✓ Post published successfully!
          </div>
        )}

        {/* NEW POST FORM */}
        {view === 'new' && (
          <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0d1f1c', margin: 0 }}>Write New Post</h2>

            {[
              { name: 'title', label: 'Title', type: 'text', placeholder: 'Post title...' },
              { name: 'author', label: 'Author', type: 'text', placeholder: 'e.g. Moses Alicwamu' },
              { name: 'date', label: 'Date (optional)', type: 'text', placeholder: 'e.g. July 10, 2026 — leave blank for today' },
              { name: 'image', label: 'Image URL (optional)', type: 'text', placeholder: 'https://... — leave blank for default' },
              { name: 'excerpt', label: 'Excerpt / Summary', type: 'text', placeholder: 'Short summary shown on the blog list...' },
            ].map(f => (
              <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#0d1f1c' }}>{f.label}</label>
                <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={handle}
                  required={!['date', 'image'].includes(f.name)}
                  style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: '#0d1f1c', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#0f8972'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0d1f1c' }}>Category</label>
              <select name="category" value={form.category} onChange={handle}
                style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: '#0d1f1c', outline: 'none', background: '#fff' }}>
                {Object.keys(categoryColors).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0d1f1c' }}>Article Body</label>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>Separate paragraphs with a blank line (press Enter twice between paragraphs)</p>
              <textarea name="body" placeholder="Write your article here...&#10;&#10;Start a new paragraph by leaving a blank line between sections." value={form.body} onChange={handle} required rows={14}
                style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: '#0d1f1c', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.7 }}
                onFocus={e => e.target.style.borderColor = '#0f8972'}
                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <button type="submit" style={{ background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
              Publish Post
            </button>
          </form>
        )}

        {/* POSTS LIST */}
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {posts.length === 0 && (
              <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: '40px', textAlign: 'center', color: '#999', fontSize: 14 }}>
                No posts yet. Click "New Post" to write your first article.
              </div>
            )}
            {posts.map(post => {
              const cat = categoryColors[post.category] || { bg: '#f0faf7', color: '#0f8972' }
              return (
                <div key={post.id} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ background: cat.bg, color: cat.color, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20 }}>{post.category}</span>
                      <span style={{ fontSize: 12, color: '#999' }}>{post.date}</span>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0d1f1c', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</p>
                    <p style={{ fontSize: 12, color: '#777', margin: '4px 0 0' }}>By {post.author}</p>
                  </div>
                  <button onClick={() => deletePost(post.id)}
                    style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
