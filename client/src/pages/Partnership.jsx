import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBullhorn, faTractor, faLandmark, faArrowRight,
  faCircleQuestion, faGears, faPlus,
} from '@fortawesome/free-solid-svg-icons'

const tickerItem = (
  <span className="advert-ticker-item">
    <span className="tk-badge"><FontAwesomeIcon icon={faBullhorn} /> News</span>
    <span className="tk-text">
      Boldstone Announces UGX 500 Million (US $140,000) Equity &amp; Debt Financing Plan to Build
      Coffee Processing Infrastructure and Empower Smallholder Farmers in Uganda.
    </span>
    <a className="tk-link" href="https://www.boldstoneinvestments.com/blog/news-2/boldstone-to-raise-us-140-000-pre-seed-investment-6">
      Read More →
    </a>
  </span>
)

const howCards = [
  {
    icon: faCircleQuestion,
    title: 'Who Can Become a Boldstone Partner?',
    body: "We partner with anyone who has an audience that has an interest in coffee. Whether you are creating content, leading a SACCO or Farmers' group and care about accessing the right support, let's talk.",
  },
  {
    icon: faGears,
    title: 'How Do Partnerships Work?',
    body: 'It depends on what makes sense for you and your audience or community. We pay influencers per referral with a budget allocated to resources. For institutions we work for custom benefits and revenue share. We will find the right structure during our conversation and process.',
  },
]

const faqs = [
  {
    q: 'How do you work with NGOs or Non-Profits?',
    a: 'Coffee farms guarantee revenue compared to humanitarian challenges that NGOs solve. We help them set up coffee farms that generate revenue to sustain their operations in the middle of cuts in international development.',
  },
  {
    q: 'How do you work with influencers?',
    a: 'Influencers help promote our coffee farming and trade business to their audiences on social media. By educating their following on social media on the work of Boldstone, they help grow our business reach and impact.',
  },
  {
    q: 'Which part of Uganda are your operations based?',
    a: 'We are primarily located in Fort Portal, Uganda with farming and trade operations extending to the districts of Kabarole, Kyegegwa, Kyenjojo and Kamwenge.',
  },
  {
    q: 'What do I need to become a partner?',
    a: 'You need proof of identification as a business or individual and the value you would like to create with Boldstone.',
  },
]

