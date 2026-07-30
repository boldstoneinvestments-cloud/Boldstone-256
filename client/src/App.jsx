import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PaymentBar from './components/layout/PaymentBar'
import Home from './pages/Home'
import About from './pages/About'
import Investors from './pages/Investors'
import Farmers from './pages/Farmers'
import Partnership from './pages/Partnership'
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <PaymentBar />
      <Footer />
    </div>
  )
}
