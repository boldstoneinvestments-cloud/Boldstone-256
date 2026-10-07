import { useState } from 'react'
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
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import './FarmerDashboard.css'

const navigation = [
  { to: '/farmer/dashboard', label: 'Dashboard', icon: faLeaf },
  { to: '/farmer/performance', label: 'Performance', icon: faChartLine },
  { to: '/farmer/prices', label: 'Prices', icon: faCoins },
  { to: '/farmer/agronomy', label: 'Agronomy', icon: faSeedling, count: 3 },
  { to: '/farmer/harvest', label: 'Harvest & sales', icon: faCalendarCheck },
  { to: '/farmer/opportunities', label: 'Opportunities', icon: faGraduationCap },
  { to: '/farmer/rewards', label: 'Rewards', icon: faAward },
  { to: '/farmer/apply-for-loan', label: 'Apply for loan', icon: faCoins },
]

export default function FarmerLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const currentPage = navigation.find(item => item.to === pathname)?.label || 'Dashboard'
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="farmer-app">
      <aside className={`farmer-sidebar${menuOpen ? ' is-open' : ''}`}>
        <a className="farmer-brand" href="/farmer/dashboard" aria-label="Boldstone farmer dashboard">
          <span className="farmer-brand-mark"><FontAwesomeIcon icon={faLeaf} /></span>
          <span><strong>BOLDSTONE</strong><small>FARMER PORTAL</small></span>
        </a>

        <div className="farmer-farm-switcher">
          <span>ACTIVE FARM</span>
          <strong>Kasenene Coffee Farm</strong>
          <small><FontAwesomeIcon icon={faLocationDot} /> Kyenjojo, Uganda</small>
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
            <span className="farmer-avatar">MM</span>
            <span><strong>Moses M.</strong><small>Sample farmer</small></span>
            <span className="farmer-profile-dot" />
          </div>
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
            <NavLink className="farmer-notifications" to="/farmer/agronomy" aria-label="3 farm alerts"><FontAwesomeIcon icon={faSeedling} /><i>3</i></NavLink>
          </div>
        </header>

        <div className="farmer-dashboard-content"><Outlet /></div>
      </main>
    </div>
  )
}