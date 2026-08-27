import { useState, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faArrowRight, faRulerCombined, faMountain, faCloudRain, faLayerGroup, faLocationDot, faChartPie, faBullhorn, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as turf from '@turf/turf'

// ── ESTATE MOCK DATA ──────────────────────────────────────────────────────────
const ESTATE = {
  name: 'Kyenjojo Coffee Estate',
  location: 'Kyenjojo District, Uganda',
  altitude: '1,200 – 1,700m',
  rainfall: '1,300 – 1,600mm',
  soil: 'Volcanic Loam',
  TOTAL_ACRES: 3000,
}

// ── IRREGULAR BOUNDARY [lat, lng] ─────────────────────────────────────────────
// 48-point polygon tracing natural terrain contours: ridgelines, valleys, roads
const ESTATE_BOUNDARY = [
  [0.5882, 30.5934],
  [0.5901, 30.5978],
  [0.5888, 30.6021],
  [0.5910, 30.6058],
  [0.5897, 30.6102],
  [0.5918, 30.6145],
  [0.5905, 30.6189],
  [0.5924, 30.6228],
  [0.5912, 30.6271],
  [0.5935, 30.6312],
  [0.5968, 30.6358],
  [0.6004, 30.6381],
  [0.6038, 30.6402],
  [0.6071, 30.6388],
  [0.6108, 30.6415],
  [0.6142, 30.6398],
  [0.6178, 30.6421],
  [0.6215, 30.6407],
  [0.6251, 30.6432],
  [0.6288, 30.6418],
  [0.6318, 30.6391],
  [0.6341, 30.6354],
  [0.6362, 30.6312],
  [0.6378, 30.6268],
  [0.6395, 30.6221],
  [0.6408, 30.6178],
  [0.6421, 30.6132],
  [0.6412, 30.6088],
  [0.6428, 30.6041],
  [0.6415, 30.5998],
  [0.6401, 30.5954],
  [0.6382, 30.5918],
  [0.6358, 30.5942],
  [0.6331, 30.5921],
  [0.6304, 30.5938],
  [0.6275, 30.5912],
  [0.6248, 30.5928],
  [0.6218, 30.5908],
  [0.6188, 30.5924],
  [0.6158, 30.5905],
  [0.6128, 30.5921],
  [0.6095, 30.5902],
  [0.6062, 30.5918],
  [0.6028, 30.5898],
  [0.5994, 30.5914],
  [0.5961, 30.5895],
  [0.5928, 30.5912],
  [0.5904, 30.5924],
]

// GeoJSON version of boundary (turf uses [lng, lat])
const ESTATE_GEOJSON = turf.polygon([[
  ...ESTATE_BOUNDARY.map(([lat, lng]) => [lng, lat]),
  [ESTATE_BOUNDARY[0][1], ESTATE_BOUNDARY[0][0]], // close ring
]])

// ── GENERATE CLIPPED PARCELS ──────────────────────────────────────────────────
// 50 acres per parcel. At lat ~0.6°:
//   side = sqrt(50 * 4046.86) = 449.8 m
//   latStep = 449.8 / 111320 = 0.0040408°
//   lngStep = 449.8 / 111316 = 0.0040411°
// Grid starts at boundary bounding box so parcels fill right to the edge.
// turf.intersect clips each square — edge parcels become triangles or any shape.
function generateParcels() {
  const LAT_STEP = 0.0040408
  const LNG_STEP = 0.0040411
  const PARCEL_ACRES = 50

  const lats = ESTATE_BOUNDARY.map(([lat]) => lat)
  const lngs = ESTATE_BOUNDARY.map(([, lng]) => lng)
  const latMin = Math.min(...lats)
  const lngMin = Math.min(...lngs)
  const latMax = Math.max(...lats)
  const lngMax = Math.max(...lngs)

  const rows = Math.ceil((latMax - latMin) / LAT_STEP) + 1
  const cols = Math.ceil((lngMax - lngMin) / LNG_STEP) + 1

  const parcels = []
  let id = 1

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lat0 = latMin + r * LAT_STEP
      const lng0 = lngMin + c * LNG_STEP
      const lat1 = lat0 + LAT_STEP
      const lng1 = lng0 + LNG_STEP

      const parcelGeoJSON = turf.polygon([[
        [lng0, lat0], [lng1, lat0], [lng1, lat1], [lng0, lat1], [lng0, lat0],
      ]])

      const clipped = turf.intersect(turf.featureCollection([parcelGeoJSON, ESTATE_GEOJSON]))
      if (!clipped) continue

      let rings = []
      if (clipped.geometry.type === 'Polygon') {
        rings = [clipped.geometry.coordinates[0].map(([lng, lat]) => [lat, lng])]
      } else if (clipped.geometry.type === 'MultiPolygon') {
        rings = clipped.geometry.coordinates.map(poly => poly[0].map(([lng, lat]) => [lat, lng]))
      }
      if (!rings.length) continue

      const acres = parseFloat((turf.area(clipped) / 4046.86).toFixed(1))
      // Only keep parcels with meaningful area (> 5 acres) to drop tiny slivers
      if (acres < 5) continue

      parcels.push({ id: id++, acres, fullAcres: PARCEL_ACRES, rings })
    }
  }
  return parcels
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const USD_TO_UGX = 3700 // 1 USD ≈ 3,700 UGX
const toUGX = (usd) => `UGX ${(usd * USD_TO_UGX).toLocaleString()}`

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

