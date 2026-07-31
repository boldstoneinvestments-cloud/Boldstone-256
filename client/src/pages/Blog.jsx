import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCalendar, faUser, faPlus, faLock, faTimes, faTrash, faImage } from '@fortawesome/free-solid-svg-icons'

const STORAGE_KEY = 'boldstone_blog_posts'
const ADMIN_PASSWORD = 'boldstone2026'

function getStoredPosts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}
function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

const hardcodedPosts = [
  {
    id: 1,
    title: 'Boldstone To Raise US $140,000 Pre-Seed Investment',
    category: 'News',
    author: 'Boldstone',
    date: 'June 17, 2026',
    image: 'https://address-restaurant2.odoo.com/web/image/1948-db6cb14d/Land%20aerial%20view.webp',
    excerpt: 'Boldstone Announces US $140K (UGX 500M) Equity and Debt Financing Plan to Build Coffee Processing Infrastructure in Uganda.',
    body: [
      'Boldstone Property Investments LLC today announced its 2026-2027 plan to finance the establishment of coffee processing infrastructure in Kyenjojo District, Uganda. Boldstone is raising money in order to set up coffee processing infrastructure that will enable it to dry, hull and purchase coffee beans from thousands of smallholder farmers in Uganda. The investment will also enable the establishment of Boldstone\'s coffee digital infrastructure, extend small recoverable loans to verified smallholder farmers and help the business accomplish the incorporation in the USA as a Delaware C-Corp.',
      'Boldstone expects to raise UGX 500M (Approx. US $140,000) of gross cash proceeds during the 2026-2027 financial year. The company plans to achieve its funding objective by using a balanced combination of debt and equity financing to maintain a solid investment-grade balance sheet. On the equity side, Boldstone plans to raise approximately half of its 2026-2027 funding through a combination of equity-linked and common equity issuances.',
      'The company plans to issue equity from the at-the-market program flexibly over time based on market conditions and capital needs. On the debt side, Boldstone intends to raise upwards of UGX 150M (US$ 40,000) of low interest debt via crowdfunding and UGX 100M (US $27,000) in a low interest impact linked Uganda government facility.',
      'This funding plan reflects Boldstone\'s commitment to maintaining an investment-grade rating, prudent capital allocation, balance sheet strength, and transparency with investors as the company continues to expand its sustainable coffee trade and farming business. These transactions have been approved by Boldstone\'s Board of Directors which constitutes the founding members. Boldstone is in the process of identifying a financial advisor for the debt and preferred equity offering which may cause slight changes to fund allocations.',
    ],
  },
]

const categoryColors = {
  News:     { bg: '#e6f4f1', color: '#0f8972' },
  Impact:   { bg: '#fef3c7', color: '#d97706' },
  Industry: { bg: '#ede9fe', color: '#7c3aed' },
  Company:  { bg: '#fee2e2', color: '#dc2626' },
  Agronomy: { bg: '#dcfce7', color: '#16a34a' },
}

const emptyForm = { title: '', category: 'News', author: '', date: '', image: '', imagePreview: '', excerpt: '', body: '' }

