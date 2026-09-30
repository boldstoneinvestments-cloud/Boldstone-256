const CACHE_DURATION_MS = 60_000
const STORAGE_PREFIX = 'boldstone:admin-product-cache:'
const cache = new Map()
const pendingRequests = new Map()
let cacheVersion = 0

function storageKey(url) {
  return `${STORAGE_PREFIX}${url}`
}

function readStoredEntry(url, now) {
  try {
    const key = storageKey(url)
    const serialized = sessionStorage.getItem(key)
    if (!serialized) return null
    const entry = JSON.parse(serialized)
    if (!entry || entry.expiresAt <= now || !('data' in entry)) {
      sessionStorage.removeItem(key)
      return null
    }
    return entry
  } catch {
    return null
  }
}

function storeEntry(url, entry) {
  cache.set(url, entry)
  try {
    sessionStorage.setItem(storageKey(url), JSON.stringify(entry))
  } catch {
    return
  }
}

function getCachedEntry(url, now) {
  const entry = cache.get(url) || readStoredEntry(url, now)
  if (entry) cache.set(url, entry)
  return entry
}

function getProductFromCachedList(detailUrl, now) {
  const endpoint = '/api/admin/shop/products/'
  const endpointIndex = detailUrl.lastIndexOf(endpoint)
  if (endpointIndex < 0) return null

  const identifier = detailUrl.slice(endpointIndex + endpoint.length)
  if (!identifier || identifier.includes('/')) return null
  const listUrl = detailUrl.slice(0, endpointIndex + endpoint.length - 1)
  const listEntry = getCachedEntry(listUrl, now)
  const products = listEntry?.data?.products
  if (!Array.isArray(products)) return null

  let decodedIdentifier
  try {
    decodedIdentifier = decodeURIComponent(identifier)
  } catch {
    decodedIdentifier = identifier
  }
  const product = products.find(item => item.id === decodedIdentifier || item.slug === decodedIdentifier)
  return product ? { product, expiresAt: listEntry.expiresAt } : null
}

export function invalidateAdminProductCache() {
  cacheVersion += 1
  cache.clear()
  pendingRequests.clear()
  try {
    for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
      const key = sessionStorage.key(index)
      if (key?.startsWith(STORAGE_PREFIX)) sessionStorage.removeItem(key)
    }
  } catch {
    return
  }
}

export async function fetchAdminProductData(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  if (method !== 'GET') {
    const response = await fetch(url, options)
    if (response.ok) invalidateAdminProductCache()
    return response
  }

  const now = Date.now()
  for (const [key, entry] of cache) {
    if (entry.expiresAt <= now) cache.delete(key)
  }

  const cached = getCachedEntry(url, now)
  if (cached) {
    return { ok: true, status: 200, json: async () => cached.data }
  }

  const listedProduct = getProductFromCachedList(url, now)
  if (listedProduct) {
    const data = { product: listedProduct.product }
    storeEntry(url, { data, expiresAt: listedProduct.expiresAt })
    return { ok: true, status: 200, json: async () => data }
  }

  const pending = pendingRequests.get(url)
  if (pending) return pending

  const requestVersion = cacheVersion
  const request = fetch(url, options)
    .then(async response => {
      let data
      try {
        data = await response.clone().json()
      } catch {
        return response
      }
      if (response.ok && requestVersion === cacheVersion) {
        storeEntry(url, { data, expiresAt: Date.now() + CACHE_DURATION_MS })
      }
      return {
        ok: response.ok,
        status: response.status,
        json: async () => data,
      }
    })
    .finally(() => {
      if (pendingRequests.get(url) === request) pendingRequests.delete(url)
    })
  pendingRequests.set(url, request)
  return request
}