const plans = [
  {
    badge: 'POPULAR CHOICE',
    name: 'Starter Plan',
    priceYear1: 49.99,
    priceYear2Plus: 19.99,
    description: 'Ideal for individuals, young professionals, and first-time coffee farmers who want to start with a manageable monthly commitment. You don\'t have to be a Ugandan to subscribe.',
    included: [
      'Annual lease of 1 acre of coffee farmland',
      'Land preparation and site establishment',
      'High-quality coffee seedlings',
      'Indigenous shade tree seedlings',
      'Planting and field layout',
      'Farm maintenance during establishment',
      'Agronomy supervision and technical support',
      'Progress updates and farm records',
      'Harvest preparation support',
    ],
    howItWorks: [
      { step: '1–6', title: 'Months 1–6', desc: 'Your subscription builds the establishment fund for your coffee acre.' },
      { step: '7', title: 'Month 7', desc: 'Boldstone begins preparing and planting your coffee farm.' },
      { step: '7–12', title: 'Months 7–12', desc: 'Your farm is established and maintained while you continue your subscription.' },
      { step: 'After', title: 'After Year 1', desc: 'Your subscription reduces to US$18/month or US$180/year to cover continued land access, farm management, and agronomy support.' },
    ],
    whyChoose: [
      'Low upfront commitment',
      'Predictable monthly payments',
      'Accessible to salaried individuals and diaspora clients',
      'Allows you to build a long-term agricultural asset gradually',
      'Easy to expand by adding additional acres over time',
    ],
    featured: true,
    cta: 'GET STARTED',
  },
  {
    badge: 'GROWTH PLAN',
    name: 'Growth Plan',
    priceYear1: 569.99,
    priceYear2Plus: 219.99,
    priceType: 'yearly',
    description: 'Ideal for individuals, businesses, individuals in the diaspora, and clients with available capital who want their coffee farm established without waiting for a phased setup period.',
    included: [
      'Annual lease of 1 acre of coffee farmland',
      'Land preparation and farm establishment',
      'High-quality coffee seedlings',
      'Planting and field layout',
      'Ongoing farm maintenance',
      'Agronomy supervision and technical support',
      'Periodic farm reports and production updates',
      'Harvest planning and coordination support',
    ],
    howItWorks: [
      { step: '1', title: 'Immediate Start', desc: 'Farm establishment begins as soon as your subscription is confirmed.' },
      { step: '2', title: 'Faster Planting', desc: 'Faster planting timeline with no waiting period.' },
      { step: '3', title: 'Early Production', desc: 'Earlier crop development and production readiness.' },
      { step: '4', title: 'Year 2 Renewal', desc: 'After the first year, your subscription renews at US$219.99/year for continued land access, farm management, and agronomy support.' },
    ],
    whyChoose: [
      'Farm establishment begins as soon as your subscription is confirmed',
      'Faster planting timeline',
      'Earlier crop development and production readiness',
      'Simplified annual payment with no monthly administration',
      'Best value for subscribers able to pay upfront',
    ],
    renewal: 'After the first year, your subscription renews at US$219.99/year for continued land access, farm management, and agronomy support.',
    featured: false,
    cta: 'GET STARTED',
  },
]