export default function Blog() {
  const [active, setActive] = useState(null)
  const [storedPosts, setStoredPosts] = useState(getStoredPosts)
  const allPosts = [...storedPosts, ...hardcodedPosts]

  // modal states
  const [modal, setModal] = useState(null) // null | 'login' | 'write' | 'manage'
  const [pw, setPw] = useState('')
  const [pwErr, setPwErr] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [published, setPublished] = useState(false)

  const openLogin = () => { setModal('login'); setPw(''); setPwErr(false) }
  const closeModal = () => { setModal(null); setPw(''); setPwErr(false); setForm(emptyForm); setPublished(false) }

  const login = e => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) { setModal('write'); setPwErr(false) }
    else setPwErr(true)
  }

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImageUpload = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({ ...f, image: reader.result, imagePreview: reader.result }))
    reader.readAsDataURL(file)
  }

  const publish = e => {
    e.preventDefault()
    const newPost = {
      id: Date.now(),
      title: form.title,
      category: form.category,
      author: form.author,
      date: form.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      image: form.image || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1400&q=80',
      // base64 image stored directly
      excerpt: form.excerpt,
      body: form.body.split('\n\n').filter(p => p.trim()),
    }
    const updated = [newPost, ...storedPosts]
    savePosts(updated)
    setStoredPosts(updated)
    setForm(emptyForm)
    setPublished(true)
  }

  const deletePost = (id) => {
    const updated = storedPosts.filter(p => p.id !== id)
    savePosts(updated)
    setStoredPosts(updated)
  }

  const open = (post) => { setActive(post); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const close = () => { setActive(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  // ── ARTICLE DETAIL ──
  if (active) {
    const cat = categoryColors[active.category] || { bg: '#f0faf7', color: '#0f8972' }
    return (
      <div style={{ background: '#f4f8f7', minHeight: '100vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <button onClick={close} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#0f8972', fontWeight: 700, fontSize: 14, marginBottom: 32, padding: 0 }}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Blog
          </button>
          <img src={active.image} alt={active.title} style={{ width: '100%', height: 380, objectFit: 'cover', borderRadius: 16, marginBottom: 32 }} />
          <span style={{ background: cat.bg, color: cat.color, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, display: 'inline-block' }}>
            {active.category}
          </span>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, color: '#0d1f1c', lineHeight: 1.2, margin: '12px 0 20px' }}>{active.title}</h1>
          <div style={{ display: 'flex', gap: 24, marginBottom: 36, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: '#777', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FontAwesomeIcon icon={faUser} style={{ color: '#0f8972' }} /> {active.author}
            </span>
            <span style={{ fontSize: 13, color: '#777', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FontAwesomeIcon icon={faCalendar} style={{ color: '#0f8972' }} /> {active.date}
            </span>
          </div>
          <div style={{ borderTop: '2px solid #e0e0e0', paddingTop: 32 }}>
            {active.body.map((para, i) => (
              <p key={i} style={{ fontSize: 15, color: '#444', lineHeight: 1.9, marginBottom: 20, textAlign: 'justify' }}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── BLOG LIST ──
  return (
    <div style={{ background: '#f4f8f7', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#0f8972', marginBottom: 8 }}>Boldstone Blog</p>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0d1f1c', marginBottom: 12, lineHeight: 1.1 }}>News & Insights</h1>
            <p style={{ fontSize: 13, color: '#555', maxWidth: 520, margin: 0 }}>
              Stories, updates and insights from Uganda's coffee industry and the Boldstone team.
            </p>
          </div>
          <button onClick={openLogin}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>
            <FontAwesomeIcon icon={faPlus} /> Add Post
          </button>
        </div>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {allPosts.map((post) => {
            const cat = categoryColors[post.category] || { bg: '#f0faf7', color: '#0f8972' }
            return (
              <div key={post.id} onClick={() => open(post)}
                style={{ background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', cursor: 'pointer', display: 'flex', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(15,137,114,0.1)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <img src={post.image} alt={post.title} style={{ width: 180, minHeight: 140, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ background: cat.bg, color: cat.color, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20 }}>{post.category}</span>
                    <span style={{ fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FontAwesomeIcon icon={faCalendar} /> {post.date}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0d1f1c', marginBottom: 6, lineHeight: 1.3 }}>{post.title}</h3>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65, margin: 0 }}>{post.excerpt}</p>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0f8972', marginTop: 10 }}>Read More →</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── MODAL OVERLAY ── */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}>

          {/* LOGIN MODAL */}
          {modal === 'login' && (
            <div style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 380, textAlign: 'center', position: 'relative' }}>
              <button onClick={closeModal} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 18 }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(15,137,114,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FontAwesomeIcon icon={faLock} style={{ color: '#0f8972', fontSize: 20 }} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1f1c', marginBottom: 6 }}>Admin Sign In</h2>
              <p style={{ fontSize: 13, color: '#777', marginBottom: 24 }}>Enter your password to write a post</p>
              <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)}
                  style={{ border: `1px solid ${pwErr ? '#f87171' : '#e0e0e0'}`, borderRadius: 8, padding: '12px 14px', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#0f8972'}
                  onBlur={e => e.target.style.borderColor = pwErr ? '#f87171' : '#e0e0e0'}
                />
                {pwErr && <p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>Incorrect password</p>}
                <button type="submit" style={{ background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
                  Sign In
                </button>
              </form>
            </div>
          )}

          {/* WRITE POST MODAL */}
          {modal === 'write' && (
            <div style={{ background: '#fff', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
              <button onClick={closeModal} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 18 }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1f1c', margin: 0 }}>Write New Post</h2>
                <button onClick={() => setModal('manage')} style={{ fontSize: 12, color: '#0f8972', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                  Manage Posts
                </button>
              </div>

              {published && (
                <div style={{ background: '#e6f4f1', border: '1px solid #0f8972', borderRadius: 8, padding: '12px 16px', color: '#0f8972', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
                  ✓ Post published successfully!
                </div>
              )}

              <form onSubmit={publish} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { name: 'title', label: 'Title', placeholder: 'Post title...' },
                  { name: 'author', label: 'Author', placeholder: 'e.g. Moses Alicwamu' },
                  { name: 'date', label: 'Date (optional)', placeholder: 'e.g. July 10, 2026 — leave blank for today' },
                  { name: 'excerpt', label: 'Excerpt', placeholder: 'Short summary shown on the blog list...' },
                ].map(f => (
                  <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#0d1f1c' }}>{f.label}</label>
                    <input name={f.name} type="text" placeholder={f.placeholder} value={form[f.name]} onChange={handle}
                      required={!['date'].includes(f.name)}
                      style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = '#0f8972'}
                      onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </div>
                ))}
                {/* Image Upload */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#0d1f1c' }}>Post Image</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px dashed #0f8972', borderRadius: 8, padding: '12px 14px', cursor: 'pointer', background: '#f0faf7' }}>
                    <FontAwesomeIcon icon={faImage} style={{ color: '#0f8972', fontSize: 18 }} />
                    <span style={{ fontSize: 13, color: '#0f8972', fontWeight: 600 }}>
                      {form.imagePreview ? 'Change image' : 'Click to upload image'}
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                  {form.imagePreview && (
                    <img src={form.imagePreview} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginTop: 6 }} />
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#0d1f1c' }}>Category</label>
                  <select name="category" value={form.category} onChange={handle}
                    style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', background: '#fff' }}>
                    {Object.keys(categoryColors).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#0d1f1c' }}>Article Body</label>
                  <p style={{ fontSize: 12, color: '#999', margin: 0 }}>Separate paragraphs with a blank line</p>
                  <textarea name="body" placeholder="Write your article here...&#10;&#10;Leave a blank line between paragraphs." value={form.body} onChange={handle} required rows={10}
                    style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.7 }}
                    onFocus={e => e.target.style.borderColor = '#0f8972'}
                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
                <button type="submit" style={{ background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
                  Publish Post
                </button>
              </form>
            </div>
          )}

          {/* MANAGE POSTS MODAL */}
          {modal === 'manage' && (
            <div style={{ background: '#fff', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
              <button onClick={closeModal} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 18 }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1f1c', margin: 0 }}>Manage Posts</h2>
                <button onClick={() => setModal('write')} style={{ fontSize: 12, color: '#0f8972', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                  ← Write Post
                </button>
              </div>
              {storedPosts.length === 0
                ? <p style={{ color: '#999', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>No posts added yet.</p>
                : storedPosts.map(post => (
                  <div key={post.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#0d1f1c', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</p>
                      <p style={{ fontSize: 12, color: '#999', margin: '3px 0 0' }}>{post.date} · {post.author}</p>
                    </div>
                    <button onClick={() => deletePost(post.id)}
                      style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      )}
    </div>
  )
}
