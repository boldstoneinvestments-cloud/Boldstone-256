const express = require('express')
const cors = require('cors')
const { estate, leases } = require('./data/estateData')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/estate', (req, res) => {
  const totalLeased = leases.reduce((sum, l) => sum + l.acres, 0)
  const available = estate.TOTAL_ACRES - totalLeased
  const pct = ((totalLeased / estate.TOTAL_ACRES) * 100).toFixed(1)
  res.json({
    ...estate,
    totalLeased,
    available,
    pct: parseFloat(pct),
    leaseCount: leases.length,
    leases
  })
})

app.post('/api/estate/invest', (req, res) => {
  const { acres } = req.body
  if (!acres || typeof acres !== 'number' || acres < 1) {
    return res.status(400).json({ error: 'Invalid acres value' })
  }
  const totalLeased = leases.reduce((sum, l) => sum + l.acres, 0)
  const available = estate.TOTAL_ACRES - totalLeased
  if (acres > available) {
    return res.status(400).json({ error: `Only ${available} acres available` })
  }
  leases.push({ acres })
  const newLeased = totalLeased + acres
  res.json({
    success: true,
    totalLeased: newLeased,
    available: estate.TOTAL_ACRES - newLeased,
    pct: parseFloat(((newLeased / estate.TOTAL_ACRES) * 100).toFixed(1)),
    leaseCount: leases.length,
    leases
  })
})

const PORT = 3001
app.listen(PORT, () => console.log(`Boldstone API running on http://localhost:${PORT}`))
