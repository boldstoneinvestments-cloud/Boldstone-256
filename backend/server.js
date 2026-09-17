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

async function initDB() {
  if (!db) return
  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      product VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      location VARCHAR(255) NOT NULL,
      notes TEXT,
      status ENUM('Pending','Confirmed','Delivered') DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('Orders table ready.')
}

initDB().catch(err => console.error('DB init error:', err.message))

app.get('/', async (req, res) => {
  try {
    if (!db) return res.json({ message: 'Boldstone Backend is running', database: 'not configured' })
    await db.query('SELECT 1')
    res.json({ message: 'Boldstone Backend is running', database: 'connected' })
  } catch (err) {
    res.status(500).json({ message: 'Boldstone Backend is running', database: 'disconnected', error: err.message })
  }
})

// POST /api/orders — place a new order
app.post('/api/orders', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'Database not configured' })
  const { name, phone, email, product, quantity, location, notes } = req.body
  if (!name || !phone || !product || !quantity || !location) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    const [result] = await db.query(
      'INSERT INTO orders (name, phone, email, product, quantity, location, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, phone, email || null, product, quantity, location, notes || null]
    )
    res.status(201).json({ id: result.insertId, message: 'Order placed successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/orders — admin: get all orders newest first
app.get('/api/orders', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'Database not configured' })
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/orders/:id/status — admin: update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'Database not configured' })
  const { status } = req.body
  if (!['Pending', 'Confirmed', 'Delivered'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id])
    res.json({ message: 'Status updated' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Boldstone backend running on http://localhost:${PORT}`)
})
