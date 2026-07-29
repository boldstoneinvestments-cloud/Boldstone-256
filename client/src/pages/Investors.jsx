import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function LandGrid({ totalAcres, totalLeased }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const COLS = 60, ROWS = 50
    const GAP = 1, BLOCK = 7
    const W = COLS * (BLOCK + GAP) - GAP
    const H = ROWS * (BLOCK + GAP) - GAP
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    for (let i = 0; i < COLS * ROWS; i++) {
      const col = i % COLS
      const row = Math.floor(i / COLS)
      const x = col * (BLOCK + GAP)
      const y = row * (BLOCK + GAP)
      const r = 1
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + BLOCK - r, y)
      ctx.quadraticCurveTo(x + BLOCK, y, x + BLOCK, y + r)
      ctx.lineTo(x + BLOCK, y + BLOCK - r)
      ctx.quadraticCurveTo(x + BLOCK, y + BLOCK, x + BLOCK - r, y + BLOCK)
      ctx.lineTo(x + r, y + BLOCK)
      ctx.quadraticCurveTo(x, y + BLOCK, x, y + BLOCK - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      ctx.fillStyle = i < totalLeased ? '#0f8972' : '#c8e6c9'
      ctx.fill()
    }
  }, [totalLeased])

  return (
    <div className="bg-[#f0f7f4] p-5 flex flex-col gap-3">
      <p className="text-xs font-bold text-[#0d1f1c]">Land Allocation Map — Each block = 1 Acre</p>
      <canvas ref={canvasRef} className="w-full h-auto rounded-lg" />
      <div className="flex gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <div className="w-3 h-3 rounded-sm bg-[#0f8972]" /> Leased
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <div className="w-3 h-3 rounded-sm bg-[#c8e6c9] border border-[#a5d6a7]" /> Available
        </div>
      </div>
    </div>
  )
}

