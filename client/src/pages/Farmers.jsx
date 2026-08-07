import { useEffect, useRef, useState } from 'react'
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
    <a className="tk-link" href="https://www.boldstoneinvestments.com/blog/news-2/boldstone-to-raise-us-140-000-pre-seed-investment-6">Read More →</a>
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
          <div className="tag">
            <FontAwesomeIcon icon={faLeaf} /> For Farmers
          </div>
          <h1>Grow More. <span>Earn More.</span></h1>
          <p>Coffee farming is hard enough to keep chasing for the right traders to purchase your coffee or the best agronomical support to ensure that your coffee farms are most productive.</p>
          <p>Boldstone's digital platform helps you to access the right farming advise, mentor, market prices while selling your coffee at the very best possible time and price.</p>
          <div className="hero-btns">
            <a href="https://forms.gle/amtu1ouEKpt2kNYP7" target="_blank" rel="noreferrer" className="hero-btn primary">
              Join as a Farmer
            </a>
          </div>
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
