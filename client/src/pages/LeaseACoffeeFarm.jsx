import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faArrowRight, faRulerCombined, faMountain, faCloudRain, faLayerGroup, faLocationDot, faChartPie, faBullhorn } from '@fortawesome/free-solid-svg-icons'
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
    description: 'Ideal for individuals, young professionals, individuals in the diaspora, and first-time coffee farmers who want to start with a manageable monthly commitment. You don\'t have to be a Ugandan to subscribe.',
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
    priceYear1: 480,
    priceYear2Plus: 180,
    priceType: 'yearly',
    description: 'Ideal for individuals and businesses with available capital who want their coffee farm established without waiting for a phased setup period.',
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
      { step: '4', title: 'Year 2 Renewal', desc: 'After the first year, your subscription renews at US$180/year for continued land access, farm management, and agronomy support.' },
    ],
    whyChoose: [
      'Farm establishment begins as soon as your subscription is confirmed',
      'Faster planting timeline',
      'Earlier crop development and production readiness',
      'Simplified annual payment with no monthly administration',
      'Best value for subscribers able to pay upfront',
    ],
    renewal: 'After the first year, your subscription renews at US$180/year for continued land access, farm management, and agronomy support.',
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
  { feature: 'Payment', monthly: 'US$49.99/month', annual: 'US$499/year' },
  { feature: 'Land Lease Included', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Coffee Seedlings Included', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Indigenous Tree Seedlings', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Farm Management Included', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Farm Establishment Begins', monthly: 'Month 7', annual: 'Immediately' },
  { feature: 'Agronomy Support', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Farm Progress Updates', monthly: 'Yes', annual: 'Yes' },
  { feature: 'Renewal After Year 1', monthly: 'US$19.99/month', annual: 'US$199/year' },
  { feature: 'Best For', monthly: 'Salaried individuals, diaspora, first-time farmers', annual: 'Businesses, investors, and clients with available capital' },
]

