import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
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

const css = `
  .blog-page { background: #f4f8f7; min-height: 100vh; padding: 60px 10px; }
  .blog-inner { max-width: 100%; margin: 0 auto; }
  .blog-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
  .blog-cta-row { display: flex; gap: 16px; margin-bottom: 32px; }
  .blog-cta-card { flex: 1; background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px 24px; }
  .blog-cta-card h3 { margin: 0 0 8px; font-size: 15px; font-weight: 800; color: #0d1f1c; }
  .blog-cta-card p { margin: 0 0 14px; font-size: 13px; color: #666; line-height: 1.6; }
  .blog-cta-card a { font-size: 13px; font-weight: 700; color: #0f8972; text-decoration: none; }
  .blog-cta-card.green { background: #0f8972; border-color: #0f8972; }
  .blog-cta-card.green h3 { color: #fff; }
  .blog-cta-card.green p { color: #d1faf3; }
  .blog-cta-card.green a { color: #fff; }
  .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .blog-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; cursor: pointer; transition: box-shadow 0.2s; }
  .blog-card:hover { box-shadow: 0 8px 28px rgba(15,137,114,0.1); }
  .blog-card img { width: 100%; height: 180px; object-fit: cover; display: block; }
  .blog-card-body { padding: 16px 18px; display: flex; flex-direction: column; flex: 1; }
  @media (max-width: 720px) {
    .blog-cta-row { flex-direction: column; }
    .blog-grid { grid-template-columns: 1fr; }
  }
`

