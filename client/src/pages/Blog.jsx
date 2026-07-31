import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons'

const STORAGE_KEY = 'boldstone_blog_posts'

function getStoredPosts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
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

export default function Blog() {
  const [active, setActive] = useState(null)
  const allPosts = [...getStoredPosts(), ...hardcodedPosts]

  const open = (post) => { setActive(post); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const close = () => { setActive(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }

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
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, color: '#0d1f1c', lineHeight: 1.2, margin: '12px 0 20px' }}>
            {active.title}
          </h1>
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

  return (
    <div style={{ background: '#f4f8f7', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#0f8972', marginBottom: 8 }}>Boldstone Blog</p>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#0d1f1c', marginBottom: 12, lineHeight: 1.1 }}>News & Insights</h1>
        <p style={{ fontSize: 15, color: '#555', marginBottom: 48, maxWidth: 520 }}>
          Stories, updates and insights from Uganda's coffee industry and the Boldstone team.
        </p>
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
                    <span style={{ background: cat.bg, color: cat.color, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20 }}>
                      {post.category}
                    </span>
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
    </div>
  )
}
