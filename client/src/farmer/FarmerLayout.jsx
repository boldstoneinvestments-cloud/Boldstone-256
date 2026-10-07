import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faAward,
  faBars,
  faBookOpen,
  faCalendarCheck,
  faChartLine,
  faChevronRight,
  faCloudSun,
  faCoins,
  faGraduationCap,
  faLeaf,
  faLocationDot,
  faSeedling,
  faTree,
} from '@fortawesome/free-solid-svg-icons'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearFarmerToken, farmerApi, getFarmerToken } from './farmerApi'
import './FarmerDashboard.css'

const navigation = [
  { to: '/farmers/dashboard', label: 'Dashboard', icon: faLeaf },
  { to: '/farmers/performance', label: 'Performance', icon: faChartLine },
  { to: '/farmers/prices', label: 'Prices', icon: faCoins },
  { to: '/farmers/agronomy', label: 'Agronomy', icon: faSeedling, count: 3 },
  { to: '/farmers/harvest', label: 'Harvest & sales', icon: faCalendarCheck },
  { to: '/farmers/opportunities', label: 'Opportunities', icon: faGraduationCap },
  { to: '/farmers/rewards', label: 'Rewards', icon: faAward },
  { to: '/farmers/apply-for-loan', label: 'Apply for loan', icon: faCoins },
]

export default function FarmerLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [farmer, setFarmer] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const currentPage = navigation.find(item => item.to === pathname)?.label || 'Dashboard'
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!getFarmerToken()) {
      navigate('/farmers/sign-in', { replace: true, state: { from: pathname } })
      return
    }
    let active = true
    farmerApi('auth/me')
      .then(result => { if (active) setFarmer(result.farmer) })
      .catch(() => {
        clearFarmerToken()
        navigate('/farmers/sign-in', { replace: true, state: { from: pathname } })
      })
      .finally(() => { if (active) setAuthChecked(true) })
    return () => { active = false }
  }, [navigate, pathname])

  if (!authChecked || !farmer) {
    return <div className="farmer-auth-loading" role="status">Loading farmer workspace...</div>
  }

  const signOut = async () => {
    try { await farmerApi('auth/sign-out', { method: 'POST' }) } catch { /* Local sign-out still clears the token. */ }
    clearFarmerToken()
    navigate('/farmers/sign-in', { replace: true })
  }

  return (
    <div className="farmer-app">
      <aside className={`farmer-sidebar${menuOpen ? ' is-open' : ''}`}>
        <a className="farmer-brand" href="/farmers/dashboard" aria-label="Boldstone farmer dashboard">
          <span className="farmer-brand-mark"><FontAwesomeIcon icon={faLeaf} /></span>
          <span><strong>BOLDSTONE</strong><small>FARMER PORTAL</small></span>
        </a>

        <div className="farmer-farm-switcher">
          <span>ACTIVE FARM</span>
          <strong>{farmer.farm?.name || 'Farm not assigned'}</strong>
          <small><FontAwesomeIcon icon={faLocationDot} /> {farmer.farm?.location || farmer.farm?.district || 'Location not set'}</small>
        </div>

        <nav className="farmer-nav" aria-label="Farmer workspace pages">
          <span className="farmer-nav-caption">FARM WORKSPACE</span>
          {navigation.map(item => (
            <NavLink key={item.to} to={item.to} end onClick={closeMenu} className={({ isActive }) => isActive ? 'selected' : ''}>
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
              {item.count && <small>{item.count}</small>}
            </NavLink>
          ))}
        </nav>

        <div className="farmer-sidebar-bottom">
          <a className="farmer-support-link" href="/farmers"><FontAwesomeIcon icon={faBookOpen} /><span>Farmer guides</span><FontAwesomeIcon icon={faChevronRight} /></a>
          <div className="farmer-profile">
            <span className="farmer-avatar">{farmer.name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase()}</span>
            <span><strong>{farmer.name || farmer.email}</strong><small>Farmer account</small></span>
            <span className="farmer-profile-dot" />
          </div>
          <button className="farmer-sign-out" type="button" onClick={signOut}>Sign out</button>
          <a className="farmer-back-link" href="/farmers"><FontAwesomeIcon icon={faArrowLeft} /> Back to Boldstone</a>
        </div>
      </aside>

      {menuOpen && <button className="farmer-menu-scrim" onClick={closeMenu} aria-label="Close navigation" />}

      <main className="farmer-main">
        <header className="farmer-topbar">
          <button className="farmer-menu-toggle" onClick={() => setMenuOpen(open => !open)} aria-label="Toggle dashboard menu">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="farmer-topbar-context"><span>FARM WORKSPACE</span><span>/</span><strong>{currentPage}</strong></div>
          <div className="farmer-topbar-actions">
            <span className="farmer-weather"><FontAwesomeIcon icon={faCloudSun} /><strong>24°</strong><span>Partly cloudy</span></span>
            <NavLink className="farmer-notifications" to="/farmers/agronomy" aria-label="3 farm alerts"><FontAwesomeIcon icon={faSeedling} /><i>3</i></NavLink>
          </div>
        </header>

        <div className="farmer-dashboard-content"><Outlet /></div>
      </main>
    </div>
  )
}