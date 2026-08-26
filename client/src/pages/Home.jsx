import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
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
      href="https://www.boldstoneinvestments.com/blog"
    >
      Read More →
    </a>
  </span>
)

export default function Home() {
  return (
    <div>
      <Helmet>
        <title>Boldstone Investments | Invest and Source Coffee in Uganda with Boldstone</title>
        <meta name="description" content="We enable individuals to grow coffee on affordable leased land and exporters to trade traceable, sustainably grown coffee from Uganda." />
        <meta name="keywords" content="coffee investment in Uganda, coffee investment, coffee investment opportunities, coffee investment opportunities in Uganda, coffee farming investment, coffee farming investment in Uganda, invest in coffee farming, invest in coffee, coffee farm investment, commercial coffee investment, commercial coffee farming, commercial coffee farming in Uganda, agricultural investment in Uganda, agricultural investment opportunities in Uganda, agribusiness investment in Uganda, agribusiness investment opportunities, farming investment in Uganda, sustainable agricultural investment, long-term agricultural investment, investment opportunities in Uganda, coffee business investment, coffee business opportunities, coffee investment partnership, coffee farming partnership, agricultural investment partnership, agricultural partnerships in Uganda, farmer-investor partnerships, coffee farmer partnerships, landowner partnerships, coffee estate partnerships, commercial farming partnerships, coffee investment firm, coffee investment firm in Uganda, coffee investment company, agricultural investment company in Uganda, private agricultural investment, coffee industry investment, coffee value-chain investment, Uganda coffee industry, coffee industry in Uganda, Uganda coffee market, Uganda coffee sector, Ugandan coffee, Uganda coffee farming, coffee farming in Uganda, coffee production in Uganda, coffee cultivation in Uganda, coffee farms in Uganda, coffee estates in Uganda, coffee plantations in Uganda, coffee value chain, Uganda coffee value chain, coffee supply chain, coffee production and processing, coffee processing in Uganda, coffee trade in Uganda, coffee export in Uganda, coffee market access, coffee value addition, sustainable coffee farming, sustainable coffee investment, sustainable coffee production, sustainable farming in Uganda, sustainable agriculture in Uganda, responsible coffee farming, regenerative agriculture, climate-smart agriculture, data-driven agriculture, data-driven farming, agricultural technology, agritech Uganda, digital agriculture, precision agriculture, agricultural analytics, digital farm management, coffee farm management, agricultural business opportunities, coffee farming opportunities, agricultural partnerships, agricultural land partnerships, land investment partnerships, coffee land investment, coffee investment for individuals, coffee investment for companies, agricultural investment for investors, coffee business opportunities in Uganda, coffee farming opportunities in Uganda, agricultural business opportunities in Uganda, coffee value addition in Uganda, coffee processing and export in Uganda, Uganda coffee trade, Uganda coffee exports, Uganda coffee production, Uganda agricultural sector, agriculture in Uganda, Uganda agribusiness, Uganda agricultural investment, Uganda farming investment, coffee enterprise development, commercial coffee enterprise, professionally managed coffee farming, professionally managed agricultural investment, coffee industry opportunities, coffee sector investment, agricultural value chain investment, coffee production investment, coffee processing investment, coffee trade investment, coffee export investment, coffee market investment, coffee farming business, coffee farming enterprise, commercial agriculture in Uganda, sustainable agribusiness in Uganda, agricultural development in Uganda, coffee industry development, coffee value chain development, coffee production and value addition, coffee processing and value addition, coffee farming and processing, coffee production and trade, coffee farming and trade, coffee business and investment, coffee agriculture and investment, sustainable coffee value chain, sustainable coffee industry, sustainable coffee production in Uganda, long-term coffee investment, scalable coffee farming, data-driven coffee farming, technology-driven agriculture, digital coffee farming, smart agriculture in Uganda, modern coffee farming, modern agricultural investment, professional coffee farm management, coffee farm development, coffee estate development, commercial farm development, agricultural enterprise development" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.boldstoneinvestments.com/" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Boldstone Investments" />
        <meta property="og:title" content="Boldstone Investments | Invest and Source Coffee in Uganda with Boldstone." />
        <meta property="og:description" content="We enable individuals to grow coffee on affordable leased land and exporters to trade traceable, sustainably grown coffee from Uganda." />
        <meta property="og:url" content="https://www.boldstoneinvestments.com/" />
        <meta property="og:image" content="https://address-restaurant2.odoo.com/web/image/1918-fe8aa66d/cfe.webp" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Boldstone Investments | Invest and Source Coffee in Uganda with Boldstone." />
        <meta name="twitter:description" content="We enable individuals to grow coffee on affordable leased land and exporters to trade traceable, sustainably grown coffee from Uganda." />
        <meta name="twitter:image" content="https://address-restaurant2.odoo.com/web/image/1918-fe8aa66d/cfe.webp" />
      </Helmet>

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
            The #1 Source of Traceable & Sustainably Grown Coffee
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            Grow & Source Coffee In Uganda with <span>Boldstone</span>
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
