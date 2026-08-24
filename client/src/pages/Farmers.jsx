import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullhorn, faLeaf, faChevronDown, faArrowRight, faCircleCheck } from '@fortawesome/free-solid-svg-icons'

function Counter({ target }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const step = target / 60
        let current = 0
        const timer = setInterval(() => {
          current = Math.min(current + step, target)
          setCount(Math.floor(current))
          if (current >= target) clearInterval(timer)
        }, 25)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count}</span>
}

const tickerItem = (
  <span className="advert-ticker-item">
    <span className="tk-badge"><FontAwesomeIcon icon={faBullhorn} /> News</span>
    <span className="tk-text">Boldstone Announces UGX 500 Million (US $140,000) Equity &amp; Debt Financing Plan to Build Coffee Processing Infrastructure and Empower Smallholder Farmers in Uganda.</span>
    <a className="tk-link" href="https://www.boldstoneinvestments.com/blog">Read More →</a>
  </span>
)

const offerCards = [
  { title: 'Live Market Prices', desc: 'Get real-time coffee market price updates so you always know the best time to sell your harvest.' },
  { title: 'Agronomy Support', desc: 'Access personalised farming advice, pest and disease management and best practice guidance from certified agronomists.' },
  { title: 'Farmer Community', desc: 'Join a growing community of coffee farmers in Uganda. Share knowledge, ask questions and grow together.' },
  { title: 'Direct Market Access', desc: 'Sell your coffee directly to Boldstone at the best possible prices — no middlemen, no guesswork.' },
  { title: 'Offline Farm Tips', desc: 'Our system sends farm tips directly to your phone that you can access even without internet connection.' },
  { title: 'Rewards Program', desc: 'Earn rewards for farming the Boldstone way — quality, sustainability and consistency are recognised and rewarded.' },
]

const plans = [
  {
    badge: 'FREE',
    name: 'FREE PLAN',
    desc: 'Everything you need to get started as a Boldstone farmer.',
    features: [
      'Access to farming insights',
      'Coffee farming community',
      'Live market price updates',
      'Apply for programs & opportunities',
    ],
    featured: false,
  },
  {
    badge: 'MOST POPULAR',
    name: 'BASIC PLAN',
    desc: "All in Free, plus personalised support to grow your farm's productivity.",
    features: [
      'Everything in Free',
      'Personalised agronomy support',
      'Pest & disease management',
      'Bulk input purchase discounts',
      'Land lease opportunities',
    ],
    featured: true,
  },
  {
    badge: 'PREMIUM',
    name: 'PREMIUM PLAN',
    desc: 'All in Basic, plus dedicated support, financing access and certification.',
    features: [
      'Everything in Basic',
      'Dedicated agronomist',
      'Quarterly farm visits',
      'Access to partner lenders',
      'Investor & partner network',
      'Certification support',
      'Priority training access',
    ],
    featured: false,
  },
]