function FitBounds() {
  const map = useMap()
  map.fitBounds(ESTATE_BOUNDARY, { padding: [32, 32] })
  return null
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
const comparisonData = [
  { feature: 'Payment', monthly: 'US$49.99/month', annual: 'US$569.99/year' },
  { feature: 'Land Lease Included', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Coffee Seedlings Included', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Indigenous Tree Seedlings', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Farm Management Included', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Farm Establishment Begins', monthly: 'Month 7', annual: 'Immediately' },
  { feature: 'Agronomy Support', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Farm Progress Updates', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Renewal After Year 1', monthly: 'US$19.99/month', annual: 'US$219.99/year' },
  { feature: 'Best For', monthly: 'Salaried individuals and first-time farmers', annual: 'Businesses, investors, individuals in the diaspora and clients with available capital' },
]

const leaseFaqs = [
  {
    q: 'What exactly am I subscribing to?',
    a: 'Your subscription gives you access to one acre or more acres of coffee farmland within Boldstone’s professionally managed single-origin agroforestry estate. The subscription includes land leasing, coffee seedling establishment, farm management, agronomy supervision, and ongoing maintenance according to your selected plan. You are not purchasing land; you are participating in a managed coffee farming program designed to build a productive long-term agricultural asset.',
  },
  {
    q: 'Where is the farm located?',
    a: 'Boldstone’s coffee estate is located in Kyenjojo District in Western Uganda, one of the country’s leading coffee-growing regions. The area is known for fertile soils, favorable rainfall patterns, and strong Robusta coffee production. The farm is being developed as a large-scale, traceable, and sustainable agroforestry estate, allowing every subscriber’s acre to be integrated into a unified coffee production system.',
  },
  {
    q: 'How does the Monthly Subscription Plan work?',
    a: 'The Monthly Subscription Plan is designed for people who want to start coffee farming with a manageable monthly commitment. During the first six months, your payments contribute toward land preparation, seedling procurement, and farm establishment. From Month 7, Boldstone begins establishing your one-acre coffee farm while your subscription continues through the remainder of the first year. After Year 1, the subscription reduces to US$18 per month or US$180 per year for continued land access, farm management, and agronomy support.',
  },
  {
    q: 'What makes Boldstone’s farming model sustainable?',
    a: 'Boldstone is developing a regenerative agroforestry coffee estate that integrates native shade tree species such as Albizia coriaria and Cordia africana with coffee production. The farm follows an interleaved planting design aligned with Uganda’s Ministry of Agriculture, Animal Industry and Fisheries (MAAIF) guidelines, helping regulate microclimates, improve soil health, retain moisture, enhance biodiversity, and reduce heat-related pest pressure. This approach supports long-term coffee productivity while restoring the surrounding ecosystem.',
  },
  {
    q: 'Can I pay with a credit or debit card, and will I receive an invoice?',
    a: 'Yes. Boldstone accepts major international credit and debit cards, and subscribers receive a digital invoice and payment confirmation for every transaction. Monthly subscriptions are billed automatically on a recurring basis unless cancelled according to the subscription terms. Annual subscribers receive a comprehensive invoice showing the costs of land leasing, seedlings, and farm management services included in their plan.',
  },
  {
    q: 'Can I visit my coffee farm or receive updates?',
    a: 'Absolutely. Subscribers are welcome to visit the farm by appointment, and Boldstone provides periodic farm updates, including photographs, planting progress, agronomy activities, and seasonal production reports. Our goal is to ensure that both local and international subscribers remain connected to their coffee farm even if they are unable to visit regularly.',
  },
  {
    q: 'What happens after the coffee is harvested?',
    a: 'Boldstone provides harvest coordination, post-harvest handling support, and market linkage services through its coffee network. Because the farm operates as a single-origin and traceable estate, coffee from subscriber acres can be managed within a unified quality system designed for premium domestic and international markets. Detailed harvesting and revenue arrangements are outlined in the subscriber agreement.',
  },
  {
    q: 'Can I lease additional acres or renew my subscription in future years?',
    a: 'Yes. You may expand your coffee farm by leasing additional acres, subject to land availability, making the platform suitable for individuals, families, diaspora investors, and businesses. Both the Monthly and Annual plans are designed for long-term participation, and subscriptions can be renewed annually to continue receiving land access, farm management, agronomy support, and ongoing maintenance as your coffee farm matures and grows.',
  },
]

export default function Investors() {
  const allParcels = useMemo(() => generateParcels(), [])

  const [leased, setLeased]           = useState(new Set([1, 2, 5]))
  const [selected, setSelected]       = useState(new Set())
  const [successMsg, setSuccessMsg]   = useState('')
  const [showComparison, setShowComparison] = useState(false)
  const [showStarterDetails, setShowStarterDetails] = useState(false)
  const [showGrowthDetails, setShowGrowthDetails] = useState(false)
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

  const totalLeased   = leased.size
  const totalSelected = selected.size
  const available     = allParcels.length - totalLeased
  const pct           = allParcels.length
    ? parseFloat(((totalLeased / allParcels.length) * 100).toFixed(1))
    : 0

  const toggleParcel = (id) => {
    if (leased.has(id)) return
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    setSuccessMsg('')
  }

  const handleReserve = () => {
    if (!selected.size) return
    const totalAcres = [...selected].reduce((sum, id) => {
      const p = allParcels.find(p => p.id === id)
      return sum + (p ? p.acres : 0)
    }, 0)
    setLeased(prev => new Set([...prev, ...selected]))
    setSuccessMsg(`✓ ${selected.size} parcel${selected.size > 1 ? 's' : ''} (${totalAcres} acres) successfully reserved!`)
    setSelected(new Set())
  }

  const getStyle = (id) => {
    if (leased.has(id))   return { color: '#0a6b58', fillColor: '#0f8972', fillOpacity: 0.6,  weight: 1 }
    if (selected.has(id)) return { color: '#00cc99', fillColor: '#3dffc0', fillOpacity: 0.6,  weight: 2 }
    return                       { color: '#ffffff', fillColor: '#ffffff',  fillOpacity: 0.08, weight: 1 }
  }

  const boundaryStyle = { color: '#3dffc0', fillColor: 'transparent', weight: 2.5, dashArray: '7 5' }

  return (
    <div>
      <Helmet>
        <title>Lease a Coffee Farm in Uganda | Boldstone Investments</title>
        <meta name="description" content="At Boldstone, You're not simply owning a coffee farm—you are becoming part of a large, professionally managed single-origin coffee estate designed for traceability, long-term profitability, and environmental sustainability." />
        <meta name="keywords" content="lease a coffee farm in Uganda, coffee farm lease Uganda, lease coffee farmland Uganda, coffee farm leasing, coffee land lease Uganda, coffee farming in Uganda, coffee farm investment Uganda, coffee farming investment, invest in coffee farming, coffee farm investment opportunities, coffee farming opportunities Uganda, own a coffee farm Uganda, start a coffee farm Uganda, start coffee farming in Uganda, coffee plantation Uganda, coffee plantation investment, coffee estate Uganda, coffee estate investment, coffee farm ownership, coffee farming partnership, coffee farm partnership Uganda, agricultural land lease Uganda, farmland lease Uganda, agricultural land investment Uganda, agricultural investment Uganda, agricultural investment opportunities Uganda, commercial coffee farming Uganda, commercial coffee farm, commercial coffee plantation, coffee farming business Uganda, coffee agriculture Uganda, Uganda coffee industry, Uganda coffee sector, Uganda coffee market, Uganda coffee value chain, coffee production Uganda, coffee cultivation Uganda, coffee growing Uganda, coffee farm development, coffee plantation development, coffee estate development, coffee land investment, coffee farmland investment, sustainable coffee farming, sustainable coffee farm Uganda, sustainable coffee investment, sustainable agriculture Uganda, sustainable coffee production, sustainable coffee plantation, sustainable coffee estate, single origin coffee Uganda, single origin coffee farm, single origin coffee estate, single origin coffee farming, traceable coffee Uganda, traceable coffee farming, traceable coffee estate, specialty coffee farming Uganda, premium coffee Uganda, sustainable coffee beans, coffee agroforestry Uganda, coffee agroforestry farming, agroforestry coffee farm, coffee farm management, professional coffee farm management, professionally managed coffee farm, professional agricultural management, coffee agronomy, coffee agronomy support, coffee farm agronomy, coffee farm maintenance, coffee farm establishment, coffee land preparation, coffee planting, coffee seedlings Uganda, quality coffee seedlings, certified coffee seedlings, coffee nursery Uganda, coffee seedling suppliers Uganda, coffee farm irrigation, coffee water management, coffee soil management, coffee soil health, coffee nutrient management, coffee pest management, coffee disease management, coffee climate risk management, coffee farm productivity, coffee yield improvement, coffee farm profitability, coffee farming profitability, coffee farm returns, coffee farming returns, coffee investment returns, long term coffee investment, long term coffee farming, agricultural income diversification, passive agricultural investment, managed coffee farm, managed agricultural investment, coffee farm management services, coffee farming services Uganda, coffee farm lease opportunities, coffee leasing opportunities, affordable coffee farm investment, low cost coffee farming, affordable agricultural investment, farmland access Uganda, productive agricultural land Uganda, agricultural land access, coffee farming for beginners, first time coffee farmer, coffee farming for individuals, coffee farming for businesses, coffee farming for diaspora, coffee investment for diaspora, coffee farming for international investors, coffee farming for Ugandans, coffee farm subscription, coffee farming plans, coffee farm leasing plans, one acre coffee farm, one acre coffee plantation, one acre coffee farm Uganda, one acre coffee investment, one acre agricultural investment, one acre farming opportunity, one acre coffee estate, scalable coffee farming, scalable coffee investment, expand coffee farm, coffee enterprise development, coffee business investment Uganda, coffee value addition Uganda, coffee processing Uganda, coffee trade Uganda, coffee export Uganda, coffee market access Uganda, sustainable agricultural enterprise, professionally managed agricultural land, professionally managed coffee estate, transparent agricultural investment, transparent coffee investment, flexible coffee farm leasing, coffee farming partnership opportunities, coffee estate partnership, coffee land partnership, coffee farmer investor partnership, coffee farming opportunities for individuals, coffee farming opportunities for companies, coffee farming opportunities for diaspora, agricultural opportunities in Uganda" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.boldstoneinvestments.com/lease-a-coffee-farm/" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Boldstone Investments" />
        <meta property="og:title" content="Lease a Coffee Farm in Uganda | Boldstone Investments" />
        <meta property="og:description" content="At Boldstone, You're not simply owning a coffee farm—you are becoming part of a large, professionally managed single-origin coffee estate designed for traceability, long-term profitability, and environmental sustainability." />
        <meta property="og:url" content="https://www.boldstoneinvestments.com/lease-a-coffee-farm" />
        <meta property="og:image" content="https://address-restaurant2.odoo.com/web/image/1948-db6cb14d/Land%20aerial%20view.webp" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lease a Coffee Farm in Uganda | Boldstone Investments" />
        <meta name="twitter:description" content="At Boldstone, You're not simply owning a coffee farm—you are becoming part of a large, professionally managed single-origin coffee estate designed for traceability, long-term profitability, and environmental sustainability." />
        <meta name="twitter:image" content="https://address-restaurant2.odoo.com/web/image/1948-db6cb14d/Land%20aerial%20view.webp" />
      </Helmet>

      {/* ADVERT TICKER */}
      <div className="advert-banner">
        <div className="advert-ticker">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="advert-ticker-item">
              <span className="tk-badge"><FontAwesomeIcon icon={faBullhorn} /> News</span>
              <span className="tk-text">
                Boldstone Announces UGX 500 Million (US $140,000) Equity &amp; Debt Financing Plan to Build
                Coffee Processing Infrastructure and Empower Smallholder Farmers in Uganda.
              </span>
              <a className="tk-link" href="https://www.boldstoneinvestments.com/blog">
                Read More →
              </a>
              {i < 3 && <span className="advert-sep">●</span>}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section
        style={{
          position: 'relative',
          minHeight: '520px',
          overflow: 'hidden',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: "url('https://address-restaurant2.odoo.com/web/image/1948-db6cb14d/Land%20aerial%20view.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,18,12,0.6)' }} />
        <div className="hero-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="hero-label"
          >
            Own a Coffee Farm in Uganda
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ textAlign: 'center' }}
          >
            Grow Your Coffee in Uganda's Sustainable Single-Origin Coffee Estate
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="hero-actions"
          >
            <Link to="/partnership" className="btn-primary">Get Started →</Link>
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </motion.div>
        </div>
      </section>

      {/* ── INTRO TEXT ── */}
      <section style={{
        padding: '56px 24px',
        position: 'relative',
        backgroundImage: "url('https://address-restaurant2.odoo.com/web/image/2021-f4893534/card%201.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}>
        {/* 3D Glass panel */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(1px)',
          WebkitBackdropFilter: 'blur(1px)',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          borderRight: '1px solid rgba(255,255,255,0.03)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
          transform: 'perspective(1200px) rotateX(0.6deg)',
          transformOrigin: 'center top',
          zIndex: 0,
        }} />

        <div className="bs-wrap" style={{ maxWidth: 860, position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '15px', color: '#0d1f1c', lineHeight: 1.85, marginBottom: '24px', textAlign: 'justify' }}>
            At Boldstone, You're not simply owning a coffee farm—you are becoming part of a large, professionally managed single-origin coffee estate designed for traceability, long-term profitability, and environmental sustainability.
          </p>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section className="farmer-plans lease-plans">
        <div className="bs-wrap">
          <div className="plans-header">
            <h1 className="section-label">Choose Your Coffee Farming Plan</h1>
          </div>
          <div className="plans-grid">
            {plans.map((plan, i) => (
              <div key={i} className={`plan-card${plan.featured ? ' featured' : ''}`}>
                <div className="offer-card-back" />
                <div className="offer-card-inner">
                  <div className="plan-card-content">
                    <p className="plan-name">{plan.name}</p>
                    
                    {/* Pricing */}
                    {i === 0 ? (
                      <p className="plan-pricing" style={{
                        fontSize: 'clamp(0.65rem, 2vw, 0.8rem)',
                        fontWeight: 700,
                        lineHeight: 1.5,
                        color: '#0d1f1c',
                        margin: '12px 0 16px',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.3rem',
                      }}>
                        <span style={{ fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', fontWeight: 700, color: '#0d1f1c', whiteSpace: 'nowrap' }}>
                          US$49.99/month
                        </span>
                        <span style={{ fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', fontWeight: 700, color: '#0d1f1c' }}>for the 1st year,</span>
                        <span style={{ fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', fontWeight: 700, color: '#0d1f1c' }}>Renews at</span>
                        <span style={{ fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', fontWeight: 700, color: '#0d1f1c', whiteSpace: 'nowrap' }}>
                          US$19.99/month
                        </span>
                      </p>
                    ) : (
                      <p className="plan-pricing" style={{
                        fontSize: 'clamp(0.65rem, 2vw, 0.8rem)',
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: '#0d1f1c',
                        margin: '12px 0 16px',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                      }}>
                        <span style={{ fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', fontWeight: 700, color: '#0d1f1c' }}>
                          US$569.99/year
                        </span>
                        {' '}for the 1st year, Renews at{' '}
                        <span style={{ fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', fontWeight: 700, color: '#0d1f1c' }}>
                          US$219.99/year
                        </span>
                      </p>
                    )}

                    {/* Description */}
                    {plan.description && (
                      <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#333', margin: '0 0 12px 0' }}>
                        {plan.description}
                      </p>
                    )}

                    <div className="plan-divider" />

                    {/* What's Included */}
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', tracking: '2px', color: '#666', marginBottom: '8px' }}>
                        What's Included
                      </p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {plan.included.map((item, j) => (
                          <li key={j} style={{ fontSize: '0.85rem', color: '#333', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <span style={{ color: '#0f8972', fontWeight: 900, marginTop: '2px' }}>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Learn More Button */}
                    {/* Learn More Button */}
                    <div style={{ marginTop: 'auto' }}>
                    {i === 0 && (
                      <button
                        onClick={() => setShowStarterDetails(!showStarterDetails)}
                        style={{
                          width: 'fit-content',
                          padding: '10px 16px',
                          marginBottom: '20px',
                          background: '#f0faf7',
                          border: '1.5px solid #0f8972',
                          borderRadius: '8px',
                          color: '#0f8972',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(15,137,114,0.08)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#f0faf7'
                        }}
                      >
                        {showStarterDetails ? 'Show Less' : 'Learn More'} →
                      </button>
                    )}

                    {/* Learn More Button for Growth Plan */}
                    {i === 1 && (
                      <button
                        onClick={() => setShowGrowthDetails(!showGrowthDetails)}
                        style={{
                          width: 'fit-content',
                          padding: '10px 16px',
                          marginBottom: '20px',
                          background: plan.featured ? 'rgba(61,255,192,0.15)' : '#f0faf7',
                          border: `1.5px solid ${plan.featured ? '#3dffc0' : '#0f8972'}`,
                          borderRadius: '8px',
                          color: plan.featured ? '#3dffc0' : '#0f8972',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = plan.featured ? 'rgba(61,255,192,0.25)' : 'rgba(15,137,114,0.08)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = plan.featured ? 'rgba(61,255,192,0.15)' : '#f0faf7'
                        }}
                      >
                        {showGrowthDetails ? 'Show Less' : 'Learn More'} →
                      </button>
                    )}
                    </div>

                    <Link to="/partnership" className="plan-cta">
                      {plan.cta} <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compare All Plans Button */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={() => setShowComparison(true)}
              style={{
                background: 'none',
                border: '2px solid #0f8972',
                color: '#0f8972',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '12px 28px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                borderRadius: '50px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f0faf7'
                e.target.style.borderColor = '#0a6b58'
                e.target.style.color = '#0a6b58'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none'
                e.target.style.borderColor = '#0f8972'
                e.target.style.color = '#0f8972'
              }}
            >
              Compare All Plans <span style={{ marginLeft: '4px' }}>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Why Lease Section */}
      <section className="lease-why-section" style={{
        padding: '56px 24px',
        position: 'relative',
        backgroundImage: "url('https://address-restaurant2.odoo.com/web/image/2019-9db78ec6/background%20image.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}>
        {/* 3D Glass panel */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(1px)',
          WebkitBackdropFilter: 'blur(1px)',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          borderRight: '1px solid rgba(255,255,255,0.03)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
          transform: 'perspective(1200px) rotateX(0.6deg)',
          transformOrigin: 'center top',
          zIndex: 0,
        }} />

        <div className="bs-wrap" style={{ maxWidth: 1200, position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 900, color: '#0d1f1c', marginBottom: '56px', textAlign: 'center' }}>
            Why Lease a Coffee Farm with Boldstone
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              {
                title: 'Single Origin & Sustainable Farms',
                description: 'Boldstone\'s aims to establish single origin, traceable and sustainable coffee agro-forestry farms. By being a part, you gain a premium price advantage due to sustainably grown coffee beans.',
              },
              {
                title: 'Low Cost of Ownership',
                description: 'There is no land purchase required to start farming with Boldstone; meaning that 80%+ of your capital goes straight into farming. Save up to $4,000 by accessing productive agricultural land through an annual lease.',
              },
              {
                title: 'Professional Farm Management',
                description: 'Our team understands the critical factors that determine a successful coffee farm, including soil health, irrigation and water management, nutrient requirements, pest and disease control, and climate-related risks. This expertise enables us to manage your coffee farm using proven agronomic practices that maximize plant health, productivity, and long-term yield potential.',
              },
              {
                title: 'Quality Coffee Seedlings',
                description: 'We provide high-quality coffee seedlings sourced from our trusted and certified nursery beds to ensure strong establishment and long-term productivity. We aim for seedlings that have vigor, disease resistance, and suitability to local growing conditions, giving your farm a healthy start and improving its potential for consistent yields over the life of the coffee plantation.',
              },
              {
                title: 'Transparent Pricing',
                description: 'We have no hidden fees and unexpected charges. We provide transparent and straightforward pricing with clearly defined costs for land leasing, seedlings, and farm management services.',
              },
              {
                title: 'Scalable',
                description: 'Begin with a single acre and expand your coffee farm at your own pace. Boldstone\'s flexible leasing and farm management model allows you to increase your acreage over time as your confidence, capital, and production goals grow, making it easy to build a larger coffee enterprise without the need for a significant upfront land investment.',
              },
            ].map((item, idx) => (
              <div key={idx} className="offer-card">
                <div className="offer-card-back" />
                <div className="offer-card-inner">
                  <div className="offer-card-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="p-faqs-section lease-faqs-section">
        <div className="bs-wrap">
          <div className="p-faq-layout">
            <div>
              <h2 className="p-faq-heading">FAQs</h2>
            </div>
            <div className="p-faq-right">
              {leaseFaqs.map((faq, i) => (
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

      {/* Starter Details Modal */}
      {showStarterDetails && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '12px',
          backdropFilter: 'blur(3px)',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(15, 137, 114, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(15, 137, 114, 0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: 'clamp(20px, 5vw, 32px)',
              background: 'linear-gradient(135deg, #0a6b58 0%, #0f8972 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(15, 137, 114, 0.2)',
              flexShrink: 0,
            }}>
              <div>
                <p style={{ 
                  fontSize: 'clamp(9px, 2.5vw, 11px)', 
                  fontWeight: 800, 
                  letterSpacing: '2px', 
                  textTransform: 'uppercase', 
                  color: '#7ecfc4', 
                  margin: '0 0 8px 0' 
                }}>
                  Starter Plan
                </p>
                <h2 style={{ fontSize: 'clamp(20px, 6vw, 32px)', fontWeight: 900, color: '#fff', margin: 0 }}>
                  How It Works
                </h2>
              </div>
              <button
                onClick={() => setShowStarterDetails(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  cursor: 'pointer',
                  color: '#fff',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                  marginLeft: '12px',
                  minWidth: '48px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)'
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: 'clamp(16px, 4vw, 32px)', overflowY: 'auto', flex: 1 }}>
              {/* How It Works */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {plans[0].howItWorks.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: '#f0faf7', border: '2px solid #0f8972', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900, color: '#0f8972', flexShrink: 0 }}>
                        {j + 1}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0d1f1c', margin: '0 0 4px 0' }}>{item.title}</p>
                        <p style={{ fontSize: '0.9rem', color: '#555', margin: 0, lineHeight: '1.5' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0d1f1c', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Why Choose the Monthly Plan?
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {plans[0].whyChoose.map((reason, j) => (
                    <li key={j} style={{ fontSize: '0.9rem', color: '#333', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#0f8972', fontWeight: 900, marginTop: '2px', minWidth: '16px' }}>•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Renewal Info */}
              {plans[0].renewal && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0d1f1c', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    After Year 1
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#333', lineHeight: '1.6', margin: 0 }}>
                    {plans[0].renewal}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Growth Plan Details Modal */}
      {showGrowthDetails && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '12px',
          backdropFilter: 'blur(3px)',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(15, 137, 114, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(15, 137, 114, 0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: 'clamp(20px, 5vw, 32px)',
              background: 'linear-gradient(135deg, #0a6b58 0%, #0f8972 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(15, 137, 114, 0.2)',
              flexShrink: 0,
            }}>
              <div>
                <p style={{ 
                  fontSize: 'clamp(9px, 2.5vw, 11px)', 
                  fontWeight: 800, 
                  letterSpacing: '2px', 
                  textTransform: 'uppercase', 
                  color: '#7ecfc4', 
                  margin: '0 0 8px 0' 
                }}>
                  Growth Plan
                </p>
                <h2 style={{ fontSize: 'clamp(20px, 6vw, 32px)', fontWeight: 900, color: '#fff', margin: 0 }}>
                  Immediate Benefits
                </h2>
              </div>
              <button
                onClick={() => setShowGrowthDetails(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  cursor: 'pointer',
                  color: '#fff',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                  marginLeft: '12px',
                  minWidth: '48px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)'
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: 'clamp(16px, 4vw, 32px)', overflowY: 'auto', flex: 1 }}>
              <div style={{ marginBottom: '32px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'Farm establishment begins as soon as your subscription is confirmed',
                    'Faster planting timeline',
                    'Earlier crop development and production readiness',
                    'Simplified annual payment with no monthly administration',
                    'Best value for subscribers able to pay upfront',
                  ].map((benefit, j) => (
                    <li key={j} style={{ fontSize: '0.9rem', color: '#333', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#0f8972', fontWeight: 900, marginTop: '2px', minWidth: '16px' }}>•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '12px',
          backdropFilter: 'blur(3px)',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(15, 137, 114, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(15, 137, 114, 0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: 'clamp(20px, 5vw, 32px)',
              background: 'linear-gradient(135deg, #0a6b58 0%, #0f8972 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(15, 137, 114, 0.2)',
              flexShrink: 0,
            }}>
              <div>
                <p style={{ 
                  fontSize: 'clamp(9px, 2.5vw, 11px)', 
                  fontWeight: 800, 
                  letterSpacing: '2px', 
                  textTransform: 'uppercase', 
                  color: '#7ecfc4', 
                  margin: '0 0 8px 0' 
                }}>
                  Side by Side
                </p>
                <h2 style={{ fontSize: 'clamp(20px, 6vw, 32px)', fontWeight: 900, color: '#fff', margin: 0 }}>
                  Plan Comparison
                </h2>
              </div>
              <button
                onClick={() => setShowComparison(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  cursor: 'pointer',
                  color: '#fff',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                  marginLeft: '12px',
                  minWidth: '48px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)'
                }}
              >
                ✕
              </button>
            </div>

            {/* Table Container */}
            <div style={{ 
              padding: 'clamp(16px, 4vw, 32px)', 
              overflowY: 'auto', 
              overflowX: 'auto',
              flex: 1,
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
              }} className="comparison-table">
                <thead>
                  <tr>
                    <th style={{
                      padding: 'clamp(12px, 2vw, 16px) clamp(12px, 3vw, 20px)',
                      textAlign: 'left',
                      fontSize: 'clamp(10px, 2.5vw, 12px)',
                      fontWeight: 900,
                      color: '#0d1f1c',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      background: '#f0faf7',
                      borderBottom: '2px solid #0f8972',
                      borderLeft: '1.5px solid #d1d5db',
                      borderRight: '1.5px solid #d1d5db',
                      borderTop: '1.5px solid #d1d5db',
                      borderRadius: '8px 0 0 0',
                      whiteSpace: 'nowrap',
                    }}>
                      Feature
                    </th>
                    <th style={{
                      padding: 'clamp(12px, 2vw, 16px) clamp(12px, 3vw, 20px)',
                      textAlign: 'center',
                      fontSize: 'clamp(10px, 2.5vw, 12px)',
                      fontWeight: 900,
                      color: '#0f8972',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      background: '#f0faf7',
                      borderBottom: '2px solid #0f8972',
                      borderLeft: '1.5px solid #d1d5db',
                      borderRight: '1.5px solid #d1d5db',
                      borderTop: '1.5px solid #d1d5db',
                      position: 'relative',
                      whiteSpace: 'nowrap',
                    }}>
                      Monthly
                    </th>
                    <th style={{
                      padding: 'clamp(12px, 2vw, 16px) clamp(12px, 3vw, 20px)',
                      textAlign: 'center',
                      fontSize: 'clamp(10px, 2.5vw, 12px)',
                      fontWeight: 900,
                      color: '#0f8972',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      background: 'linear-gradient(135deg, rgba(15, 137, 114, 0.08), rgba(61, 255, 192, 0.05))',
                      borderBottom: '2px solid #0f8972',
                      borderLeft: '1.5px solid #d1d5db',
                      borderRight: '1.5px solid #d1d5db',
                      borderTop: '1.5px solid #d1d5db',
                      borderRadius: '0 8px 0 0',
                      whiteSpace: 'nowrap',
                    }}>
                      Annual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, idx) => {
                    const isLastRow = idx === comparisonData.length - 1
                    const isBoldRow = row.feature === 'Payment'
                    return (
                      <tr key={idx}>
                        <td style={{
                          padding: 'clamp(12px, 2vw, 16px) clamp(12px, 3vw, 20px)',
                          fontSize: 'clamp(11px, 2.2vw, 14px)',
                          fontWeight: isBoldRow ? 600 : 500,
                          color: '#0d1f1c',
                          background: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                          borderBottom: '1.5px solid #d1d5db',
                          borderLeft: '1.5px solid #d1d5db',
                          borderRight: '1.5px solid #d1d5db',
                          borderRadius: isLastRow ? '0 0 0 8px' : '0',
                          minWidth: '140px',
                        }}>
                          {row.feature}
                        </td>
                        <td style={{
                          padding: 'clamp(12px, 2vw, 16px) clamp(12px, 3vw, 20px)',
                          fontSize: 'clamp(11px, 2.2vw, 14px)',
                          fontWeight: isBoldRow ? 500 : 400,
                          color: '#555',
                          background: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                          borderBottom: '1.5px solid #d1d5db',
                          borderLeft: '1.5px solid #d1d5db',
                          borderRight: '1.5px solid #d1d5db',
                          textAlign: 'center',
                          minWidth: '100px',
                        }}>
                          {row.monthly === 'Yes' ? <span style={{fontWeight: 700, fontSize: '18px'}}>✓</span> : row.monthly}
                        </td>
                        <td style={{
                          padding: 'clamp(12px, 2vw, 16px) clamp(12px, 3vw, 20px)',
                          fontSize: 'clamp(11px, 2.2vw, 14px)',
                          fontWeight: isBoldRow ? 600 : 400,
                          color: '#0f8972',
                          background: idx % 2 === 0 
                            ? 'rgba(15, 137, 114, 0.03)' 
                            : 'rgba(15, 137, 114, 0.06)',
                          borderBottom: '1.5px solid #d1d5db',
                          borderLeft: '1.5px solid #d1d5db',
                          borderRight: '1.5px solid #d1d5db',
                          textAlign: 'center',
                          borderRadius: isLastRow ? '0 0 8px 0' : '0',
                          minWidth: '100px',
                        }}>
                          {row.annual === 'Yes' ? <span style={{fontWeight: 700, fontSize: '18px'}}>✓</span> : row.annual}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Info Text - appears after scrolling */}
              <div style={{ padding: '24px 0 0 0', marginTop: '16px' }}>
                <p style={{
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  lineHeight: '1.6',
                  color: '#555',
                  margin: 0,
                  fontWeight: 400,
                }}>
                  Both plans are designed to help you build a productive coffee farm without purchasing land, while benefiting from Boldstone's expertise in coffee agronomy, farm management, and market access.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: 'clamp(16px, 3vw, 24px) clamp(16px, 4vw, 32px)',
              borderTop: '1px solid #e5e7eb',
              background: '#f9fafb',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <button
                onClick={() => setShowComparison(false)}
                style={{
                  padding: 'clamp(10px, 2vw, 12px) clamp(16px, 4vw, 28px)',
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  fontWeight: 700,
                  border: 'none',
                  background: 'linear-gradient(135deg, #0a6b58, #0f8972)',
                  color: '#fff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(15, 137, 114, 0.2)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 6px 20px rgba(15, 137, 114, 0.3)'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 4px 12px rgba(15, 137, 114, 0.2)'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
