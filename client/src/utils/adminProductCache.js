const CACHE_DURATION_MS = 60_000
const cache = new Map()
const pendingRequests = new Map()
let cacheVersion = 0

export function invalidateAdminProductCache() {
  cacheVersion += 1
  cache.clear()
  pendingRequests.clear()
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

  const cached = cache.get(url)
  if (cached) {
    return { ok: true, status: 200, json: async () => cached.data }
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
        cache.set(url, { data, expiresAt: Date.now() + CACHE_DURATION_MS })
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