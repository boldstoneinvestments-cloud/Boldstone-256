import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons'

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

const plans = [
  {
    badge: 'MONTHLY',
    name: 'LEASE 1 ACRE MONTHLY',
    price: '$15', period: '/ month',
    desc: 'Flexible monthly lease. Cancel anytime with no long-term commitment.',
    features: [
      'Lease 1 acre of coffee farm',
      'Full farm management included',
      'Monthly progress reports',
      'Cancel anytime',
    ],
    featured: false,
    cta: 'Start Monthly',
  },
  {
    badge: 'MOST POPULAR',
    name: 'LEASE 1 ACRE ANNUALLY',
    price: '$150', period: '/ year',
    desc: 'Best value for serious investors. Save $30 compared to monthly.',
    features: [
      'Lease 1 acre of coffee farm',
      'Full farm management included',
      'Monthly progress reports',
      'Save $30 vs monthly',
      'Priority investor support',
    ],
    featured: true,
    cta: 'Start Annual Plan',
  },
  {
    badge: 'ONE-TIME',
    name: 'COFFEE SEEDLINGS',
    price: '$200', period: 'one-time',
    desc: 'Premium disease-resistant seedlings delivered and planted on your acre.',
    features: [
      'Premium coffee seedlings',
      '25% below market price',
      'Delivered & planted for you',
      'Disease-resistant varieties',
    ],
    featured: false,
    cta: 'Order Seedlings',
  },
]

export default function Investors() {
  return (
    <div>

      {/* HERO */}
      <section
        className="relative min-h-[560px] flex items-center justify-center text-center overflow-hidden"
        style={{ backgroundImage: "url('https://address-restaurant2.odoo.com/web/image/1948-db6cb14d/Land%20aerial%20view.webp')", backgroundSize: 'cover', backgroundPosition: 'center top' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(4,20,14,0.55)] to-[rgba(4,20,14,0.75)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-white">
          <motion.span
            variants={fadeUp} initial="hidden" animate="show"
            className="inline-block bg-white/10 border border-white/25 text-[#3dffc0] text-[11px] font-bold tracking-[3px] uppercase px-5 py-2 rounded-full mb-6 backdrop-blur-sm"
          >
            Invest in Coffee · Grow the Future
          </motion.span>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }}
            className="text-5xl font-black leading-[1.05] tracking-tight mb-5"
          >
            Own a Coffee Farm<br />in <span className="text-[#3dffc0]">Uganda</span>
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.2 }}
            className="text-white/75 text-base leading-relaxed max-w-xl mx-auto mb-8"
          >
            Lease a portion of our 3,000-acre estate and be part of a sustainable coffee future. We handle the farming — you enjoy the ownership.
          </motion.p>
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <Link to="/partnership" className="btn-primary">Get Started →</Link>
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </motion.div>
        </div>
      </section>

      {/* PLANS */}
      <section className="farmer-plans">
        <div className="bs-wrap">
          <div className="plans-header">
            <h1 className="section-label">INVESTOR PLANS</h1>
            <h2>Choose your <span>plan.</span></h2>
            <p>Start with a single acre and scale up. Every plan includes full farm management — we do the work, you own the land.</p>
          </div>
          <div className="plans-grid">
            {plans.map((plan, i) => (
              <div key={i} className={`plan-card${plan.featured ? ' featured' : ''}`}>
                <span className="plan-badge">{plan.badge}</span>
                <p className="plan-name">{plan.name}</p>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1, color: plan.featured ? '#fff' : '#0d1f1c', margin: '8px 0 4px' }}>
                  {plan.price} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: plan.featured ? 'rgba(255,255,255,0.55)' : '#aaa' }}>{plan.period}</span>
                </div>
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
                <Link to="/partnership" className="plan-cta">
                  {plan.cta} <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