export default function Blog() {
  const [active, setActive] = useState(null)
  const [storedPosts, setStoredPosts] = useState(getStoredPosts)
  const allPosts = [...storedPosts, ...hardcodedPosts]

  const [modal, setModal] = useState(null)
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
      <div style={{ background: '#f4f8f7', minHeight: '100vh', padding: '40px 24px' }}>
        <style>{`
          .article-img { float: left; width: 45%; margin: 0 28px 16px 0; border-radius: 12px; object-fit: cover; display: block; max-height: 420px; }
          .article-body { overflow: hidden; }
          .article-body::after { content: ''; display: table; clear: both; }
          @media (max-width: 640px) {
            .article-img { float: none; width: 100%; margin: 0 0 20px 0; max-height: 240px; }
          }
        `}</style>

        <button onClick={close} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#0f8972', fontWeight: 700, fontSize: 14, marginBottom: 28, padding: 0 }}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Blog
        </button>

        <span style={{ background: cat.bg, color: cat.color, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 12 }}>
          {active.category}
        </span>
        <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 900, color: '#0d1f1c', lineHeight: 1.2, margin: '0 0 12px' }}>{active.title}</h1>
        <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#777', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FontAwesomeIcon icon={faUser} style={{ color: '#0f8972' }} /> {active.author}
          </span>
          <span style={{ fontSize: 13, color: '#777', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FontAwesomeIcon icon={faCalendar} style={{ color: '#0f8972' }} /> {active.date}
          </span>
        </div>

        <div className="article-body">
          <img src={active.image} alt={active.title} className="article-img" />
          {active.body.map((para, i) => (
            <p key={i} style={{ fontSize: 15, color: '#444', lineHeight: 1.9, marginBottom: 20, textAlign: 'justify' }}>{para}</p>
          ))}
        </div>

        {/* Subscribe section */}
        <div style={{ marginTop: 48, background: '#fff', borderRadius: 16, padding: '36px 32px', textAlign: 'center', border: '1px solid #e0ede9' }}>
          <p style={{ fontSize: 20, fontWeight: 900, color: '#0d1f1c', margin: '0 0 8px' }}>Subscribe to our newsletter</p>
          <p style={{ fontSize: 14, color: '#666', margin: '0 0 24px' }}>Get the latest Boldstone news and updates delivered straight to your inbox.</p>
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 10, maxWidth: 460, margin: '0 auto', flexWrap: 'wrap' }}>
            <input
              type="email" placeholder="Enter your email address" required
              style={{ flex: 1, minWidth: 200, padding: '12px 16px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 14, outline: 'none', background: '#f8fffe', color: '#0d1f1c' }}
            />
            <button type="submit" style={{ background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Subscribe
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── BLOG LIST ──
  return (
    <div className="blog-page">
      <Helmet>
        <title>Boldstone Blog | Uganda Coffee Industry News & Insights</title>
        <meta name="description" content="Read Boldstone news, insights and updates on Uganda's coffee industry, coffee farming, investment, processing, agriculture, markets and the future of African coffee." />
        <meta name="keywords" content="Boldstone blog, Boldstone news, Boldstone insights, Boldstone updates, Uganda coffee news, Uganda coffee industry news, coffee industry news Uganda, coffee farming news Uganda, coffee investment news Uganda, coffee market news Uganda, Uganda coffee market, Uganda coffee industry, Uganda coffee sector, Uganda coffee farming, Uganda coffee production, Uganda coffee exports, Uganda coffee trade, coffee business Uganda, coffee investment Uganda, coffee investment insights, coffee investment opportunities Uganda, coffee farming investment Uganda, agricultural investment Uganda, agricultural news Uganda, agribusiness news Uganda, agribusiness Uganda, agricultural insights Uganda, agriculture news Uganda, coffee processing Uganda, coffee processing news, coffee value addition Uganda, coffee value chain Uganda, Uganda coffee value chain, coffee market insights Uganda, coffee market information Uganda, coffee prices Uganda, coffee farmers Uganda, smallholder coffee farmers Uganda, coffee farmer news, coffee farming insights, coffee farming trends Uganda, coffee farming opportunities Uganda, sustainable coffee farming Uganda, sustainable agriculture Uganda, coffee sustainability Uganda, coffee agroforestry Uganda, coffee technology Uganda, agricultural technology Uganda, agritech Uganda, digital agriculture Uganda, digital farming Uganda, coffee farming technology, farmer technology Uganda, coffee industry trends, coffee business news, coffee business insights, coffee industry insights, African coffee news, African coffee industry, African coffee market, African coffee investment, African coffee farming, African agriculture news, African agribusiness news, agricultural investment Africa, coffee investment Africa, coffee business Africa, coffee value chain Africa, coffee processing Africa, coffee exports Africa, coffee market Africa, startup news Uganda, startup investment Uganda, startup funding Uganda, pre-seed funding Uganda, startup fundraising Uganda, agricultural startup Uganda, agritech startup Uganda, impact investment Uganda, impact financing Uganda, agricultural finance Uganda, farmer financing Uganda, coffee processing infrastructure, coffee infrastructure Uganda, coffee industry development Uganda, coffee sector development Uganda, agricultural development Uganda, coffee trade insights, coffee export insights, coffee market trends, coffee industry updates, coffee farming updates, agricultural investment insights, sustainable coffee business, coffee entrepreneurship Uganda, agribusiness opportunities Uganda, coffee entrepreneurs Uganda, coffee companies Uganda, coffee investment companies Uganda, Boldstone coffee, Boldstone Investments news, Boldstone Investments Uganda, Boldstone coffee farming, Boldstone coffee investment, Boldstone agriculture, Boldstone coffee processing, Boldstone investment news" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.boldstoneinvestments.com/blog" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Boldstone Investments" />
        <meta property="og:title" content="Boldstone Blog | Uganda Coffee Industry News & Insights" />
        <meta property="og:description" content="Stories, news and insights from Uganda's coffee industry and Boldstone Investments, covering coffee farming, investment, processing, markets, agriculture and African coffee." />
        <meta property="og:url" content="https://www.boldstoneinvestments.com/blog" />
        <meta property="og:image" content="https://address-restaurant2.odoo.com/web/image/1948-db6cb14d/Land%20aerial%20view.webp" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Boldstone Blog | Uganda Coffee Industry News & Insights" />
        <meta name="twitter:description" content="Stories, news and insights from Uganda's coffee industry and Boldstone Investments, covering coffee farming, investment, processing, markets, agriculture and African coffee." />
        <meta name="twitter:image" content="https://address-restaurant2.odoo.com/web/image/1948-db6cb14d/Land%20aerial%20view.webp" />
      </Helmet>
      <style>{css}</style>
      <div className="blog-inner">

        {/* Header */}
        <div className="blog-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#0f8972', marginBottom: 8 }}>Boldstone Blog</p>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0d1f1c', marginBottom: 12, lineHeight: 1.1 }}>News &amp; Insights</h1>
            <p style={{ fontSize: 13, color: '#555', maxWidth: 520, margin: 0 }}>
              Stories, updates and insights from Uganda's coffee industry and the Boldstone team.
            </p>
          </div>

        </div>

        {/* Blog Grid */}
        <div className="blog-grid">
          {allPosts.map((post) => {
            const cat = categoryColors[post.category] || { bg: '#f0faf7', color: '#0f8972' }
            return (
              <div key={post.id} className="blog-card" onClick={() => open(post)}>
                <img src={post.image} alt={post.title} />
                <div className="blog-card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ background: cat.bg, color: cat.color, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20 }}>{post.category}</span>
                    <span style={{ fontSize: 11, color: '#999', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FontAwesomeIcon icon={faCalendar} /> {post.date}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0d1f1c', marginBottom: 8, lineHeight: 1.3 }}>{post.title}</h3>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65, margin: 0, flex: 1 }}>{post.excerpt}</p>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0f8972', marginTop: 12, display: 'block' }}>Read More →</span>
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
                  <textarea name="body" placeholder={'Write your article here...\n\nLeave a blank line between paragraphs.'} value={form.body} onChange={handle} required rows={10}
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
