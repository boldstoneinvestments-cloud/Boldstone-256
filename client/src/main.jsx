import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

const preloadRetryKey = 'boldstone:preload-retry'

window.addEventListener('vite:preloadError', event => {
  event.preventDefault()
  try {
    if (sessionStorage.getItem(preloadRetryKey)) {
      sessionStorage.removeItem(preloadRetryKey)
      return
    }
    sessionStorage.setItem(preloadRetryKey, '1')
  } catch {
    return
  }

  const freshUrl = new URL(window.location.href)
  freshUrl.searchParams.set('_assets', Date.now().toString())
  window.location.replace(freshUrl)
})

window.addEventListener('load', () => {
  window.setTimeout(() => sessionStorage.removeItem(preloadRetryKey), 15000)
}, { once: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)
