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
    leaseCount: leases.length
  })
})

const PORT = 3001
app.listen(PORT, () => console.log(`Boldstone API running on http://localhost:${PORT}`))
