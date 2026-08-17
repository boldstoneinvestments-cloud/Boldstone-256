import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullhorn } from '@fortawesome/free-solid-svg-icons'

function Counter({ target }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1800
        const step = target / (duration / 16)
        let current = 0
        const timer = setInterval(() => {
          current += step
          if (current >= target) { setCount(target); clearInterval(timer) }
          else setCount(Math.floor(current))
        }, 16)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

const tickerItem = (
  <span className="advert-ticker-item">
    <span className="tk-badge">
      <FontAwesomeIcon icon={faBullhorn} /> News
    </span>
    <span className="tk-text">
      Boldstone Announces UGX 500 Million (US $140,000) Equity &amp; Debt Financing Plan to Build Coffee Processing Infrastructure and Empower Smallholder Farmers in Uganda.
    </span>
    <a
      className="tk-link"
      href="https://www.boldstoneinvestments.com/#/blog"
    >
      Read More →
    </a>
  </span>
)

export default function Home() {
  return (
    <div>
      {/* ADVERT TICKER BANNER */}
      <div className="advert-banner">
        <div className="advert-ticker">
          {tickerItem}
          <span className="advert-sep">●</span>
          {tickerItem}
          <span className="advert-sep">●</span>
          {tickerItem}
          <span className="advert-sep">●</span>
          {tickerItem}
          <span className="advert-sep">●</span>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="hero-label"
          >
            Uganda's #1 Coffee Investment Firm
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            Grow Coffee in Uganda with <span>Boldstone</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ textAlign: 'left' }}
          >
            The coffee industry in Uganda is a $2.2B market opportunity. We partner with forward thinking farmers, individuals and companies to invest in commercial coffee farming and trade in Uganda.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="hero-actions"
          >
            <a href="https://forms.gle/amtu1ouEKpt2kNYP7" className="btn-primary">BECOME A PARTNER →</a>
            <Link to="/about" className="btn-secondary">LEARN MORE →</Link>
          </motion.div>
        </div>
      </section>

      {/* WHY BOLDSTONE */}
      <section className="partner-section">
        <div className="partner-visual" />
        <div className="partner-content">
          <p className="section-label">Why Boldstone</p>
          <div className="benefit-list">
            {[
              { title: 'Industry Expertise', desc: 'We bring deep knowledge across the coffee value chain from agronomic best practices and farm management to processing and market access.' },
              { title: 'Collective Growth', desc: 'We believe success is shared, creating opportunities and long-term value for our farmers, landowners, investors, and communities.' },
              { title: 'Data & Digital First', desc: 'We leverage data, analytics, and digital technologies to make smarter decisions and drive scalable, sustainable growth.' },
            ].map((b, i) => (
              <div key={i} className="benefit-item">
                <div className="benefit-copy">
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <p className="hero-stats-heading">Boldstone In Numbers</p>
      <div className="hero-stats">
        {[
          { prefix: 'US $', value: 200, suffix: 'K+', label: 'Assets Under Management' },
          { value: 300, suffix: '+', label: 'Partner Farmers' },
          { value: 50, suffix: '+', label: 'Acres of Coffee' },
          { value: 20, suffix: '+', label: 'Combined Years of Experience' },
        ].map((s, i) => (
          <div key={i} className="hero-stat">
            <div className="hero-stat-copy">
              <div className="hero-stat-value">{s.prefix}<Counter target={s.value} />{s.suffix}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="bs-wrap">
          <div className="cta-card">
            <h2>Let Coffee Diversify Your Income.<br />Do It With Boldstone.</h2>
            <p>Transparent, Professional, and Flexible Partnership.</p>
            <div className="cta-actions">
              <Link to="/partnership" className="btn-primary">Become a Partner</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