const diagonalCard = ({ image, imageLeft, title, desc, linkLabel }) => (
  <div style={{ borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'row', minHeight: 480, position: 'relative' }}>
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: imageLeft, right: '-10%', backgroundImage: `url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }} preserveAspectRatio="none" viewBox="0 0 100 100">
      <line x1="52" y1="0" x2="41.6" y2="100" stroke="rgba(107,158,138,0.5)" strokeWidth="0.8" />
    </svg>
    <div style={{ flex: '0 0 52%', padding: '36px 24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1, background: '#0d2a1e', clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flex: 1, paddingTop: 40 }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 32, lineHeight: 1.2 }}>{title}</h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>{desc}</p>
      </div>
      <a href="https://forms.gle/amtu1ouEKpt2kNYP7" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 700, color: '#c9a84c', textDecoration: 'none', borderBottom: '1px solid rgba(201,168,76,0.4)', paddingBottom: 4, alignSelf: 'flex-start' }}>
        {linkLabel} <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} />
      </a>
    </div>
  </div>
)

const cards = [
  {
    img: 'url(https://address-restaurant2.odoo.com/web/image/2000-b4068ca5/ldy.webp)',
    imgSize: 'cover',
    title: 'Influencers',
    desc: 'Share Boldstone with your audience online through videos, posts and creative content.',
    link: 'Apply as an Influencer',
  },
  {
    img: "url('https://address-restaurant2.odoo.com/web/image/2002-f96f6be8/coffee_cherries.webp')",
    imgSize: 'cover',
    title: 'Coffee Co-operatives',
    desc: 'Give your co-operative or group members access to a digital tool that improves farming output through a coffee knowledge base and a dedicated community.',
    link: 'Apply as a Co-operative',
  },
  {
    img: "url('https://address-restaurant2.odoo.com/web/image/2004-6e5add86/ChatGPT%20Image%20Aug%2012%2C%202026%2C%2007_38_31%20PM.webp')",
    imgSize: '60%',
    title: 'Institutions',
    desc: 'Are you a Bank, SACCO, Fintech, Insurance Company, or Non Profit? Partner with Boldstone to extend your services to our community of coffee farmers.',
    link: 'Apply as an Institution',
  },
]

function CardsGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <div className="p-cards-grid" ref={ref}>
      {cards.map((card, i) => (
        <motion.div
          key={i}
          className="p-card-wrap p-card-hover"
          style={{ borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'row', minHeight: 480, position: 'relative' }}
          initial={{ opacity: 0, y: 70 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 70 }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: i * 0.18 }}
        >
          <div className="p-card-img" style={{ position: 'absolute', top: 0, bottom: 0, left: '32%', right: '-10%', backgroundImage: card.img, backgroundSize: card.imgSize, backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
          <div className="p-card-overlay" style={{ flex: '0 0 52%', padding: '36px 24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1, background: '#0d2a1e', clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flex: 1, paddingTop: 40 }}>
              <h3 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 32, lineHeight: 1.2 }}>{card.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>{card.desc}</p>
            </div>
            <a href="https://forms.gle/amtu1ouEKpt2kNYP7" className="p-card-link">
              {card.link} <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </div>
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="52" y1="0" x2="41.6" y2="100" stroke="rgba(107,158,138,0.7)" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

export default function Partnership() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div>
      {/* ADVERT TICKER */}
      <div className="advert-banner">
        <div className="advert-ticker">
          {tickerItem}<span className="advert-sep">●</span>
          {tickerItem}<span className="advert-sep">●</span>
          {tickerItem}<span className="advert-sep">●</span>
          {tickerItem}<span className="advert-sep">●</span>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80')" }} />
        <div className="hero-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="hero-label"
          >
            Boldstone Partnership Program
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            Partner With <span>Boldstone</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ textAlign: 'center' }}
          >
            Coffee in Uganda is more than a crop — it's a high-value export asset bringing in $2.2B annually. Are you a co-operative, SACCO, Bank, NGO, or influencer? There's a place for you in our ecosystem.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="hero-actions"
          >
            <a href="https://forms.gle/amtu1ouEKpt2kNYP7" className="btn-primary">Explore Opportunities →</a>
          </motion.div>
        </div>
      </section>

      {/* PARTNERSHIP TYPES */}
      <section className="p-types-section">
        <div className="bs-wrap">

          {/* Section header */}
          <div style={{ marginBottom: 48, position: 'relative' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#0d1f1c', marginBottom: 16, lineHeight: 1.1 }}>Partnership types</h2>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7, maxWidth: 360 }}>Different partners. One growing ecosystem.<br />Choose how you'd like to collaborate with us.</p>
            <div style={{ position: 'absolute', top: 0, right: 0, display: 'grid', gridTemplateColumns: 'repeat(6, 8px)', gap: 6, opacity: 0.25 }}>
              {[...Array(30)].map((_, i) => <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: '#0f8972' }} />)}
            </div>
          </div>

          {/* Cards grid */}
          <CardsGrid />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="p-how-section">
        <div className="bs-wrap">
          <p className="p-section-label">HOW IT WORKS</p>
          <div className="p-how-grid">
            {howCards.map((c, i) => (
              <div key={i} className="p-how-card">
                <h4><FontAwesomeIcon icon={c.icon} /> {c.title}</h4>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="p-faqs-section">
        <div className="bs-wrap">
          <div className="p-faq-layout">
            <div className="p-faq-left">
              <p className="p-faq-big-label">FAQs</p>
              <p className="p-faq-heading">Got Questions? We've Got Answers.</p>
              <p className="p-faq-sub">Everything you need to know about partnering with Boldstone.</p>
            </div>
            <div className="p-faq-right">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`p-faq-item${openFaq === i ? ' open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="p-faq-q">
                    <span>{faq.q}</span>
                    <div className="p-faq-icon"><FontAwesomeIcon icon={faPlus} /></div>
                  </div>
                  <div className="p-faq-a">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
