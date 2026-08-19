import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PaymentBar from './components/layout/PaymentBar'
import Home from './pages/Home'
import About from './pages/About'
import LeaseACoffeeFarm from './pages/LeaseACoffeeFarm'
import Farmers from './pages/Farmers'
import Partnership from './pages/Partnership'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import AdminBlog from './pages/AdminBlog'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/lease-a-coffee-farm" element={<LeaseACoffeeFarm />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!['/','/about','/blog','/blog/','/contact','/partnership','/lease-a-coffee-farm'].includes(useLocation().pathname) && <PaymentBar />}
      <Footer />
    </div>
  )
}
