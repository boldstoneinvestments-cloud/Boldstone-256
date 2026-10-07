import { Navigate, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { CartProvider } from './CartContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PaymentBar from './components/layout/PaymentBar'
import AdminLogin from './pages/AdminLogin'
import ChatWidget from './components/layout/ChatWidget'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const LeaseACoffeeFarm = lazy(() => import('./pages/LeaseACoffeeFarm'))
const LeaseApplication = lazy(() => import('./pages/LeaseApplication'))
const Farmers = lazy(() => import('./pages/Farmers'))
const FarmerLayout = lazy(() => import('./farmer/FarmerLayout'))
const FarmerDashboard = lazy(() => import('./farmer/FarmerDashboardHome'))
const FarmerPerformance = lazy(() => import('./farmer/FarmerPages').then(module => ({ default: module.FarmerPerformance })))
const FarmerPrices = lazy(() => import('./farmer/FarmerPages').then(module => ({ default: module.FarmerPrices })))
const FarmerAgronomy = lazy(() => import('./farmer/FarmerPages').then(module => ({ default: module.FarmerAgronomy })))
const FarmerHarvest = lazy(() => import('./farmer/FarmerPages').then(module => ({ default: module.FarmerHarvest })))
const FarmerOpportunities = lazy(() => import('./farmer/FarmerPages').then(module => ({ default: module.FarmerOpportunities })))
const FarmerRewards = lazy(() => import('./farmer/FarmerPages').then(module => ({ default: module.FarmerRewards })))
const FarmerLoanApplication = lazy(() => import('./farmer/FarmerPages').then(module => ({ default: module.FarmerLoanApplication })))
const FarmerAdviceDetail = lazy(() => import('./farmer/FarmerAdviceDetail'))
const FarmerAuth = lazy(() => import('./farmer/FarmerAuth'))
const Partnership = lazy(() => import('./pages/Partnership'))
const Contact = lazy(() => import('./pages/Contact'))
const Blog = lazy(() => import('./pages/Blog'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Shop = lazy(() => import('./pages/Shop'))
const AccountAuth = lazy(() => import('./pages/AccountAuth'))
const PasswordReset = lazy(() => import('./pages/PasswordReset'))
const AdminBlog = lazy(() => import('./pages/AdminBlog'))
const AdminOrders = lazy(() => import('./pages/AdminOrders'))
const AdminProducts = lazy(() => import('./pages/AdminProducts'))
const AdminProductEditor = lazy(() => import('./pages/AdminProductEditor'))
const AdminOrderDetail = lazy(() => import('./pages/AdminOrderDetail'))
const AdminLayout = lazy(() => import('./pages/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminApplications = lazy(() => import('./pages/AdminApplications'))
const AdminChat = lazy(() => import('./pages/AdminChat'))
const AdminUsers = lazy(() => import('./pages/AdminUsers'))
const AdminActivity = lazy(() => import('./pages/AdminActivity'))

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
  const navigate = useNavigate()
  const isAdmin = pathname.startsWith('/admin')
  const isFarmerApp = pathname.startsWith('/farmers/')
  const isAccountAuth = pathname === '/account/sign-in' || pathname === '/account/sign-up'

  useEffect(() => {
    const redirect = sessionStorage.getItem('redirect')
    if (!redirect) return
    sessionStorage.removeItem('redirect')
    navigate(redirect, { replace: true })
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <GoogleAuthHandoff />
      {!isAdmin && !isFarmerApp && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[50vh] grid place-items-center" aria-busy="true"><span className="admin-loading-spinner" aria-hidden="true" />Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/lease-a-coffee-farm" element={<LeaseACoffeeFarm />} />
          <Route path="/lease-application" element={<LeaseApplication />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/farmers/sign-in" element={<FarmerAuth />} />
          <Route path="/farmers/sign-up" element={<FarmerAuth mode="sign-up" />} />
          <Route element={<FarmerLayout />}>
            <Route path="/farmers/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmers/performance" element={<FarmerPerformance />} />
            <Route path="/farmers/prices" element={<FarmerPrices />} />
            <Route path="/farmers/agronomy" element={<FarmerAgronomy />} />
            <Route path="/farmers/harvest" element={<FarmerHarvest />} />
            <Route path="/farmers/opportunities" element={<FarmerOpportunities />} />
            <Route path="/farmers/rewards" element={<FarmerRewards />} />
            <Route path="/farmers/apply-for-loan" element={<FarmerLoanApplication />} />
            <Route path="/farmers/advice" element={<FarmerAdviceDetail />} />
            <Route path="/farmers/advice/:slug" element={<FarmerAdviceDetail />} />
          </Route>
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin/sign-in" element={<AdminLogin />} />
          <Route path="/admin/password-reset" element={<PasswordReset admin />} />
          <Route path="/admin/password-reset/confirm/:uid/:token" element={<PasswordReset admin />} />
          <Route path="/account/sign-in" element={<AccountAuth mode="sign-in" />} />
          <Route path="/account/sign-up" element={<AccountAuth mode="sign-up" />} />
          <Route path="/account/password-reset" element={<PasswordReset />} />
          <Route path="/account/password-reset/confirm/:uid/:token" element={<PasswordReset />} />
          <Route path="/admin" element={<Suspense fallback={<div className="admin-auth-check" role="status" aria-busy="true"><span className="admin-loading-spinner" aria-hidden="true" /><span>Opening admin...</span></div>}><AdminLayout /></Suspense>}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductEditor />} />
            <Route path="products/:productId/edit" element={<AdminProductEditor />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="lease-applications" element={<AdminApplications />} />
            <Route path="chat" element={<AdminChat />} />
            <Route path="chat/:email" element={<AdminChat />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="activity" element={<AdminActivity />} />
            <Route path="blog" element={<AdminBlog />} />
          </Route>
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>
      {!isAdmin && ['farmers', 'lease-a-coffee-farm'].includes(pathname.slice(1)) && <PaymentBar />}
      {!isAdmin && !isFarmerApp && <Footer />}
      {!isAdmin && !isFarmerApp && !isAccountAuth && pathname !== '/shop' && <ChatWidget />}
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
