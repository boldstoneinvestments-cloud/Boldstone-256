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
    badge: 'MONTHLY', name: 'LEASE 1 ACRE MONTHLY', price: toUGX(15), period: '/ month',
    desc: 'Flexible monthly lease. Cancel anytime.',
    features: ['Lease 1 acre of coffee farm', 'Full farm management included', 'Monthly progress reports', 'Cancel anytime'],
    featured: false, cta: 'Start Monthly',
  },
  {
    badge: 'MOST POPULAR', name: 'LEASE 1 ACRE ANNUALLY', price: toUGX(150), period: '/ year',
    desc: `Best value for serious investors. Save ${toUGX(30)} compared to monthly.`,
    features: ['Lease 1 acre of coffee farm', 'Full farm management included', 'Monthly progress reports', `Save ${toUGX(30)} vs monthly`, 'Priority investor support'],
    featured: true, cta: 'Start Annual Plan',
  },
  {
    badge: 'ONE-TIME', name: 'COFFEE SEEDLINGS', price: toUGX(200), period: 'one-time',
    desc: 'Premium disease-resistant seedlings delivered and planted on your acre.',
    features: ['Premium coffee seedlings', '25% below market price', 'Delivered & planted for you', 'Disease-resistant varieties'],
    featured: false, cta: 'Order Seedlings',
  },
]

function FitBounds() {
  const map = useMap()
  map.fitBounds(ESTATE_BOUNDARY, { padding: [32, 32] })
  return null
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function Investors() {
  const allParcels = useMemo(() => generateParcels(), [])

  const [leased, setLeased]         = useState(new Set([1, 2, 5]))
  const [selected, setSelected]     = useState(new Set())
  const [successMsg, setSuccessMsg] = useState('')

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
              <a className="tk-link" href="https://www.boldstoneinvestments.com/blog/news-2/boldstone-to-raise-us-140-000-pre-seed-investment-6">
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
        backgroundImage: "url('https://address-restaurant2.odoo.com/web/image/2016-eafec619/green%20background.webp')",
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
            At Boldstone, you are not simply leasing an acre of land—you are becoming part of a large, professionally managed single-origin coffee estate designed for traceability, long-term profitability, and environmental sustainability. We are establishing a large-scale coffee farm that combines commercial production with regenerative agroforestry, creating a coffee ecosystem that is resilient to climate change while preserving Uganda's natural environment. Every leased acre contributes to a unified coffee estate where production practices, quality standards, and environmental stewardship are managed consistently from planting through harvest.
          </p>
          <p style={{ fontSize: '15px', color: '#0d1f1c', lineHeight: 1.85, textAlign: 'justify' }}>
            Lease one or more acres of coffee farmland through Boldstone and choose a farming plan that includes land access, quality coffee seedlings, indigenous tree species, planting, farm management, maintenance, and harvest support. Whether you are an individual, a family, a diaspora Ugandan, or a business looking to participate in agriculture, Boldstone makes sustainable coffee farming accessible without the need to own land or manage a farm yourself.
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
                          label: 'Monthly', sub: 'per month',
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
            <h1 className="section-label">INVESTOR PLANS</h1>
            <h2>Choose your <span>plan.</span></h2>
            <p>Start with a single acre and scale up. Every plan includes full farm management — we do the work, you own the coffee.</p>
          </div>
          <div className="plans-grid">
            {plans.map((plan, i) => (
              <div key={i} className={`plan-card${plan.featured ? ' featured' : ''}`}>
                <div className="offer-card-back" />
                <div className="offer-card-inner">
                  <div className="plan-card-content">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
