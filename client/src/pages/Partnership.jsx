import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBullhorn, faTractor, faLandmark, faArrowRight,
  faCircleQuestion, faGears, faPlus, faChevronDown,
} from '@fortawesome/free-solid-svg-icons'

const tickerItem = (
  <span className="advert-ticker-item">
    <span className="tk-badge"><FontAwesomeIcon icon={faBullhorn} /> News</span>
    <span className="tk-text">
      Boldstone Announces UGX 500 Million (US $140,000) Equity &amp; Debt Financing Plan to Build
      Coffee Processing Infrastructure and Empower Smallholder Farmers in Uganda.
    </span>
    <a className="tk-link" href="https://www.boldstoneinvestments.com/blog">
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
          <div className="p-card-overlay" style={{ flex: '0 0 52%', padding: '36px 24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1, background: '#0f8972', clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flex: 1, paddingTop: 40 }}>
              <h3 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 32, lineHeight: 1.2 }}>{card.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>{card.desc}</p>
            </div>
            <a href="https://forms.gle/amtu1ouEKpt2kNYP7" className="p-card-link">
              {card.link} <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </div>

        </motion.div>
      ))}
    </div>
  )
}

export default function Partnership() {
  const [openFaq, setOpenFaq] = useState(0)
  const faqAnswerRefs = useRef([])

  useEffect(() => {
    const syncFaqHeights = () => {
      faqAnswerRefs.current.forEach((answer, index) => {
        if (!answer) return
        answer.style.maxHeight = openFaq === index ? `${answer.scrollHeight}px` : '0px'
      })
    }
    syncFaqHeights()
    window.addEventListener('resize', syncFaqHeights)
    return () => window.removeEventListener('resize', syncFaqHeights)
  }, [openFaq])

  return (
    <div>
      <Helmet>
        <title>Coffee Partnership Opportunities in Uganda | Boldstone</title>
        <meta name="description" content="Boldstone Partnership Program — Partner With Boldstone to build a stronger coffee ecosystem in Uganda. Coffee is more than a crop — it's a high-value export asset bringing in $2.2B annually. Whether you are a co-operative, SACCO, bank, NGO, or influencer, there's a place for you in our ecosystem." />
        <meta name="keywords" content="coffee partnership opportunities in Uganda, coffee partnerships Uganda, coffee partnership, coffee business partnerships, coffee industry partnerships, coffee ecosystem Uganda, Uganda coffee ecosystem, coffee value chain partnerships, Uganda coffee value chain, coffee sector partnerships, coffee farming partnerships, coffee farmer partnerships, coffee farmer support partnerships, agricultural partnerships Uganda, agricultural partnership opportunities, agribusiness partnerships Uganda, agribusiness partnership opportunities, agriculture business partnerships, agricultural ecosystem Uganda, coffee cooperative partnerships, coffee cooperatives Uganda, coffee cooperative opportunities, coffee cooperative support, coffee cooperative development, coffee cooperative network, farmer cooperative Uganda, farmers cooperative partnerships, farmer group partnerships Uganda, coffee farmers groups, coffee farmer organizations, coffee SACCO partnerships, SACCO partnerships Uganda, SACCO agriculture partnerships, SACCO coffee farming partnerships, SACCO farmer partnerships, financial institution partnerships Uganda, bank partnerships Uganda, agricultural banking partnerships, coffee finance partnerships, agricultural finance partnerships, fintech partnerships Uganda, agritech partnerships Uganda, agricultural technology partnerships, coffee technology partnerships, insurance partnerships Uganda, agricultural insurance partnerships, coffee farm insurance partnerships, NGO partnerships Uganda, NGO coffee partnerships, nonprofit partnerships Uganda, non profit coffee partnerships, NGO agricultural partnerships, coffee development partnerships, coffee industry NGO partnerships, influencer partnerships Uganda, coffee influencer partnerships, influencer marketing Uganda, coffee influencer marketing, coffee content creators Uganda, agricultural influencers Uganda, farming influencers Uganda, coffee creators, coffee marketing partnerships, coffee promotion Uganda, coffee brand partnerships, referral partnerships Uganda, referral marketing partnerships, business referral partnerships, revenue sharing partnerships, revenue share Uganda, strategic partnerships Uganda, strategic agricultural partnerships, strategic coffee partnerships, commercial partnerships Uganda, corporate partnerships Uganda, institutional partnerships Uganda, business collaboration Uganda, agricultural collaboration, coffee business collaboration, coffee industry collaboration, partnership opportunities Uganda, business opportunities Uganda, agricultural business opportunities Uganda, coffee business opportunities Uganda, coffee industry opportunities Uganda, farmer support programs Uganda, coffee farmer programs Uganda, coffee knowledge platform, coffee farming knowledge, coffee farming education Uganda, coffee farmer education, digital agriculture Uganda, digital farming platform Uganda, coffee farming technology Uganda, coffee farmer community, coffee farmer community Uganda, coffee farmer network Uganda, agricultural digital platform, farmer digital platform, coffee marketplace Uganda, coffee market access Uganda, coffee market information, coffee farming support Uganda, coffee agronomy support Uganda, coffee farmer services, coffee farmer resources, coffee value chain development, coffee sector development Uganda, Uganda coffee industry development, coffee export ecosystem Uganda, Uganda coffee exports, coffee trade Uganda, coffee production Uganda, coffee farming Uganda, commercial coffee farming Uganda, sustainable coffee partnerships, sustainable agriculture partnerships, sustainable coffee farming Uganda, sustainable coffee value chain, coffee investment partnerships, coffee investment ecosystem Uganda, agricultural investment partnerships, investment partnerships Uganda, institutional partnerships, community partnerships Uganda, cooperative development partnerships, financial partnerships for farmers, farmer financial services partnerships, agricultural fintech Uganda, agricultural financial services Uganda, coffee industry financial services, coffee farmer financial inclusion, financial inclusion agriculture Uganda, farmer financial inclusion, coffee ecosystem partners, coffee industry stakeholders Uganda, agricultural stakeholders Uganda, coffee stakeholders Uganda, partner with Boldstone, Boldstone partnership program, Boldstone partners, become a Boldstone partner, Boldstone cooperative partnership, Boldstone institutional partnership, Boldstone influencer partnership, Boldstone NGO partnership, Boldstone SACCO partnership, Boldstone bank partnership, Boldstone fintech partnership, Boldstone insurance partnership, coffee partnership program, agricultural partnership program, farmer partnership program, coffee referral program, coffee referral partnership, coffee affiliate partnership, coffee community partnership" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.boldstoneinvestments.com/partnership/" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Boldstone Investments" />
        <meta property="og:title" content="Coffee Partnership Opportunities in Uganda | Boldstone" />
        <meta property="og:description" content="Boldstone Partnership Program — Partner With Boldstone to build a stronger coffee ecosystem in Uganda. Coffee is more than a crop — it's a high-value export asset bringing in $2.2B annually. Whether you are a co-operative, SACCO, bank, NGO, or influencer, there's a place for you in our ecosystem." />
        <meta property="og:url" content="https://www.boldstoneinvestments.com/partnership" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Coffee Partnership Opportunities in Uganda | Boldstone" />
        <meta name="twitter:description" content="Boldstone Partnership Program — Partner With Boldstone to build a stronger coffee ecosystem in Uganda. Coffee is more than a crop — it's a high-value export asset bringing in $2.2B annually. Whether you are a co-operative, SACCO, bank, NGO, or influencer, there's a place for you in our ecosystem." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80" />
      </Helmet>

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
          <div className="p-how-header">
            <span className="p-how-label">HOW IT WORKS</span>
          </div>

          <div className="p-how-cards">
            {/* Card 1 — number left */}
            <div className="p-how-card">
              <div className="p-how-num p-how-num--left" />
              <div className="p-how-card-body">
                <h3>{howCards[0].title}</h3>
                <p>{howCards[0].body}</p>
              </div>
            </div>

            {/* Card 2 — number right */}
            <div className="p-how-card p-how-card--reverse">
              <div className="p-how-card-body">
                <h3>{howCards[1].title}</h3>
                <p>{howCards[1].body}</p>
              </div>
              <div className="p-how-num p-how-num--right" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="p-faqs-section lease-faqs-section">
        <div className="bs-wrap">
          <div className="p-faq-layout">
            <div>
              <h2 className="p-faq-heading">FAQs</h2>
            </div>
            <div className="p-faq-right">
              {faqs.map((faq, i) => (
                <div
                  key={faq.q}
                  className={`p-faq-item${openFaq === i ? ' open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') setOpenFaq(openFaq === i ? null : i)
                  }}
                >
                  <div className="p-faq-q">
                    <span>{faq.q}</span>
                    <div className="p-faq-icon"><FontAwesomeIcon icon={faChevronDown} /></div>
                  </div>
                  <div
                    ref={(element) => { faqAnswerRefs.current[i] = element }}
                    className="p-faq-a"
                    style={{ maxHeight: openFaq === i ? `${faqAnswerRefs.current[i]?.scrollHeight || 0}px` : '0px' }}
                  >
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
