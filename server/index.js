require('dotenv').config()
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const { estate, leases } = require('./data/estateData')

const app = express()
app.use(cors())
app.use(express.json())

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' })

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New message from Boldstone Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

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
