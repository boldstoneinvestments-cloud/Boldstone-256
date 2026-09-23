import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './CartContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PaymentBar from './components/layout/PaymentBar'
import Home from './pages/Home'
import About from './pages/About'
import LeaseACoffeeFarm from './pages/LeaseACoffeeFarm'
import LeaseApplication from './pages/LeaseApplication'
import Farmers from './pages/Farmers'
import Partnership from './pages/Partnership'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import AdminBlog from './pages/AdminBlog'
import AdminOrders from './pages/AdminOrders'
import AdminOrderDetail from './pages/AdminOrderDetail'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './pages/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminApplications from './pages/AdminApplications'
import AdminChat from './pages/AdminChat'
import AdminUsers from './pages/AdminUsers'
import NotFound from './pages/NotFound'
import ChatWidget from './components/layout/ChatWidget'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Shop from './pages/Shop'
import AccountAuth from './pages/AccountAuth'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function GoogleAuthHandoff() {
  const { hash } = useLocation()

  useEffect(() => {
    const googleToken = new URLSearchParams(hash.replace(/^#/, '')).get('google_token')
    if (!googleToken) return
    localStorage.setItem('boldstone_customer_token', googleToken)
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
  }, [hash])

  return null
}

function AppInner() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  const isAccountAuth = pathname === '/account/sign-in' || pathname === '/account/sign-up'
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <GoogleAuthHandoff />
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/lease-a-coffee-farm" element={<LeaseACoffeeFarm />} />
          <Route path="/lease-application" element={<LeaseApplication />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin/sign-in" element={<AdminLogin />} />
          <Route path="/account/sign-in" element={<AccountAuth mode="sign-in" />} />
          <Route path="/account/sign-up" element={<AccountAuth mode="sign-up" />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="lease-applications" element={<AdminApplications />} />
            <Route path="chat" element={<AdminChat />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="blog" element={<AdminBlog />} />
          </Route>
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && ['farmers', 'lease-a-coffee-farm'].includes(pathname.slice(1)) && <PaymentBar />}
      {!isAdmin && <Footer />}
      {!isAdmin && !isAccountAuth && pathname !== '/shop' && <ChatWidget />}
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  )
}
