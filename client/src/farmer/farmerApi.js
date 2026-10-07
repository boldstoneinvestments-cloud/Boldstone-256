import { useEffect, useState } from 'react'

const configuredBackend = import.meta.env.VITE_API_URL
const BACKEND = (configuredBackend && !configuredBackend.includes('boldstone-256-production.up.railway.app')
  ? configuredBackend
  : import.meta.env.PROD
    ? 'https://backend-production-9c1d1.up.railway.app'
    : 'http://localhost:5000').replace(/\/api\/?$/, '')
const TOKEN_KEY = 'boldstone_farmer_token'

export function getFarmerToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveFarmerToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearFarmerToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem('boldstone_farmer_account')
}

export async function farmerApi(path, options = {}) {
  const token = getFarmerToken()
  const response = await fetch(`${BACKEND}/api/farmer/${path.replace(/^\//, '')}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.error || 'Unable to load farmer data.')
    error.status = response.status
    throw error
  }
  return data
}

export function useFarmerResource(path) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [reloadId, setReloadId] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    farmerApi(path)
      .then(result => { if (active) setData(result) })
      .catch(requestError => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [path, reloadId])

  return { data, error, loading, refresh: () => setReloadId(value => value + 1) }
}