export default function Investors() {
  const allParcels = useMemo(() => generateParcels(), [])

  const [leased, setLeased]           = useState(new Set([1, 2, 5]))
  const [selected, setSelected]       = useState(new Set())
  const [successMsg, setSuccessMsg]   = useState('')
  const [showComparison, setShowComparison] = useState(false)
  const [showStarterDetails, setShowStarterDetails] = useState(false)
  const [showGrowthDetails, setShowGrowthDetails] = useState(false)

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
              <a className="tk-link" href="https://www.boldstoneinvestments.com/#/blog">
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
            At Boldstone, you are not simply leasing an acre of land—you are becoming part of a large, professionally managed single-origin coffee estate designed for traceability, long-term profitability, and environmental sustainability.
          </p>
        </div>
      </section>

      {/* ── LAND EXPLORER ── */}
      <section className="py-20 bg-[#f0faf7]" style={{ display: 'none' }}>
        <div className="bs-wrap">
          <div className="why-left mb-10" style={{ display: 'none' }}>
            <h1 className="section-label">ESTATE MAP</h1>
            <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0 12px', color: '#1a1a1a' }}>Kyenjojo <span style={{ color: '#0f8972' }}>Coffee Estate</span></h2>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7 }}>Satellite view of the real estate. Parcels are clipped to the exact boundary — click any parcel to select it, then reserve.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">

            {/* MAP */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div style={{ height: 540 }}>
                <MapContainer
                  center={[0.6155, 30.6175]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom
                >
                  <FitBounds />
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri — Maxar, Earthstar Geographics"
                    maxZoom={19}
                  />

                  {/* Outer estate boundary */}
                  <Polygon positions={ESTATE_BOUNDARY} pathOptions={boundaryStyle}>
                    <Tooltip sticky>Kyenjojo Coffee Estate — 3,000 acres</Tooltip>
                  </Polygon>

                  {/* Clipped parcels — each ring is guaranteed inside the boundary */}
                  {allParcels.map(p =>
                    p.rings.map((ring, ri) => (
                      <Polygon
                        key={`${p.id}-${ri}`}
                        positions={ring}
                        pathOptions={getStyle(p.id)}
                        eventHandlers={{ click: () => toggleParcel(p.id) }}
                      >
                        <Tooltip>
                          {leased.has(p.id)
                            ? `Parcel #${p.id} — Leased (${p.acres} ac)`
                            : selected.has(p.id)
                            ? `Parcel #${p.id} — Selected · ${p.acres} ac`
                            : `Parcel #${p.id} — ${p.acres} ac · click to select`}
                        </Tooltip>
                      </Polygon>
                    ))
                  )}
                </MapContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-5 px-5 py-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <div className="w-3 h-3 rounded-sm bg-[#0f8972]" /> Leased ({totalLeased})
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <div className="w-3 h-3 rounded-sm bg-[#3dffc0]" /> Your Selection ({totalSelected})
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <div className="w-3 h-3 rounded-sm border border-gray-300 bg-white/30" /> Available ({available})
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 ml-auto">
                  <div className="w-5 h-0 border-t-2 border-dashed border-[#3dffc0]" /> Estate Boundary
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="flex flex-col gap-4 min-w-0">

              {/* ESTATE DETAILS CARD */}
              <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #0a1f18 0%, #0d2a20 100%)', border: '1px solid rgba(61,255,192,0.12)' }}>

                {/* Card header */}
                <div className="flex items-center justify-between" style={{ padding: '16px 10px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="min-w-0" style={{ paddingLeft: '10px' }}>
                    <p className="text-[9px] font-black uppercase tracking-[4px] text-[#3dffc0] mb-0.5">Kyenjojo · Uganda</p>
                    <p className="text-white font-black text-base leading-none">Estate Details</p>
                  </div>
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(61,255,192,0.1)', border: '1px solid rgba(61,255,192,0.2)', marginRight: '10px' }}>
                    <FontAwesomeIcon icon={faLocationDot} className="text-[#3dffc0] text-xs" />
                  </div>
                </div>

                {/* Stats rows */}
                <div className="px-5 py-3 flex flex-col" style={{ gap: '2px' }}>
                  {[
                    { icon: faRulerCombined, label: 'Total Size', value: '3,000 acres' },
                    { icon: faChartPie,      label: 'Available',  value: `${available} parcels` },
                    { icon: faMountain,      label: 'Altitude',   value: '1,200 – 1,700 m' },
                    { icon: faCloudRain,     label: 'Rainfall',   value: '1,300 – 1,600 mm/yr' },
                    { icon: faLayerGroup,    label: 'Soil',       value: 'Volcanic Loam' },
                    { icon: faLocationDot,   label: 'Location',   value: 'Kyenjojo District' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-3" style={{ padding: '10px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(15,137,114,0.2)' }}>
                        <FontAwesomeIcon icon={row.icon} style={{ color: '#0f8972', fontSize: '9px' }} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)', paddingLeft: '10px', whiteSpace: 'nowrap', width: '300px' }}>{row.label}</span>
                      <span className="text-white text-xs font-semibold truncate flex-1 text-left" style={{ paddingRight: '10px', paddingLeft: '10px' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Allocation */}
                <div style={{ padding: '16px 20px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
                    <span className="text-[9px] font-black uppercase tracking-[3px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Allocated</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#3dffc0] font-black text-sm">{pct}%</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>{totalLeased} leased</span>
                    </div>
                  </div>
                  <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0f8972, #3dffc0)', minWidth: pct > 0 ? '8px' : '0' }} />
                  </div>
                  <div className="flex justify-between" style={{ marginTop: '8px' }}>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>0%</span>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>100%</span>
                  </div>
                </div>
              </div>

              {/* RESERVE WIDGET */}
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(15,137,114,0.25)' }}>

                {/* Green header */}
                <div className="flex items-center justify-between" style={{ padding: '16px 10px 16px 10px', background: 'linear-gradient(135deg, #0a6b58, #0f8972)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-white font-black text-base leading-none" style={{ paddingLeft: '10px' }}>Reserve Parcels</p>
                </div>

                {/* Body */}
                <div className="bg-white px-5 py-3">
                  {totalSelected === 0 ? (
                    <div className="text-center py-5">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#f0faf7' }}>
                        <FontAwesomeIcon icon={faLocationDot} className="text-[#0f8972]" />
                      </div>
                      <p className="text-sm font-bold text-[#0d1f1c] mb-1">No parcels selected</p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>Click a parcel on the map to select it</p>
                    </div>
                  ) : (
                    <>
                      {/* Selected + area */}
                      <div className="grid grid-cols-2 mb-4" style={{ gap: '2px' }}>
                        {[{
                          label: 'Parcels', value: totalSelected, unit: totalSelected > 1 ? 'selected' : 'selected',
                        }, {
                          label: 'Total Area',
                          value: [...selected].reduce((s, id) => s + (allParcels.find(p => p.id === id)?.acres ?? 0), 0).toFixed(1),
                          unit: 'acres',
                        }].map((s, i) => (
                          <div key={i} className="rounded-xl text-center" style={{ background: '#f0faf7', padding: '10px 10px' }}>
                            <p className="text-[9px] font-black uppercase tracking-[3px] mb-1" style={{ color: '#9ca3af' }}>{s.label}</p>
                            <p className="text-xl font-black text-[#0d1f1c] leading-none">{s.value}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>{s.unit}</p>
                          </div>
                        ))}
                      </div>

                      {/* Cost rows */}
                      <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid #f0f0f0' }}>
                        {[{
                          label: 'Monthly', sub: '/month',
                          amount: [...selected].reduce((s, id) => s + (allParcels.find(p => p.id === id)?.acres ?? 0), 0) * 15 * USD_TO_UGX,
                        }, {
                          label: 'Annual', sub: 'save 17%',
                          amount: [...selected].reduce((s, id) => s + (allParcels.find(p => p.id === id)?.acres ?? 0), 0) * 150 * USD_TO_UGX,
                        }].map((row, i) => (
                          <div key={i} className="flex items-center justify-between" style={{ padding: '10px 10px', borderBottom: i === 0 ? '1px solid #f0f0f0' : 'none' }}>
                            <div>
                              <p className="text-xs font-bold text-[#0d1f1c]">{row.label}</p>
                              <p className="text-[10px]" style={{ color: i === 1 ? '#0f8972' : '#9ca3af' }}>{row.sub}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>UGX</p>
                              <p className="text-sm font-black text-[#0d1f1c]">{row.amount.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {successMsg && (
                    <div className="flex items-center gap-2 text-xs font-semibold rounded-xl px-4 py-3 mb-4" style={{ background: '#f0faf7', border: '1px solid rgba(15,137,114,0.2)', color: '#0f8972' }}>
                      <FontAwesomeIcon icon={faCircleCheck} className="flex-shrink-0" />
                      <span className="truncate">{successMsg}</span>
                    </div>
                  )}

                  <button
                    onClick={handleReserve}
                    disabled={totalSelected === 0}
                    className="text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 mx-auto"
                    style={{ padding: '10px 5px', width: '300px', display: 'block', margin: '0 auto', ...(totalSelected === 0
                      ? { background: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed' }
                      : { background: 'linear-gradient(135deg, #0a6b58, #0f8972)' })
                    }}
                  >
                    {totalSelected === 0 ? 'Select parcels on the map' : `Reserve ${totalSelected} Parcel${totalSelected > 1 ? 's' : ''}`}
                    {totalSelected > 0 && <FontAwesomeIcon icon={faArrowRight} />}
                  </button>
                  <p className="text-[10px] text-center mt-3" style={{ color: '#d1d5db' }}>Non-binding · our team will contact you</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section className="farmer-plans">
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
                      <p style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: '#fff',
                        margin: '12px 0 16px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                          US$49.99/month
                        </span>
                        {' '}for the 1st year, Renews at{' '}
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                          US$19.99/month
                        </span>
                      </p>
                    ) : (
                      <p style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: plan.featured ? '#fff' : '#0d1f1c',
                        margin: '12px 0 16px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: plan.featured ? '#fff' : '#0d1f1c' }}>
                          US$499/year
                        </span>
                        {' '}for the 1st year, Renews at{' '}
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: plan.featured ? '#fff' : '#0d1f1c' }}>
                          US$199/year
                        </span>
                      </p>
                    )}

                    {/* Description */}
                    {plan.description && (
                      <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: plan.featured ? 'rgba(255,255,255,0.85)' : '#333', margin: '0 0 12px 0' }}>
                        {plan.description}
                      </p>
                    )}

                    <div className="plan-divider" />

                    {/* What's Included */}
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', tracking: '2px', color: plan.featured ? 'rgba(255,255,255,0.6)' : '#666', marginBottom: '8px' }}>
                        What's Included
                      </p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {plan.included.map((item, j) => (
                          <li key={j} style={{ fontSize: '0.85rem', color: plan.featured ? 'rgba(255,255,255,0.85)' : '#333', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <span style={{ color: plan.featured ? '#3dffc0' : '#0f8972', fontWeight: 900, marginTop: '2px' }}>•</span>
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