export default function Investors() {
  const [estate, setEstate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetch('/api/estate')
      .then(r => r.json())
      .then(data => { setEstate(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (estate) setTimeout(() => setProgress(estate.pct), 400)
  }, [estate])

  return (
    <div>
      {/* HERO */}
      <section
        className="relative min-h-[480px] flex items-center"
        style={{ backgroundImage: "url('https://address-restaurant2.odoo.com/web/image/1948-db6cb14d/Land%20aerial%20view.webp')", backgroundSize: 'cover', backgroundPosition: 'center top' }}
      >
        <div className="absolute inset-0 bg-[rgba(4,15,10,0.32)]" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center text-white w-full">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-white/15 border border-white/35 text-white text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5 backdrop-blur-sm"
          >
            Invest in Coffee. Grow the Future.
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl font-black mb-4"
          >
            Own a Coffee Farm in <span className="text-[#3dffc0]">Uganda</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-white/85 max-w-lg mx-auto text-sm leading-relaxed"
          >
            Lease a portion of our 3,000-acre coffee estate and be part of a sustainable coffee future. We handle the farming — you enjoy the ownership.
          </motion.p>
        </div>
      </section>

      {/* ESTATE SECTION */}
      <section className="bg-[#f7faf9] border-b border-gray-200 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase text-[#0f8972] mb-2">Investment Opportunity —</p>
            <h2 className="text-3xl font-black text-[#0d1f1c]">Kyenjojo <span className="text-[#0f8972]">Coffee Estate</span></h2>
            <p className="text-sm text-gray-500 mt-2 max-w-lg">One estate, shared among many investors. Lease your acre and we handle everything from planting to harvest.</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading estate data...</div>
          ) : estate ? (
            <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
              <LandGrid totalAcres={estate.TOTAL_ACRES} totalLeased={estate.totalLeased} />
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-[#0d1f1c] mb-1">{estate.name}</h3>
                  <p className="text-sm font-semibold text-[#0f8972] flex items-center gap-1 mb-6">
                    📍 {estate.location}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Total Estate Size', value: estate.TOTAL_ACRES.toLocaleString(), unit: 'acres', color: 'text-[#0d1f1c]' },
                      { label: 'Available to Lease', value: estate.available.toLocaleString(), unit: 'acres', color: 'text-[#0f8972]' },
                      { label: 'Already Leased', value: estate.totalLeased.toLocaleString(), unit: 'acres', color: 'text-gray-400' },
                      { label: 'Lease Sections', value: estate.leaseCount, unit: 'active', color: 'text-gray-400' },
                    ].map((s, i) => (
                      <div key={i} className="bg-[#f7faf9] rounded-xl p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-1">{s.label}</p>
                        <p className={`text-2xl font-black ${s.color}`}>{s.value} <span className="text-xs font-normal text-gray-400">{s.unit}</span></p>
                      </div>
                    ))}
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span><strong className="text-[#0d1f1c]">{estate.pct}%</strong> allocated</span>
                      <span><strong className="text-[#0d1f1c]">{estate.available.toLocaleString()}</strong> acres remaining</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#e8f4f1] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0f8972] rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 pt-5 border-t border-gray-100 text-xs text-gray-500">
                  <span>⛰ {estate.altitude}</span>
                  <span>🌧 {estate.rainfall}</span>
                  <span>🪨 {estate.soil}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-red-400 text-sm">Could not load estate data. Make sure the server is running.</p>
          )}
        </div>
      </section>

      {/* LEAFLET MAP */}
      {estate && (
        <section className="py-14 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-bold tracking-widest uppercase text-[#0f8972] mb-2">Estate Location —</p>
            <h2 className="text-2xl font-black text-[#0d1f1c] mb-6">Find Us on the Map</h2>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: 400 }}>
              <MapContainer
                center={[estate.coordinates.lat, estate.coordinates.lng]}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <Circle
                  center={[estate.coordinates.lat, estate.coordinates.lng]}
                  radius={6000}
                  pathOptions={{ color: '#0f8972', fillColor: '#0f8972', fillOpacity: 0.2 }}
                >
                  <Popup>
                    <strong>{estate.name}</strong><br />
                    {estate.location}<br />
                    {estate.available.toLocaleString()} acres available
                  </Popup>
                </Circle>
              </MapContainer>
            </div>
          </div>
        </section>
      )}

      {/* PLANS */}
      <section className="py-14 bg-[#f7faf9]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold tracking-widest uppercase text-[#0d1f1c] mb-6">Choose Your Plan</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { popular: true, price: '$15', period: '/ month', name: 'Lease 1 Acre Monthly', desc: 'Flexible monthly subscription. Cancel anytime.', btn: 'Choose Monthly Plan', features: ['Lease 1 acre of coffee farm', 'Farm management included', 'Progress updates & reports', 'Cancel anytime'] },
              { popular: false, price: '$150', period: '/ year', name: 'Lease 1 Acre Annually', desc: 'Best value for long-term commitment.', btn: 'Choose Annual Plan', features: ['Lease 1 acre of coffee farm', 'Farm management included', 'Progress updates & reports', 'Best value – Save $30!'] },
              { popular: false, price: '$200', period: 'one-time', name: 'Coffee Seedlings', desc: 'High-quality, disease-resistant seedlings delivered and planted on your acre.', btn: 'Order Seedlings', features: ['Premium seedlings', '25% below market price', 'Delivered & planted', 'Disease-resistant varieties'] },
            ].map((plan, i) => (
              <div key={i} className={`relative bg-white rounded-2xl p-6 border-2 ${plan.popular ? 'border-[#0f8972]' : 'border-gray-200'}`}>
                {plan.popular && <span className="absolute -top-3 left-4 bg-[#0f8972] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>}
                <div className="text-3xl font-black text-[#0d1f1c]">{plan.price} <span className="text-sm font-normal text-gray-400">{plan.period}</span></div>
                <div className="font-bold text-base mt-2 mb-1">{plan.name}</div>
                <p className="text-xs text-gray-500 mb-4">{plan.desc}</p>
                <Link to="/partnership" className={`block w-full text-center py-2.5 rounded-lg text-sm font-bold transition-colors mb-4 ${plan.popular ? 'bg-[#0f8972] text-white hover:bg-[#0d7a65]' : 'border-2 border-[#0d1f1c] text-[#0d1f1c] hover:bg-gray-50'}`}>
                  {plan.btn}
                </Link>
                <ul className="flex flex-col gap-2">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="text-[#0f8972]">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAYMENT BAR */}
      <div className="border-t border-gray-200 py-5">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[#0f8972] text-2xl">🔒</span>
            <div>
              <p className="text-sm font-bold text-[#0d1f1c]">Secure & Trusted Payments</p>
              <p className="text-xs text-gray-400">All payments are secure and encrypted</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap text-sm font-bold">
            <span className="border border-gray-200 rounded px-3 py-1 text-[#1a1f71]">VISA</span>
            <span className="border border-gray-200 rounded px-3 py-1">Mastercard</span>
            <span className="border border-gray-200 rounded px-3 py-1 bg-[#2671b9] text-white">AMEX</span>
            <span className="border border-gray-200 rounded px-3 py-1">Google Pay</span>
            <span className="border border-gray-200 rounded px-3 py-1 bg-black text-white"> Apple Pay</span>
          </div>
          <p className="text-xs text-gray-400">Payments powered by <span className="text-[#635bff] font-black text-base">stripe</span></p>
        </div>
      </div>
    </div>
  )
}