export default function Farmers() {
  const heroBgRef = useRef(null)

  useEffect(() => {
    if (heroBgRef.current) heroBgRef.current.classList.add('loaded')
  }, [])

  return (
    <div>
      <Helmet>
        <title>Coffee Farming Support in Uganda | Boldstone Farmers</title>
        <meta name="description" content="Coffee farming is hard enough to keep chasing for the right traders to purchase your coffee or the best agronomical support to ensure that your coffee farms are most productive. Boldstone's digital platform helps you to access the right farming advise, mentor, market prices while selling your coffee at the very best possible time and price." />
        <meta name="keywords" content="coffee farmers in Uganda, coffee farming in Uganda, coffee farming support, coffee farmer support, coffee farming advice, coffee farming advice Uganda, coffee farming tips, coffee farming tips Uganda, coffee farm management, coffee farm productivity, coffee farming best practices, coffee farming opportunities, coffee farmer opportunities, Uganda coffee farmers, Ugandan coffee farmers, coffee farmer network, coffee farming community, coffee farmer community Uganda, coffee farmer training, coffee farming training, coffee training Uganda, coffee agronomy, coffee agronomy support, agronomy support for farmers, coffee agronomist, coffee agronomist Uganda, agricultural extension services, agricultural advice Uganda, farming advice Uganda, coffee farm advice, coffee crop management, coffee crop production, coffee production Uganda, coffee cultivation Uganda, coffee plantation management, coffee estate management, commercial coffee farming Uganda, sustainable coffee farming Uganda, sustainable coffee production, coffee farm sustainability, coffee quality improvement, coffee yield improvement, coffee farm productivity improvement, coffee harvest management, coffee harvesting Uganda, coffee post-harvest management, coffee pest management, coffee disease management, coffee pests and diseases, coffee pest control, coffee disease control, coffee plant health, coffee farm health, coffee farming technology, digital agriculture Uganda, digital farming Uganda, agricultural technology Uganda, agritech Uganda, digital farming platform, digital agriculture platform, farmer digital platform, farmer technology platform, coffee farming platform, coffee farmer platform, coffee market prices, coffee market price Uganda, live coffee prices, coffee price updates, coffee prices Uganda, coffee market information, coffee market updates, coffee price information, coffee selling prices, coffee selling Uganda, selling coffee in Uganda, where to sell coffee in Uganda, coffee buyers Uganda, coffee buyer, coffee market access, direct coffee market access, direct coffee buyers, coffee trading Uganda, coffee trade Uganda, coffee value chain Uganda, Uganda coffee value chain, coffee supply chain Uganda, coffee marketing Uganda, coffee sales Uganda, coffee trading opportunities, coffee farmer market access, coffee farmer marketplace, coffee farmer network Uganda, coffee farmer partnerships, coffee farming partnership, coffee farmer support program, coffee farmer programs, farmer development programs, agricultural opportunities Uganda, farming opportunities Uganda, farmer opportunities Uganda, agricultural training Uganda, farmer education Uganda, agricultural education Uganda, farmer mentorship, agricultural mentorship, coffee farmer mentorship, coffee farming mentorship, coffee farm consulting, agricultural consulting Uganda, coffee farm consulting Uganda, personalised agronomy support, farm management support, coffee farm management support, coffee input discounts, agricultural input discounts, coffee farming inputs, farm inputs Uganda, agricultural inputs Uganda, coffee financing, coffee farmer financing, agricultural financing Uganda, farm financing Uganda, agricultural lenders Uganda, coffee certification support, coffee certification Uganda, coffee quality certification, coffee farmer rewards, farmer rewards program, coffee farmer rewards, coffee farming rewards, coffee farmer membership, farmer membership program, coffee farmer membership program, free farmer membership, premium farmer support, coffee farming community Uganda, commercial agriculture Uganda, agricultural development Uganda, farmer productivity Uganda, coffee farmer productivity, coffee yield improvement Uganda, coffee quality improvement Uganda, profitable coffee farming, profitable coffee farm, growing coffee in Uganda, grow coffee in Uganda, earn more from coffee farming, increase coffee farm income, improve coffee farm productivity, improve coffee yields, coffee farming business Uganda" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.boldstoneinvestments.com/farmers" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Boldstone Investments" />
        <meta property="og:title" content="Coffee Farming Support in Uganda | Boldstone Farmers" />
        <meta property="og:description" content="Coffee farming is hard enough to keep chasing for the right traders to purchase your coffee or the best agronomical support to ensure that your coffee farms are most productive. Boldstone's digital platform helps you to access the right farming advise, mentor, market prices while selling your coffee at the very best possible time and price." />
        <meta property="og:url" content="https://www.boldstoneinvestments.com/farmers" />
        <meta property="og:image" content="https://address-restaurant2.odoo.com/web/image/1906-689c8b1f/coffee%20man.webp" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Coffee Farming Support in Uganda | Boldstone Farmers" />
        <meta name="twitter:description" content="Coffee farming is hard enough to keep chasing for the right traders to purchase your coffee or the best agronomical support to ensure that your coffee farms are most productive. Boldstone's digital platform helps you to access the right farming advise, mentor, market prices while selling your coffee at the very best possible time and price." />
        <meta name="twitter:image" content="https://address-restaurant2.odoo.com/web/image/1906-689c8b1f/coffee%20man.webp" />
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
      <section className="farmers-hero">
        <div className="farmers-hero-bg" ref={heroBgRef} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="tag"
          >
            <FontAwesomeIcon icon={faLeaf} /> For Farmers
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            Grow More. <span>Earn More.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            Coffee farming is hard enough to keep chasing for the right traders to purchase your coffee or the best agronomical support to ensure that your coffee farms are most productive.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          >
            Boldstone's digital platform helps you to access the right farming advise, mentor, market prices while selling your coffee at the very best possible time and price.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-btns"
          >
            <a href="https://forms.gle/amtu1ouEKpt2kNYP7" target="_blank" rel="noreferrer" className="hero-btn primary">
              Join as a Farmer
            </a>
          </motion.div>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </section>

      {/* WHY BOLDSTONE */}
      <section className="why-section">
        <div className="bs-wrap">
          <div className="why-left">
            <h1 className="section-label">WHY BOLDSTONE</h1>
            <h2>Farm and sell with the <span>best in the business.</span></h2>
          </div>
          <div className="offer-grid" style={{ marginTop: '48px' }}>
            {offerCards.map((card, i) => (
              <div key={i} className="offer-card">
                <div className="offer-card-back" />
                <div className="offer-card-inner">
                  <div className="offer-card-content">
                    <h4>{card.title}</h4>
                    <p>{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="farmer-plans">
        <div className="bs-wrap">
          <div className="plans-header">
            <h1 className="section-label" style={{ justifyContent: 'center' }}>MEMBERSHIPS</h1>
            <h2>Choose your <span>plan.</span></h2>
            <p>Start free and upgrade as your farm grows. Every plan gives you access to the Boldstone farmer network.</p>
          </div>
          <div className="plans-grid">
            {plans.map((plan, i) => (
              <div key={i} className={`plan-card${plan.featured ? ' featured' : ''}`}>
                <div className="offer-card-back" />
                <div className="offer-card-inner">
                  <div className="plan-card-content">
                    <span className="plan-badge">{plan.badge}</span>
                    <p className="plan-name">{plan.name}</p>
                    <p className="plan-desc">{plan.desc}</p>
                    <div className="plan-divider" />
                    <ul className="plan-features">
                      {plan.features.map((f, j) => (
                        <li key={j}>
                          <FontAwesomeIcon icon={faCircleCheck} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a href="#" className="plan-cta">
                      Get Started <FontAwesomeIcon icon={faArrowRight} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-header">
        <h2>Boldstone In Numbers</h2>
      </div>
      <div className="stats-section">
        <div className="farmers-stats-bar">
          <div className="farmers-stats-inner">
            <div className="stat">
              <div className="num"><Counter target={300} />+</div>
              <p>Partner Farmers</p>
            </div>
            <div className="stat">
              <div className="num"><Counter target={50} />+</div>
              <p>Acres of Coffee</p>
            </div>
            <div className="stat">
              <div className="num">US $<Counter target={200} />k</div>
              <p>Assets Under Management</p>
            </div>
            <div className="stat">
              <div className="num"><Counter target={20} />+</div>
              <p>Combined Years of Experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="farmers-cta-section">
        <div className="cta-inner">
          <h2>Ready to Build Your Coffee Farm?</h2>
          <p>Join a growing network of farmers across Uganda who are building profitable, sustainable coffee farms with Boldstone. Let's grow together.</p>
          <a href="https://forms.gle/amtu1ouEKpt2kNYP7" target="_blank" rel="noreferrer">
            Get Started Today <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </div>
  )
}
