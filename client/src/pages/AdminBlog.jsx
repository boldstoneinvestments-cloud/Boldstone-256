import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faTrash, faPlus, faImage, faPen } from '@fortawesome/free-solid-svg-icons'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app') ? configuredBackend.replace(/\/$/, '') : (import.meta.env.PROD ? 'https://backend-production-9c1d1.up.railway.app' : 'http://localhost:5000')
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

const categoryColors = {
  News: { bg: '#e6f4f1', color: '#0f8972' },
  Impact: { bg: '#fef3c7', color: '#d97706' },
  Industry: { bg: '#ede9fe', color: '#7c3aed' },
  Company: { bg: '#fee2e2', color: '#dc2626' },
  Agronomy: { bg: '#dcfce7', color: '#16a34a' },
}

const emptyForm = { title: '', category: 'News', author: '', date: '', image: '', imagePreview: '', excerpt: '', body: '', is_published: true }

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [view, setView] = useState('list') // 'list' | 'new'

  useEffect(() => {
    let active = true
    fetch(`${BACKEND}/api/admin/blog/posts`, { credentials: 'include' })
      .then(async response => {
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.error || 'Could not load blog posts.')
        if (active) setPosts(data.posts || [])
      })
      .catch(loadError => { if (active) setError(loadError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImageUpload = async e => {
    const input = e.currentTarget
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image must be 10 MB or smaller.')
      return
    }
    setUploading(true)
    setError('')
    try {
      const signatureResponse = await fetch(`${BACKEND}/api/admin/blog/upload-signature`, {
        method: 'POST',
        credentials: 'include',
      })
      const signatureData = await signatureResponse.json().catch(() => ({}))
      if (!signatureResponse.ok) throw new Error(signatureData.error || 'Could not authorize image upload.')

      const uploadData = new FormData()
      uploadData.append('file', file)
      uploadData.append('api_key', signatureData.api_key)
      uploadData.append('timestamp', signatureData.timestamp)
      uploadData.append('folder', signatureData.folder)
      uploadData.append('signature', signatureData.signature)
      const response = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/image/upload`, {
        method: 'POST',
        body: uploadData,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.secure_url) throw new Error(data.error?.message || 'Image upload failed.')
      setForm(current => ({ ...current, image: data.secure_url, imagePreview: data.secure_url }))
    } catch (uploadError) {
      setError(uploadError.message || 'Image upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const submit = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      title: form.title,
      category: form.category,
      author: form.author,
      image: form.image || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1400&q=80',
      excerpt: form.excerpt,
      body: form.body.split(/\n\s*\n/).map(paragraph => paragraph.trim()).filter(Boolean),
      is_published: form.is_published,
    }
    if (form.date) payload.date = form.date
    try {
      const response = await fetch(`${BACKEND}/api/admin/blog/posts${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Could not save the blog post.')
      setPosts(current => editingId
        ? current.map(post => post.id === data.post.id ? data.post : post)
        : [data.post, ...current])
      setForm(emptyForm)
      setEditingId(null)
      setSuccess(true)
      setView('list')
      setTimeout(() => setSuccess(false), 4000)
    } catch (saveError) {
      setError(saveError.message || 'Could not save the blog post.')
    } finally {
      setSaving(false)
    }
  }

  const editPost = post => {
    setEditingId(post.id)
    setForm({ ...post, date: post.date || '', imagePreview: post.image, body: post.body.join('\n\n') })
    setError('')
    setView('new')
  }

  const deletePost = async id => {
    setError('')
    try {
      const response = await fetch(`${BACKEND}/api/admin/blog/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Could not delete the blog post.')
      setPosts(current => current.filter(post => post.id !== id))
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete the blog post.')
    }
  }

  return (
    <div style={{ background: '#f4f8f7', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#0f8972', marginBottom: 4 }}>Admin Portal</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0d1f1c', margin: 0 }}>Blog Manager</h1>
          </div>
          {view === 'list'
            ? <button onClick={() => { setEditingId(null); setForm(emptyForm); setError(''); setView('new') }} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 20px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faPlus} /> New Post
              </button>
            : <button onClick={() => { setEditingId(null); setForm(emptyForm); setError(''); setView('list') }} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #e0e0e0', color: '#555', fontWeight: 700, fontSize: 14, padding: '11px 20px', borderRadius: 8, cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </button>
          }
        </div>

        {success && (
          <div style={{ background: '#e6f4f1', border: '1px solid #0f8972', borderRadius: 8, padding: '12px 16px', color: '#0f8972', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
            Post saved successfully.
          </div>
        )}

        {error && (
          <div role="alert" style={{ background: '#fff1f0', border: '1px solid #f0b9b5', borderRadius: 8, padding: '12px 16px', color: '#9f1d16', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
            {error}
          </div>
        )}

        {/* NEW POST FORM */}
        {view === 'new' && (
          <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0d1f1c', margin: 0 }}>{editingId ? 'Edit Post' : 'Write New Post'}</h2>

            {[
              { name: 'title', label: 'Title', type: 'text', placeholder: 'Post title...' },
              { name: 'author', label: 'Author', type: 'text', placeholder: 'e.g. Moses Alicwamu' },
              { name: 'date', label: 'Date (optional)', type: 'text', placeholder: 'e.g. July 10, 2026 — leave blank for today' },
              { name: 'excerpt', label: 'Excerpt / Summary', type: 'text', placeholder: 'Short summary shown on the blog list...' },
            ].map(f => (
              <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#0d1f1c' }}>{f.label}</label>
                <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={handle}
                  required={!['date'].includes(f.name)}
                  style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: '#0d1f1c', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#0f8972'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            ))}

            {/* Image Upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0d1f1c' }}>Post Image</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px dashed #0f8972', borderRadius: 8, padding: '12px 14px', cursor: 'pointer', background: '#f0faf7' }}>
                <FontAwesomeIcon icon={faImage} style={{ color: '#0f8972', fontSize: 18 }} />
                <span style={{ fontSize: 13, color: '#0f8972', fontWeight: 600 }}>
                  {uploading ? 'Uploading image...' : form.imagePreview ? 'Change image' : 'Click to upload image'}
                </span>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
              {form.imagePreview && (
                <img src={form.imagePreview} alt="preview" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginTop: 4 }} />
              )}
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#0d1f1c', fontSize: 14, fontWeight: 600 }}>
              <input type="checkbox" checked={form.is_published} onChange={e => setForm(current => ({ ...current, is_published: e.target.checked }))} />
              Published on public blog
            </label>

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

            <button type="submit" disabled={saving || uploading} style={{ background: '#0f8972', color: '#fff', fontWeight: 700, fontSize: 14, padding: '13px', borderRadius: 8, border: 'none', cursor: saving || uploading ? 'wait' : 'pointer', opacity: saving || uploading ? 0.7 : 1 }}>
              {saving ? 'Saving...' : editingId ? 'Save Changes' : form.is_published ? 'Publish Post' : 'Save Draft'}
            </button>
          </form>
        )}

        {/* POSTS LIST */}
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loading && <p style={{ color: '#777', fontSize: 14 }}>Loading blog posts...</p>}
            {!loading && !error && posts.length === 0 && (
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
                      {!post.is_published && <span style={{ fontSize: 10, fontWeight: 700, color: '#8a4b08', background: '#fff3d6', padding: '3px 8px', borderRadius: 4 }}>Draft</span>}
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0d1f1c', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</p>
                    <p style={{ fontSize: 12, color: '#777', margin: '4px 0 0' }}>By {post.author}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => editPost(post)} title="Edit post" aria-label={`Edit ${post.title}`} style={{ background: '#fff', border: '1px solid #cfe0db', color: '#0f8972', borderRadius: 6, width: 36, height: 36, cursor: 'pointer' }}>
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button onClick={() => deletePost(post.id)} title="Delete post" aria-label={`Delete ${post.title}`}
                      style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 6, width: 36, height: 36, cursor: 'pointer' }}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
