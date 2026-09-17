require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')

const app = express()

app.use(cors())
app.use(express.json())

if (!process.env.DATABASE_URL) {
  console.warn('WARNING: DATABASE_URL is not set. Database features will be unavailable.')
}

const db = process.env.DATABASE_URL ? mysql.createPool(process.env.DATABASE_URL) : null

app.get('/', async (req, res) => {
  try {
    if (!db) return res.json({ message: 'Boldstone Backend is running', database: 'not configured' })
    await db.query('SELECT 1')
    res.json({ message: 'Boldstone Backend is running', database: 'connected' })
  } catch (err) {
    res.status(500).json({ message: 'Boldstone Backend is running', database: 'disconnected', error: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Boldstone backend running on http://localhost:${PORT}`)
})
