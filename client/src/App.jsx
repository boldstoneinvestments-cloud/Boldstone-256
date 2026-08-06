import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PaymentBar from './components/layout/PaymentBar'
import Home from './pages/Home'
import About from './pages/About'
import Investors from './pages/Investors'
import Farmers from './pages/Farmers'
import Partnership from './pages/Partnership'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import AdminBlog from './pages/AdminBlog'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!['/','/about'].includes(useLocation().pathname) && <PaymentBar />}
      <Footer />
    </div>
  )
}
